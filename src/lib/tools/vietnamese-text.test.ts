import { describe, expect, it } from "vitest";
import { changeCase, countText, removeDiacritics, toSlug } from "./vietnamese-text";

describe("removeDiacritics", () => {
  it("bỏ dấu thanh trên nguyên âm", () => {
    expect(removeDiacritics("Tiếng Việt")).toBe("Tieng Viet");
    expect(removeDiacritics("à á ả ã ạ")).toBe("a a a a a");
  });

  it("bỏ dấu móc của ơ và ư", () => {
    expect(removeDiacritics("thư viện")).toBe("thu vien");
    expect(removeDiacritics("cơ sở")).toBe("co so");
  });

  it("đổi đ và Đ — hai chữ cái mà NFD không tách được", () => {
    expect(removeDiacritics("đường")).toBe("duong");
    expect(removeDiacritics("Đà Nẵng")).toBe("Da Nang");
    expect(removeDiacritics("ĐƯỜNG")).toBe("DUONG");
  });

  it("giữ nguyên hoa thường, chữ số và dấu câu", () => {
    expect(removeDiacritics("Hoá đơn số 12, ngày 3/5!")).toBe("Hoa don so 12, ngay 3/5!");
  });

  it("giữ nguyên chuỗi không dấu và chuỗi rỗng", () => {
    expect(removeDiacritics("Hello World")).toBe("Hello World");
    expect(removeDiacritics("")).toBe("");
  });

  it("xử lý được cả chuỗi đã ở dạng tổ hợp sẵn", () => {
    // "ế" viết bằng e + dấu mũ + dấu sắc, thay vì ký tự dựng sẵn.
    expect(removeDiacritics("biến")).toBe("bien");
  });
});

describe("toSlug", () => {
  it("tạo slug từ tiêu đề tiếng Việt", () => {
    expect(toSlug("Đổi số tiền thành chữ")).toBe("doi-so-tien-thanh-chu");
    expect(toSlug("Tính gạch xây tường")).toBe("tinh-gach-xay-tuong");
  });

  it("gộp mọi ký tự không phải chữ và số thành một dấu nối", () => {
    expect(toSlug("Hoá đơn  --  số 12/2026!")).toBe("hoa-don-so-12-2026");
  });

  it("bỏ dấu nối thừa ở đầu và cuối", () => {
    expect(toSlug("  ...Xin chào...  ")).toBe("xin-chao");
  });

  it("hạ về chữ thường theo mặc định, giữ được hoa khi yêu cầu", () => {
    expect(toSlug("Đà Nẵng")).toBe("da-nang");
    expect(toSlug("Đà Nẵng", { preserveCase: true })).toBe("Da-Nang");
  });

  it("dùng được dấu nối khác, kể cả ký tự đặc biệt của regex", () => {
    expect(toSlug("Xin chào các bạn", { separator: "_" })).toBe("xin_chao_cac_ban");
    expect(toSlug("Xin chào các bạn", { separator: "." })).toBe("xin.chao.cac.ban");
    expect(toSlug("Xin  chào", { separator: "+" })).toBe("xin+chao");
  });

  it("trả về chuỗi rỗng khi không còn ký tự nào dùng được", () => {
    expect(toSlug("!!! ???")).toBe("");
    expect(toSlug("")).toBe("");
  });
});

describe("changeCase", () => {
  it("hạ thường và viết hoa toàn bộ", () => {
    expect(changeCase("Tiếng Việt", "lower")).toBe("tiếng việt");
    expect(changeCase("Tiếng Việt", "upper")).toBe("TIẾNG VIỆT");
  });

  it("viết hoa đầu mỗi từ", () => {
    expect(changeCase("nguyễn văn an", "title")).toBe("Nguyễn Văn An");
    expect(changeCase("HOÁ ĐƠN BÁN HÀNG", "title")).toBe("Hoá Đơn Bán Hàng");
  });

  it("viết hoa đầu mỗi câu", () => {
    expect(changeCase("xin chào. tôi tên an! bạn khoẻ chứ?", "sentence")).toBe(
      "Xin chào. Tôi tên an! Bạn khoẻ chứ?",
    );
  });

  it("giữ nguyên chuỗi rỗng", () => {
    expect(changeCase("", "title")).toBe("");
  });
});

describe("countText", () => {
  it("đếm ký tự, từ và dòng", () => {
    expect(countText("Xin chào\nbạn")).toEqual({ characters: 12, words: 3, lines: 2 });
  });

  it("không tính khoảng trắng thừa thành từ", () => {
    expect(countText("   một   hai   ").words).toBe(2);
  });

  it("đếm emoji là một ký tự", () => {
    // "🙂".length trong JavaScript là 2 vì nó chiếm hai đơn vị UTF-16.
    expect(countText("🙂").characters).toBe(1);
  });

  it("trả về 0 cho chuỗi rỗng", () => {
    expect(countText("")).toEqual({ characters: 0, words: 0, lines: 0 });
  });
});
