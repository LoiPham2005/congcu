import { env } from "@/lib/env";

/**
 * Thông tin nhận diện site, gom một chỗ.
 *
 * Đổi tên thương hiệu hoặc email liên hệ chỉ cần sửa ở đây — các trang Giới
 * thiệu, Liên hệ, Chính sách bảo mật và toàn bộ metadata đều đọc từ file này.
 */
export const siteConfig = {
  ten: "Công Cụ Việt",
  /** Đứng sau tiêu đề từng trang trong thẻ `<title>`. */
  tenNgan: "CôngCụViệt",
  moTa:
    "Bộ công cụ tính toán online miễn phí cho người Việt: đổi số thành chữ, " +
    "dự trù vật liệu xây dựng, tính tiền điện. Dùng ngay trên trình duyệt, không cần đăng ký.",
  url: env.NEXT_PUBLIC_SITE_URL,
  emailLienHe: "lienhe@example.com",
  /** Năm bắt đầu vận hành — hiển thị ở dòng bản quyền chân trang. */
  namBatDau: 2026,
} as const;

/** Ghép đường dẫn tương đối thành URL tuyệt đối cho canonical, Open Graph, sitemap. */
export function urlTuyetDoi(duongDan: string): string {
  return new URL(duongDan, siteConfig.url).toString();
}
