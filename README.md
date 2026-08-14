# Công Cụ Việt

Site công cụ tính toán online, sống bằng doanh thu quảng cáo hiển thị.

Dựng trên `nextjs_base` (Next.js 16 App Router + TypeScript strict + Vitest), đã gỡ tầng
auth/Prisma/realtime vì site cố tình **không có database và không có tài khoản**.

---

## Nguyên tắc kiến trúc

Ba quyết định chi phối toàn bộ mã nguồn. Đọc trước khi sửa gì.

### 1. Mọi phép tính chạy trên trình duyệt

Không API, không database. Doanh thu quảng cáo chỉ vài chục đồng mỗi lượt xem, nên nếu chi phí máy
chủ tăng theo lượng truy cập thì mô hình lỗ. Tính toán trên máy người dùng giữ **chi phí biên gần
bằng 0**: 10.000 hay 500.000 lượt truy cập thì VPS vẫn thế.

Hệ quả: chỉ chạm tới máy chủ khi thật sự không còn cách nào khác.

### 2. Trang phải render tĩnh được

Tĩnh = tải nhanh = điểm Core Web Vitals tốt = thứ hạng tìm kiếm cao. **Không gọi `headers()` hay
`cookies()` trong layout hay page** — chỉ một lời gọi là Next.js chuyển cả trang sang render động.

Đây cũng là lý do CSP trong `src/proxy.ts` là tĩnh chứ không dùng nonce như bản gốc.

### 3. Logic tính toán tách khỏi giao diện và phải có test

Công cụ ở đây _là_ công thức. Một con số sai không phải lỗi hiển thị mà là mất uy tín — và uy tín
là tài sản duy nhất của site. Mọi logic nằm trong `src/lib/tools/*.ts` dạng hàm thuần, kèm file
`.test.ts` bên cạnh.

---

## Thêm một công cụ mới

Ba file, không đụng chỗ nào khác:

1. **Logic** — `src/lib/tools/<ten>.ts` + `<ten>.test.ts`
   Hàm thuần, không import React. Ném lỗi có kiểu riêng khi đầu vào sai.

2. **Đăng ký** — thêm một mục vào `TOOLS` trong `src/lib/tools/registry.ts`
   Từ đây tự động có: thẻ trên trang chủ, mục trong `sitemap.xml`, khối "công cụ liên quan".

3. **Trang** — `src/app/(tools)/<slug>/page.tsx` + component `"use client"` cho phần tương tác
   Bọc bằng `<ToolPage>` và truyền `guide` là nội dung hướng dẫn.

Vài điều bắt buộc, sai là hỏng SEO:

- **Mỗi công cụ một URL riêng.** Không gộp nhiều công cụ vào một trang rồi chuyển tab, không dùng
  `?tool=abc`. Google cần URL riêng mới xếp hạng được.
- **Slug tiếng Việt không dấu**, đúng cụm người ta gõ: `/doi-so-thanh-chu`.
- **`seoTitle` viết riêng, không tái dùng `name`.** Đó là dòng hiện trên kết quả tìm kiếm.
- **Phần `guide` phải là nội dung thật.** Trang chỉ có ô nhập liệu bị coi là nội dung mỏng và
  không được AdSense duyệt.

---

## Chạy

```bash
make setup     # cài deps + tạo .env
make dev       # http://localhost:3000
make check     # typecheck + lint + format + test
```

## Cấu hình

Chỉ hai biến, xem `.env.example`:

| Biến                         | Bắt buộc | Ghi chú                                                          |
| ---------------------------- | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | có       | Tên miền thật, không có `/` ở cuối. Đi vào sitemap và canonical. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | không    | `ca-pub-<16 số>`. Để trống thì quảng cáo tự tắt.                 |

> `NEXT_PUBLIC_*` được nhúng vào bundle **lúc build**, không đọc lại ở runtime. Đổi giá trị thì
> phải build lại — sửa `.env` rồi restart sẽ không có tác dụng.

## Deploy

```bash
make docker-up    # Docker, một container duy nhất
make vps-deploy   # hoặc chạy trực tiếp: systemd + Caddy
```

Cả hai đều chỉ dựng một tiến trình Node phục vụ HTML đã build sẵn — chạy được trên VPS rẻ nhất.

---

## Việc còn phải làm trước khi lên production

- [ ] Đổi `siteConfig` trong `src/lib/site-config.ts`: tên site và **email liên hệ thật**
      (hiện là `lienhe@example.com` — AdSense sẽ từ chối nếu để nguyên)
- [ ] Mua tên miền `.com`, set `NEXT_PUBLIC_SITE_URL`
- [ ] Thêm `favicon.ico` và ảnh Open Graph vào `public/`
- [ ] Build thêm công cụ cho đủ 10–15 trang trước khi nộp AdSense
- [ ] Khai báo sitemap trong Google Search Console, **chờ có traffic tự nhiên rồi mới nộp AdSense**
- [ ] Sau khi được duyệt: điền `NEXT_PUBLIC_ADSENSE_CLIENT` và thay mã slot thật trong
      `src/lib/ads.ts`
- [ ] Cài tiện ích chặn quảng cáo trên trình duyệt dùng để test — tự bấm vào quảng cáo của mình
      là bị khoá tài khoản vĩnh viễn

Kế hoạch tổng thể và bảng từ khoá: xem `docs/KE_HOACH_ADSENSE_ADMOB.md` và `docs/TU_KHOA_CONG_CU.md`.
