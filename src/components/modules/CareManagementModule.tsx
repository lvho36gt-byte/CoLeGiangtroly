import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  HeartHandshake,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Calendar,
  Smile,
  Heart,
  Plus,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { callGemini } from '../../services/geminiService';

export const CareManagementModule: React.FC = () => {
  const {
    students,
    attendance,
    updateAttendanceStatus,
    markAllPresent,
    setSelectedStudentForModal,
    updateStudent,
    showToast,
  } = useApp();

  const [activeArea, setActiveArea] = useState<'discipline' | 'care'>('discipline');
  const [selectedStudentForCare, setSelectedStudentForCare] = useState<Student | null>(null);
  const [lifeSkillAdvice, setLifeSkillAdvice] = useState<string | null>(null);
  const [isAdvising, setIsAdvising] = useState(false);

  // Quick intervention note
  const [interventionNote, setInterventionNote] = useState('');

  const presentCount = Object.values(attendance.records).filter((r) => r === 'present').length;
  const lateCount = Object.values(attendance.records).filter((r) => r === 'late').length;
  const absentExcusedCount = Object.values(attendance.records).filter((r) => r === 'absent_excused').length;
  const absentUnexcusedCount = Object.values(attendance.records).filter((r) => r === 'absent_unexcused').length;

  const attentionStudents = students.filter((s) => s.needsAttention);

  const handleToggleAttention = (student: Student) => {
    const updated = !student.needsAttention;
    updateStudent(student.id, {
      needsAttention: updated,
      attentionReason: updated ? 'Có dấu hiệu cần tìm hiểu thêm' : undefined,
    });
    showToast(
      updated
        ? `Đã thêm em ${student.name} vào danh sách đồng hành đặc biệt.`
        : `Đã hoàn tất hỗ trợ cho em ${student.name}.`,
      'info'
    );
  };

  const handleGetLifeSkillSuggestion = async (student: Student) => {
    setIsAdvising(true);
    setLifeSkillAdvice(null);
    setSelectedStudentForCare(student);

    try {
      const res = await callGemini(
        `Hãy gợi ý 3 hoạt động rèn luyện kỹ năng sống tích cực, nhẹ nhàng và khích lệ cho học sinh tiểu học lớp 4:
Tên: ${student.name}
Biểu hiện cần quan tâm: "${student.attentionReason || student.challenges.join(', ')}"
Thế mạnh sẵn có: "${student.strengths.join(', ')}"
Mục tiêu: Giúp em tự tin hòa đồng mà không làm tổn thương lòng tự trọng.`
      );
      if (res.isAvailable && res.text) {
        setLifeSkillAdvice(res.text);
      } else {
        setLifeSkillAdvice(
          res.message ||
            'Chưa kết nối AI: Hệ thống máy chủ chưa cấu hình GEMINI_API_KEY. Bạn có thể sử dụng các bài tập kỹ năng sống trong Thư viện học liệu.'
        );
      }
    } catch {
      setLifeSkillAdvice('Lỗi kết nối khi gọi AI.');
    } finally {
      setIsAdvising(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveArea('discipline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeArea === 'discipline'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Khu vực A: Quản lý Nền nếp & Điểm danh</span>
          </button>

          <button
            onClick={() => setActiveArea('care')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeArea === 'care'
                ? 'bg-linear-to-r from-rose-600 to-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Khu vực B: Chăm sóc & Đồng hành ({attentionStudents.length})</span>
          </button>
        </div>

        {activeArea === 'discipline' && (
          <button
            onClick={markAllPresent}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            ✓ Đánh dấu tất cả có mặt
          </button>
        )}
      </div>

      {/* AREA A: NỀN NẾP & ĐIỂM DANH */}
      {activeArea === 'discipline' && (
        <div className="space-y-6">
          {/* Quick Attendance Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-800">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Có mặt
              </span>
              <span className="text-2xl font-black mt-2 block">{presentCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                Đi muộn
              </span>
              <span className="text-2xl font-black mt-2 block">{lateCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
              <span className="text-xs font-bold flex items-center gap-1.5 text-blue-800">
                <UserX className="w-4 h-4 text-blue-600" />
                Vắng có phép
              </span>
              <span className="text-2xl font-black mt-2 block">{absentExcusedCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
              <span className="text-xs font-bold flex items-center gap-1.5 text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Vắng không phép
              </span>
              <span className="text-2xl font-black mt-2 block">{absentUnexcusedCount}</span>
            </div>
          </div>

          {/* Interactive Attendance Table */}
          <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Điểm danh ngày: {attendance.date}</h3>
                <p className="text-xs text-slate-500">Nhấn vào trạng thái của từng học sinh để cập nhật ngay.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Mã HS</th>
                    <th className="p-3.5">Họ và tên</th>
                    <th className="p-3.5">Tổ</th>
                    <th className="p-3.5">Trạng thái điểm danh hôm nay</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => {
                    const status = attendance.records[s.id] || 'present';

                    return (
                      <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-500">{s.code}</td>
                        <td className="p-3.5 font-extrabold text-slate-900">
                          <button
                            onClick={() => setSelectedStudentForModal(s)}
                            className="hover:text-blue-700 text-left hover:underline"
                          >
                            {s.name}
                          </button>
                        </td>
                        <td className="p-3.5 text-slate-600">{s.group}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1 flex-wrap">
                            <button
                              onClick={() => updateAttendanceStatus(s.id, 'present')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                                status === 'present'
                                  ? 'bg-emerald-500 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Có mặt
                            </button>
                            <button
                              onClick={() => updateAttendanceStatus(s.id, 'late')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                                status === 'late'
                                  ? 'bg-amber-500 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Đi muộn
                            </button>
                            <button
                              onClick={() => updateAttendanceStatus(s.id, 'absent_excused')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                                status === 'absent_excused'
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Vắng có phép
                            </button>
                            <button
                              onClick={() => updateAttendanceStatus(s.id, 'absent_unexcused')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                                status === 'absent_unexcused'
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Không phép
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleToggleAttention(s)}
                            className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                              s.needsAttention
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                            }`}
                          >
                            {s.needsAttention ? 'Đang quan tâm ★' : '+ Quan tâm'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AREA B: CHĂM SÓC & HỖ TRỢ */}
      {activeArea === 'care' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-linear-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase">
                Nguyên tắc giáo dục nhân văn
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Kế Hoạch Nâng Đỡ & Đồng Hành Cá Nhân Hóa
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                "Có dấu hiệu cần tìm hiểu thêm" - Thay vì gắn nhãn tiêu cực, chúng ta mở ra những cơ hội để lắng nghe, tìm hiểu nguyên nhân gốc rễ và cùng gia đình nâng đỡ từng bước tiến nhỏ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Students needing attention */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                <span>Danh sách học sinh cần đồng hành ({attentionStudents.length})</span>
              </h4>

              {attentionStudents.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    selectedStudentForCare?.id === s.id
                      ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedStudentForCare(s)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl ${s.avatarColor} text-white font-bold flex items-center justify-center text-sm`}>
                        {s.name.charAt(s.name.lastIndexOf(' ') + 1)}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{s.name}</h5>
                        <span className="text-[11px] text-slate-500">{s.code} • {s.group}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetLifeSkillSuggestion(s);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI gợi ý</span>
                    </button>
                  </div>

                  <p className="mt-2.5 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed font-medium">
                    ⚠️ {s.attentionReason || 'Có dấu hiệu cần thêm sự khích lệ và đồng hành.'}
                  </p>
                </div>
              ))}

              {attentionStudents.length === 0 && (
                <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <Smile className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Tất cả học sinh đều đang tiến bộ tích cực!</p>
                </div>
              )}
            </div>

            {/* Right: Care plan & AI Life Skills Advice */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
              {selectedStudentForCare ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        Kế hoạch hỗ trợ cho em: {selectedStudentForCare.name}
                      </h4>
                      <p className="text-xs text-slate-500">Phụ huynh: {selectedStudentForCare.parentName} ({selectedStudentForCare.parentPhone})</p>
                    </div>
                    <button
                      onClick={() => handleToggleAttention(selectedStudentForCare)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200"
                    >
                      ✓ Hoàn tất hỗ trợ
                    </button>
                  </div>

                  {/* AI Advice Box */}
                  <div className="p-4 rounded-2xl bg-linear-to-br from-purple-50 via-pink-50 to-amber-50 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>Gợi ý biện pháp sư phạm & Kỹ năng sống từ AI</span>
                      </span>
                      <button
                        onClick={() => handleGetLifeSkillSuggestion(selectedStudentForCare)}
                        disabled={isAdvising}
                        className="text-xs font-bold text-purple-700 hover:underline disabled:opacity-50"
                      >
                        {isAdvising ? 'Đang tạo...' : 'Tạo mới'}
                      </button>
                    </div>

                    {lifeSkillAdvice ? (
                      <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line bg-white/90 p-3 rounded-xl border border-purple-100 font-medium">
                        {lifeSkillAdvice}
                      </p>
                    ) : (
                      <p className="text-xs text-purple-900/70 italic">
                        Nhấn nút "AI gợi ý" để AI Bạn Đồng Hành phân tích và đưa ra kế hoạch hỗ trợ 3 bước phù hợp nhất với tâm lý của em {selectedStudentForCare.name}.
                      </p>
                    )}
                  </div>

                  {/* Teacher Support Log */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                      Nhật ký đồng hành của cô giáo:
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>Tuần này</span>
                          <span className="font-semibold text-emerald-600">Đang thực hiện</span>
                        </div>
                        <p className="text-slate-800 mt-1 font-medium">
                          Trò chuyện thân mật riêng 5 phút sau giờ ra chơi. Phân công nhiệm vụ nhóm nhỏ để em dễ hòa nhập.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">Chọn một học sinh bên trái để xem kế hoạch hỗ trợ cá nhân hóa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
