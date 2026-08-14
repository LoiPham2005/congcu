import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/tool-page";
import { getToolOrThrow } from "@/lib/tools/registry";
import { NumberToWordsForm } from "./number-to-words-form";

const tool = getToolOrThrow("doi-so-thanh-chu");

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
      <NumberToWordsForm />
    </ToolPage>
  );
}

function Guide() {
  return (
    <>
      <h2>Dùng để làm gì</h2>
      <p>
        Kế toán viết hoá đơn, hợp đồng và phiếu thu chi đều phải ghi số tiền bằng chữ bên cạnh chữ
        số. Đây là quy định để chống sửa chứng từ: chữ số có thể thêm một nét thành con số khác, còn
        chữ viết thì không.
      </p>

      <h2>Cách đọc số tiền theo quy ước tiếng Việt</h2>
      <p>Ba quy tắc bất quy tắc mà công cụ này đã xử lý sẵn:</p>
      <ul>
        <li>
          Số <strong>5</strong> đứng sau hàng chục đọc là <strong>lăm</strong>, không phải
          &ldquo;năm&rdquo;: 15 là <em>mười lăm</em>, 25 là <em>hai mươi lăm</em>.
        </li>
        <li>
          Số <strong>1</strong> đứng sau hàng chục từ 2 trở lên đọc là <strong>mốt</strong>: 21 là{" "}
          <em>hai mươi mốt</em>, nhưng 11 vẫn là <em>mười một</em>.
        </li>
        <li>
          Số <strong>4</strong> đứng sau hàng chục từ 2 trở lên thường đọc là <strong>tư</strong>:
          24 là <em>hai mươi tư</em>, còn 14 vẫn là <em>mười bốn</em>.
        </li>
      </ul>

      <h3>Khi hàng chục bằng 0</h3>
      <p>
        Chèn chữ đệm <strong>linh</strong> hoặc <strong>lẻ</strong>: 105 đọc là{" "}
        <em>một trăm linh năm</em>. Hai cách đều đúng, miền Bắc quen dùng &ldquo;linh&rdquo;, miền
        Nam quen dùng &ldquo;lẻ&rdquo;. Chọn theo thói quen của đơn vị bạn.
      </p>

      <h3>Khi cả nhóm ba chữ số bằng 0</h3>
      <p>
        Phải giữ chữ <strong>không trăm</strong> để không mất hàng: 1.005 đọc là{" "}
        <em>một nghìn không trăm linh năm</em>, chứ không phải &ldquo;một nghìn linh năm&rdquo;.
      </p>

      <h2>Có nên thêm chữ &ldquo;chẵn&rdquo;</h2>
      <p>
        Nên, với chứng từ in ra giấy. Chữ &ldquo;chẵn&rdquo; ở cuối khẳng định số tiền không còn
        phần lẻ và bịt luôn khoảng trống phía sau — không ai viết thêm chữ vào đó được nữa. Với
        chứng từ điện tử thì không bắt buộc.
      </p>

      <h2>Câu hỏi thường gặp</h2>

      <h3>Công cụ có gửi số tiền của tôi đi đâu không?</h3>
      <p>
        Không. Toàn bộ phép đọc chạy bằng JavaScript ngay trên trình duyệt của bạn. Bạn có thể tắt
        mạng rồi thử lại — công cụ vẫn hoạt động bình thường.
      </p>

      <h3>Đọc được số lớn tới đâu?</h3>
      <p>
        Tới 21 chữ số ở phần nguyên, tức là quá mức mọi chứng từ thực tế. Số được xử lý dưới dạng
        chuỗi nên không bị làm tròn sai như khi tính bằng kiểu số thông thường.
      </p>

      <h3>Nhập &ldquo;1.5&rdquo; thì được hiểu là bao nhiêu?</h3>
      <p>
        Là <em>một phẩy năm</em>. Dấu phân cách hàng nghìn luôn đi kèm đúng ba chữ số, nên{" "}
        <code>1.500</code> được hiểu là một nghìn năm trăm, còn <code>1.5</code> chỉ có thể là số
        thập phân. Muốn chắc chắn thì dùng dấu phẩy cho phần thập phân theo đúng quy ước tiếng Việt.
      </p>
    </>
  );
}
