import Link from "next/link";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  // Trang 404 không được vào chỉ mục: để lọt vào là Google ghi nhận site có
  // nội dung rỗng, ảnh hưởng tới đánh giá chất lượng của cả tên miền.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="container">
      <h1 className="page-title">Không tìm thấy trang</h1>
      <p className="page-lead">
        Đường dẫn này không tồn tại hoặc đã được đổi. Thử một trong các công cụ bên dưới.
      </p>

      <div className="grid-auto" style={{ marginTop: 24 }}>
        {TOOLS.map((tool) => (
          <Link key={tool.slug} href={tool.path} className="tool-card">
            <div className="tool-card__name">{tool.name}</div>
            <div className="tool-card__desc">{tool.description}</div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 24 }}>
        <Link href="/">← Về trang chủ</Link>
      </p>
    </main>
  );
}
