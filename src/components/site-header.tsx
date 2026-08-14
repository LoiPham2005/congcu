import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Thanh điều hướng.
 *
 * Cố tình là Server Component tĩnh, không đọc cookie hay `headers()`: chỉ cần
 * chạm vào một trong hai thứ đó là toàn bộ trang mất khả năng render tĩnh.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__inner">
        <Link href="/" className="site-header__brand">
          {siteConfig.ten}
        </Link>

        <div className="site-header__nav">
          <Link href="/#cong-cu">Công cụ</Link>
          <Link href="/gioi-thieu">Giới thiệu</Link>
          <Link href="/lien-he">Liên hệ</Link>
        </div>
      </nav>
    </header>
  );
}
