import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, TOOLS, getActiveCategories, getToolsByCategory } from "@/lib/tools/registry";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const categories = getActiveCategories();

  return (
    <main className="container">
      <header style={{ marginBottom: 36 }}>
        <h1 className="page-title">Công cụ tính toán online cho người Việt</h1>
        <p className="page-lead">
          {TOOLS.length} công cụ miễn phí, dùng ngay trên trình duyệt. Không cần đăng ký, không cần
          cài phần mềm, không lưu dữ liệu của bạn.
        </p>
      </header>

      <div id="cong-cu" className="stack">
        {categories.map((category) => {
          const info = CATEGORIES[category];
          const tools = getToolsByCategory(category);

          return (
            <section key={category} aria-labelledby={`nhom-${category}`}>
              <h2 id={`nhom-${category}`} className="section-title">
                {info.name}
              </h2>
              <p className="section-desc">{info.description}</p>

              <div className="grid-auto">
                {tools.map((tool) => (
                  <Link key={tool.slug} href={tool.path} className="tool-card">
                    <div className="tool-card__name">{tool.name}</div>
                    <div className="tool-card__desc">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="card card--muted" style={{ marginTop: 40 }}>
        <h2 className="section-title">Vì sao dùng {siteConfig.ten}</h2>
        <ul className="prose" style={{ marginTop: 10, paddingLeft: 20 }}>
          <li>
            <strong>Không gửi dữ liệu đi đâu cả.</strong> Mọi phép tính chạy ngay trên máy bạn, kể
            cả khi mất mạng giữa chừng.
          </li>
          <li>
            <strong>Không đăng ký, không giới hạn lượt dùng.</strong>
          </li>
          <li>
            <strong>Công thức được ghi rõ.</strong> Mỗi công cụ đều giải thích cách tính bên dưới để
            bạn tự đối chiếu, thay vì phải tin vào một con số không rõ từ đâu ra.
          </li>
        </ul>
      </section>
    </main>
  );
}
