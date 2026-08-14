import { describe, expect, it } from "vitest";
import {
  BRICK_PRESETS,
  InvalidEstimateInputError,
  estimateBricks,
  type BrickDimensions,
} from "./brick-estimate";

const GACH_ONG: BrickDimensions = { length: 180, width: 80, height: 80 };
const GACH_THE: BrickDimensions = { length: 200, width: 100, height: 50 };

describe("estimateBricks — định mức viên trên m²", () => {
  it("khớp với con số ~55 viên/m² quen dùng cho gạch ống, tường một lớp", () => {
    const result = estimateBricks({
      wallLength: 1,
      wallHeight: 1,
      brick: GACH_ONG,
      wallThickness: 100,
    });

    expect(result.layers).toBe(1);
    expect(result.bricksPerSquareMeter).toBe(58.5);
  });

  it("khớp với con số ~80 viên/m² quen dùng cho gạch thẻ", () => {
    const result = estimateBricks({
      wallLength: 1,
      wallHeight: 1,
      brick: GACH_THE,
      wallThickness: 100,
    });

    expect(result.bricksPerSquareMeter).toBe(79.4);
  });

  it("tường dày gấp đôi thì thành hai lớp và số viên tăng gấp đôi", () => {
    const result = estimateBricks({
      wallLength: 1,
      wallHeight: 1,
      brick: GACH_ONG,
      wallThickness: 200,
    });

    expect(result.layers).toBe(2);
    expect(result.bricksPerSquareMeter).toBe(117);
    expect(result.effectiveThickness).toBe(170);
  });

  it("mạch vữa dày hơn thì cần ít viên hơn", () => {
    const mach10 = estimateBricks({
      wallLength: 1,
      wallHeight: 1,
      brick: GACH_ONG,
      wallThickness: 100,
    });
    const mach20 = estimateBricks({
      wallLength: 1,
      wallHeight: 1,
      brick: GACH_ONG,
      wallThickness: 100,
      mortarJoint: 20,
    });

    expect(mach20.bricksPerSquareMeter).toBeLessThan(mach10.bricksPerSquareMeter);
  });
});

describe("estimateBricks — diện tích và hao hụt", () => {
  it("trừ diện tích cửa khỏi diện tích tường", () => {
    const result = estimateBricks({
      wallLength: 10,
      wallHeight: 3,
      openingArea: 6,
      brick: GACH_ONG,
      wallThickness: 100,
    });

    expect(result.netArea).toBe(24);
  });

  it("cộng hao hụt rồi làm tròn LÊN — mua thiếu tệ hơn mua thừa", () => {
    const result = estimateBricks({
      wallLength: 10,
      wallHeight: 3,
      brick: GACH_ONG,
      wallThickness: 100,
      wastePercent: 3,
    });

    expect(result.bricksExact).toBe(1754.4);
    expect(result.bricksToBuy).toBe(1808);
  });

  it("hao hụt 0% vẫn làm tròn lên vì không mua được nửa viên", () => {
    const result = estimateBricks({
      wallLength: 10,
      wallHeight: 3,
      brick: GACH_ONG,
      wallThickness: 100,
      wastePercent: 0,
    });

    expect(result.bricksToBuy).toBe(1755);
  });
});

describe("estimateBricks — vữa, xi măng và cát", () => {
  it("chỉ tính vữa trong phần khối xây, không tính lớp trát", () => {
    const result = estimateBricks({
      wallLength: 10,
      wallHeight: 3,
      brick: GACH_ONG,
      wallThickness: 100,
    });

    // Phần xây dày 80mm chứ không phải 100mm danh nghĩa.
    expect(result.effectiveThickness).toBe(80);
    expect(result.mortarVolume).toBe(0.379);
  });

  it("tỷ lệ vữa nằm trong khoảng hợp lý của khối xây (10–20%)", () => {
    const result = estimateBricks({
      wallLength: 10,
      wallHeight: 3,
      brick: GACH_ONG,
      wallThickness: 100,
    });

    const masonryVolume = result.netArea * (result.effectiveThickness / 1000);
    const ratio = result.mortarVolume / masonryVolume;

    expect(ratio).toBeGreaterThan(0.1);
    expect(ratio).toBeLessThan(0.2);
  });

  it("quy xi măng ra bao 50kg, làm tròn lên", () => {
    const result = estimateBricks({
      wallLength: 10,
      wallHeight: 3,
      brick: GACH_ONG,
      wallThickness: 100,
      mortarGrade: "75",
    });

    expect(result.cementKg).toBe(112.2);
    expect(result.cementBags).toBe(3);
    expect(result.sandCubicMeters).toBe(0.41);
  });

  it("mác vữa cao hơn thì tốn nhiều xi măng hơn trên cùng khối lượng vữa", () => {
    const base = { wallLength: 10, wallHeight: 3, brick: GACH_ONG, wallThickness: 100 } as const;

    const mac50 = estimateBricks({ ...base, mortarGrade: "50" });
    const mac100 = estimateBricks({ ...base, mortarGrade: "100" });

    expect(mac50.mortarVolume).toBe(mac100.mortarVolume);
    expect(mac100.cementKg).toBeGreaterThan(mac50.cementKg);
  });
});

describe("estimateBricks — đầu vào không hợp lệ", () => {
  const base = { wallLength: 10, wallHeight: 3, brick: GACH_ONG, wallThickness: 100 } as const;

  it("từ chối kích thước bằng 0 hoặc âm", () => {
    expect(() => estimateBricks({ ...base, wallLength: 0 })).toThrow(InvalidEstimateInputError);
    expect(() => estimateBricks({ ...base, wallHeight: -1 })).toThrow(InvalidEstimateInputError);
    expect(() => estimateBricks({ ...base, wallThickness: 0 })).toThrow(InvalidEstimateInputError);
  });

  it("từ chối số không hợp lệ", () => {
    expect(() => estimateBricks({ ...base, wallLength: Number.NaN })).toThrow(
      InvalidEstimateInputError,
    );
  });

  it("từ chối diện tích cửa lớn hơn hoặc bằng diện tích tường", () => {
    expect(() => estimateBricks({ ...base, openingArea: 30 })).toThrow(/nhỏ hơn diện tích tường/);
    expect(() => estimateBricks({ ...base, openingArea: -1 })).toThrow(InvalidEstimateInputError);
  });

  it("từ chối hao hụt và mạch vữa âm", () => {
    expect(() => estimateBricks({ ...base, wastePercent: -1 })).toThrow(InvalidEstimateInputError);
    expect(() => estimateBricks({ ...base, mortarJoint: -1 })).toThrow(InvalidEstimateInputError);
  });
});

describe("BRICK_PRESETS", () => {
  it("mọi cỡ gạch dựng sẵn đều tính ra kết quả hợp lệ", () => {
    for (const preset of BRICK_PRESETS) {
      const result = estimateBricks({
        wallLength: 5,
        wallHeight: 3,
        brick: preset,
        wallThickness: preset.width,
      });

      expect(result.bricksToBuy).toBeGreaterThan(0);
      expect(result.mortarVolume).toBeGreaterThanOrEqual(0);
      expect(result.layers).toBe(1);
    }
  });

  it("không có id trùng nhau", () => {
    const ids = BRICK_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
