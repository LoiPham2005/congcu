/**
 * Dự trù gạch, xi măng và cát cho tường xây.
 *
 * ---
 * VÌ SAO TÍNH TỪ HÌNH HỌC THAY VÌ CHÉP ĐỊNH MỨC
 *
 * Trên mạng lưu truyền các con số kiểu "tường 100 hết 55 viên/m²". Chúng đúng
 * cho đúng một cỡ gạch và đúng một bề dày mạch vữa, nhưng không ai ghi kèm điều
 * kiện đó, nên chép về là sai ngay khi người dùng đổi loại gạch.
 *
 * Ở đây số viên/m² được suy ra từ kích thước viên gạch cộng bề dày mạch vữa.
 * Cách này tự kiểm chứng được: thay số của gạch ống 80×80×180 và mạch 10mm sẽ
 * ra ~58 viên/m² cho tường một lớp, khớp với định mức ~55 viên vẫn dùng ngoài
 * công trường; gạch thẻ 50×100×200 ra ~79 viên/m², khớp với con số ~80 viên.
 *
 * Kết quả là số dự trù để đi mua vật tư, không thay thế bản vẽ thiết kế.
 */

export type BrickDimensions = {
  /** Chiều dài viên gạch, mm — cạnh nằm ngang trên mặt tường. */
  length: number;
  /** Chiều rộng viên gạch, mm — cạnh ăn vào bề dày tường. */
  width: number;
  /** Chiều cao viên gạch, mm — cạnh nằm dọc trên mặt tường. */
  height: number;
};

export type BrickPreset = BrickDimensions & {
  id: string;
  name: string;
};

/** Các cỡ gạch phổ biến ở Việt Nam, đơn vị mm. */
export const BRICK_PRESETS: readonly BrickPreset[] = [
  { id: "ong-2-lo", name: "Gạch ống 2 lỗ (80×80×180)", length: 180, width: 80, height: 80 },
  { id: "ong-4-lo", name: "Gạch ống 4 lỗ (80×80×180)", length: 180, width: 80, height: 80 },
  { id: "the-dac", name: "Gạch thẻ đặc (50×100×200)", length: 200, width: 100, height: 50 },
  { id: "tuynel-dac", name: "Gạch tuynel đặc (60×105×220)", length: 220, width: 105, height: 60 },
  {
    id: "block-be-tong",
    name: "Gạch block bê tông (100×200×400)",
    length: 400,
    width: 100,
    height: 200,
  },
];

/**
 * Định mức vữa xây cho 1 m³ vữa, theo mác vữa.
 *
 * Lấy theo các bảng định mức xây dựng phổ biến. Đây là số dự trù để đi mua vật
 * tư — công trình có hồ sơ thiết kế thì lấy theo hồ sơ.
 */
export const MORTAR_GRADES = {
  "50": { name: "Mác 50 — tường bao, ít chịu lực", cementKg: 230, sandCubicMeters: 1.12 },
  "75": { name: "Mác 75 — thông dụng cho nhà ở", cementKg: 296, sandCubicMeters: 1.09 },
  "100": { name: "Mác 100 — tường chịu lực", cementKg: 385, sandCubicMeters: 1.05 },
} as const;

export type MortarGrade = keyof typeof MORTAR_GRADES;

/** Khối lượng một bao xi măng, kg. */
const CEMENT_BAG_KG = 50;

export type BrickEstimateInput = {
  /** Chiều dài tường, m. */
  wallLength: number;
  /** Chiều cao tường, m. */
  wallHeight: number;
  /** Tổng diện tích cửa đi và cửa sổ cần trừ ra, m². Mặc định 0. */
  openingArea?: number;
  brick: BrickDimensions;
  /** Bề dày tường hoàn thiện phần xây, mm. Thường 100 hoặc 200. */
  wallThickness: number;
  /** Bề dày mạch vữa, mm. Mặc định 10. */
  mortarJoint?: number;
  /** Hao hụt do vỡ và cắt, %. Mặc định 3. */
  wastePercent?: number;
  mortarGrade?: MortarGrade;
};

export type BrickEstimate = {
  /** Diện tích tường sau khi trừ cửa, m². */
  netArea: number;
  /** Số lớp gạch theo bề dày tường. */
  layers: number;
  /**
   * Bề dày phần xây thực tế, mm — chỉ tính gạch và mạch vữa giữa các lớp.
   *
   * Thường nhỏ hơn bề dày danh nghĩa người dùng nhập: "tường 100" ngoài đời là
   * gạch rộng 80mm cộng hai lớp trát mỗi bên khoảng 10mm. Phần trát đó không
   * phải vữa xây nên không được tính vào đây.
   */
  effectiveThickness: number;
  /** Số viên trên 1 m² tường, đã tính cả số lớp. Làm tròn 1 chữ số thập phân. */
  bricksPerSquareMeter: number;
  /** Số viên lý thuyết, chưa cộng hao hụt. */
  bricksExact: number;
  /** Số viên cần mua, đã cộng hao hụt và làm tròn lên. */
  bricksToBuy: number;
  /** Thể tích vữa xây, m³. */
  mortarVolume: number;
  cementKg: number;
  /** Số bao xi măng 50 kg, làm tròn lên. */
  cementBags: number;
  sandCubicMeters: number;
};

export class InvalidEstimateInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEstimateInputError";
  }
}

function requirePositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new InvalidEstimateInputError(`${label} phải là số lớn hơn 0.`);
  }
}

/** Làm tròn tới `digits` chữ số thập phân, tránh đuôi rác của số dấu phẩy động. */
function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function estimateBricks(input: BrickEstimateInput): BrickEstimate {
  const {
    wallLength,
    wallHeight,
    openingArea = 0,
    brick,
    wallThickness,
    mortarJoint = 10,
    wastePercent = 3,
    mortarGrade = "75",
  } = input;

  requirePositive(wallLength, "Chiều dài tường");
  requirePositive(wallHeight, "Chiều cao tường");
  requirePositive(wallThickness, "Bề dày tường");
  requirePositive(brick.length, "Chiều dài viên gạch");
  requirePositive(brick.width, "Chiều rộng viên gạch");
  requirePositive(brick.height, "Chiều cao viên gạch");

  if (!Number.isFinite(mortarJoint) || mortarJoint < 0) {
    throw new InvalidEstimateInputError("Bề dày mạch vữa không được âm.");
  }

  if (!Number.isFinite(wastePercent) || wastePercent < 0) {
    throw new InvalidEstimateInputError("Hao hụt không được âm.");
  }

  const grossArea = wallLength * wallHeight;

  if (!Number.isFinite(openingArea) || openingArea < 0) {
    throw new InvalidEstimateInputError("Diện tích cửa không được âm.");
  }

  if (openingArea >= grossArea) {
    throw new InvalidEstimateInputError(
      "Diện tích cửa phải nhỏ hơn diện tích tường — kiểm tra lại số đã nhập.",
    );
  }

  const netArea = grossArea - openingArea;

  // n lớp gạch chiếm: n×rộng + (n−1)×mạch. Giải ngược ra n rồi làm tròn, vì bề
  // dày tường người dùng nhập là con số tròn ngoài đời (100, 200) chứ không
  // khớp chính xác tới từng milimét.
  const layers = Math.max(
    1,
    Math.round((wallThickness + mortarJoint) / (brick.width + mortarJoint)),
  );

  // Mỗi viên trên mặt tường chiếm một ô chữ nhật gồm cả mạch vữa bao quanh.
  const cellAreaSquareMeters =
    ((brick.length + mortarJoint) / 1000) * ((brick.height + mortarJoint) / 1000);

  const bricksPerSquareMeter = layers / cellAreaSquareMeters;
  const bricksExact = bricksPerSquareMeter * netArea;
  const bricksToBuy = Math.ceil(bricksExact * (1 + wastePercent / 100));

  // Vữa XÂY chỉ nằm trong phần khối xây, tức bề dày do gạch và mạch giữa các
  // lớp tạo ra — không phải bề dày danh nghĩa người dùng nhập. Lấy nhầm con số
  // này sẽ tính cả lớp trát vào vữa xây và cho ra lượng xi măng cao vống lên.
  const effectiveThickness = layers * brick.width + (layers - 1) * mortarJoint;

  const masonryVolume = netArea * (effectiveThickness / 1000);
  const brickVolume = (brick.length * brick.width * brick.height) / 1_000_000_000;
  const mortarVolume = Math.max(0, masonryVolume - brickVolume * bricksExact);

  const grade = MORTAR_GRADES[mortarGrade];
  const cementKg = mortarVolume * grade.cementKg;
  const sandCubicMeters = mortarVolume * grade.sandCubicMeters;

  return {
    netArea: round(netArea, 2),
    layers,
    effectiveThickness,
    bricksPerSquareMeter: round(bricksPerSquareMeter, 1),
    bricksExact: round(bricksExact, 1),
    bricksToBuy,
    mortarVolume: round(mortarVolume, 3),
    cementKg: round(cementKg, 1),
    cementBags: Math.ceil(cementKg / CEMENT_BAG_KG),
    sandCubicMeters: round(sandCubicMeters, 2),
  };
}
