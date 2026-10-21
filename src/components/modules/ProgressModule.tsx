import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmotionType, Student } from '../../types';
import {
  TrendingUp,
  Smile,
  Sparkles,
  Heart,
  Award,
  BookOpen,
  Calendar,
  Send,
  HelpCircle,
  Clock,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { callGemini } from '../../services/geminiService';

export const ProgressModule: React.FC = () => {
  const { students, emotions, logEmotion, showToast } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'hs-01');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('happy');
  const [reflectionText, setReflectionText] = useState('');
  const [aiNextStep, setAiNextStep] = useState<string | null>(null);
  const [isGeneratingNextStep, setIsGeneratingNextStep] = useState(false);

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const studentEmotions = emotions.filter((e) => e.studentId === selectedStudentId);

  const emotionButtons: { type: EmotionType; label: string; icon: string; color: string }[] = [
    { type: 'happy', label: 'Vui vẻ', icon: '😊', color: 'hover:bg-emerald-100 border-emerald-300' },
    { type: 'peaceful', label: 'Bình yên', icon: '😌', color: 'hover:bg-sky-100 border-sky-300' },
    { type: 'neutral', label: 'Bình thường', icon: '😐', color: 'hover:bg-slate-100 border-slate-300' },
    { type: 'worried', label: 'Lo lắng', icon: '😟', color: 'hover:bg-amber-100 border-amber-300' },
    { type: 'sad', label: 'Buồn', icon: '😢', color: 'hover:bg-rose-100 border-rose-300' },
  ];

  const handleLogEmotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    logEmotion({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      emotion: selectedEmotion,
      reflection: reflectionText.trim() || undefined,
    });

    setReflectionText('');
  };

  const handleGenerateNextStep = async () => {
    if (!currentStudent) return;
    setIsGeneratingNextStep(true);
    setAiNextStep(null);

    try {
      const res = await callGemini(
        `Hãy đóng vai chuyên gia giáo dục tích cực, đề xuất 3 "BƯỚC TIẾN TIẾP THEO VỪA SỨC" cho học sinh tiểu học lớp 4:
Học sinh: ${currentStudent.name} (${currentStudent.gender})
Sở trường: ${currentStudent.strengths.join(', ')}
Mục tiêu hiện tại: ${currentStudent.goals}
Điểm cần rèn luyện: ${currentStudent.challenges.join(', ')}

Yêu cầu:
- Tuyệt đối khích lệ, tạo cảm hứng, tôn vinh sự tiến bộ của chính bản thân em.
- Các bước tiến thực tế, có thể làm ngay trong tuần này tại trường hoặc ở nhà.
- Kèm theo 1 lời nhắn động viên ấm áp từ cô giáo chủ nhiệm.`
      );

      if (res.isAvailable && res.text) {
        setAiNextStep(res.text);
      } else {
        setAiNextStep(
          res.message ||
            'Chưa kết nối AI: Hệ thống máy chủ chưa cấu hình GEMINI_API_KEY. Bạn vẫn có thể xem các gợi ý bước tiến trong hồ sơ học sinh.'
        );
      }
    } catch {
      setAiNextStep('Lỗi kết nối khi gọi AI gợi ý.');
    } finally {
      setIsGeneratingNextStep(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Picker Bar */}
      <div className="bg-white p-4 rounded-3xl border border-amber-200/90 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Hồ Sơ Phát Triển & Nhật Ký Cảm Xúc Cá Nhân</span>
          </h2>
          <p className="text-xs text-slate-500">
            Theo dõi sự tiến bộ của chính học sinh theo thời gian, tuyệt đối không xếp hạng so sánh gây tổn thương.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Xem học sinh:</span>
          <select
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-sky-500"
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setAiNextStep(null);
            }}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name} ({s.group})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Emotion Diary Check-in (Học sinh điểm danh cảm xúc) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Smile className="w-5 h-5 text-amber-500" />
                <span>Nhật Ký Cảm Xúc Hôm Nay</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Tự nguyện & Bảo mật
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hôm nay em cảm thấy thế nào? Hãy chọn một biểu tượng và chia sẻ tâm sự cùng cô giáo nhé!
            </p>

            <form onSubmit={handleLogEmotion} className="space-y-4 pt-1">
              <div className="grid grid-cols-5 gap-2">
                {emotionButtons.map((btn) => (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => setSelectedEmotion(btn.type)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedEmotion === btn.type
                        ? 'bg-amber-100 border-amber-400 shadow-sm scale-105'
                        : `bg-slate-50 border-slate-200 ${btn.color}`
                    }`}
                  >
                    <span className="text-2xl block">{btn.icon}</span>
                    <span className="text-[10px] font-bold text-slate-700 block mt-1">{btn.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Hôm nay em muốn chia sẻ điều gì với cô giáo? (Tự nguyện)</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Hôm nay em vui vì làm xong bài toán sớm... hoặc Em hơi lo vì bài vẽ chưa hoàn thành..."
                  className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 leading-relaxed"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi cảm xúc đến cô giáo</span>
              </button>
            </form>

            {/* Emotion History */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lịch sử cảm xúc của em {currentStudent.name}:
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {studentEmotions.map((e) => (
                  <div key={e.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2">
                    <span className="text-lg">
                      {e.emotion === 'happy' ? '😊' : e.emotion === 'peaceful' ? '😌' : e.emotion === 'neutral' ? '😐' : e.emotion === 'worried' ? '😟' : '😢'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="capitalize">{e.emotion}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{e.date}</span>
                      </div>
                      {e.reflection && (
                        <p className="mt-0.5 text-slate-600 italic">"{e.reflection}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Multi-dimensional Progress + AI Next Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* 6 Dimensions Card */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Biểu đồ Tiến bộ Toàn diện: {currentStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">6 trụ cột năng lực & phẩm chất cốt lõi</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-amber-600">🌸 {currentStudent.flowerCount} Hoa</span>
                  <span className="text-rose-600">❤️ {currentStudent.heartCount} Tim</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { key: 'learning', label: '1. Học tập & Nhận thức', score: currentStudent.progressScores.learning, color: 'bg-blue-500' },
                  { key: 'qualities', label: '2. Phẩm chất (Chăm chỉ, Trung thực, Nhân ái)', score: currentStudent.progressScores.qualities, color: 'bg-emerald-500' },
                  { key: 'capabilities', label: '3. Năng lực chung & Tự chủ', score: currentStudent.progressScores.capabilities, color: 'bg-purple-500' },
                  { key: 'teamwork', label: '4. Kỹ năng hợp tác & Làm việc nhóm', score: currentStudent.progressScores.teamwork, color: 'bg-amber-500' },
                  { key: 'responsibility', label: '5. Tinh thần trách nhiệm', score: currentStudent.progressScores.responsibility, color: 'bg-rose-500' },
                  { key: 'activities', label: '6. Tham gia hoạt động tập thể', score: currentStudent.progressScores.activities, color: 'bg-teal-500' },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{item.label}</span>
                      <span className="font-black text-slate-900">{item.score}/10</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-700`}
                        style={{ width: `${item.score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Next Steps Generator */}
            <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-3xl border border-indigo-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase">
                    Tính năng đặc biệt
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base mt-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span>AI Gợi Ý Bước Tiến Tiếp Theo</span>
                  </h4>
                </div>
                <button
                  onClick={handleGenerateNextStep}
                  disabled={isGeneratingNextStep}
                  className="px-4 py-2 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingNextStep ? 'AI đang đề xuất...' : 'AI gợi ý bước tiến tiếp theo'}</span>
                </button>
              </div>

              {aiNextStep ? (
                <div className="p-4 rounded-2xl bg-white border border-indigo-100 text-xs leading-relaxed text-slate-800 whitespace-pre-line shadow-xs font-medium">
                  {aiNextStep}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 italic">Nhiệm vụ vừa sức giúp em tiến bộ mỗi ngày</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiNextStep);
                        showToast('Đã sao chép gợi ý bước tiến tiếp theo!', 'success');
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs"
                    >
                      Sao chép
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-indigo-900/70 italic leading-relaxed">
                  Nhấn nút trên để AI Bạn Đồng Hành phân tích các mốc tiến bộ hiện tại của em {currentStudent.name} và đề xuất 3 nhiệm vụ vừa sức nhằm động viên em tự tin vươn lên.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
