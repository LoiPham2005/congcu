import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: `Chính sách bảo mật của ${siteConfig.ten}: dữ liệu bạn nhập vào công cụ không rời khỏi trình duyệt. Giải thích về cookie quảng cáo của Google.`,
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

export default function Page() {
  return (
    <main className="container">
      <h1 className="page-title">Chính sách bảo mật</h1>
      <p className="page-lead">Cập nhật lần cuối: 14/08/2026</p>

      <article className="prose">
        <h2>1. Dữ liệu bạn nhập vào công cụ</h2>
        <p>
          <strong>
            Số liệu và văn bản bạn nhập vào các công cụ trên site không được gửi đi đâu cả.
          </strong>{" "}
          Mọi phép tính chạy bằng JavaScript ngay trên trình duyệt của bạn. Chúng tôi không nhận,
          không lưu trữ và không nhìn thấy nội dung đó.
        </p>
        <p>
          Bạn có thể tự kiểm chứng: ngắt kết nối mạng sau khi trang đã tải xong, các công cụ vẫn
          hoạt động bình thường.
        </p>
        <p>
          {siteConfig.ten} không có chức năng đăng ký tài khoản, nên chúng tôi không có tên, email,
          số điện thoại hay bất kỳ thông tin định danh nào của bạn.
        </p>

        <h2>2. Số liệu truy cập</h2>
        <p>
          Chúng tôi thống kê lượt truy cập ở mức tổng hợp — trang nào được xem nhiều, người dùng đến
          từ nguồn nào — để biết nên làm thêm công cụ gì. Số liệu này không gắn với cá nhân nào.
        </p>

        <h2>3. Quảng cáo và cookie của bên thứ ba</h2>
        <p>
          Site hiển thị quảng cáo từ Google AdSense. Google và các đối tác của họ có thể dùng cookie
          để hiển thị quảng cáo phù hợp hơn dựa trên lịch sử truy cập của bạn trên site này và các
          website khác.
        </p>
        <ul>
          <li>
            Google sử dụng cookie <code>DoubleClick</code> để phục vụ quảng cáo dựa trên lượt truy
            cập trước đó của bạn.
          </li>
          <li>
            Bạn có thể tắt quảng cáo cá nhân hoá tại{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Cài đặt quảng cáo của Google
            </a>
            .
          </li>
          <li>
            Chi tiết về cách Google xử lý dữ liệu khi bạn dùng site của đối tác được nêu tại{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              chính sách của Google
            </a>
            .
          </li>
        </ul>
        <p>
          Chúng tôi không kiểm soát cookie do bên thứ ba đặt và không truy cập được dữ liệu họ thu
          thập.
        </p>

        <h2>4. Quyền của bạn</h2>
        <p>
          Vì chúng tôi không lưu dữ liệu cá nhân nào của bạn nên không có gì để yêu cầu chúng tôi
          cung cấp hoặc xoá. Với dữ liệu do Google thu thập qua quảng cáo, bạn thực hiện quyền của
          mình trực tiếp trong tài khoản Google hoặc qua các liên kết ở mục 3.
        </p>
        <p>
          Bạn cũng có thể chặn cookie trong cài đặt trình duyệt hoặc dùng tiện ích chặn quảng cáo.
          Các công cụ trên site vẫn hoạt động đầy đủ.
        </p>

        <h2>5. Trẻ em</h2>
        <p>
          Site không hướng tới trẻ em dưới 13 tuổi và không chủ động thu thập thông tin từ nhóm tuổi
          này.
        </p>

        <h2>6. Thay đổi chính sách</h2>
        <p>
          Khi có thay đổi, chúng tôi cập nhật nội dung trên trang này kèm ngày sửa mới ở đầu trang.
        </p>

        <h2>7. Liên hệ</h2>
        <p>
          Thắc mắc về chính sách này xin gửi tới{" "}
          <a href={`mailto:${siteConfig.emailLienHe}`}>{siteConfig.emailLienHe}</a> hoặc qua{" "}
          <Link href="/lien-he">trang liên hệ</Link>.
        </p>
      </article>
    </main>
  );
}
