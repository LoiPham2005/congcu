# Công Cụ Việt — quy ước dự án

Site công cụ tính toán online, sống bằng doanh thu quảng cáo hiển thị (AdSense).
Dựng trên `nextjs_base`, đã gỡ tầng auth/Prisma/realtime.

---

## Ba nguyên tắc bất di bất dịch

Mọi thay đổi phải tôn trọng ba điều này. Nếu một yêu cầu buộc phải phá vỡ một trong ba,
**dừng lại và nói rõ với người dùng trước khi làm**, đừng tự quyết.

### 1. Mọi phép tính chạy trên trình duyệt — không database, không API

Doanh thu chỉ vài chục đồng mỗi lượt xem. Nếu chi phí máy chủ tăng theo lượng truy cập thì
mô hình lỗ. Tính toán trên máy người dùng giữ chi phí biên gần bằng 0.

- KHÔNG thêm Prisma, database, hay `src/app/api/*` trừ khi người dùng yêu cầu rõ ràng.
- Nhu cầu xử lý file nặng: ưu tiên WebAssembly chạy trên trình duyệt thay vì gửi lên máy chủ.

### 2. Trang phải render tĩnh được

Tĩnh → tải nhanh → Core Web Vitals tốt → thứ hạng tìm kiếm cao → traffic → doanh thu.

- **KHÔNG gọi `headers()`, `cookies()`, `draftMode()`** trong bất kỳ `layout.tsx` hay `page.tsx`
  nào. Chỉ một lời gọi là Next.js chuyển cả trang sang render động.
- Sau khi build, mọi route phải hiện `○ (Static)`. Thấy `ƒ (Dynamic)` là có lỗi.
- Đây cũng là lý do CSP trong `src/proxy.ts` là tĩnh, không dùng nonce như `nextjs_base`.

### 3. Logic tính toán tách khỏi giao diện và BẮT BUỘC có test

Công cụ ở đây _là_ công thức. Một con số sai không phải lỗi hiển thị mà là mất uy tín —
và uy tín là tài sản duy nhất của site.

- Logic thuần nằm ở `src/lib/tools/<ten>.ts`, không import React.
- File test `<ten>.test.ts` nằm ngay cạnh. Không có test = chưa xong.
- Ưu tiên **suy công thức từ nguyên lý** hơn là chép định mức có sẵn trên mạng, rồi viết test
  đối chiếu kết quả với con số thực tế đã biết. Xem `brick-estimate.ts` làm mẫu.

---

## Quy ước code

- **Định danh tiếng Anh, comment tiếng Việt.** Theo đúng `nextjs_base`.
- Comment giải thích **vì sao**, không mô tả lại code. Ưu tiên ghi lại đánh đổi và cạm bẫy.
- TypeScript strict, có `noUncheckedIndexedAccess` — index vào mảng trả về `T | undefined`.
- Lỗi đầu vào ném class Error riêng (`InvalidNumberError`, `InvalidEstimateInputError`),
  không trả `null` chung chung. Component bắt lại và hiện thông báo.
- Chạy `pnpm check` trước khi báo xong. Nó gồm typecheck + lint + format + test.

---

## Quy tắc SEO — sai là hỏng, và hỏng âm thầm

- **Mỗi công cụ một URL riêng.** Không gộp nhiều công cụ vào một trang rồi chuyển tab,
  không dùng `?tool=abc`. Google cần URL riêng mới xếp hạng được.
- **Slug tiếng Việt không dấu**, đúng cụm người ta gõ: `/doi-so-thanh-chu`.
- **`seoTitle` viết riêng, không tái dùng `name`.** Đó là dòng hiện trên trang kết quả tìm kiếm.
- **Mọi trang phải có `alternates.canonical`.**
- **Trang 404 và trang lỗi phải `robots: { index: false }`.**
- **File tĩnh trong `public/` đè lên route cùng tên.** Đã từng có `public/robots.txt` chứa
  `Disallow: /` che mất `src/app/robots.ts` — site chạy đẹp nhưng Google không vào được.
  Kiểm tra bằng cách curl thật, đừng tin vào code.

## Quy tắc quảng cáo

- **Công cụ đứng trước, quảng cáo đứng sau.** Chèn quảng cáo lên trên đẩy công cụ khỏi màn hình
  đầu → người dùng thoát → Google đo được. Chính sách AdSense cũng cấm che nội dung chính.
- **Mọi khối quảng cáo phải giữ chỗ sẵn** bằng `min-height` (xem `AdSlot`). Nội dung nhảy khi
  quảng cáo nạp làm hỏng điểm CLS, mà CLS ảnh hưởng thứ hạng.
- **Quảng cáo tự tắt khi chưa có `NEXT_PUBLIC_ADSENSE_CLIENT`.** Giữ nguyên hành vi này.
- Thêm host quảng cáo mới phải cập nhật `GOOGLE_ADS_HOSTS` trong `src/proxy.ts`, nếu không
  CSP sẽ chặn.
- **Phần `guide` của mỗi trang công cụ phải là nội dung thật.** Trang chỉ có ô nhập liệu bị
  coi là nội dung mỏng và không được AdSense duyệt.

---

## Cấu trúc

```
src/
  app/
    (tools)/<slug>/page.tsx      # server component, metadata + guide
    (tools)/<slug>/<ten>-form.tsx # "use client", phần tương tác
    sitemap.ts  robots.ts         # sinh từ registry
  components/
    ads/ad-slot.tsx               # khối quảng cáo, giữ chỗ chống CLS
    tools/tool-page.tsx           # khung chung mọi trang công cụ
    tools/related-tools.tsx
  lib/
    tools/registry.ts             # ⭐ nguồn sự thật duy nhất
    tools/<ten>.ts                # logic thuần + <ten>.test.ts
    site-config.ts  ads.ts  env.ts
```

`registry.ts` điều khiển trang chủ, `sitemap.xml`, khối "công cụ liên quan". Thêm công cụ mới
chỉ cần thêm một mục ở đó — không sửa chỗ nào khác.

## Cấu hình

Hai biến, xem `.env.example`. `NEXT_PUBLIC_*` được nhúng vào bundle **lúc build**, không đọc
lại ở runtime — đổi giá trị phải build lại, sửa `.env` rồi restart không có tác dụng.

---

## Bối cảnh kinh doanh

Site nằm trong kế hoạch dài hạn ở `docs/KE_HOACH_ADSENSE_ADMOB.md`, bảng từ khoá ở
`docs/TU_KHOA_CONG_CU.md`. Hai điểm ảnh hưởng tới quyết định kỹ thuật:

- **Quảng cáo là trần thấp.** Đích cuối là chuyển sang bán thuê bao. Khi làm tính năng có thể
  thu phí, cân nhắc tách sang dự án riêng dùng `base_template` thay vì nhét vào đây.
- **Ưu tiên công cụ, không làm blog.** Google AI Overviews đã cắt phần lớn traffic của site
  nội dung. Người dùng cần _làm một việc_, không cần đọc câu trả lời.
