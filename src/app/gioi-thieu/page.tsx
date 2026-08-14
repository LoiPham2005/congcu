import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools/registry";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `${siteConfig.ten} là bộ công cụ tính toán online miễn phí, chạy hoàn toàn trên trình duyệt và không lưu dữ liệu người dùng.`,
  alternates: { canonical: "/gioi-thieu" },
};

export default function Page() {
  return (
    <main className="container">
      <h1 className="page-title">Giới thiệu</h1>

      <article className="prose">
        <p>
          {siteConfig.ten} là bộ công cụ tính toán trực tuyến dành cho người Việt. Hiện có{" "}
          {TOOLS.length} công cụ, tất cả đều miễn phí và không yêu cầu đăng ký.
        </p>

        <h2>Chúng tôi làm gì</h2>
        <p>
          Có những phép tính lặp đi lặp lại trong công việc hằng ngày mà đến giờ vẫn phải tra công
          thức rồi bấm máy tính tay: đọc số tiền thành chữ khi viết hoá đơn, dự trù số viên gạch
          trước khi xây, kiểm tra hoá đơn tiền điện xem có bị tính sai bậc thang không.
        </p>
        <p>
          Chúng tôi làm sẵn những phép tính đó thành công cụ nhập là ra kết quả, kèm phần giải thích
          công thức bên dưới để bạn tự đối chiếu.
        </p>

        <h2>Nguyên tắc làm việc</h2>
        <ul>
          <li>
            <strong>Không thu thập dữ liệu.</strong> Mọi phép tính chạy bằng JavaScript ngay trên
            máy bạn. Số liệu bạn nhập không rời khỏi trình duyệt, kể cả khi đó là số tiền trong hợp
            đồng hay danh sách khách hàng.
          </li>
          <li>
            <strong>Công khai cách tính.</strong> Mỗi công cụ đều ghi rõ công thức và nguồn định
            mức. Một con số không giải thích được thì không đáng tin.
          </li>
          <li>
            <strong>Nói rõ giới hạn.</strong> Kết quả ở đây là số dự trù và tham khảo. Chỗ nào cần
            hồ sơ thiết kế hay tư vấn chuyên môn, chúng tôi nói thẳng.
          </li>
          <li>
            <strong>Không bắt đăng ký để xem kết quả.</strong> Vào là dùng được ngay.
          </li>
        </ul>

        <h2>Vì sao có quảng cáo</h2>
        <p>
          Site được duy trì bằng doanh thu quảng cáo hiển thị. Nhờ vậy toàn bộ công cụ giữ được miễn
          phí và không giới hạn lượt dùng. Chúng tôi đặt quảng cáo bên dưới phần công cụ, không chèn
          vào giữa thao tác của bạn và không dùng cửa sổ bật lên.
        </p>

        <h2>Góp ý và báo lỗi</h2>
        <p>
          Nếu bạn thấy một kết quả sai, hãy báo cho chúng tôi qua{" "}
          <Link href="/lien-he">trang liên hệ</Link>. Công cụ tính sai là lỗi nghiêm trọng nhất mà
          một site như thế này có thể mắc phải, nên chúng tôi ưu tiên sửa trước mọi việc khác.
        </p>
        <p>
          Bạn cũng có thể đề xuất công cụ mới. Chúng tôi ưu tiên những phép tính nhiều người phải
          làm đi làm lại mà chưa có công cụ tử tế.
        </p>
      </article>
    </main>
  );
}
