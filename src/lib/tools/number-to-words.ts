/**
 * Đọc số thành chữ tiếng Việt.
 *
 * Logic thuần, không phụ thuộc React — để test được bằng Vitest. Đây là chủ ý:
 * công cụ trên site này *là* công thức, nên một con số sai không chỉ là lỗi
 * hiển thị mà là mất uy tín, và uy tín chính là tài sản duy nhất của site.
 */

const DIGIT_WORDS = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
] as const;

/**
 * Tên hàng theo nhóm ba chữ số, tính từ phải sang.
 *
 * Tiếng Việt lặp "nghìn – triệu – tỷ" rồi ghép chồng lên "tỷ": 10^12 là "nghìn
 * tỷ", 10^15 là "triệu tỷ", 10^18 là "tỷ tỷ".
 */
const SCALE_WORDS = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"] as const;

const MAX_GROUPS = SCALE_WORDS.length;

export type ZeroTensStyle = "linh" | "lẻ";

export type NumberToWordsOptions = {
  /** Đơn vị nối vào cuối, ví dụ `"đồng"`. Để trống thì không thêm gì. */
  unit?: string;
  /**
   * Thêm "chẵn" sau đơn vị khi số không có phần lẻ.
   *
   * Quy ước kế toán: ghi "chẵn" để không ai điền thêm được chữ vào chỗ trống
   * phía sau trên chứng từ giấy.
   */
  appendRound?: boolean;
  /** Cách đọc hàng chục bằng 0, ví dụ 105: "một trăm linh năm" / "lẻ năm". */
  zeroTensStyle?: ZeroTensStyle;
  /** Viết hoa chữ cái đầu. Mặc định bật. */
  capitalize?: boolean;
};

/** Kết quả phân tích chuỗi người dùng nhập. */
export type ParsedNumber = {
  negative: boolean;
  /** Phần nguyên, đã bỏ số 0 vô nghĩa ở đầu. Luôn có ít nhất một chữ số. */
  integer: string;
  /** Phần thập phân, không có dấu phân cách. Chuỗi rỗng nếu là số nguyên. */
  fraction: string;
};

export class InvalidNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidNumberError";
  }
}

/**
 * Tách dấu phân cách nghìn khỏi dấu thập phân trong chuỗi người dùng gõ.
 *
 * Người Việt viết `1.234.567,89` còn bàn phím quen tay lại hay ra `1,234,567.89`,
 * nên không thể cố định một quy ước. Quy tắc áp dụng, theo thứ tự:
 *
 *   1. Có cả `.` và `,` → dấu xuất hiện SAU CÙNG là dấu thập phân.
 *   2. Chỉ một loại, xuất hiện nhiều lần → đó là dấu phân cách nghìn.
 *   3. Chỉ một loại, xuất hiện một lần → là phân cách nghìn nếu theo sau đúng
 *      ba chữ số (`1.234`), ngược lại là dấu thập phân (`1,5` hoặc `1.23`).
 *
 * Quy tắc 3 an toàn hơn vẻ ngoài của nó: nhóm nghìn hợp lệ luôn đúng ba chữ
 * số, nên `1.50` không thể là cách viết của 1500.
 */
function splitSeparators(raw: string): { integerPart: string; fractionPart: string } {
  const lastDot = raw.lastIndexOf(".");
  const lastComma = raw.lastIndexOf(",");

  let decimalIndex = -1;

  if (lastDot >= 0 && lastComma >= 0) {
    decimalIndex = Math.max(lastDot, lastComma);
  } else {
    const only = lastDot >= 0 ? "." : lastComma >= 0 ? "," : "";

    if (only) {
      const occurrences = raw.split(only).length - 1;
      const digitsAfter = raw.length - raw.lastIndexOf(only) - 1;

      if (occurrences === 1 && digitsAfter !== 3) {
        decimalIndex = raw.lastIndexOf(only);
      }
    }
  }

  if (decimalIndex < 0) {
    return { integerPart: raw.replace(/[.,]/g, ""), fractionPart: "" };
  }

  return {
    integerPart: raw.slice(0, decimalIndex).replace(/[.,]/g, ""),
    fractionPart: raw.slice(decimalIndex + 1).replace(/[.,]/g, ""),
  };
}

/**
 * Chuẩn hoá thứ người dùng gõ thành dạng máy đọc được.
 *
 * Nhận `string` chứ không chỉ `number` là có lý do: số tiền lớn vượt quá
 * `Number.MAX_SAFE_INTEGER` sẽ bị làm tròn sai nếu đi qua kiểu `number`.
 */
export function parseNumberInput(input: string | number): ParsedNumber {
  const raw = String(input).trim().replace(/\s+/g, "");

  if (!raw) {
    throw new InvalidNumberError("Chưa nhập số.");
  }

  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;

  if (!/^[\d.,]+$/.test(unsigned)) {
    throw new InvalidNumberError("Chỉ nhập chữ số, dấu chấm và dấu phẩy.");
  }

  const { integerPart, fractionPart } = splitSeparators(unsigned);

  if (!integerPart && !fractionPart) {
    throw new InvalidNumberError("Chưa nhập số.");
  }

  const integer = integerPart.replace(/^0+(?=\d)/, "") || "0";
  // Số 0 ở cuối phần thập phân không mang thông tin: 1,50 đọc như 1,5.
  const fraction = fractionPart.replace(/0+$/, "");

  if (Math.ceil(integer.length / 3) > MAX_GROUPS) {
    throw new InvalidNumberError(
      `Số quá lớn, chỉ hỗ trợ tối đa ${MAX_GROUPS * 3} chữ số ở phần nguyên.`,
    );
  }

  return { negative, integer, fraction };
}

/**
 * Đọc một nhóm ba chữ số.
 *
 * `readHundreds` do hàm gọi quyết định: nhóm đứng đầu số thì bỏ "không trăm"
 * (105 → "một trăm linh năm"), còn nhóm phía sau thì phải giữ để không mất hàng
 * (1005 → "một nghìn không trăm linh năm").
 */
function readGroup(
  hundreds: number,
  tens: number,
  units: number,
  readHundreds: boolean,
  zeroTensStyle: ZeroTensStyle,
): string {
  const words: string[] = [];

  if (readHundreds) {
    words.push(DIGIT_WORDS[hundreds] as string, "trăm");
  }

  if (tens === 0) {
    // "linh"/"lẻ" chỉ có nghĩa khi đứng sau hàng trăm đã được đọc.
    if (units > 0 && readHundreds) {
      words.push(zeroTensStyle);
    }
  } else if (tens === 1) {
    words.push("mười");
  } else {
    words.push(DIGIT_WORDS[tens] as string, "mươi");
  }

  if (units > 0) {
    if (units === 1 && tens >= 2) {
      words.push("mốt");
    } else if (units === 4 && tens >= 2) {
      words.push("tư");
    } else if (units === 5 && tens >= 1) {
      words.push("lăm");
    } else {
      words.push(DIGIT_WORDS[units] as string);
    }
  }

  return words.join(" ");
}

/** Cắt chuỗi chữ số thành các nhóm ba, tính từ phải sang. */
function toGroups(digits: string): number[] {
  const groups: number[] = [];

  for (let end = digits.length; end > 0; end -= 3) {
    groups.unshift(Number(digits.slice(Math.max(0, end - 3), end)));
  }

  return groups;
}

/** Đọc phần nguyên. Trả về `"không"` khi giá trị bằng 0. */
function readInteger(digits: string, zeroTensStyle: ZeroTensStyle): string {
  const groups = toGroups(digits);
  const firstSignificant = groups.findIndex((group) => group > 0);

  if (firstSignificant < 0) {
    return DIGIT_WORDS[0];
  }

  const parts: string[] = [];

  for (let i = firstSignificant; i < groups.length; i += 1) {
    const group = groups[i] as number;
    const scale = SCALE_WORDS[groups.length - 1 - i] as string;

    // Nhóm rỗng ở giữa vẫn bị bỏ qua: 1_000_005 đọc là "một triệu không trăm
    // linh năm", không phải "một triệu không nghìn ...".
    if (group === 0) continue;

    const hundreds = Math.floor(group / 100);
    const tens = Math.floor((group % 100) / 10);
    const units = group % 10;
    const isLeading = i === firstSignificant;

    parts.push(readGroup(hundreds, tens, units, !isLeading || hundreds > 0, zeroTensStyle));

    if (scale) parts.push(scale);
  }

  return parts.join(" ");
}

/** Đọc phần thập phân theo từng chữ số: `,05` → "không năm". */
function readFraction(digits: string): string {
  return [...digits].map((digit) => DIGIT_WORDS[Number(digit)] as string).join(" ");
}

/**
 * Đọc số thành chữ tiếng Việt.
 *
 * @throws {InvalidNumberError} khi chuỗi nhập vào không phải là số hợp lệ.
 *
 * @example
 * numberToWords(1_234_567, { unit: "đồng" })
 * // → "Một triệu hai trăm ba mươi tư nghìn năm trăm sáu mươi bảy đồng"
 */
export function numberToWords(input: string | number, options: NumberToWordsOptions = {}): string {
  const { unit, appendRound = false, zeroTensStyle = "linh", capitalize = true } = options;

  const { negative, integer, fraction } = parseNumberInput(input);

  const parts: string[] = [];

  if (negative && !(integer === "0" && !fraction)) {
    parts.push("âm");
  }

  parts.push(readInteger(integer, zeroTensStyle));

  if (fraction) {
    parts.push("phẩy", readFraction(fraction));
  }

  if (unit) {
    parts.push(unit);
    // "chẵn" khẳng định số không còn phần lẻ, nên số thập phân thì không dùng.
    if (appendRound && !fraction) parts.push("chẵn");
  }

  const text = parts
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!capitalize) return text;

  return text.charAt(0).toUpperCase() + text.slice(1);
}
