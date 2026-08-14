import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy — tên mới của Middleware kể từ Next.js 16.
 *
 * Ở đây nó chỉ làm một việc: gắn Content-Security-Policy. Không còn kiểm tra
 * đăng nhập vì site này không có tài khoản.
 *
 * ---
 * VÌ SAO CSP Ở ĐÂY LÀ TĨNH, KHÔNG DÙNG NONCE
 *
 * Bản gốc trong `nextjs_base` sinh nonce riêng cho từng request. Cách đó chặt
 * hơn, nhưng để thẻ <script> nhận được nonce thì `layout.tsx` phải gọi
 * `headers()` — và chỉ cần một lời gọi đó là Next.js chuyển TOÀN BỘ trang sang
 * render động, mất sạch khả năng dựng tĩnh.
 *
 * Với site này thì đó là cái giá quá đắt: trang tĩnh là thứ cho tốc độ tải
 * nhanh, điểm Core Web Vitals tốt, thứ hạng tìm kiếm cao và chi phí VPS gần
 * như bằng không. Đổi lại, rủi ro khi nới CSP ở đây rất thấp — site không có
 * đăng nhập, không có cookie phiên, không lưu dữ liệu người dùng, nên không có
 * gì để một cuộc tấn công XSS đánh cắp.
 *
 * Nếu sau này thêm tài khoản và thanh toán, hãy dựng phần đó thành ứng dụng
 * riêng trên subdomain và giữ nguyên cơ chế nonce của `nextjs_base` ở đó.
 */

/** Các host mà AdSense cần để nạp script, khung quảng cáo và gửi số liệu. */
const GOOGLE_ADS_HOSTS = [
  "https://pagead2.googlesyndication.com",
  "https://tpc.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
  "https://partner.googleadservices.com",
  "https://adservice.google.com",
  "https://www.googletagservices.com",
  "https://ep1.adtrafficquality.google",
  "https://ep2.adtrafficquality.google",
];

function buildContentSecurityPolicy(isDev: boolean): string {
  const adsHosts = GOOGLE_ADS_HOSTS.join(" ");

  return [
    `default-src 'self'`,
    // 'unsafe-inline' là bắt buộc: Next.js nhúng dữ liệu hydrate bằng thẻ
    // <script> inline, mà không có nonce thì chỉ 'unsafe-inline' cho qua.
    `script-src 'self' 'unsafe-inline' ${adsHosts}${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    // Ảnh quảng cáo đến từ tên miền của chính nhà quảng cáo — không thể liệt
    // kê trước, nên buộc phải cho phép mọi nguồn https.
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${adsHosts}${isDev ? " ws: wss:" : ""}`,
    // Quảng cáo hiển thị bên trong iframe do Google dựng.
    `frame-src ${adsHosts}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(isDev ? [] : [`upgrade-insecure-requests`]),
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function proxy(_request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy(isDev));
  return response;
}

export const config = {
  matcher: [
    // Bỏ qua asset tĩnh và mọi file có phần mở rộng — header bảo mật cho
    // chúng đã được set sẵn ở next.config.mjs.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
