"use client";

import { useMemo, useState } from "react";
import {
  InvalidNumberError,
  numberToWords,
  parseNumberInput,
  type ZeroTensStyle,
} from "@/lib/tools/number-to-words";

/** Kết quả tính, tách riêng lỗi để hiển thị thông báo thay vì làm sập giao diện. */
type Outcome = { ok: true; text: string; preview: string } | { ok: false; message: string };

/** Chèn dấu chấm phân cách nghìn để người dùng tự soát lại con số đã gõ. */
function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function NumberToWordsForm() {
  const [input, setInput] = useState("1234567");
  const [withUnit, setWithUnit] = useState(true);
  const [appendRound, setAppendRound] = useState(false);
  const [zeroTensStyle, setZeroTensStyle] = useState<ZeroTensStyle>("linh");
  const [copied, setCopied] = useState(false);

  const outcome = useMemo<Outcome>(() => {
    if (!input.trim()) {
      return { ok: false, message: "Nhập một số để bắt đầu." };
    }

    try {
      const parsed = parseNumberInput(input);
      const preview =
        groupThousands(parsed.integer) + (parsed.fraction ? `,${parsed.fraction}` : "");

      return {
        ok: true,
        preview: (parsed.negative ? "-" : "") + preview,
        text: numberToWords(input, {
          ...(withUnit ? { unit: "đồng" } : {}),
          appendRound,
          zeroTensStyle,
        }),
      };
    } catch (error) {
      if (error instanceof InvalidNumberError) {
        return { ok: false, message: error.message };
      }
      throw error;
    }
  }, [input, withUnit, appendRound, zeroTensStyle]);

  async function handleCopy() {
    if (!outcome.ok) return;

    try {
      await navigator.clipboard.writeText(outcome.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt cũ hoặc trang không chạy trên HTTPS thì không có Clipboard
      // API. Người dùng vẫn bôi đen chép tay được nên không cần báo lỗi.
    }
  }

  return (
    <div className="card stack" style={{ gap: 18 }}>
      <div className="field">
        <label className="field__label" htmlFor="so-can-doc">
          Số cần đọc
        </label>
        <input
          id="so-can-doc"
          className="input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ví dụ: 1.234.567"
        />
        <span className="field__hint">
          {outcome.ok
            ? `Đang đọc số: ${outcome.preview}`
            : "Dùng dấu chấm cho hàng nghìn, dấu phẩy cho phần thập phân."}
        </span>
      </div>

      <div className="grid-auto">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={withUnit}
            onChange={(event) => setWithUnit(event.target.checked)}
          />
          Thêm đơn vị &ldquo;đồng&rdquo;
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={appendRound}
            onChange={(event) => setAppendRound(event.target.checked)}
            disabled={!withUnit}
          />
          Thêm &ldquo;chẵn&rdquo; ở cuối
        </label>

        <div className="field">
          <label className="field__label" htmlFor="kieu-doc-linh">
            Hàng chục bằng 0
          </label>
          <select
            id="kieu-doc-linh"
            className="select"
            value={zeroTensStyle}
            onChange={(event) => setZeroTensStyle(event.target.value as ZeroTensStyle)}
          >
            <option value="linh">linh — một trăm linh năm</option>
            <option value="lẻ">lẻ — một trăm lẻ năm</option>
          </select>
        </div>
      </div>

      {outcome.ok ? (
        <div className="result">
          <div className="result__label">Đọc thành chữ</div>
          <p className="result__value">{outcome.text}</p>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 12 }}
            onClick={handleCopy}
          >
            {copied ? "Đã chép ✓" : "Chép kết quả"}
          </button>
        </div>
      ) : (
        <p className="alert-error" role="status">
          {outcome.message}
        </p>
      )}
    </div>
  );
}
