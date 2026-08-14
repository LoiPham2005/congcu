# Kế hoạch Vai 2 — Kiếm tiền từ quảng cáo (AdSense / AdMob)

> **Vai 2 = bạn là người BÁN chỗ quảng cáo.** Bạn xây web/app, Google hiển thị quảng cáo của người khác lên đó, bạn được chia tiền.
> Ngược với Vai 1 (chạy Facebook/TikTok Ads) — ở đó mỗi click **trừ** tiền bạn.

Ngày lập: 2026-08-14
Người thực hiện: 1 người (part-time, song song freelance)

---

## 1. Sự thật cần chấp nhận trước khi bắt đầu

Đọc kỹ phần này. Nếu không chấp nhận được thì đừng bắt đầu, đỡ mất 12 tháng.

| Kỳ vọng sai                    | Thực tế                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------- |
| "Làm bao nhiêu kiếm bấy nhiêu" | Thu nhập **không tuyến tính**. Có thể làm 500 giờ và kiếm 0đ.                 |
| "Vài tháng là có tiền"         | Đồng đầu tiên: **3–6 tháng**. Đủ sống: **12–24 tháng**, nếu may.              |
| "Không áp lực"                 | Đổi áp lực khách hàng lấy áp lực **thị trường không quan tâm**. Khó chịu hơn. |
| "Code xong là xong"            | Code chiếm **20%** công sức. 80% là làm sao có người dùng.                    |

**Kinh tế đơn vị (traffic Việt Nam):**

- Web AdSense: RPM khoảng **12.000 – 50.000đ / 1.000 lượt xem trang**
- App AdMob: banner rất thấp; interstitial và rewarded cao hơn nhiều lần
- → Muốn **5 triệu/tháng** cần cỡ **150.000 – 300.000 lượt xem trang/tháng**

Traffic tiếng Anh trả cao hơn tiếng Việt nhiều lần. Cân nhắc làm song ngữ ngay từ đầu.

**Ngưỡng thanh toán:** cả AdSense và AdMob đều là **100 USD**. Chưa đủ thì Google giữ, không trả. Nhiều người bỏ cuộc trước khi chạm mốc này.

---

## 2. Chiến lược: làm CÔNG CỤ, không làm NỘI DUNG

Đây là quyết định quan trọng nhất của cả kế hoạch.

**Không làm:** blog, site tin tức, site "top 10", site chia sẻ kiến thức.
**Lý do:** từ khi Google đẩy AI Overviews lên đầu trang kết quả, người dùng đọc câu trả lời ngay trên Google và không click vào web nữa. Rất nhiều site nội dung sống 5–7 năm đã chết trong 2 năm qua. Đi vào hướng này bây giờ là đi vào ngành đang suy.

**Làm:** trang **công cụ dùng được ngay, không cần đăng ký**.
**Lý do:** người dùng cần **làm một việc**, không cần đọc câu trả lời. AI không thay thế được hành động.

Ví dụ loại từ khoá đúng hướng:

- "tạo mã QR chuyển khoản ngân hàng"
- "tính lương gross sang net"
- "nén ảnh online không mất chất lượng"
- "chuyển excel sang json"
- "tính lãi suất vay ngân hàng"
- "tạo chữ ký email"

Đặc điểm chung: **người tìm đang muốn làm gì đó ngay**, và họ sẽ quay lại lần sau.

### Tài sản sẵn có để tận dụng

| Repo            | Vai trò trong kế hoạch                                                       |
| --------------- | ---------------------------------------------------------------------------- |
| `nextjs_base`   | Nền cho website công cụ (SSR tốt cho SEO, đã có Prisma, Docker, deploy)      |
| `toolbox`       | Kiểm tra lại — nếu đã là hướng công cụ thì đây là hạt giống, khỏi làm từ đầu |
| `flutter_base2` | Nền cho app di động, gắn AdMob                                               |
| `deploybox`     | Hạ tầng triển khai                                                           |

Không phải bắt đầu từ số 0. Đây là lợi thế thật.

---

## 3. Hai mặt trận — làm web trước, app sau

|                           | Web + AdSense              | App + AdMob                                            |
| ------------------------- | -------------------------- | ------------------------------------------------------ |
| Thời gian ra sản phẩm đầu | 2–4 tuần                   | 4–8 tuần                                               |
| Nguồn traffic miễn phí    | Google Search (SEO)        | ASO trên CH Play / App Store                           |
| Chi phí                   | Domain + VPS (~500k/tháng) | Tài khoản dev: Google 25 USD một lần, Apple 99 USD/năm |
| Vòng lặp thử nghiệm       | Nhanh — deploy trong ngày  | Chậm — chờ duyệt store 1–7 ngày                        |
| Rủi ro lớn nhất           | Google core update         | Không ai tải app                                       |

**Quyết định: làm web trước.** Vòng lặp nhanh hơn, chi phí thấp hơn, học được nhiều hơn trong cùng thời gian. App chỉ bắt đầu ở Giai đoạn 3, khi đã biết chủ đề nào có người tìm thật.

---

## 4. Lộ trình 12 tháng

Cam kết tối thiểu: **8–10 giờ/tuần cố định, ghi vào lịch**. Không phải "lúc nào rảnh".

### Giai đoạn 0 — Nghiên cứu từ khoá (Tuần 1–2) · Chưa code gì

Mục tiêu: tìm ra **10 công cụ** có người tìm thật.

Việc cần làm:

1. Dùng Google Keyword Planner (miễn phí, chỉ cần tài khoản Google Ads — không cần chạy quảng cáo)
2. Gõ thử từ khoá vào Google, xem trang kết quả:
   - Nếu top 10 toàn báo lớn, ngành ngân hàng/bảo hiểm → **bỏ**, không cạnh tranh nổi
   - Nếu top 10 có site nhỏ, giao diện cũ, quảng cáo dày → **đây là cơ hội**
3. Lập bảng: từ khoá | lượng tìm/tháng | độ khó | thời gian build ước tính

**Tiêu chí chọn:** ≥ 1.000 lượt tìm/tháng, build được trong ≤ 3 ngày, đối thủ yếu.

**Đầu ra:** file `keywords.md` với 10 dòng đã chấm điểm.

### Giai đoạn 1 — Dựng site và xin duyệt AdSense (Tuần 3–10)

Mục tiêu: **được AdSense chấp thuận**. Đây là cửa ải thật, nhiều người trượt.

Việc cần làm:

1. Mua domain `.com` (khoảng 300k/năm). **Không dùng subdomain miễn phí** — AdSense rất khó duyệt.
2. Dựng site từ `nextjs_base`, deploy lên VPS qua `deploybox`
3. **Build 10–15 công cụ** từ danh sách Giai đoạn 0. Mỗi công cụ = một trang riêng, một URL riêng.
4. Bắt buộc phải có (thiếu là trượt duyệt):
   - Trang **Chính sách bảo mật** (Privacy Policy)
   - Trang **Giới thiệu** (About)
   - Trang **Liên hệ** (Contact) — email thật
   - Menu điều hướng rõ ràng
   - Giao diện responsive, không lỗi trên mobile
5. Mỗi trang công cụ kèm 200–400 chữ giải thích cách dùng — không copy từ nơi khác
6. Khai báo sitemap trong Google Search Console, chờ index
7. **Chờ có traffic tự nhiên rồi mới nộp AdSense.** Nộp khi site trống hoặc chưa ai vào là lý do trượt phổ biến nhất.

**Cột mốc:** AdSense duyệt. Nếu trượt, Google nói lý do — sửa rồi nộp lại, không giới hạn số lần.

### Giai đoạn 2 — SEO và mở rộng (Tháng 3–6)

Mục tiêu: **10.000 lượt xem trang/tháng**.

Việc cần làm:

1. Mỗi tuần thêm **1–2 công cụ mới**. Cuối giai đoạn có 30–40 công cụ.
2. Theo dõi Search Console hàng tuần: từ khoá nào đang lên, trang nào có hiển thị nhưng ít click → sửa tiêu đề
3. Tối ưu tốc độ tải — Core Web Vitals ảnh hưởng thứ hạng. Next.js đã tốt sẵn, đừng phá bằng thư viện nặng.
4. Đặt vị trí quảng cáo: **trên màn hình đầu 1 khối, giữa nội dung 1 khối, cuối trang 1 khối**. Đừng nhồi quá — vừa giảm trải nghiệm vừa bị Google phạt.
5. Thêm **tiếng Anh** cho các công cụ không phụ thuộc ngữ cảnh Việt Nam (nén ảnh, đổi định dạng file...). RPM cao hơn nhiều lần.

**Cột mốc:** doanh thu đầu tiên hiển thị trong AdSense. Nhỏ thôi (vài trăm nghìn), nhưng đây là bằng chứng mô hình chạy được.

### Giai đoạn 3 — Thêm mặt trận app (Tháng 6–9)

Chỉ làm nếu Giai đoạn 2 đạt mốc. Nếu chưa, ở lại Giai đoạn 2.

Việc cần làm:

1. Nhìn Search Console xem **công cụ nào nhiều traffic nhất** → làm app cho đúng cái đó. Không đoán mò.
2. Build bằng `flutter_base2`, gắn AdMob
3. Định dạng quảng cáo theo thứ tự ưu tiên: **rewarded** (người dùng tự nguyện xem để mở tính năng) > **interstitial** (giữa các màn hình) > banner
4. Bắt buộc: file `app-ads.txt` trên domain của bạn, khai báo trong AdMob
5. ASO: tên app chứa từ khoá người ta gõ; ảnh chụp màn hình đầu tiên nói **lợi ích**, không khoe giao diện
6. Đặt link từ web sang app ở mỗi trang công cụ — đây là nguồn tải miễn phí sẵn có

**Cột mốc:** 1.000 lượt cài đặt.

### Giai đoạn 4 — Đánh giá và quyết định (Tháng 12)

Ngồi xuống, nhìn số, quyết định thẳng thắn:

- **Nếu ≥ 5 triệu/tháng và đang tăng** → tiếp tục, tăng thời gian đầu tư
- **Nếu 1–5 triệu/tháng** → mô hình chạy được nhưng chậm. Cân nhắc chuyển hướng: dùng traffic đang có để **bán bản Pro thuê bao** thay vì sống bằng quảng cáo. Một người trả 50k/tháng bằng cả nghìn người xem quảng cáo.
- **Nếu < 1 triệu/tháng** → dừng. Không tiếc. Giữ lại kỹ năng SEO/ASO/phân phối — đó mới là thứ đáng giá, và nó dùng được cho mọi sản phẩm sau này.

---

## 5. Điều cấm kỵ — vi phạm là mất trắng

Google khoá tài khoản vĩnh viễn và **giữ luôn tiền chưa thanh toán**. Không kháng nghị được trong đa số trường hợp.

- ❌ **Tự click vào quảng cáo của mình** — kể cả một lần, kể cả vô tình
- ❌ Nhờ bạn bè, người thân click
- ❌ Dùng công cụ tự động, bot, mua traffic
- ❌ Đặt chữ "Bấm vào đây" cạnh quảng cáo, hoặc để quảng cáo lẫn vào nút bấm gây nhầm
- ❌ Nội dung vi phạm: cờ bạc, người lớn, bản quyền, thuốc/thực phẩm chức năng không phép
- ❌ Nhồi quá nhiều quảng cáo che hết nội dung

Quy tắc an toàn: **cài extension chặn quảng cáo trên trình duyệt bạn dùng để test site của mình.**

---

## 6. Chỉ số theo dõi hàng tuần

Mở một Google Sheet, mỗi Chủ nhật ghi 5 con số:

| Chỉ số                | Xem ở đâu        | Ý nghĩa            |
| --------------------- | ---------------- | ------------------ |
| Lượt xem trang        | Google Analytics | Quy mô             |
| Số từ khoá vào top 10 | Search Console   | Sức khoẻ SEO       |
| RPM                   | AdSense          | Chất lượng traffic |
| Doanh thu             | AdSense / AdMob  | Kết quả            |
| Số công cụ đã có      | Tự đếm           | Nhịp làm việc      |

Chỉ nhìn số. Không tự đánh giá bằng cảm giác "tuần này thấy làm được nhiều".

---

## 7. Chi phí dự kiến năm đầu

| Khoản                           | Chi phí                      |
| ------------------------------- | ---------------------------- |
| Domain `.com`                   | ~300k/năm                    |
| VPS                             | ~300–500k/tháng              |
| Tài khoản Google Play Developer | 25 USD (một lần)             |
| Tài khoản Apple Developer       | 99 USD/năm (chỉ khi cần iOS) |
| **Tổng năm đầu**                | **~6–10 triệu**              |

Chi phí thấp. Thứ đắt nhất là **thời gian** — khoảng 400–500 giờ.

---

## 8. Thuế

Từ 2026, cá nhân có doanh thu từ nền tảng xuyên biên giới **vượt 500 triệu/năm** nộp **7% trên phần vượt** (5% GTGT + 2% TNCN).

Ở quy mô kế hoạch này (dưới 500 triệu/năm), chưa tới ngưỡng. Nhưng nên **giữ lại toàn bộ sao kê nhận tiền từ Google** ngay từ đồng đầu tiên. Nếu vượt ngưỡng thì hỏi kế toán, đừng tự nhân 7% cho toàn bộ doanh thu — cách tính năm 2026 có điều chỉnh.

---

## 9. Nguyên tắc nền

1. **Giữ freelance làm dòng tiền.** Đừng nghỉ việc. Người ta thất bại vì hết tiền trước khi sản phẩm kịp sống, hiếm khi vì ý tưởng dở.
2. **Chọn kênh phân phối trước, chọn sản phẩm sau.** Không tìm được từ khoá có người tìm thì đừng build.
3. **Đặt mốc dừng trước khi bắt đầu.** Đã ghi ở Giai đoạn 4. Không có mốc dừng, bạn sẽ nuôi một dự án chết trong 3 năm.
4. **Quảng cáo là trần thấp.** Nếu traffic lên được, hướng thuê bao trả tiền cao hơn hàng chục lần với cùng lượng người dùng. Luôn để ngỏ cửa chuyển sang.

---

## 10. Việc cần làm ngay tuần này

- [ ] Mở `toolbox`, xác định nó đang là gì — có tái dùng được không
- [ ] Tạo tài khoản Google Ads (miễn phí) để dùng Keyword Planner
- [ ] Nghiên cứu và chấm điểm 10 từ khoá công cụ → ghi vào `keywords.md`
- [ ] Với mỗi từ khoá, gõ thử Google và xem đối thủ top 10 mạnh hay yếu
- [ ] Chọn 3 công cụ dễ nhất để làm trước
- [ ] Đặt lịch cố định 8–10 giờ/tuần vào Google Calendar

**Chưa mua domain, chưa viết dòng code nào cho tới khi xong bảng từ khoá.**
