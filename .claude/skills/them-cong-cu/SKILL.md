---
name: them-cong-cu
description: Thêm một công cụ tính toán mới vào site (đổi số thành chữ, tính tiền điện, tính thuế…). Dùng khi người dùng nói "thêm công cụ", "làm công cụ tính X", "tạo trang tính Y", hoặc yêu cầu bất kỳ tiện ích mới nào cho site. Bao gồm cả logic, test, trang, đăng ký registry và nội dung hướng dẫn cho SEO.
---

# Thêm một công cụ mới

Một công cụ = **3 file**. Không sửa chỗ nào khác — `registry.ts` tự lo trang chủ, sitemap và
liên kết chéo.

Đọc `CLAUDE.md` trước nếu chưa nạp. Ba nguyên tắc ở đó chi phối mọi bước dưới đây.

---

## Bước 0 — Xác nhận từ khoá trước khi viết code

**Không bắt đầu nếu chưa biết người ta gõ gì để tìm công cụ này.** Đây là site sống bằng
traffic tìm kiếm; một công cụ không ai tìm là công sức bỏ đi.

Hỏi người dùng (hoặc tra `docs/TU_KHOA_CONG_CU.md`):

- Cụm từ chính xác người dùng gõ vào Google là gì?
- Đối thủ ở trang đầu là ai — site lớn hay blog công ty nhỏ?
- Góc đánh khác biệt là gì? Làm y hệt đối thủ thì không có lý do để Google xếp mình lên trên.

Nếu người dùng chỉ nói "làm công cụ tính X" mà chưa có thông tin này, hãy đề xuất từ khoá bạn
suy đoán và nói rõ đó là suy đoán cần họ xác nhận. Đừng chặn công việc lại, nhưng đừng im lặng
bịa ra `seoTitle`.

---

## Bước 1 — Logic thuần + test

`src/lib/tools/<ten>.ts` — tên file tiếng Anh, kebab-case.

Yêu cầu bắt buộc:

- **Không import React.** File này phải chạy được trong môi trường Node của Vitest.
- **Export type cho đầu vào và đầu ra.** Đừng dùng object ẩn danh.
- **Ném class Error riêng khi đầu vào sai**, ví dụ `InvalidXxxError extends Error`.
  Không trả `null` chung chung — component cần thông báo cụ thể để hiện cho người dùng.
- **Suy công thức từ nguyên lý, không chép định mức trên mạng.** Số trên mạng thường đúng cho
  đúng một trường hợp mà không ai ghi kèm điều kiện. Suy từ nguyên lý thì đổi tham số vẫn đúng.
- **Comment ghi lại vì sao**, đặc biệt là các cạm bẫy đã phát hiện.

Mẫu tham khảo theo độ phức tạp tăng dần:

| File                               | Đáng học điều gì                                                   |
| ---------------------------------- | ------------------------------------------------------------------ |
| `src/lib/tools/vietnamese-text.ts` | Xử lý chuỗi đơn giản, tuỳ chọn qua object                          |
| `src/lib/tools/number-to-words.ts` | Phân tích đầu vào người dùng gõ lộn xộn, nhiều quy tắc bất quy tắc |
| `src/lib/tools/brick-estimate.ts`  | Suy công thức từ hình học, validate nhiều tham số                  |

### Test — không có test là chưa xong

`src/lib/tools/<ten>.test.ts`, dùng `describe`/`it` tiếng Việt.

Phải phủ được:

1. **Các ca cơ bản** — giá trị thường gặp
2. **Ca biên** — 0, số âm, chuỗi rỗng, giá trị lớn nhất
3. **Đầu vào sai** — kiểm tra ném đúng loại lỗi
4. **Đối chiếu thực tế** — nếu công thức suy ra từ nguyên lý, viết test so kết quả với con số
   đã biết ngoài đời. Đây là thứ chứng minh công thức đúng.

Ví dụ ca thứ 4, trong `brick-estimate.test.ts`:

```ts
it("khớp với con số ~55 viên/m² quen dùng cho gạch ống, tường một lớp", () => {
  // …
  expect(result.bricksPerSquareMeter).toBe(58.5);
});
```

Chạy `pnpm vitest run src/lib/tools` để kiểm tra riêng phần logic trước khi làm giao diện.
**Làm xong bước này rồi mới sang bước 2** — sửa công thức sau khi đã dựng giao diện tốn hơn nhiều.

---

## Bước 2 — Đăng ký vào registry

Thêm một mục vào `TOOLS` trong `src/lib/tools/registry.ts`.

```ts
{
  slug: "tinh-tien-dien",
  path: "/tinh-tien-dien",
  name: "Tính tiền điện",
  seoTitle: "Tính tiền điện bậc thang EVN online — kèm nhà trọ nhiều hộ",
  description: "…",
  category: "dien-nuoc",
  keywords: ["cách tính tiền điện", "tính tiền điện bậc thang", …],
  updatedAt: "2026-08-14",
}
```

Lưu ý từng trường:

- `slug` phải trùng tên thư mục trong `src/app/(tools)/`.
- `seoTitle` **viết riêng, không tái dùng `name`**. Đây là dòng hiện trên Google và quyết định
  người ta có bấm hay không. Chứa đúng cụm từ khoá, dưới ~60 ký tự để không bị cắt.
- `description` dùng cho cả `<meta description>` lẫn thẻ ở trang chủ. Khoảng 150–160 ký tự.
- `keywords` là các cách diễn đạt khác của cùng nhu cầu.
- `updatedAt` đi vào `lastModified` của sitemap. **Cập nhật mỗi khi sửa nội dung thật**, đừng
  để nguyên khi đã đổi công thức.
- `category` phải là một trong các khoá của `CATEGORIES`. Thêm nhóm mới thì thêm vào đó trước.

**Không đăng ký công cụ chưa làm xong.** Mọi mục ở đây đi thẳng vào sitemap, mà sitemap trỏ tới
trang 404 là tín hiệu xấu với Google.

---

## Bước 3 — Trang và giao diện

Hai file trong `src/app/(tools)/<slug>/`:

### `<ten>-form.tsx` — phần tương tác

- Bắt đầu bằng `"use client"`.
- Tính kết quả bằng `useMemo`, **không dùng nút "Tính"**. Kết quả hiện ngay khi gõ là lý do
  người dùng thích công cụ hơn đọc bài viết.
- Bọc lời gọi logic trong `try/catch`, bắt đúng class lỗi, trả về kiểu
  `{ ok: true, … } | { ok: false, message: string }` rồi hiện `.alert-error`.
- Ô nhập số giữ state dạng `string`, không phải `number` — ép về number ngay khi gõ sẽ khiến
  người dùng không xoá hết ô được. Xem `useNumberField` trong `brick-estimate-form.tsx`.
- Có nút chép kết quả nếu đầu ra là văn bản.
- Dùng class CSS sẵn có trong `globals.css`: `.card`, `.field`, `.input`, `.select`,
  `.textarea`, `.btn`, `.result`, `.stat-grid`, `.alert-error`, `.note`. Đừng viết CSS mới trừ
  khi thật sự thiếu.

### `page.tsx` — server component

Chép nguyên khung từ một trang có sẵn, chỉ đổi slug và nội dung:

```tsx
const tool = getToolOrThrow("<slug>");

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  keywords: [...tool.keywords],
  alternates: { canonical: tool.path },
  openGraph: { title: tool.seoTitle, description: tool.description, url: tool.path },
};

export default function Page() {
  return (
    <ToolPage tool={tool} guide={<Guide />}>
      <XxxForm />
    </ToolPage>
  );
}
```

`ToolPage` tự lo breadcrumb, `<h1>`, JSON-LD, vị trí quảng cáo và khối công cụ liên quan.
**Không tự đặt `<h1>` hay khối quảng cáo trong trang** — sẽ trùng.

---

## Bước 4 — Nội dung hướng dẫn (`<Guide />`)

Đây **không phải phần lấp chỗ**. Nó quyết định hai việc: Google hiểu trang giải quyết vấn đề
gì, và AdSense có duyệt site không (trang chỉ có ô nhập liệu bị coi là nội dung mỏng).

Độ dài mục tiêu: **500–900 từ**. Cấu trúc đã dùng ở cả ba công cụ hiện có:

1. **`<h2>` Dùng để làm gì / Khi nào cần** — bối cảnh thật, ai dùng và tại sao
2. **`<h2>` Công thức hoặc quy tắc** — giải thích cách tính, để người dùng tự đối chiếu
3. **`<h2>` Cạm bẫy thường gặp** — chỗ này giá trị nhất, và là thứ đối thủ không có
4. **`<h2>` Câu hỏi thường gặp** — mỗi câu một `<h3>`, trả lời thẳng

Nguyên tắc viết:

- Viết cho người đang cần làm việc đó, không viết cho máy tìm kiếm. Nhồi từ khoá phản tác dụng.
- **Nói rõ giới hạn.** Chỗ nào kết quả chỉ là dự trù, chỗ nào cần chuyên gia — ghi thẳng.
  Thành thật là thứ giữ được người quay lại.
- Luôn có một câu trả lời cho "dữ liệu của tôi có bị gửi đi đâu không" — đây là lo lắng thật
  và là lợi thế của kiến trúc chạy trên trình duyệt.
- Dùng `&ldquo;`/`&rdquo;` cho dấu ngoặc kép, `{" "}` khi cần khoảng trắng giữa các thẻ JSX.

---

## Bước 5 — Kiểm tra

```bash
pnpm check     # typecheck + lint + format + test
pnpm build     # route mới phải hiện ○ (Static)
```

Sau đó chạy thử và **kiểm tra bằng curl thật, đừng tin vào code**:

```bash
node .next/standalone/server.js &
curl -s localhost:3000/<slug> | grep -o '<title>[^<]*</title>'
curl -s localhost:3000/sitemap.xml | grep <slug>
curl -s localhost:3000/<slug> | grep -o 'rel="canonical" href="[^"]*"'
```

Ba điều phải đúng:

- Route hiện `○ (Static)` trong bảng build. Thấy `ƒ` là đã lỡ gọi `headers()`/`cookies()` ở đâu đó.
- **Kết quả tính phải nằm sẵn trong HTML server trả về**, không phải chờ JavaScript chạy —
  đó là thứ Google đọc. Kiểm tra bằng cách `grep` một con số kết quả trong output curl.
- `<slug>` có mặt trong `sitemap.xml`.

---

## Sau khi xong, báo lại người dùng

- Đường dẫn công cụ và số test đã viết
- Công thức đã dùng và **cách nó được kiểm chứng** (đối chiếu với con số thực tế nào)
- Giới hạn đã biết của công cụ
- Nếu có suy đoán về từ khoá mà người dùng chưa xác nhận, nhắc lại rõ ràng
