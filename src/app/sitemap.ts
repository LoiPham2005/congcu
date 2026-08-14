import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools/registry";
import { urlTuyetDoi } from "@/lib/site-config";

/**
 * Sitemap sinh thẳng từ registry.
 *
 * Nhờ vậy thêm công cụ mới là nó tự vào sitemap — không bao giờ có chuyện quên
 * khai báo rồi để Google mất vài tuần mới tự tìm ra trang.
 *
 * `lastModified` lấy từ `updatedAt` của từng công cụ chứ không phải thời điểm
 * build: nếu để ngày build, mọi trang sẽ cùng "vừa cập nhật" sau mỗi lần deploy
 * và tín hiệu đó mất hết ý nghĩa với Google.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: urlTuyetDoi("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: urlTuyetDoi("/gioi-thieu"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: urlTuyetDoi("/lien-he"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: urlTuyetDoi("/chinh-sach-bao-mat"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: urlTuyetDoi(tool.path),
    lastModified: new Date(tool.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}
