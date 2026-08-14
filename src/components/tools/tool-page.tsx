import Link from "next/link";
import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { RelatedTools } from "@/components/tools/related-tools";
import { AD_SLOTS } from "@/lib/ads";
import { env } from "@/lib/env";
import { siteConfig, urlTuyetDoi } from "@/lib/site-config";
import type { Tool } from "@/lib/tools/registry";

type Props = {
  tool: Tool;
  /** Phần tương tác — thường là một Client Component. */
  children: ReactNode;
  /** Nội dung hướng dẫn bên dưới công cụ. */
  guide: ReactNode;
};

/**
 * Khung chung của mọi trang công cụ.
 *
 * ---
 * VÌ SAO CÔNG CỤ ĐỨNG TRƯỚC, QUẢNG CÁO ĐỨNG SAU
 *
 * Người dùng vào đây để làm một việc cụ thể. Chèn quảng cáo lên trên và đẩy
 * công cụ xuống dưới màn hình đầu sẽ khiến họ thoát ra ngay — Google đo được
 * điều đó, và cả chính sách bố cục của AdSense cũng cấm che nội dung chính.
 * Đặt quảng cáo sau khi người dùng đã có kết quả vừa giữ được trải nghiệm vừa
 * cho hiển thị chất lượng hơn.
 *
 * Phần hướng dẫn phía dưới cũng không phải để lấp chỗ: nó là nội dung thật để
 * Google hiểu trang này giải quyết vấn đề gì, và là điều kiện để được duyệt
 * AdSense — trang chỉ có mỗi ô nhập liệu sẽ bị coi là nội dung mỏng.
 */
export function ToolPage({ tool, children, guide }: Props) {
  const adsenseClient = env.NEXT_PUBLIC_ADSENSE_CLIENT;

  // Dữ liệu có cấu trúc giúp Google hiểu đây là ứng dụng dùng được ngay chứ
  // không phải bài viết, và dựng đường dẫn phân cấp trên trang kết quả.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        description: tool.description,
        url: urlTuyetDoi(tool.path),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: "vi-VN",
        offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: urlTuyetDoi("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: tool.name,
            item: urlTuyetDoi(tool.path),
          },
        ],
      },
    ],
  };

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumb" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link> <span aria-hidden="true">›</span> {tool.name}
      </nav>

      <h1 className="page-title">{tool.seoTitle}</h1>
      <p className="page-lead">{tool.description}</p>

      <div style={{ marginTop: 24 }}>{children}</div>

      <AdSlot slot={AD_SLOTS.belowTool} viTri="trong-bai" client={adsenseClient} />

      <article className="prose">{guide}</article>

      <AdSlot slot={AD_SLOTS.inArticle} viTri="ngang" client={adsenseClient} />

      <RelatedTools slug={tool.slug} />

      <p style={{ marginTop: 32, fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Công cụ này chạy hoàn toàn trên trình duyệt của bạn — {siteConfig.ten} không nhận, không lưu
        và không nhìn thấy dữ liệu bạn nhập.
      </p>
    </main>
  );
}
