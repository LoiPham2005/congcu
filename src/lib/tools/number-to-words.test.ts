import { describe, expect, it } from "vitest";
import { InvalidNumberError, numberToWords, parseNumberInput } from "./number-to-words";

/** Bỏ viết hoa để phần lớn ca kiểm thử đọc cho gọn. */
const read = (input: string | number) => numberToWords(input, { capitalize: false });

describe("numberToWords — hàng đơn vị và hàng chục", () => {
  it("đọc số một chữ số", () => {
    expect(read(0)).toBe("không");
    expect(read(1)).toBe("một");
    expect(read(5)).toBe("năm");
    expect(read(9)).toBe("chín");
  });

  it('dùng "mười" cho hàng chục bằng 1, "mươi" cho từ 2 trở lên', () => {
    expect(read(10)).toBe("mười");
    expect(read(20)).toBe("hai mươi");
    expect(read(90)).toBe("chín mươi");
  });

  it('đọc 1 thành "mốt" chỉ khi hàng chục từ 2 trở lên', () => {
    expect(read(11)).toBe("mười một");
    expect(read(21)).toBe("hai mươi mốt");
    expect(read(71)).toBe("bảy mươi mốt");
  });

  it('đọc 4 thành "tư" chỉ khi hàng chục từ 2 trở lên', () => {
    expect(read(14)).toBe("mười bốn");
    expect(read(24)).toBe("hai mươi tư");
  });

  it('đọc 5 thành "lăm" khi có hàng chục', () => {
    expect(read(5)).toBe("năm");
    expect(read(15)).toBe("mười lăm");
    expect(read(25)).toBe("hai mươi lăm");
  });
});

describe("numberToWords — hàng trăm và chữ đệm linh/lẻ", () => {
  it("bỏ hàng chục và đơn vị khi bằng 0", () => {
    expect(read(100)).toBe("một trăm");
    expect(read(900)).toBe("chín trăm");
  });

  it('chèn "linh" khi hàng chục bằng 0 nhưng còn hàng đơn vị', () => {
    expect(read(101)).toBe("một trăm linh một");
    expect(read(105)).toBe("một trăm linh năm");
  });

  it('đổi được sang "lẻ"', () => {
    expect(numberToWords(105, { capitalize: false, zeroTensStyle: "lẻ" })).toBe("một trăm lẻ năm");
  });

  it("kết hợp đúng với mười / lăm", () => {
    expect(read(110)).toBe("một trăm mười");
    expect(read(115)).toBe("một trăm mười lăm");
    expect(read(124)).toBe("một trăm hai mươi tư");
  });
});

describe("numberToWords — nhóm nghìn, triệu, tỷ", () => {
  it("đọc các mốc tròn", () => {
    expect(read(1_000)).toBe("một nghìn");
    expect(read(1_000_000)).toBe("một triệu");
    expect(read(1_000_000_000)).toBe("một tỷ");
    expect(read("1000000000000")).toBe("một nghìn tỷ");
  });

  it("đọc số nhiều nhóm", () => {
    expect(read(1_234)).toBe("một nghìn hai trăm ba mươi tư");
    expect(read(1_234_567)).toBe("một triệu hai trăm ba mươi tư nghìn năm trăm sáu mươi bảy");
  });

  it('giữ "không trăm" ở nhóm không đứng đầu để không mất hàng', () => {
    expect(read(1_005)).toBe("một nghìn không trăm linh năm");
    expect(read(1_050)).toBe("một nghìn không trăm năm mươi");
  });

  it("bỏ qua trọn nhóm bằng 0 ở giữa", () => {
    expect(read(1_000_005)).toBe("một triệu không trăm linh năm");
    expect(read(2_000_100)).toBe("hai triệu một trăm");
  });

  it("giữ chính xác số vượt quá giới hạn an toàn của kiểu number", () => {
    // 9007199254740993 = MAX_SAFE_INTEGER + 2. Nếu đi qua kiểu `number` thì
    // giá trị này bị làm tròn xuống, nên phải nhận vào dạng chuỗi.
    expect(read("9007199254740993")).toContain("ba");
    expect(() => parseNumberInput("9007199254740993")).not.toThrow();
    expect(parseNumberInput("9007199254740993").integer).toBe("9007199254740993");
  });
});

describe("numberToWords — tuỳ chọn hiển thị", () => {
  it("viết hoa chữ cái đầu theo mặc định", () => {
    expect(numberToWords(1_234_567, { unit: "đồng" })).toBe(
      "Một triệu hai trăm ba mươi tư nghìn năm trăm sáu mươi bảy đồng",
    );
  });

  it('thêm "chẵn" cho số nguyên khi được yêu cầu', () => {
    expect(numberToWords(500_000, { unit: "đồng", appendRound: true })).toBe(
      "Năm trăm nghìn đồng chẵn",
    );
  });

  it('không thêm "chẵn" khi số còn phần lẻ', () => {
    expect(numberToWords("1,5", { unit: "đồng", appendRound: true })).toBe("Một phẩy năm đồng");
  });

  it("đọc phần thập phân theo từng chữ số", () => {
    expect(read("1,05")).toBe("một phẩy không năm");
  });

  it('thêm "âm" cho số âm, trừ số 0', () => {
    expect(read(-15)).toBe("âm mười lăm");
    expect(read("-0")).toBe("không");
  });
});

describe("parseNumberInput — tách dấu nghìn khỏi dấu thập phân", () => {
  it("coi dấu lặp lại là phân cách nghìn", () => {
    expect(parseNumberInput("12.345.678").integer).toBe("12345678");
    expect(parseNumberInput("12,345,678").integer).toBe("12345678");
  });

  it("coi dấu đơn lẻ theo sau đúng ba chữ số là phân cách nghìn", () => {
    expect(parseNumberInput("1.234")).toEqual({
      negative: false,
      integer: "1234",
      fraction: "",
    });
  });

  it("coi dấu đơn lẻ không theo sau ba chữ số là dấu thập phân", () => {
    expect(parseNumberInput("1,5").fraction).toBe("5");
    expect(parseNumberInput("1.23").fraction).toBe("23");
  });

  it("lấy dấu xuất hiện sau cùng làm dấu thập phân khi có cả hai loại", () => {
    expect(parseNumberInput("1.234,56")).toEqual({
      negative: false,
      integer: "1234",
      fraction: "56",
    });
    expect(parseNumberInput("1,234.56")).toEqual({
      negative: false,
      integer: "1234",
      fraction: "56",
    });
  });

  it("bỏ số 0 thừa ở đầu phần nguyên và ở cuối phần thập phân", () => {
    expect(parseNumberInput("007").integer).toBe("7");
    expect(parseNumberInput("1,50").fraction).toBe("5");
    expect(parseNumberInput("0").integer).toBe("0");
  });

  it("bỏ khoảng trắng người dùng gõ thừa", () => {
    expect(parseNumberInput(" 1 234 567 ").integer).toBe("1234567");
  });
});

describe("parseNumberInput — đầu vào không hợp lệ", () => {
  it("từ chối chuỗi rỗng", () => {
    expect(() => parseNumberInput("")).toThrow(InvalidNumberError);
    expect(() => parseNumberInput("   ")).toThrow(InvalidNumberError);
  });

  it("từ chối ký tự không phải số", () => {
    expect(() => parseNumberInput("một trăm")).toThrow(InvalidNumberError);
    expect(() => parseNumberInput("12a3")).toThrow(InvalidNumberError);
  });

  it("từ chối số vượt quá số chữ số hỗ trợ", () => {
    expect(() => parseNumberInput("1".repeat(22))).toThrow(InvalidNumberError);
  });
});
