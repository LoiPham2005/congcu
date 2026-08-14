import Link from "next/link";
import { getRelatedTools } from "@/lib/tools/registry";

/**
 * Khối gợi ý cuối trang công cụ.
 *
 * Đây là thứ biến một lượt truy cập thành hai lượt xem trang. Với site sống
 * bằng quảng cáo thì doanh thu tỷ lệ thuận với số trang mỗi phiên, nên khối
 * này đóng góp trực tiếp — đồng thời liên kết nội bộ cũng giúp Google bò hết
 * các trang công cụ mới.
 */
export function RelatedTools({ slug }: { slug: string }) {
  const tools = getRelatedTools(slug);

  if (tools.length === 0) return null;

  return (
    <section style={{ marginTop: 40 }} aria-labelledby="cong-cu-lien-quan">
      <h2 id="cong-cu-lien-quan" className="section-title">
        Công cụ liên quan
      </h2>
      <p className="section-desc">Các tiện ích khác có thể bạn cần dùng tới.</p>

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
}
