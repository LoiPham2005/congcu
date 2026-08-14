---
name: kiem-tra-seo
description: Soát lỗi SEO và điều kiện duyệt AdSense trên bản build thật trước khi deploy. Dùng khi người dùng nói "kiểm tra trước khi deploy", "soát SEO", "sắp nộp AdSense", "site đã sẵn sàng chưa", hoặc sau khi thêm nhiều công cụ mới. Kiểm tra bằng curl trên server thật, không đọc code suông.
---

# Soát SEO và điều kiện AdSense

Lỗi SEO ở dự án này **hỏng âm thầm**: site chạy đẹp, build sạch, deploy thành công — rồi sáu
tháng sau vẫn không có ai vào mà không hiểu vì sao.

Nguyên tắc của skill này: **kiểm tra trên bản build thật bằng curl, không đọc code rồi kết luận.**
Từng có `public/robots.txt` chứa `Disallow: /` che mất `src/app/robots.ts` — đọc code thì thấy
đúng, chạy thật mới lộ ra.

---

## Chuẩn bị

```bash
pnpm check
NEXT_PUBLIC_SITE_URL=https://<tenmien-that> pnpm build
lsof -ti:3000 | xargs kill -9 2>/dev/null
(NEXT_PUBLIC_SITE_URL=https://<tenmien-that> node .next/standalone/server.js > /tmp/congcu.log 2>&1 &)
sleep 3
```

Nhớ `kill` tiến trình khi soát xong.

---

## A. Chặn — sai một trong các mục này là site không lên được Google

### A1. robots.txt phải cho phép bò

```bash
curl -s localhost:3000/robots.txt
```

Phải thấy `Allow: /` và dòng `Sitemap:` trỏ đúng tên miền thật.

Thấy `Disallow: /` → kiểm tra ngay `ls public/` xem có file tĩnh đè lên route không.

### A2. Không route nào bị động

Trong output `pnpm build`, mọi route phải là `○ (Static)`.

Thấy `ƒ (Dynamic)` → có chỗ gọi `headers()`, `cookies()` hoặc `draftMode()`. Truy bằng:

```bash
grep -rn "headers()\|cookies()\|draftMode()" src/app src/components
```

### A3. Sitemap đủ và đúng tên miền

```bash
curl -s localhost:3000/sitemap.xml | grep -c "<loc>"
curl -s localhost:3000/sitemap.xml | grep -o "<loc>[^<]*" | head -20
```

Số URL phải bằng `TOOLS.length + 4` (trang chủ + 3 trang bắt buộc). Mọi `<loc>` phải là tên
miền thật, không phải `localhost`.

### A4. Mọi trang trả 200, trang không tồn tại trả 404

```bash
for p in $(curl -s localhost:3000/sitemap.xml | grep -o '<loc>[^<]*' | sed 's|<loc>https://[^/]*||'); do
  printf "%-28s %s\n" "${p:-/}" "$(curl -s -o /dev/null -w '%{http_code}' localhost:3000${p:-/})"
done
curl -s -o /dev/null -w 'trang-khong-ton-tai %{http_code}\n' localhost:3000/khong-ton-tai
```

### A5. Nội dung phải nằm trong HTML server trả về

Đây là điều nhiều người bỏ sót. Google đọc HTML, và với site công cụ thì **kết quả tính phải
có sẵn trong HTML**, không phải chờ JavaScript chạy.

```bash
curl -s localhost:3000/<slug-bat-ky> | grep -o 'result__value[^<]*<[^>]*>[^<]*'
```

Không thấy kết quả nào → component đang chỉ tính sau khi hydrate. Sửa bằng cách cho state ban
đầu có giá trị mẫu hợp lệ (xem `NumberToWordsForm` khởi tạo `useState("1234567")`).

---

## B. Chất lượng SEO từng trang

Chạy vòng qua mọi trang công cụ:

```bash
for p in $(curl -s localhost:3000/sitemap.xml | grep -o '<loc>[^<]*' | sed 's|<loc>https://[^/]*||'); do
  echo "── ${p:-/}"
  curl -s localhost:3000${p:-/} | grep -o '<title>[^<]*</title>\|name="description" content="[^"]*"\|rel="canonical" href="[^"]*"'
done
```

Với mỗi trang, kiểm:

- **Có `<title>`, không trùng với trang khác.** Tiêu đề trùng làm Google chỉ chọn một trang.
- **Độ dài `<title>` dưới ~60 ký tự** để không bị cắt trên trang kết quả.
- **Có `<meta description>`**, khoảng 150–160 ký tự, không trùng nhau.
- **Có `rel="canonical"`** trỏ đúng URL của chính trang đó, tên miền thật.
- **Đúng một thẻ `<h1>`** mỗi trang:
  ```bash
  curl -s localhost:3000/<slug> | grep -c '<h1'
  ```
- **Trang 404 phải `noindex`**:
  ```bash
  curl -s localhost:3000/khong-ton-tai | grep -o 'name="robots" content="[^"]*"'
  ```

Kiểm dữ liệu có cấu trúc trên trang công cụ:

```bash
curl -s localhost:3000/<slug> | grep -o '"@type":"[^"]*"'
```

Phải thấy `WebApplication` và `BreadcrumbList`.

---

## C. Điều kiện duyệt AdSense

Đây là danh sách lý do bị từ chối phổ biến, theo thứ tự hay gặp.

### C1. Ba trang bắt buộc

```bash
for p in /gioi-thieu /lien-he /chinh-sach-bao-mat; do
  printf "%-22s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' localhost:3000$p)"
done
```

Cả ba phải 200 và có liên kết từ chân trang mọi trang.

### C2. Email liên hệ phải là địa chỉ thật

```bash
grep -n "emailLienHe" src/lib/site-config.ts
```

Còn `example.com` là **chắc chắn bị từ chối**.

### C3. Chính sách bảo mật phải nói về cookie quảng cáo

```bash
curl -s localhost:3000/chinh-sach-bao-mat | grep -c "DoubleClick\|policies.google.com"
```

Phải > 0. AdSense yêu cầu nêu rõ việc bên thứ ba dùng cookie.

### C4. Đủ nội dung

```bash
grep -c "slug:" src/lib/tools/registry.ts
```

Nên có **ít nhất 10–15 công cụ** trước khi nộp. Mỗi trang phải có phần `guide` là nội dung
thật, không phải chỉ ô nhập liệu.

Kiểm nhanh trang nào nội dung mỏng:

```bash
for p in $(curl -s localhost:3000/sitemap.xml | grep -o '<loc>[^<]*' | sed 's|<loc>https://[^/]*||'); do
  n=$(curl -s localhost:3000${p:-/} | sed 's/<[^>]*>/ /g' | wc -w | tr -d ' ')
  printf "%-28s %s từ\n" "${p:-/}" "$n"
done
```

Trang công cụ dưới ~500 từ là mỏng, cần viết thêm phần hướng dẫn.

### C5. CSP không chặn quảng cáo

```bash
curl -sI localhost:3000/ | grep -i content-security-policy
```

Phải có `pagead2.googlesyndication.com` trong `script-src`, `frame-src` cho phép host quảng
cáo, và `img-src` có `https:`. Thiếu là quảng cáo hiện trắng trơn.

### C6. Hành vi khi chưa cấu hình AdSense

```bash
curl -s localhost:3000/<slug> | grep -c googlesyndication
```

Khi `NEXT_PUBLIC_ADSENSE_CLIENT` chưa set, kết quả phải là **0** — không nạp script thừa.
Khi đã set thì phải > 0.

---

## D. Tốc độ và trải nghiệm

- **Khối quảng cáo phải giữ chỗ.** Mọi `AdSlot` cần `min-height`, nếu không nội dung nhảy khi
  quảng cáo nạp và điểm CLS hỏng.
  ```bash
  curl -s localhost:3000/<slug> | grep -o 'ad-slot[^>]*min-height[^;]*'
  ```
- **Không có tài nguyên ngoài chặn render.** Site không dùng font hay CSS từ CDN — kiểm:
  ```bash
  curl -s localhost:3000/ | grep -o 'href="https://[^"]*"' | grep -v "$(grep NEXT_PUBLIC_SITE_URL .env 2>/dev/null | cut -d= -f2)"
  ```
- Ảnh (khi có) phải dùng `next/image` và có `alt`.

---

## Báo cáo

Sau khi soát, báo lại theo ba nhóm, **đừng chỉ nói "đã kiểm tra xong"**:

1. **Chặn deploy** — mục A và C1–C3 sai. Phải sửa trước khi lên.
2. **Nên sửa** — tiêu đề trùng, thiếu description, trang mỏng.
3. **Ghi nhận** — những việc phụ thuộc bên ngoài: mua tên miền, khai báo Search Console,
   chờ traffic tự nhiên trước khi nộp AdSense.

Nhớ `kill` server thử nghiệm khi xong.
