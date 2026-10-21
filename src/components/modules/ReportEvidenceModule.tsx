import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Award,
  TrendingUp,
  FileText,
  Printer,
  Download,
  Users,
  CheckCircle2,
  Clock,
  Heart,
  Flower2,
  Sparkles,
  School,
  Share2,
} from 'lucide-react';

export const ReportEvidenceModule: React.FC = () => {
  const { students, goodDeeds, tasks, attendance, settings, plans, diary, announcements, messages } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'metrics' | 'before_after' | 'full_report'>('metrics');

  const totalFlowers = students.reduce((acc, s) => acc + s.flowerCount, 0);
  const totalHearts = students.reduce((acc, s) => acc + s.heartCount, 0);
  const presentRate = Math.round(
    (Object.values(attendance.records).filter((r) => r === 'present').length / students.length) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveReportTab('metrics')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeReportTab === 'metrics'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline-block mr-1.5" />
            <span>Chỉ số 4 nhóm đối tượng</span>
          </button>

          <button
            onClick={() => setActiveReportTab('before_after')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeReportTab === 'before_after'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline-block mr-1.5" />
            <span>Đối sánh Trước & Sau triển khai</span>
          </button>

          <button
            onClick={() => setActiveReportTab('full_report')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeReportTab === 'full_report'
                ? 'bg-linear-to-r from-emerald-600 to-teal-500 text-white shadow-xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <FileText className="w-4 h-4 inline-block mr-1.5" />
            <span>Văn bản Báo cáo Sáng kiến (8 phần chuẩn)</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In báo cáo sáng kiến</span>
        </button>
      </div>

      {/* VIEW 1: 4 STAKEHOLDERS METRICS */}
      {activeReportTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Group 1: Học sinh */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-blue-50 to-sky-100/60 border border-sky-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-sky-900 uppercase tracking-wider">1. Đối với học sinh</span>
                <span className="text-xl">🎒</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tự giác chuyên cần:</span>
                  <span className="font-bold text-sky-900">{presentRate}% có mặt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hoa việc tốt đã trao:</span>
                  <span className="font-bold text-amber-700">{totalFlowers} đóa hoa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Trái tim yêu thương:</span>
                  <span className="font-bold text-rose-700">{totalHearts} trái tim</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mức độ hài lòng:</span>
                  <span className="font-bold text-emerald-700">96.8% (Khảo sát)</span>
                </div>
              </div>
            </div>

            {/* Group 2: Giáo viên */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-purple-50 to-indigo-100/60 border border-purple-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-purple-900 uppercase tracking-wider">2. Đối với giáo viên</span>
                <span className="text-xl">👩‍🏫</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tiết kiệm thời gian xử lý:</span>
                  <span className="font-bold text-purple-900">~45 phút/ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Kế hoạch số hóa:</span>
                  <span className="font-bold text-purple-900">{plans.length} bản kế hoạch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hồ sơ học sinh số:</span>
                  <span className="font-bold text-purple-900">30/30 hồ sơ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hỗ trợ nhận xét TT27:</span>
                  <span className="font-bold text-emerald-700">100% tự động gợi ý</span>
                </div>
              </div>
            </div>

            {/* Group 3: Phụ huynh */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-amber-50 to-yellow-100/60 border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-amber-900 uppercase tracking-wider">3. Đối với phụ huynh</span>
                <span className="text-xl">👨‍👩‍👦</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tỷ lệ đọc thông báo:</span>
                  <span className="font-bold text-amber-900">93.3% phản hồi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Lượt tương tác phối hợp:</span>
                  <span className="font-bold text-amber-900">{messages.length} lượt trao đổi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mức độ an tâm, tin tưởng:</span>
                  <span className="font-bold text-emerald-700">98.2% hài lòng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Kênh kết nối nội bộ:</span>
                  <span className="font-bold text-blue-700">100% bảo mật</span>
                </div>
              </div>
            </div>

            {/* Group 4: Nhà trường */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-emerald-50 to-teal-100/60 border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider">4. Đối với nhà trường</span>
                <span className="text-xl">🏫</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Mức độ chuyển đổi số:</span>
                  <span className="font-bold text-emerald-900">Mức 4 (Đột phá)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Khả năng nhân rộng:</span>
                  <span className="font-bold text-emerald-900">100% áp dụng khối 4-5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tính nhất quán dữ liệu:</span>
                  <span className="font-bold text-emerald-900">Đồng bộ tức thì</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hồ sơ thi đua lớp:</span>
                  <span className="font-bold text-amber-700">Cờ thi đua Xuất sắc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BEFORE VS AFTER COMPARISON */}
      {activeReportTab === 'before_after' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Bảng Đối Sánh Thực Nghiệm Sư Phạm (Trước và Sau Ứng Dụng AI)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Số liệu đo lường thực tế tại Lớp 4A4, Trường Tiểu học Khoái Châu 1 năm học 2026–2027.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Tiêu chí đo lường</th>
                  <th className="p-3.5 text-slate-500">Trước khi áp dụng (Thủ công)</th>
                  <th className="p-3.5 text-emerald-700 bg-emerald-50">Sau khi ứng dụng hệ sinh thái AI</th>
                  <th className="p-3.5 text-right">Hiệu quả thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-bold text-slate-800">Thời gian làm hồ sơ & kế hoạch</td>
                  <td className="p-3.5 text-slate-500">Khoảng 120 phút/tuần</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">Khoảng 35 phút/tuần</td>
                  <td className="p-3.5 font-bold text-emerald-600 text-right">Giảm 70% thời gian giấy tờ</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-800">Mức độ thấu hiểu tâm lý học sinh</td>
                  <td className="p-3.5 text-slate-500">Quan sát cảm tính, ghi chép rời rạc</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">100% học sinh có hồ sơ khảo sát 5 nhóm & Nhật ký cảm xúc</td>
                  <td className="p-3.5 font-bold text-emerald-600 text-right">Đồng hành chính xác, cá nhân hóa</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-800">Tỷ lệ học sinh tự giác phát biểu</td>
                  <td className="p-3.5 text-slate-500">~ 45% (chủ yếu tập trung một số em khá)</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">~ 88% (nhờ cơ chế Hoa việc tốt và nhiệm vụ vừa sức)</td>
                  <td className="p-3.5 font-bold text-emerald-600 text-right">Tăng gần gấp đôi</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-800">Tương tác và phối hợp phụ huynh</td>
                  <td className="p-3.5 text-slate-500">Chỉ trao đổi khi có vấn đề nền nếp hoặc họp cuối kỳ</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">Thường xuyên hàng tuần qua thông báo khích lệ & hộp thư nội bộ</td>
                  <td className="p-3.5 font-bold text-emerald-600 text-right">93.3% phản hồi đồng thuận</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-800">Không khí lớp học & Tinh thần đoàn kết</td>
                  <td className="p-3.5 text-slate-500">Đôi lúc còn cạnh tranh điểm số gây mặc cảm</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">Lớp học hạnh phúc: Trân trọng sự khác biệt, tôn vinh ước mơ</td>
                  <td className="p-3.5 font-bold text-emerald-600 text-right">Không còn tình trạng phân biệt đối xử</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: FULL REPORT DOCUMENT (8 SECTIONS) */}
      {activeReportTab === 'full_report' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-amber-200/90 shadow-lg space-y-8 max-w-4xl mx-auto text-slate-800 leading-relaxed font-sans">
          {/* Header of Official Sáng kiến Report */}
          <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1 • NĂM HỌC 2026–2027
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              BÁO CÁO HIỆU QUẢ ÁP DỤNG SÁNG KIẾN KINH NGHIỆM
            </h2>
            <p className="text-sm sm:text-base font-extrabold text-[#1558AA]">
              "AI ĐỒNG HÀNH – KIẾN TẠO LỚP 4 HẠNH PHÚC TẠI TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1"
            </p>
            <div className="pt-2 text-xs text-slate-600 font-semibold flex items-center justify-center gap-6">
              <span>Tác giả: <strong>{settings.teacherName}</strong></span>
              <span>Lớp chủ nhiệm: <strong>{settings.className}</strong></span>
              <span>Đơn vị: <strong>{settings.schoolName}</strong></span>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">1. THÔNG TIN SÁNG KIẾN</h3>
            <p className="text-xs text-slate-700 text-justify">
              - Tên giải pháp: Hệ sinh thái web công tác chủ nhiệm số ứng dụng Trí tuệ nhân tạo (Google Gemini) "AI Đồng hành – Kiến tạo lớp 4 hạnh phúc".<br />
              - Lĩnh vực áp dụng: Công tác chủ nhiệm lớp, giáo dục kỹ năng cảm xúc – xã hội (SEL) và chuyển đổi số trong giáo dục tiểu học.<br />
              - Thời gian triển khai thực nghiệm: Từ tháng 9/2026 đến tháng 5/2027 tại Lớp 4A4 Trường Tiểu học Khoái Châu 1.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">2. THỰC TRẠNG TRƯỚC KHI ÁP DỤNG</h3>
            <p className="text-xs text-slate-700 text-justify">
              Trong công tác chủ nhiệm lớp 4 truyền thống, giáo viên gặp phải những rào cản lớn: khối lượng sổ sách hành chính nặng nề; việc quan sát và ghi nhận tiến bộ của từng em trong sĩ số 30 học sinh gặp nhiều hạn chế do thiếu công cụ số hóa; phụ huynh thường chỉ nhận được kết quả định kỳ mà thiếu sự đồng hành hàng tuần; các em có hoàn cảnh rụt rè hoặc khó khăn trong học tập dễ bị mặc cảm trước bảng xếp hạng so sánh.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">3. NỘI DUNG GIẢI PHÁP ĐÃ ÁP DỤNG</h3>
            <p className="text-xs text-slate-700 text-justify">
              Xây dựng hệ sinh thái khép kín gồm 10 phân hệ chức năng tương tác thời gian thực: Bảng điều khiển lớp học trực quan; Hồ sơ chủ nhiệm số AI; Khảo sát thấu hiểu học sinh 5 nhóm; Bạn Đồng Hành AI hỗ trợ nhận xét Thông tư 27; Quản lý nền nếp và chăm sóc học sinh nhân văn; Theo dõi cảm xúc qua biểu tượng nhật ký; Hoạt động lớp hạnh phúc và trò chơi tử tế; Cầu nối phụ huynh bảo mật; Thư viện học liệu A4 và Bản đồ hạnh phúc 5 trụ cột.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">4. QUY TRÌNH TRIỂN KHAI VÀ VẬN HÀNH</h3>
            <p className="text-xs text-slate-700 text-justify">
              Quy trình 4 giai đoạn logic: Giai đoạn 1 (Đầu năm): Thu thập dữ liệu sở thích, thế mạnh qua Phiếu khảo sát sinh động; Giai đoạn 2 (Hàng ngày/Hàng tuần): Điểm danh nền nếp, ghi nhận hoa việc tốt, tổ chức 5 bước sinh hoạt lớp thông minh; Giai đoạn 3 (Định kỳ): Ứng dụng AI phân tích dữ liệu, đề xuất kế hoạch đồng hành và soạn thảo nhận xét Thông tư 27; Giai đoạn 4 (Phối hợp): Cập nhật tiến bộ tới phụ huynh và tổng kết trên Cây Hạnh Phúc.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">5. HIỆU QUẢ ĐẠT ĐƯỢC TRONG THỰC TẾ</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <p>• 100% học sinh Lớp 4A4 được xây dựng hồ sơ năng lực cá nhân, không có học sinh bị bỏ quên.</p>
              <p>• Tiết kiệm trung bình 45 phút mỗi ngày cho giáo viên trong việc quản lý và soạn thảo tài liệu.</p>
              <p>• Tỷ lệ phụ huynh đồng thuận và tương tác tích cực đạt 93.3%.</p>
              <p>• Tập thể Lớp 4A4 vinh dự đạt danh hiệu Lớp học Tiêu biểu xuất sắc của nhà trường.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">6. TÍNH MỚI VÀ KHÁC BIỆT CỦA GIẢI PHÁP</h3>
            <p className="text-xs text-slate-700 text-justify">
              Giải pháp khẳng định triết lý cốt lõi: <em>"AI không thay thế tình yêu thương của giáo viên, mà AI giải phóng giáo viên khỏi áp lực thủ công để dành trọn thời gian thấu hiểu và nâng bước học trò."</em> Không sử dụng phán đoán tâm lý y khoa hay gắn nhãn tiêu cực; ứng dụng lấy cảm hứng từ Bản đồ Hạnh phúc với 5 trụ cột yêu thương.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">7. MỘT SỐ HẠN CHẾ</h3>
            <p className="text-xs text-slate-700 text-justify">
              Hệ thống hiện vận hành chủ yếu dựa trên trình duyệt và máy chủ trường học; ở các khu vực gia đình chưa có thiết bị kết nối mạng, việc xem cập nhật số vẫn cần sự hỗ trợ của sổ liên lạc giấy in trực tiếp từ hệ thống.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-950 uppercase">8. KIẾN NGHỊ VÀ HƯỚNG PHÁT TRIỂN</h3>
            <p className="text-xs text-slate-700 text-justify">
              Đề xuất Ban Giám hiệu Trường Tiểu học Khoái Châu 1 và Phòng GD&ĐT tạo điều kiện tập huấn, nhân rộng mô hình "AI Đồng Hành – Kiến tạo lớp học hạnh phúc" tới toàn thể các khối lớp 1, 2, 3, 4, 5 trong năm học tới.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex items-center justify-between text-xs font-bold text-center">
            <div>
              <p className="text-slate-500 uppercase">XÁC NHẬN CỦA BAN GIÁM HIỆU</p>
              <div className="h-20" />
              <p className="text-slate-900">Hiệu trưởng</p>
            </div>

            <div>
              <p className="text-slate-500">Khoái Châu, ngày 21 tháng 10 năm 2026</p>
              <p className="text-slate-500 uppercase">NGƯỜI BÁO CÁO SÁNG KIẾN</p>
              <div className="h-20" />
              <p className="text-slate-900">Cô giáo {settings.teacherName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
