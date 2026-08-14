"use client";

import { useEffect, useRef } from "react";

/**
 * Một khối quảng cáo AdSense.
 *
 * Hai điều khối này phải làm đúng, nếu không nó sẽ ăn mất chính doanh thu mà
 * nó sinh ra:
 *
 * 1. GIỮ CHỖ SẴN. Quảng cáo nạp sau khi trang đã hiện, nên nếu không đặt trước
 *    chiều cao thì nội dung sẽ nhảy xuống lúc quảng cáo xuất hiện. Đó là điểm
 *    CLS xấu trong Core Web Vitals, mà CLS ảnh hưởng trực tiếp tới thứ hạng
 *    tìm kiếm — tức là ảnh hưởng tới traffic, tức là ảnh hưởng tới doanh thu.
 *
 * 2. TỰ TẮT KHI CHƯA CÓ MÃ. Giai đoạn đầu chưa được AdSense duyệt; lúc đó vẫn
 *    hiện khung giữ chỗ để bố cục không đổi khi bật quảng cáo lên sau này.
 */

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export type ViTriQuangCao = "ngang" | "trong-bai" | "vuong";

/** Chiều cao giữ chỗ theo từng vị trí, đơn vị px. */
const CHIEU_CAO_GIU_CHO: Record<ViTriQuangCao, number> = {
  ngang: 100,
  "trong-bai": 280,
  vuong: 250,
};

type Props = {
  /** Mã đơn vị quảng cáo lấy trong bảng điều khiển AdSense. */
  slot: string;
  viTri?: ViTriQuangCao;
  /** Mã publisher. Không truyền thì khối tự tắt và chỉ hiện khung giữ chỗ. */
  client?: string | undefined;
};

export function AdSlot({ slot, viTri = "trong-bai", client }: Props) {
  const daDay = useRef(false);
  const chieuCao = CHIEU_CAO_GIU_CHO[viTri];

  useEffect(() => {
    if (!client || daDay.current) return;

    // React StrictMode chạy effect hai lần ở dev. Đẩy trùng vào adsbygoogle sẽ
    // khiến AdSense báo lỗi "already have ads in them", nên chốt bằng ref.
    daDay.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // Trình chặn quảng cáo hoặc script chưa nạp xong. Không phải lỗi cần xử
      // lý: trang vẫn dùng được bình thường, chỉ là không có quảng cáo.
    }
  }, [client]);

  if (!client) {
    return (
      <div
        className="ad-slot ad-slot--trong"
        style={{ minHeight: chieuCao }}
        aria-hidden="true"
        data-vi-tri={viTri}
      />
    );
  }

  return (
    <div className="ad-slot" style={{ minHeight: chieuCao }} data-vi-tri={viTri}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: chieuCao }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
