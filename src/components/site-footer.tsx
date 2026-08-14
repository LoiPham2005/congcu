import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Chân trang.
 *
 * Ba liên kết Giới thiệu / Liên hệ / Chính sách bảo mật không phải để trang trí:
 * AdSense yêu cầu site có đủ ba trang này thì mới xét duyệt, và thiếu chúng là
 * một trong những lý do bị từ chối phổ biến nhất.
 */
export function SiteFooter() {
  // Không dùng `new Date()` để tránh lệch giữa HTML dựng sẵn lúc build và thời
  // điểm người dùng truy cập — năm hiện tại thay đổi thì cập nhật siteConfig.
  const nam = siteConfig.namBatDau;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__links">
          <Link href="/gioi-thieu">Giới thiệu</Link>
          <Link href="/lien-he">Liên hệ</Link>
          <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
        </div>

        <p>
          Mọi công cụ trên site đều chạy ngay trên trình duyệt của bạn. Chúng tôi không gửi, không
          lưu và không nhìn thấy dữ liệu bạn nhập vào.
        </p>

        <p>
          © {nam} {siteConfig.ten}. Kết quả mang tính tham khảo, không thay thế tư vấn chuyên môn.
        </p>
      </div>
    </footer>
  );
}
