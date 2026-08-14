import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ với ${siteConfig.ten} để báo lỗi kết quả tính toán, đề xuất công cụ mới hoặc trao đổi về hợp tác quảng cáo.`,
  alternates: { canonical: "/lien-he" },
};

export default function Page() {
  return (
    <main className="container">
      <h1 className="page-title">Liên hệ</h1>

      <article className="prose">
        <p>
          Mọi thư gửi tới địa chỉ bên dưới đều được đọc. Chúng tôi cố gắng phản hồi trong vòng 3
          ngày làm việc.
        </p>

        <div className="card" style={{ margin: "20px 0" }}>
          <div className="stat__label">Email</div>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: 4 }}>
            <a href={`mailto:${siteConfig.emailLienHe}`}>{siteConfig.emailLienHe}</a>
          </p>
        </div>

        <h2>Báo kết quả tính sai</h2>
        <p>Đây là loại thư chúng tôi ưu tiên xử lý trước. Để sửa nhanh, bạn ghi giúp:</p>
        <ul>
          <li>Tên công cụ và đường dẫn trang</li>
          <li>Các số bạn đã nhập</li>
          <li>Kết quả công cụ trả ra và kết quả bạn cho là đúng</li>
          <li>Nguồn hoặc công thức bạn dùng để đối chiếu, nếu có</li>
        </ul>

        <h2>Đề xuất công cụ mới</h2>
        <p>
          Hãy mô tả phép tính bạn đang phải làm thủ công và bối cảnh công việc. Chúng tôi ưu tiên
          những phép tính nhiều người phải làm đi làm lại mà chưa có công cụ tử tế.
        </p>

        <h2>Hợp tác quảng cáo</h2>
        <p>
          Chúng tôi nhận đặt quảng cáo hiển thị phù hợp với nội dung từng trang. Không nhận nội dung
          cờ bạc, cho vay nặng lãi hoặc thực phẩm chức năng không phép.
        </p>

        <h2>Bản quyền</h2>
        <p>
          Nếu bạn cho rằng một nội dung trên site vi phạm bản quyền của mình, hãy gửi thư kèm liên
          kết cụ thể và bằng chứng quyền sở hữu. Chúng tôi sẽ gỡ nội dung vi phạm sau khi xác minh.
        </p>
      </article>
    </main>
  );
}
