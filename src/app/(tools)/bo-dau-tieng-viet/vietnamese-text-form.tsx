"use client";

import { useMemo, useState } from "react";
import {
  changeCase,
  countText,
  removeDiacritics,
  toSlug,
  type LetterCase,
} from "@/lib/tools/vietnamese-text";

type Mode = "bo-dau" | "slug" | "hoa-thuong";

const MODES: ReadonlyArray<{ value: Mode; label: string }> = [
  { value: "bo-dau", label: "Bỏ dấu" },
  { value: "slug", label: "Tạo slug (URL)" },
  { value: "hoa-thuong", label: "Đổi hoa / thường" },
];

const CASES: ReadonlyArray<{ value: LetterCase; label: string }> = [
  { value: "lower", label: "chữ thường" },
  { value: "upper", label: "CHỮ HOA" },
  { value: "title", label: "Viết Hoa Mỗi Từ" },
  { value: "sentence", label: "Viết hoa đầu câu" },
];

const MAU =
  "Công ty TNHH Xây dựng Đại Phúc\nHoá đơn số 1234, ngày 05/08/2026\nĐịa chỉ: 12 Nguyễn Huệ, Quận 1";

export function VietnameseTextForm() {
  const [input, setInput] = useState(MAU);
  const [mode, setMode] = useState<Mode>("bo-dau");
  const [letterCase, setLetterCase] = useState<LetterCase>("title");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    switch (mode) {
      case "bo-dau":
        // Xử lý theo từng dòng để giữ nguyên bố cục người dùng dán vào.
        return input
          .split("\n")
          .map((line) => removeDiacritics(line))
          .join("\n");
      case "slug":
        return input
          .split("\n")
          .map((line) => toSlug(line))
          .join("\n");
      case "hoa-thuong":
        return changeCase(input, letterCase);
    }
  }, [input, mode, letterCase]);

  const stats = useMemo(() => countText(input), [input]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Không có Clipboard API thì người dùng vẫn bôi đen chép tay được.
    }
  }

  return (
    <div className="card stack" style={{ gap: 18 }}>
      <div className="field">
        <span className="field__label">Chế độ</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={mode === item.value ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setMode(item.value)}
              aria-pressed={mode === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "hoa-thuong" && (
        <div className="field">
          <label className="field__label" htmlFor="kieu-chu">
            Kiểu chữ
          </label>
          <select
            id="kieu-chu"
            className="select"
            value={letterCase}
            onChange={(event) => setLetterCase(event.target.value as LetterCase)}
          >
            {CASES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label className="field__label" htmlFor="van-ban-goc">
          Văn bản gốc
        </label>
        <textarea
          id="van-ban-goc"
          className="textarea"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Dán văn bản tiếng Việt vào đây…"
          spellCheck={false}
        />
        <span className="field__hint">
          {stats.characters} ký tự · {stats.words} từ · {stats.lines} dòng
        </span>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="ket-qua">
          Kết quả
        </label>
        <textarea id="ket-qua" className="textarea" value={output} readOnly spellCheck={false} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary" onClick={handleCopy}>
          {copied ? "Đã chép ✓" : "Chép kết quả"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setInput("")}>
          Xoá hết
        </button>
      </div>
    </div>
  );
}
