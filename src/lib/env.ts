import { z } from "zod";

/**
 * Validate biến môi trường một lần, ngay lúc module được load.
 *
 * Site này cố tình KHÔNG có database và KHÔNG có đăng nhập: mọi công cụ đều
 * tính toán ngay trên trình duyệt người dùng. Nhờ vậy chi phí máy chủ gần như
 * không tăng theo lượng truy cập — điều kiện sống còn khi doanh thu quảng cáo
 * chỉ vài chục đồng mỗi lượt xem.
 *
 * Hệ quả: danh sách biến ở đây rất ngắn, và cả hai đều không phải bí mật.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  /**
   * Tên miền thật, không có dấu `/` ở cuối.
   *
   * Bắt buộc đúng vì nó đi vào `sitemap.xml`, thẻ canonical và Open Graph —
   * ba chỗ mà một giá trị sai sẽ âm thầm phá SEO thay vì báo lỗi.
   */
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

  /**
   * Mã publisher AdSense, dạng `ca-pub-xxxxxxxxxxxxxxxx`.
   *
   * Để trống thì toàn bộ khối quảng cáo tự tắt. Có chủ đích: giai đoạn đầu
   * chưa được duyệt AdSense, và chạy script quảng cáo khi chưa có mã chỉ làm
   * trang chậm đi chứ không mang lại gì.
   */
  NEXT_PUBLIC_ADSENSE_CLIENT: z
    .string()
    .regex(/^ca-pub-\d{16}$/, "NEXT_PUBLIC_ADSENSE_CLIENT phải có dạng ca-pub-<16 chữ số>")
    .optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Cấu hình môi trường không hợp lệ:\n${details}\n\n` +
        `Kiểm tra file .env của bạn (tham chiếu: .env.example).`,
    );
  }

  return parsed.data;
}

export const env = loadEnv();

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";

/** Quảng cáo chỉ chạy khi đã có mã publisher thật. */
export const adsEnabled = Boolean(env.NEXT_PUBLIC_ADSENSE_CLIENT);
