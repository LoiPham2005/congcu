# Site này không có database và không có tiến trình phụ nào, nên Dockerfile chỉ
# còn hai stage: cài dependency và dựng image chạy.
#
# Kết quả là một container Node duy nhất phục vụ HTML đã dựng sẵn — chạy được
# trên VPS rẻ nhất, và chi phí không tăng theo lượng truy cập vì mọi công cụ
# tính toán ngay trên trình duyệt người dùng.
FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------------------
# deps — cài dependency. Tách riêng để layer cache chỉ vỡ khi lockfile đổi.
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Cố tình KHÔNG dùng `--mount=type=cache`: nó bắt buộc phải có BuildKit, mà
# BuildKit lại cần plugin buildx — không phải máy nào cũng có (Colima chẳng
# hạn). Layer cache theo package.json + lockfile đã đủ nhanh cho hầu hết thay đổi.
RUN pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# builder — build Next.js
# ---------------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* được nhúng thẳng vào bundle lúc build, không đọc lại ở runtime.
# Nghĩa là đổi tên miền hay đổi mã AdSense thì phải BUILD LẠI image, đặt biến
# lúc `docker run` sẽ không có tác dụng.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_ADSENSE_CLIENT=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ADSENSE_CLIENT=$NEXT_PUBLIC_ADSENSE_CLIENT

RUN pnpm build

# ---------------------------------------------------------------------------
# runner — image production, chỉ chứa output standalone
# ---------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    # server.js của standalone mặc định bind vào localhost. Trong container
    # điều đó nghĩa là không nhận được request nào từ bên ngoài.
    HOSTNAME=0.0.0.0

# Cú pháp busybox của Alpine, không phải groupadd/useradd của Debian.
RUN addgroup -g 1001 -S nodejs \
 && adduser -u 1001 -S -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Không chạy bằng root: một lỗ RCE trong app không kéo theo quyền root container.
USER nextjs

EXPOSE 3000

# Không còn route /api/health (site không có API), nên kiểm tra thẳng trang chủ
# — nó là trang tĩnh nên phép kiểm tra này rất rẻ.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
