import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/tool-page";
import { getToolOrThrow } from "@/lib/tools/registry";
import { VietnameseTextForm } from "./vietnamese-text-form";

const tool = getToolOrThrow("bo-dau-tieng-viet");

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.description,
  keywords: [...tool.keywords],
  alternates: { canonical: tool.path },
  openGraph: {
    title: tool.seoTitle,
    description: tool.description,
    url: tool.path,
  },
};

export default function Page() {
  return (
    <ToolPage tool={tool} guide={<Guide />}>
      <VietnameseTextForm />
    </ToolPage>
  );
}

function Guide() {
  return (
    <>
      <h2>Khi nào cần bỏ dấu tiếng Việt</h2>
      <ul>
        <li>
          <strong>Đặt tên file và thư mục.</strong> Một số hệ thống cũ và máy chủ Linux xử lý tên
          file có dấu rất dễ lỗi khi tải lên hoặc nén.
        </li>
        <li>
          <strong>Tạo đường dẫn website.</strong> URL có dấu bị mã hoá thành chuỗi{" "}
          <code>%E1%BA%BF</code> dài loằng ngoằng, mất ý nghĩa với cả người đọc lẫn công cụ tìm
          kiếm.
        </li>
        <li>
          <strong>Nhập liệu vào phần mềm chỉ nhận ASCII</strong> — nhiều hệ thống ngân hàng, khai
          báo hải quan và máy in hoá đơn nhiệt vẫn thuộc nhóm này.
        </li>
        <li>
          <strong>Soạn tin nhắn SMS.</strong> Tin có dấu chỉ chứa 70 ký tự mỗi tin, tin không dấu
          được 160 — bỏ dấu giúp giảm số tin phải trả tiền.
        </li>
      </ul>

      <h2>Công cụ xử lý dấu như thế nào</h2>
      <p>
        Mỗi chữ có dấu trong tiếng Việt thực chất là một chữ cái gốc cộng thêm dấu phụ. Công cụ tách
        hai phần đó ra rồi bỏ phần dấu đi, nên <em>ế</em> thành <code>e</code>, <em>ườ</em> thành{" "}
        <code>uo</code>. Cách này giữ nguyên chữ hoa thường, chữ số và mọi dấu câu.
      </p>
      <p>
        Riêng <strong>đ</strong> và <strong>Đ</strong> được xử lý riêng, vì chúng là chữ cái độc lập
        chứ không phải <code>d</code> có thêm dấu. Đây cũng là lỗi hay gặp ở các công cụ khác: bỏ
        dấu xong vẫn còn sót chữ đ.
      </p>

      <h2>Ba chế độ khác nhau</h2>
      <h3>Bỏ dấu</h3>
      <p>Giữ nguyên mọi thứ, chỉ xoá dấu. Dùng khi bạn cần văn bản đọc được nhưng không dấu.</p>

      <h3>Tạo slug (URL)</h3>
      <p>
        Bỏ dấu, hạ về chữ thường, rồi thay mọi ký tự không phải chữ và số bằng dấu gạch nối. Kết quả
        dùng được ngay làm đường dẫn: <code>Hoá đơn số 12/2026</code> thành{" "}
        <code>hoa-don-so-12-2026</code>.
      </p>

      <h3>Đổi hoa / thường</h3>
      <p>
        Chuẩn hoá văn bản dán từ Excel hoặc Word. &ldquo;Viết Hoa Mỗi Từ&rdquo; dùng cho tên riêng
        và tiêu đề; &ldquo;Viết hoa đầu câu&rdquo; dùng cho đoạn văn.
      </p>

      <h2>Câu hỏi thường gặp</h2>

      <h3>Văn bản của tôi có bị gửi lên máy chủ không?</h3>
      <p>
        Không. Toàn bộ xử lý chạy trên trình duyệt của bạn, kể cả khi mất mạng. Bạn có thể dán cả
        hợp đồng hay danh sách khách hàng vào đây mà không lo lộ dữ liệu.
      </p>

      <h3>Xử lý được văn bản dài bao nhiêu?</h3>
      <p>
        Không giới hạn cứng. Vài chục nghìn dòng vẫn chạy tức thì vì máy tính của bạn làm việc,
        không phải chờ máy chủ trả lời.
      </p>

      <h3>Chép được cả nhiều dòng cùng lúc không?</h3>
      <p>
        Được. Mỗi dòng được xử lý riêng và giữ nguyên thứ tự, nên bạn có thể dán nguyên một cột từ
        Excel rồi chép kết quả trả ngược lại.
      </p>
    </>
  );
}
