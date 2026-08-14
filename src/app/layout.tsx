import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { env } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  // Nhờ có metadataBase, mọi `alternates.canonical` và ảnh Open Graph ở các
  // trang con chỉ cần ghi đường dẫn tương đối.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.ten} — Công cụ tính toán online miễn phí`,
    template: `%s · ${siteConfig.tenNgan}`,
  },
  description: siteConfig.moTa,
  applicationName: siteConfig.ten,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: siteConfig.ten,
    url: siteConfig.url,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="vi">
      <body>
        <SiteHeader />
        <div className="site-main">{children}</div>
        <SiteFooter />

        {/*
          Nạp sau khi trang đã tương tác được: quảng cáo không bao giờ được
          chặn đường render nội dung, vì tốc độ hiển thị nội dung mới là thứ
          Google chấm điểm.

          Script này chỉ xuất hiện khi đã có mã publisher thật — trước lúc được
          AdSense duyệt thì nó chẳng làm gì ngoài việc kéo chậm trang.
        */}
        {adsenseClient && (
          <Script
            id="adsbygoogle-loader"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        )}
      </body>
    </html>
  );
}
