---
name: nghien-cuu-tu-khoa
description: Khảo sát đối thủ trên trang kết quả tìm kiếm để quyết định có nên làm một công cụ hay không, trước khi viết code. Dùng khi người dùng hỏi "nên làm công cụ gì tiếp", "từ khoá này có làm được không", "đối thủ mạnh không", hoặc trước khi bắt đầu một công cụ mới chưa có trong bảng từ khoá.
---

# Khảo sát từ khoá trước khi làm công cụ

Site này sống bằng traffic tìm kiếm. Một công cụ không ai tìm, hoặc từ khoá bị site lớn chiếm
chắc, là vài ngày công bỏ đi. Skill này chạy **trước** `them-cong-cu`.

Bảng từ khoá đã khảo sát nằm ở `docs/TU_KHOA_CONG_CU.md` — đọc trước, có thể câu trả lời đã có
sẵn ở đó.

---

## Nói trước về giới hạn — luôn nói với người dùng

**Không truy cập được Google Keyword Planner.** Mọi con số "lượt tìm/tháng" chỉ là ước lượng,
phải nói rõ đó là ước lượng và người dùng cần tự xác minh.

**WebSearch chạy từ máy chủ Mỹ, không phải Google Việt Nam.** Thứ hạng thực tế trên
google.com.vn có thể lệch. Người dùng nên gõ lại ở chế độ ẩn danh để xác nhận.

Phần làm được chắc chắn — và cũng là phần quyết định — là **nhận diện đối thủ**.

---

## Bước 1 — Tìm và đọc trang kết quả

Với mỗi từ khoá ứng viên, tìm bằng đúng cụm người Việt hay gõ:

```
WebSearch: "công cụ tính <X> online"
WebSearch: "cách tính <X>"
```

Ghi lại **tên miền** của 8–10 kết quả đầu. Tên miền mới là dữ liệu, không phải nội dung tóm tắt.

## Bước 2 — Chấm độ khó theo loại đối thủ

Đây là phần có giá trị nhất. Nhìn ai đang đứng top:

| Dấu hiệu                                                                 | Độ khó        | Kết luận                     |
| ------------------------------------------------------------------------ | ------------- | ---------------------------- |
| Blogspot, wordpress.com, site cá nhân                                    | 5 — rất dễ    | Làm ngay                     |
| Blog của công ty ngoài ngành (công ty nhôm kính đứng top từ khoá đọc số) | 5 — rất dễ    | Rào cản gần bằng 0           |
| Site công cụ nhỏ chuyên biệt                                             | 4 — dễ        | Làm được nếu công cụ tốt hơn |
| Blog công ty trong ngành, không có công cụ thật                          | 4–5           | **Cơ hội tốt** — xem bước 3  |
| Báo lớn, site tin tức                                                    | 2 — khó       | Chỉ đánh từ khoá dài         |
| Sàn tuyển dụng (TopCV, VietnamWorks, CareerLink), MISA, LuatVietnam      | 1 — rất khó   | **Bỏ**                       |
| Ngân hàng, ví điện tử, công ty tài chính                                 | 1–2 — rất khó | Chỉ đánh từ khoá dài         |

## Bước 3 — Tìm khe hở

Ba khe hở hay gặp, xếp theo giá trị:

**Đối thủ chỉ có bài viết, không có công cụ thật.** Đây là khe tốt nhất. Nếu cả trang đầu là
"cách tính X" dạng bài viết dạy công thức, thì một trang nhập số ra kết quả ngay sẽ thắng về
trải nghiệm. Đã gặp ở từ khoá vật liệu xây dựng.

**Quy định vừa thay đổi.** Luật mới, biểu giá mới, định mức mới làm mọi trang cũ lỗi thời và
sinh ra từ khoá chưa ai chiếm. Cửa sổ thường mở 3–6 tháng.

**Trường hợp phụ chưa ai phục vụ.** Đối thủ làm ca phổ thông, bỏ qua ca ngách — ví dụ tính tiền
điện cho nhà trọ nhiều hộ chung công tơ. Từ khoá dài, dễ lên, và đúng nỗi đau thật.

Không tìm được khe hở nào → **đề nghị bỏ từ khoá đó**. Làm y hệt đối thủ thì không có lý do gì
để Google xếp mình lên trên.

## Bước 4 — Cân nhắc RPM

Quy luật đã quan sát được ở thị trường Việt: **nhóm dễ vào thì RPM thấp, nhóm RPM cao thì bị
chiếm chắc.**

| Nhóm                               | RPM        | Đối thủ                 |
| ---------------------------------- | ---------- | ----------------------- |
| Tiện ích văn bản (bỏ dấu, đọc số)  | Thấp       | Rất yếu                 |
| Xây dựng, vật liệu                 | Khá        | Yếu — đa số là bài viết |
| Điện, sinh hoạt                    | Trung bình | Trung bình              |
| Tài chính, thuế, bảo hiểm, vay vốn | Cao nhất   | Tường thành             |

Chiến lược: nhóm RPM thấp đóng vai **trang mồi** để tích uy tín tên miền, rồi mới đánh sang
nhóm RPM cao bằng từ khoá dài. Đừng đánh giá một công cụ chỉ bằng RPM.

---

## Kết quả bàn giao

Với mỗi từ khoá, đưa ra:

- **Đối thủ top 10** — liệt kê tên miền thật, có link
- **Điểm dễ 1–5** kèm lý do cụ thể (không chỉ ghi con số)
- **RPM ước lượng** theo bảng nhóm ở trên
- **Khe hở** — góc đánh khác biệt, hoặc kết luận không có khe
- **Khuyến nghị**: làm ngay / để sau / bỏ
- **Công sức ước tính** tính theo ngày

Nếu khảo sát nhiều từ khoá cùng lúc, cập nhật thẳng vào `docs/TU_KHOA_CONG_CU.md` thay vì tạo
file mới, và giữ nguyên cấu trúc bảng đã có ở đó.

Luôn nhắc lại: lượng tìm kiếm là ước lượng, cần người dùng xác minh bằng Keyword Planner.
