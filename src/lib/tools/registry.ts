import type { Route } from "next";

/**
 * Danh mục công cụ — nguồn sự thật duy nhất của cả site.
 *
 * Trang chủ, `sitemap.xml`, khối "công cụ liên quan" và metadata SEO của từng
 * trang đều đọc từ đây. Thêm một công cụ mới = thêm một mục vào `TOOLS` + một
 * file logic + một `page.tsx`. Không phải sửa chỗ nào khác.
 *
 * Cố ý KHÔNG khai báo trước công cụ chưa làm xong: mọi mục trong danh sách này
 * đều đi thẳng vào sitemap, mà sitemap trỏ tới trang 404 là tín hiệu xấu với
 * Google.
 */

export type ToolCategory = "van-ban" | "xay-dung" | "dien-nuoc" | "tai-chinh";

export type Tool = {
  /** Định danh, trùng tên thư mục trong `src/app/(tools)/`. */
  slug: string;
  /** Đường dẫn tuyệt đối — dùng cho `<Link>`, canonical và sitemap. */
  path: Route;
  /** Tên ngắn, hiển thị ở trang chủ và điều hướng. */
  name: string;
  /**
   * Thẻ `<title>` của trang.
   *
   * Viết riêng, không tái dùng `name`: đây là dòng người dùng nhìn thấy trên
   * kết quả tìm kiếm và là thứ quyết định họ có bấm vào hay không, nên phải
   * chứa đúng cụm từ người ta gõ.
   */
  seoTitle: string;
  /** Thẻ `<meta name="description">`, đồng thời là mô tả trên trang chủ. */
  description: string;
  category: ToolCategory;
  /** Các cách diễn đạt khác của cùng nhu cầu — dùng cho tìm kiếm nội bộ. */
  keywords: readonly string[];
  /** Ngày sửa nội dung gần nhất, `YYYY-MM-DD`. Đi vào `lastModified`. */
  updatedAt: string;
};

export const CATEGORIES = {
  "van-ban": {
    name: "Văn bản & tiện ích",
    description: "Xử lý chữ và số nhanh, không cần cài phần mềm.",
  },
  "xay-dung": {
    name: "Xây dựng & vật liệu",
    description: "Dự trù vật tư trước khi xây, tránh mua thừa hoặc thiếu.",
  },
  "dien-nuoc": {
    name: "Điện & sinh hoạt",
    description: "Kiểm tra hoá đơn và chi phí sinh hoạt hàng tháng.",
  },
  "tai-chinh": {
    name: "Tài chính & thuế",
    description: "Tính toán lương, thuế và khoản vay theo quy định hiện hành.",
  },
} as const satisfies Record<ToolCategory, { name: string; description: string }>;

export const TOOLS: readonly Tool[] = [
  {
    slug: "doi-so-thanh-chu",
    path: "/doi-so-thanh-chu",
    name: "Đổi số thành chữ",
    seoTitle: "Đổi số tiền thành chữ online — chuẩn kế toán, có dấu",
    description:
      "Nhập số tiền, nhận ngay cách đọc bằng chữ đúng chuẩn kế toán để ghi hoá đơn, " +
      "hợp đồng và chứng từ. Hỗ trợ đơn vị đồng, hậu tố chẵn và kiểu đọc linh/lẻ.",
    category: "van-ban",
    keywords: [
      "đọc số thành chữ",
      "chuyển số tiền sang chữ",
      "số tiền bằng chữ",
      "viết số tiền bằng chữ hoá đơn",
    ],
    updatedAt: "2026-08-14",
  },
  {
    slug: "bo-dau-tieng-viet",
    path: "/bo-dau-tieng-viet",
    name: "Bỏ dấu tiếng Việt",
    seoTitle: "Chuyển tiếng Việt có dấu sang không dấu online",
    description:
      "Dán văn bản tiếng Việt có dấu, nhận lại bản không dấu giữ nguyên xuống dòng. " +
      "Kèm chế độ tạo đường dẫn thân thiện (slug) và chuyển hoa/thường.",
    category: "van-ban",
    keywords: [
      "bỏ dấu tiếng việt",
      "chuyển có dấu sang không dấu",
      "xoá dấu tiếng việt",
      "tạo slug tiếng việt",
    ],
    updatedAt: "2026-08-14",
  },
  {
    slug: "tinh-gach-xay-tuong",
    path: "/tinh-gach-xay-tuong",
    name: "Tính gạch xây tường",
    seoTitle: "Tính số viên gạch xây tường theo m² — kèm xi măng và cát",
    description:
      "Nhập kích thước tường và loại gạch, nhận ngay số viên cần mua cùng lượng " +
      "xi măng, cát cho vữa xây. Trừ được diện tích cửa và cộng hao hụt thi công.",
    category: "xay-dung",
    keywords: [
      "1m2 tường bao nhiêu viên gạch",
      "tính gạch xây nhà",
      "định mức gạch xây tường",
      "dự trù vật liệu xây tường",
    ],
    updatedAt: "2026-08-14",
  },
];

const TOOLS_BY_SLUG = new Map(TOOLS.map((tool) => [tool.slug, tool]));

export function getTool(slug: string): Tool | undefined {
  return TOOLS_BY_SLUG.get(slug);
}

/**
 * Lấy công cụ theo slug, ném lỗi nếu không có.
 *
 * Dùng trong `page.tsx` — ở đó slug là hằng số do chính ta viết, nên slug sai
 * là lỗi lập trình và phải nổ ngay lúc build, chứ không phải render ra một
 * trang thiếu tiêu đề rồi âm thầm lên Google như vậy.
 */
export function getToolOrThrow(slug: string): Tool {
  const tool = getTool(slug);

  if (!tool) {
    throw new Error(
      `Không tìm thấy công cụ "${slug}" trong registry. ` +
        `Đã thêm mục tương ứng vào TOOLS trong src/lib/tools/registry.ts chưa?`,
    );
  }

  return tool;
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

/** Các nhóm đang thực sự có công cụ — trang chủ không hiện nhóm rỗng. */
export function getActiveCategories(): ToolCategory[] {
  const keys = Object.keys(CATEGORIES) as ToolCategory[];
  return keys.filter((category) => getToolsByCategory(category).length > 0);
}

/**
 * Công cụ gợi ý ở cuối mỗi trang.
 *
 * Ưu tiên cùng nhóm rồi mới lấy bù từ nhóm khác. Mục đích là giữ người dùng ở
 * lại thêm một trang nữa — vừa tăng lượt xem (tức doanh thu quảng cáo) vừa là
 * tín hiệu tốt cho SEO.
 */
export function getRelatedTools(slug: string, limit = 4): Tool[] {
  const current = getTool(slug);

  if (!current) {
    return TOOLS.slice(0, limit);
  }

  const sameCategory = TOOLS.filter(
    (tool) => tool.category === current.category && tool.slug !== slug,
  );
  const otherCategories = TOOLS.filter((tool) => tool.category !== current.category);

  return [...sameCategory, ...otherCategories].slice(0, limit);
}
