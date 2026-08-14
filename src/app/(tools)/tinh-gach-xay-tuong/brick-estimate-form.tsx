"use client";

import { useMemo, useState } from "react";
import {
  BRICK_PRESETS,
  InvalidEstimateInputError,
  MORTAR_GRADES,
  estimateBricks,
  type BrickEstimate,
  type MortarGrade,
} from "@/lib/tools/brick-estimate";

type Outcome = { ok: true; value: BrickEstimate } | { ok: false; message: string };

const MORTAR_GRADE_KEYS = Object.keys(MORTAR_GRADES) as MortarGrade[];

/** Bề dày tường thông dụng — nhãn theo cách gọi ngoài công trường. */
const WALL_THICKNESSES = [
  { value: 100, label: "Tường 100 (một lớp gạch)" },
  { value: 200, label: "Tường 200 (hai lớp gạch)" },
] as const;

/**
 * Ô nhập số giữ dạng chuỗi thay vì number.
 *
 * Nếu ép về number ngay khi gõ, người dùng không xoá hết được ô để nhập lại —
 * chuỗi rỗng biến thành 0 và con số 0 đó lại hiện ngược lên ô nhập.
 */
function useNumberField(initial: string) {
  const [text, setText] = useState(initial);
  return { text, setText, value: Number(text.replace(",", ".")) };
}

const nf = new Intl.NumberFormat("vi-VN");

export function BrickEstimateForm() {
  const wallLength = useNumberField("10");
  const wallHeight = useNumberField("3");
  const openingArea = useNumberField("0");
  const mortarJoint = useNumberField("10");
  const wastePercent = useNumberField("3");

  const [presetId, setPresetId] = useState(BRICK_PRESETS[0]?.id ?? "");
  const [wallThickness, setWallThickness] = useState<number>(100);
  const [mortarGrade, setMortarGrade] = useState<MortarGrade>("75");

  const brick = BRICK_PRESETS.find((item) => item.id === presetId) ?? BRICK_PRESETS[0];

  const outcome = useMemo<Outcome>(() => {
    if (!brick) {
      return { ok: false, message: "Chưa chọn loại gạch." };
    }

    try {
      return {
        ok: true,
        value: estimateBricks({
          wallLength: wallLength.value,
          wallHeight: wallHeight.value,
          openingArea: openingArea.value,
          brick,
          wallThickness,
          mortarJoint: mortarJoint.value,
          wastePercent: wastePercent.value,
          mortarGrade,
        }),
      };
    } catch (error) {
      if (error instanceof InvalidEstimateInputError) {
        return { ok: false, message: error.message };
      }
      throw error;
    }
  }, [
    brick,
    wallLength.value,
    wallHeight.value,
    openingArea.value,
    wallThickness,
    mortarJoint.value,
    wastePercent.value,
    mortarGrade,
  ]);

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="card stack" style={{ gap: 18 }}>
        <div className="grid-auto">
          <div className="field">
            <label className="field__label" htmlFor="dai-tuong">
              Chiều dài tường (m)
            </label>
            <input
              id="dai-tuong"
              className="input"
              type="number"
              min="0"
              step="0.1"
              value={wallLength.text}
              onChange={(event) => wallLength.setText(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="cao-tuong">
              Chiều cao tường (m)
            </label>
            <input
              id="cao-tuong"
              className="input"
              type="number"
              min="0"
              step="0.1"
              value={wallHeight.text}
              onChange={(event) => wallHeight.setText(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="dien-tich-cua">
              Diện tích cửa trừ ra (m²)
            </label>
            <input
              id="dien-tich-cua"
              className="input"
              type="number"
              min="0"
              step="0.1"
              value={openingArea.text}
              onChange={(event) => openingArea.setText(event.target.value)}
            />
            <span className="field__hint">Cộng dồn cửa đi và cửa sổ.</span>
          </div>
        </div>

        <div className="grid-auto">
          <div className="field">
            <label className="field__label" htmlFor="loai-gach">
              Loại gạch
            </label>
            <select
              id="loai-gach"
              className="select"
              value={presetId}
              onChange={(event) => setPresetId(event.target.value)}
            >
              {BRICK_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="be-day-tuong">
              Bề dày tường
            </label>
            <select
              id="be-day-tuong"
              className="select"
              value={wallThickness}
              onChange={(event) => setWallThickness(Number(event.target.value))}
            >
              {WALL_THICKNESSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="mac-vua">
              Mác vữa xây
            </label>
            <select
              id="mac-vua"
              className="select"
              value={mortarGrade}
              onChange={(event) => setMortarGrade(event.target.value as MortarGrade)}
            >
              {MORTAR_GRADE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {MORTAR_GRADES[key].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-auto">
          <div className="field">
            <label className="field__label" htmlFor="mach-vua">
              Bề dày mạch vữa (mm)
            </label>
            <input
              id="mach-vua"
              className="input"
              type="number"
              min="0"
              step="1"
              value={mortarJoint.text}
              onChange={(event) => mortarJoint.setText(event.target.value)}
            />
            <span className="field__hint">Thông thường 10mm.</span>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="hao-hut">
              Hao hụt (%)
            </label>
            <input
              id="hao-hut"
              className="input"
              type="number"
              min="0"
              step="1"
              value={wastePercent.text}
              onChange={(event) => wastePercent.setText(event.target.value)}
            />
            <span className="field__hint">Do vỡ và cắt, thường 3–5%.</span>
          </div>
        </div>
      </div>

      {outcome.ok ? (
        <div className="card stack" style={{ gap: 16 }}>
          <div className="result">
            <div className="result__label">Số gạch cần mua</div>
            <p className="result__value">
              {nf.format(outcome.value.bricksToBuy)} viên
              <span className="stat__unit">(đã cộng {wastePercent.text || 0}% hao hụt)</span>
            </p>
          </div>

          <div className="stat-grid">
            <div className="stat">
              <div className="stat__label">Diện tích tường</div>
              <div className="stat__value">
                {nf.format(outcome.value.netArea)}
                <span className="stat__unit">m²</span>
              </div>
            </div>

            <div className="stat">
              <div className="stat__label">Định mức</div>
              <div className="stat__value">
                {nf.format(outcome.value.bricksPerSquareMeter)}
                <span className="stat__unit">viên/m²</span>
              </div>
            </div>

            <div className="stat">
              <div className="stat__label">Vữa xây</div>
              <div className="stat__value">
                {nf.format(outcome.value.mortarVolume)}
                <span className="stat__unit">m³</span>
              </div>
            </div>

            <div className="stat">
              <div className="stat__label">Xi măng</div>
              <div className="stat__value">
                {nf.format(outcome.value.cementBags)}
                <span className="stat__unit">bao 50kg</span>
              </div>
            </div>

            <div className="stat">
              <div className="stat__label">Cát</div>
              <div className="stat__value">
                {nf.format(outcome.value.sandCubicMeters)}
                <span className="stat__unit">m³</span>
              </div>
            </div>

            <div className="stat">
              <div className="stat__label">Bề dày phần xây</div>
              <div className="stat__value">
                {outcome.value.effectiveThickness}
                <span className="stat__unit">mm</span>
              </div>
            </div>
          </div>

          <p className="note">
            Bề dày phần xây ({outcome.value.effectiveThickness}mm) nhỏ hơn con số {wallThickness}mm
            bạn chọn là đúng: phần chênh lệch là hai lớp trát, không phải vữa xây. Lượng xi măng ở
            trên chỉ tính cho vữa xây — vữa trát cần tính riêng.
          </p>
        </div>
      ) : (
        <p className="alert-error" role="status">
          {outcome.message}
        </p>
      )}
    </div>
  );
}
