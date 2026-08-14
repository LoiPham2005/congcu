/**
 * Mã các đơn vị quảng cáo, gom một chỗ.
 *
 * Giá trị thật lấy trong bảng điều khiển AdSense sau khi site được duyệt, mục
 * Quảng cáo → Theo đơn vị quảng cáo. Trước đó cứ để nguyên: khối quảng cáo tự
 * tắt khi chưa có `NEXT_PUBLIC_ADSENSE_CLIENT`, nên các mã giả này không bao
 * giờ được dùng tới.
 */
export const AD_SLOTS = {
  /** Ngay dưới phần công cụ — vị trí người dùng nhìn sau khi đã có kết quả. */
  belowTool: "0000000001",
  /** Giữa phần hướng dẫn, khi người dùng đang đọc. */
  inArticle: "0000000002",
} as const;
