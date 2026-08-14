/**
 * Xử lý văn bản tiếng Việt: bỏ dấu, tạo slug, đổi kiểu hoa thường.
 *
 * Logic thuần, không phụ thuộc React — xem ghi chú ở `number-to-words.ts` về
 * lý do mọi công thức trên site này đều tách riêng và có test.
 */

/**
 * Bỏ toàn bộ dấu thanh và dấu phụ, giữ nguyên mọi thứ còn lại.
 *
 * Cách làm: `normalize("NFD")` tách ký tự dựng sẵn thành chữ gốc + dấu tổ hợp
 * (`ế` → `e` + U+0302 + U+0301), rồi xoá dải dấu tổ hợp U+0300–U+036F. Dải này
 * phủ luôn dấu móc U+031B của `ơ` và `ư`.
 *
 * `đ`/`Đ` phải xử lý riêng vì chúng là chữ cái độc lập trong bảng mã Unicode,
 * không phải `d` cộng dấu, nên NFD không đụng tới.
 */
export function removeDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export type SlugOptions = {
  /** Ký tự nối giữa các từ. Mặc định `"-"`. */
  separator?: string;
  /** Giữ nguyên chữ hoa thay vì hạ hết về chữ thường. Mặc định tắt. */
  preserveCase?: boolean;
};

/**
 * Tạo đường dẫn thân thiện từ tiêu đề tiếng Việt.
 *
 * Chỉ giữ chữ cái a–z, chữ số và dấu nối. Mọi ký tự khác — kể cả dấu câu và
 * emoji — bị coi là ranh giới từ, vì URL chứa ký tự lạ sẽ bị trình duyệt mã
 * hoá thành `%E1%BA%BF` và mất hết ý nghĩa với cả người đọc lẫn Google.
 */
export function toSlug(text: string, options: SlugOptions = {}): string {
  const { separator = "-", preserveCase = false } = options;

  const base = removeDiacritics(preserveCase ? text : text.toLowerCase());

  // Escape dấu nối trước khi nhét vào lớp ký tự của biểu thức chính quy —
  // người dùng có thể chọn ký tự mang nghĩa đặc biệt như "." hoặc "+".
  const escaped = separator.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");

  return base
    .replace(/[^a-zA-Z0-9]+/g, separator)
    .replace(new RegExp(`${escaped}{2,}`, "g"), separator)
    .replace(new RegExp(`^${escaped}+|${escaped}+$`, "g"), "");
}

export type LetterCase = "lower" | "upper" | "title" | "sentence";

/**
 * Đổi kiểu hoa thường.
 *
 * `title` viết hoa mỗi từ (dùng cho tên riêng, tiêu đề), `sentence` chỉ viết
 * hoa chữ cái đầu câu. Cả hai đều hạ phần còn lại về chữ thường để chuẩn hoá
 * văn bản người dùng dán vào từ Excel hoặc Word.
 */
export function changeCase(text: string, mode: LetterCase): string {
  switch (mode) {
    case "lower":
      return text.toLowerCase();
    case "upper":
      return text.toUpperCase();
    case "title":
      return text.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_, space: string, letter: string) => {
        return space + letter.toUpperCase();
      });
    case "sentence": {
      const lower = text.toLowerCase();
      // Chữ cái đầu của mỗi câu: đầu chuỗi, hoặc sau dấu kết câu và khoảng trắng.
      return lower.replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, prefix: string, letter: string) => {
        return prefix + letter.toUpperCase();
      });
    }
  }
}

/** Số ký tự, số từ và số dòng — hiển thị kèm ô nhập cho người dùng đối chiếu. */
export function countText(text: string): { characters: number; words: number; lines: number } {
  const trimmed = text.trim();

  return {
    // Đếm theo điểm mã Unicode chứ không theo `length`: `length` đếm đơn vị
    // UTF-16 nên emoji bị tính thành 2.
    characters: [...text].length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: text ? text.split("\n").length : 0,
  };
}
