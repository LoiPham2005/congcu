import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/tool-page";
import { getToolOrThrow } from "@/lib/tools/registry";
import { BrickEstimateForm } from "./brick-estimate-form";

const tool = getToolOrThrow("tinh-gach-xay-tuong");

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
      <BrickEstimateForm />
    </ToolPage>
  );
}

function Guide() {
  return (
    <>
      <h2>1m² tường hết bao nhiêu viên gạch</h2>
      <p>
        Câu trả lời phụ thuộc vào <strong>cỡ gạch</strong> và <strong>bề dày mạch vữa</strong>, nên
        không có một con số đúng cho mọi trường hợp. Các con số hay được nhắc tới:
      </p>
      <ul>
        <li>
          <strong>Gạch ống 8×8×18</strong>, tường một lớp: khoảng <strong>55–58 viên/m²</strong>
        </li>
        <li>
          <strong>Gạch thẻ đặc 5×10×20</strong>, tường một lớp: khoảng{" "}
          <strong>79–83 viên/m²</strong>
        </li>
        <li>Tường hai lớp: nhân đôi các con số trên</li>
      </ul>

      <h2>Công thức công cụ này dùng</h2>
      <p>
        Thay vì chép định mức có sẵn, công cụ tính thẳng từ hình học — nhờ vậy đổi cỡ gạch hay đổi
        mạch vữa thì kết quả vẫn đúng:
      </p>
      <p>
        Mỗi viên gạch trên mặt tường chiếm một ô chữ nhật gồm cả mạch vữa bao quanh nó, kích thước{" "}
        <code>(dài + mạch) × (cao + mạch)</code>. Lấy 1m² chia cho diện tích ô đó ra số viên mỗi
        lớp, rồi nhân với số lớp theo bề dày tường.
      </p>
      <p>
        Cách này tự kiểm chứng được: thay số của gạch ống 80×80×180 với mạch 10mm sẽ ra 58,5
        viên/m², khớp với định mức 55 viên vẫn dùng ngoài công trường.
      </p>

      <h2>Vì sao bề dày phần xây nhỏ hơn bề dày tường</h2>
      <p>
        &ldquo;Tường 100&rdquo; ngoài đời là <strong>gạch rộng 80mm cộng hai lớp trát</strong> mỗi
        bên khoảng 10mm. Phần trát đó dùng vữa trát, không phải vữa xây.
      </p>
      <p>
        Đây là chỗ nhiều bảng tính trên mạng bị sai: lấy nguyên bề dày 100mm để tính vữa sẽ cho ra
        lượng xi măng cao vống lên khoảng gấp rưỡi. Công cụ này chỉ tính vữa cho phần khối xây thật.
      </p>

      <h2>Nên để hao hụt bao nhiêu</h2>
      <ul>
        <li>
          <strong>3%</strong> — tường thẳng, ít cửa, thợ quen việc
        </li>
        <li>
          <strong>5%</strong> — mức an toàn cho nhà ở thông thường
        </li>
        <li>
          <strong>7–10%</strong> — nhiều góc cạnh, nhiều ô cửa, phải cắt gạch nhiều
        </li>
      </ul>
      <p>
        Kết quả luôn được làm tròn lên, vì thiếu gạch giữa chừng tốn kém hơn nhiều so với thừa vài
        chục viên — phải dừng thi công và đặt thêm một chuyến xe.
      </p>

      <h2>Câu hỏi thường gặp</h2>

      <h3>Có tính cả vữa trát tường không?</h3>
      <p>
        Không. Kết quả chỉ gồm vữa xây giữa các viên gạch. Vữa trát phụ thuộc vào bề dày lớp trát và
        số mặt cần trát, nên phải tính riêng.
      </p>

      <h3>Số cát và xi măng lấy từ đâu?</h3>
      <p>
        Từ định mức vữa xây theo mác vữa. Mác 75 là mức thông dụng cho nhà ở, cần khoảng 296kg xi
        măng cho mỗi mét khối vữa. Đây là số dự trù để đi mua vật tư; công trình có hồ sơ thiết kế
        thì lấy theo hồ sơ.
      </p>

      <h3>Tường hai lớp thì nhập thế nào?</h3>
      <p>
        Chọn &ldquo;Tường 200&rdquo; ở mục bề dày. Công cụ tự tính ra hai lớp gạch và nhân đôi số
        viên mỗi mét vuông.
      </p>

      <h3>Kết quả này có thay được bản vẽ thiết kế không?</h3>
      <p>
        Không. Đây là con số dự trù để đi mua vật liệu và ước chi phí. Công trình có kết cấu chịu
        lực phải theo hồ sơ thiết kế do kỹ sư lập.
      </p>
    </>
  );
}
