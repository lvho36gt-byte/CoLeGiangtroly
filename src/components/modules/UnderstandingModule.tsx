import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SurveyResponse, Student } from '../../types';
import {
  BrainCircuit,
  Sparkles,
  Heart,
  Smile,
  HelpCircle,
  Users,
  Target,
  FileCheck,
  Send,
  Printer,
  Copy,
  BookOpen,
  Compass,
} from 'lucide-react';
import { analyzeStudentSurvey } from '../../services/geminiService';

export const UnderstandingModule: React.FC = () => {
  const { students, surveys, submitSurvey, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'survey_form' | 'class_overview' | 'ai_report'>('class_overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'hs-01');

  // Survey Form inputs
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [favoriteActivity, setFavoriteActivity] = useState('');
  const [feelHappyWhen, setFeelHappyWhen] = useState('');

  // AI analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReportText, setAiReportText] = useState<string | null>(null);

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const currentSurvey = surveys.find((s) => s.studentId === selectedStudentId);

  const handleSelectStudentForSurvey = (id: string) => {
    setSelectedStudentId(id);
    const existing = surveys.find((s) => s.studentId === id);
    if (existing) {
      setQ1(existing.q1_hobbiesAndDreams);
      setQ2(existing.q2_myStrengths);
      setQ3(existing.q3_myDifficulties);
      setQ4(existing.q4_desiredEnvironment);
      setQ5(existing.q5_trustedPerson);
      setFavoriteActivity(existing.favoriteActivity || '');
      setFeelHappyWhen(existing.feelHappyWhen || '');
    } else {
      setQ1('');
      setQ2('');
      setQ3('');
      setQ4('');
      setQ5('');
      setFavoriteActivity('');
      setFeelHappyWhen('');
    }
    setAiReportText(null);
  };

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    submitSurvey({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      q1_hobbiesAndDreams: q1,
      q2_myStrengths: q2,
      q3_myDifficulties: q3,
      q4_desiredEnvironment: q4,
      q5_trustedPerson: q5,
      favoriteActivity: favoriteActivity || 'Hoạt động nhóm và thể thao',
      feelHappyWhen: feelHappyWhen || 'Được cô giáo và các bạn khen ngợi',
    });

    setActiveSubTab('class_overview');
  };

  const handleRunAiEmpathyAnalysis = async () => {
    if (!currentStudent) return;
    setAnalyzing(true);
    setAiReportText(null);
    setActiveSubTab('ai_report');

    const surveyDataToAnalyze = currentSurvey || {
      q1_hobbiesAndDreams: q1 || currentStudent.hobbies.join(', ') + ' - Ước mơ: ' + currentStudent.dream,
      q2_myStrengths: q2 || currentStudent.strengths.join(', '),
      q3_myDifficulties: q3 || currentStudent.challenges.join(', '),
      q4_desiredEnvironment: q4 || 'Lớp học vui vẻ, ấm áp, nhiều trò chơi',
      q5_trustedPerson: q5 || 'Cô giáo chủ nhiệm Lê Thị Giang',
      favoriteActivity: favoriteActivity || 'Hoạt động trải nghiệm sáng tạo',
      feelHappyWhen: feelHappyWhen || 'Khi được bạn bè và cô giáo động viên',
    };

    try {
      const res = await analyzeStudentSurvey(surveyDataToAnalyze, currentStudent.name);
      if (res.isAvailable && res.text) {
        setAiReportText(res.text);
      } else {
        setAiReportText(
          res.message ||
            'Chưa kết nối AI: Hệ thống máy chủ chưa được cấu hình GEMINI_API_KEY. Vui lòng kiểm tra lại thiết lập.'
        );
      }
    } catch {
      setAiReportText('Lỗi kết nối khi gọi AI phân tích.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('class_overview')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === 'class_overview'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 inline-block mr-1.5" />
            <span>Bức tranh Thấu hiểu Lớp 4A4 ({surveys.length}/{students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('survey_form')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === 'survey_form'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4 inline-block mr-1.5" />
            <span>Phiếu khảo sát 5 nhóm (Học sinh điền)</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('ai_report');
              if (!aiReportText && !analyzing) {
                handleRunAiEmpathyAnalysis();
              }
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === 'ai_report'
                ? 'bg-linear-to-r from-[#FF7A21] to-[#f59e0b] text-white shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-1.5" />
            <span>Báo cáo AI & Kế hoạch đồng hành</span>
          </button>
        </div>

        {/* Student picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Đang chọn:</span>
          <select
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
            value={selectedStudentId}
            onChange={(e) => handleSelectStudentForSurvey(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name} ({s.group})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: CLASS OVERVIEW (BỨC TRANH THẤU HIỂU LỚP HỌC) */}
      {activeSubTab === 'class_overview' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-sky-50 via-amber-50 to-emerald-50 border border-sky-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase">
                Trọng tâm Sư phạm Lớp 4
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                Bức Tranh Thấu Hiểu Tâm Hồn & Nhu Cầu Lớp 4A4
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                Khảo sát đầu năm học sinh động theo 5 trụ cột phát triển cảm xúc – xã hội. Thông tin giúp cô giáo thiết kế hoạt động trải nghiệm phù hợp, không phán xét, không dán nhãn tiêu cực.
              </p>
            </div>

            <button
              onClick={handleRunAiEmpathyAnalysis}
              className="px-5 py-3 rounded-2xl bg-linear-to-r from-[#FF7A21] to-[#f59e0b] hover:from-[#e56816] hover:to-[#d97706] text-white font-black text-xs shadow-md flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI phân tích & đề xuất kế hoạch đồng hành</span>
            </button>
          </div>

          {/* 5 pillars summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                <Smile className="w-4 h-4 text-sky-500" />
                <span>1. Sở thích & Ước mơ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đa dạng: Vẽ tranh (38%), Lắp ráp lego & STEM (32%), Thể thao bóng đá (25%), Âm nhạc múa hát (22%).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>2. Điểm mạnh bản thân</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhiệt tình giúp bạn (65%), Khéo tay (48%), Chữ viết cẩn thận (42%), Tinh thần trách nhiệm cao (55%).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>3. Điều thấy khó khăn</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ngại phát biểu trước đám đông (28%), Lo lắng trước bài kiểm tra (20%), Khó khăn bài toán hình có lời văn (18%).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                <Heart className="w-4 h-4 text-purple-500" />
                <span>4. Môi trường mong muốn</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lớp học vui vẻ, không bị chê cười khi nói sai (95%), Nhiều hoạt động trò chơi nhóm (88%).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <Users className="w-4 h-4 text-rose-500" />
                <span>5. Người muốn chia sẻ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cô giáo chủ nhiệm (84%), Bố mẹ (78%), Bạn thân trong tổ (60%).
              </p>
            </div>
          </div>

          {/* List of completed surveys */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
              <span>Danh sách phiếu khảo sát đã ghi nhận ({surveys.length})</span>
              <button
                onClick={() => setActiveSubTab('survey_form')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                + Điền phiếu khảo sát mới
              </button>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surveys.map((sur) => (
                <div key={sur.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-sm">{sur.studentName}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{sur.date}</span>
                  </div>
                  <p><strong className="text-slate-700">Sở thích & Ước mơ:</strong> {sur.q1_hobbiesAndDreams}</p>
                  <p><strong className="text-slate-700">Điểm mạnh tự tin:</strong> {sur.q2_myStrengths}</p>
                  <p><strong className="text-slate-700">Khó khăn cần cô giúp:</strong> {sur.q3_myDifficulties}</p>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500 italic">"{sur.feelHappyWhen}"</span>
                    <button
                      onClick={() => {
                        setSelectedStudentId(sur.studentId);
                        handleRunAiEmpathyAnalysis();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold transition-colors"
                    >
                      AI phân tích em này →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GRADE 4 INTERACTIVE SURVEY FORM */}
      {activeSubTab === 'survey_form' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-200/90 shadow-md space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 uppercase">
              Phiếu Khảo Sát Đầu Năm Học Lớp 4
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              "EM LÀ AI – ĐIỀU EM MONG MUỐN Ở LỚP 4A4?"
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Các em học sinh thân yêu hãy chia sẻ những điều thật lòng nhất cùng cô giáo nhé! Mọi câu trả lời của em đều là điều quý giá.
            </p>
          </div>

          {currentStudent && (
            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${currentStudent.avatarColor} text-white font-bold flex items-center justify-center shrink-0`}>
                {currentStudent.name.charAt(currentStudent.name.lastIndexOf(' ') + 1)}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900">{currentStudent.name}</span>
                <span className="text-slate-500 block">{currentStudent.code} • {currentStudent.group}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveSurvey} className="space-y-5 text-xs">
            {/* Nhóm 1 */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <span>🌟 Nhóm 1: Sở thích và ước mơ của em</span>
              </label>
              <p className="text-slate-500 text-[11px]">Em thích làm gì nhất vào thời gian rảnh rỗi? Khi lớn lên em mong muốn làm công việc gì?</p>
              <textarea
                rows={2}
                className="w-full p-3 rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500"
                placeholder="Ví dụ: Em thích đọc sách khoa học và ước mơ chế tạo rô-bốt..."
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                required
              />
            </div>

            {/* Nhóm 2 */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <span>💪 Nhóm 2: Điểm mạnh tự tin nhất của bản thân em</span>
              </label>
              <p className="text-slate-500 text-[11px]">Em cảm thấy tự tin nhất khi làm việc gì? Em có đức tính hay khả năng gì nổi bật?</p>
              <textarea
                rows={2}
                className="w-full p-3 rounded-xl border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="Ví dụ: Em tính toán nhanh, cẩn thận và thích giúp đỡ bạn bè..."
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                required
              />
            </div>

            {/* Nhóm 3 */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <span>🌱 Nhóm 3: Những điều em cảm thấy khó khăn</span>
              </label>
              <p className="text-slate-500 text-[11px]">Môn học hay hoạt động nào khiến em lo lắng? Em muốn cô giáo hỗ trợ điều gì nhất?</p>
              <textarea
                rows={2}
                className="w-full p-3 rounded-xl border border-rose-300 bg-white focus:ring-2 focus:ring-rose-500"
                placeholder="Ví dụ: Em hơi rụt rè khi phát biểu trước lớp, em sợ nói chưa đúng..."
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                required
              />
            </div>

            {/* Nhóm 4 */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-2">
              <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <span>🏫 Nhóm 4: Môi trường học tập mà em mong muốn</span>
              </label>
              <p className="text-slate-500 text-[11px]">Một lớp học như thế nào sẽ khiến em cảm thấy hạnh phúc nhất mỗi ngày đến trường?</p>
              <textarea
                rows={2}
                className="w-full p-3 rounded-xl border border-sky-300 bg-white focus:ring-2 focus:ring-sky-500"
                placeholder="Ví dụ: Lớp học vui vẻ, mọi người đoàn kết, không ai trêu chọc nhau..."
                value={q4}
                onChange={(e) => setQ4(e.target.value)}
                required
              />
            </div>

            {/* Nhóm 5 */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
              <label className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <span>🤝 Nhóm 5: Người mà em muốn chia sẻ khi cần giúp đỡ</span>
              </label>
              <p className="text-slate-500 text-[11px]">Khi gặp chuyện buồn hoặc khó khăn, ai là người em tin tưởng nhất để tâm sự?</p>
              <textarea
                rows={2}
                className="w-full p-3 rounded-xl border border-purple-300 bg-white focus:ring-2 focus:ring-purple-500"
                placeholder="Ví dụ: Cô giáo chủ nhiệm Lê Thị Giang và bạn thân cùng tổ..."
                value={q5}
                onChange={(e) => setQ5(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveSubTab('class_overview')}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Lưu phiếu khảo sát</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: AI PEDAGOGICAL EMPATHY REPORT */}
      {activeSubTab === 'ai_report' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-linear-to-r from-orange-400 to-amber-500 text-white text-xs font-bold uppercase">
                  Báo cáo Phân tích Sư phạm & Đồng hành Cá nhân hóa
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Kế hoạch Đồng Hành Cho Học Sinh: {currentStudent?.name} ({currentStudent?.code})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Được tạo bởi AI Bạn Đồng Hành dựa trên dữ liệu phiếu khảo sát và quan sát thực tế.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAiEmpathyAnalysis}
                  disabled={analyzing}
                  className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analyzing ? 'Đang phân tích...' : 'Phân tích lại'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                  title="In báo cáo"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Report Body */}
            {analyzing ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">AI đang thấu hiểu và lập kế hoạch sư phạm...</h4>
                <p className="text-xs text-slate-500">Đang phân tích thế mạnh, khó khăn và thiết kế giải pháp đồng hành tích cực.</p>
              </div>
            ) : aiReportText ? (
              <div className="p-6 rounded-2xl bg-[#FFFDF5] border border-amber-200/80 text-xs leading-relaxed text-slate-800 whitespace-pre-line shadow-xs font-medium space-y-4">
                {aiReportText}

                <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between flex-wrap gap-2 text-slate-500 text-[11px]">
                  <span className="italic">
                    * Lưu ý sư phạm: Phân tích của AI là gợi ý tham khảo; cô giáo chủ nhiệm là người quyết định cuối cùng.
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiReportText);
                      showToast('Đã sao chép báo cáo kế hoạch đồng hành!', 'success');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép toàn bộ báo cáo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 italic">
                Nhấn "Phân tích lại" để khởi động phân tích AI cho học sinh này.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
