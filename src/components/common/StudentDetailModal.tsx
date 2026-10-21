import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  X,
  Heart,
  Flower2,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Phone,
  User,
  Target,
  AlertCircle,
  Edit2,
  Save,
  CheckCircle2,
  Brain,
  Smile,
  Printer,
  Trash2,
} from 'lucide-react';
import { generateTT27Comments } from '../../services/geminiService';

export const StudentDetailModal: React.FC = () => {
  const {
    selectedStudentForModal,
    setSelectedStudentForModal,
    updateStudent,
    deleteStudent,
    surveys,
    goodDeeds,
    emotions,
    addGoodDeed,
    showToast,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Quick deed form inside modal
  const [deedTitle, setDeedTitle] = useState('');
  const [deedType, setDeedType] = useState<'flower' | 'heart'>('flower');
  const [showDeedInput, setShowDeedInput] = useState(false);

  if (!selectedStudentForModal) return null;
  const s = selectedStudentForModal;

  const startEdit = () => {
    setFormData({
      name: s.name,
      dob: s.dob,
      group: s.group,
      goals: s.goals,
      dream: s.dream,
      hobbies: [...s.hobbies],
      strengths: [...s.strengths],
      challenges: [...s.challenges],
      needsAttention: s.needsAttention,
      attentionReason: s.attentionReason || '',
      parentName: s.parentName,
      parentPhone: s.parentPhone,
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateStudent(s.id, formData);
    setIsEditing(false);
    // update current selected modal view
    setSelectedStudentForModal({ ...s, ...formData } as Student);
  };

  const studentSurvey = surveys.find((sur) => sur.studentId === s.id);
  const studentDeeds = goodDeeds.filter((d) => d.studentId === s.id);
  const studentEmotions = emotions.filter((e) => e.studentId === s.id);

  const handleQuickAddDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deedTitle.trim()) return;
    addGoodDeed({
      studentId: s.id,
      studentName: s.name,
      group: s.group,
      title: deedTitle.trim(),
      description: `Ghi nhận việc tốt tại lớp cho em ${s.name}`,
      type: deedType,
    });
    setDeedTitle('');
    setShowDeedInput(false);
    // update flower/heart locally in selected student
    setSelectedStudentForModal({
      ...s,
      flowerCount: deedType === 'flower' ? s.flowerCount + 1 : s.flowerCount,
      heartCount: deedType === 'heart' ? s.heartCount + 1 : s.heartCount,
    });
  };

  const handleAiComment = async () => {
    setAiGenerating(true);
    setAiSuggestion(null);
    try {
      const result = await generateTT27Comments(s, 'all');
      if (result.isAvailable && result.text) {
        setAiSuggestion(result.text);
      } else {
        setAiSuggestion(
          result.message ||
            'Chưa kết nối AI: Hệ thống máy chủ chưa được cấu hình GEMINI_API_KEY. Vui lòng kiểm tra cài đặt.'
        );
      }
    } catch {
      setAiSuggestion('Lỗi kết nối khi gọi AI. Vui lòng thử lại sau.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-amber-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600 p-6 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${s.avatarColor} border-3 border-white/80 shadow-md flex items-center justify-center text-white text-2xl font-black shrink-0`}>
                {s.name.charAt(s.name.lastIndexOf(' ') + 1) || s.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-extrabold tracking-tight">{s.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs border border-white/30">
                    {s.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xs">
                    {s.group}
                  </span>
                  {s.needsAttention && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Cần tìm hiểu thêm
                    </span>
                  )}
                </div>
                <p className="text-sky-100 text-sm mt-1 flex items-center gap-3">
                  <span>Giới tính: <strong>{s.gender}</strong></span>
                  <span>•</span>
                  <span>Ngày sinh: <strong>{s.dob}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors title='In hồ sơ'"
                title="In hồ sơ học sinh"
              >
                <Printer className="w-5 h-5" />
              </button>
              {!isEditing ? (
                <>
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Sửa hồ sơ
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Cô có chắc chắn muốn xóa học sinh ${s.name} (${s.code}) khỏi danh sách lớp 4A4 không?`)) {
                        deleteStudent(s.id);
                        setSelectedStudentForModal(null);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-sm font-semibold transition-colors shadow-xs"
                    title="Xóa học sinh này"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
              )}
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold">
              <Flower2 className="w-4 h-4 text-amber-300" />
              <span>{s.flowerCount} Hoa việc tốt</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold">
              <Heart className="w-4 h-4 text-pink-300" />
              <span>{s.heartCount} Trái tim yêu thương</span>
            </div>
            <div className="text-xs text-sky-100 italic truncate max-w-md">
              Ước mơ: "{s.dream || 'Chưa cập nhật'}"
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Attention banner if flagged */}
          {s.needsAttention && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Ghi chú quan tâm của giáo viên:</h4>
                <p className="text-sm mt-0.5 text-amber-800 leading-relaxed">
                  {s.attentionReason || 'Có dấu hiệu cần tìm hiểu thêm về cảm xúc hoặc thói quen học tập.'}
                </p>
              </div>
            </div>
          )}

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Sở thích & Thế mạnh */}
            <div className="p-5 rounded-2xl bg-[#FFFDF5] border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Năng khiếu, Sở thích & Điểm mạnh</span>
              </div>

              {!isEditing ? (
                <>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sở thích:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {s.hobbies.map((h, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm mạnh nổi bật:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {s.strengths.map((str, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-medium">
                          ✓ {str}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cần hỗ trợ / Thử thách:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {s.challenges.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-medium">
                          • {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600">Sở thích (ngăn cách bởi dấu phẩy):</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                      value={formData.hobbies?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hobbies: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Điểm mạnh (ngăn cách bởi dấu phẩy):</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                      value={formData.strengths?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          strengths: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Cần hỗ trợ (ngăn cách bởi dấu phẩy):</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                      value={formData.challenges?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          challenges: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Box 2: Mục tiêu & Gia đình */}
            <div className="p-5 rounded-2xl bg-[#FFFDF5] border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <Target className="w-5 h-5 text-indigo-600" />
                <span>Mục tiêu rèn luyện & Phối hợp gia đình</span>
              </div>

              {!isEditing ? (
                <>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mục tiêu phát triển:</span>
                    <p className="mt-1 text-sm bg-white p-3 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                      🎯 {s.goals || 'Chưa thiết lập mục tiêu'}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ước mơ của em:</span>
                    <p className="mt-1 text-sm bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 font-semibold flex items-center gap-2">
                      ⭐ {s.dream || 'Chưa ghi nhận'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thông tin phụ huynh:</span>
                    <div className="mt-2 text-sm space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Họ tên cha/mẹ: <strong>{s.parentName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>Điện thoại liên hệ: <strong>{s.parentPhone}</strong></span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600">Mục tiêu phát triển:</label>
                    <textarea
                      rows={2}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.goals || ''}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Ước mơ của học sinh:</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.dream || ''}
                      onChange={(e) => setFormData({ ...formData, dream: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Họ tên phụ huynh:</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.parentName || ''}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Radar / Progress Scores according to TT27 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Đánh giá sự tiến bộ toàn diện (Thang điểm tự đánh giá & theo dõi 1-10)
              </span>
              <span className="text-xs font-normal text-slate-500">Chuẩn Thông tư 27/2020/TT-BGDĐT</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Học tập', score: s.progressScores.learning, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { label: 'Phẩm chất', score: s.progressScores.qualities, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { label: 'Năng lực', score: s.progressScores.capabilities, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { label: 'Hợp tác nhóm', score: s.progressScores.teamwork, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                { label: 'Trách nhiệm', score: s.progressScores.responsibility, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                { label: 'Hoạt động', score: s.progressScores.activities, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border text-center ${item.color}`}>
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-2xl font-black mt-1 block">{item.score}</span>
                  <div className="w-full bg-black/10 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-current h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Survey responses if available */}
          {studentSurvey && (
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 shadow-xs">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm mb-3">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Phiếu khảo sát thấu hiểu học sinh (Ghi nhận đầu năm học)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="bg-white p-3 rounded-xl border border-sky-100">
                  <strong className="text-slate-600">Sở thích & Ước mơ:</strong>
                  <p className="mt-1 text-slate-800">{studentSurvey.q1_hobbiesAndDreams}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-sky-100">
                  <strong className="text-slate-600">Điểm mạnh tự tin nhất:</strong>
                  <p className="mt-1 text-slate-800">{studentSurvey.q2_myStrengths}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-sky-100">
                  <strong className="text-slate-600">Điều cảm thấy khó khăn:</strong>
                  <p className="mt-1 text-slate-800">{studentSurvey.q3_myDifficulties}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-sky-100">
                  <strong className="text-slate-600">Môi trường lớp học em mong muốn:</strong>
                  <p className="mt-1 text-slate-800">{studentSurvey.q4_desiredEnvironment}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Good Deed & Emotion Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Deeds */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-amber-500" />
                  Việc tốt đã ghi nhận ({studentDeeds.length})
                </h4>
                <button
                  onClick={() => setShowDeedInput(!showDeedInput)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition-colors"
                >
                  + Tặng hoa/tim
                </button>
              </div>

              {showDeedInput && (
                <form onSubmit={handleQuickAddDeed} className="p-3 mb-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2">
                  <input
                    type="text"
                    placeholder="Nhập hành động tốt của em..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                    value={deedTitle}
                    onChange={(e) => setDeedTitle(e.target.value)}
                    required
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          checked={deedType === 'flower'}
                          onChange={() => setDeedType('flower')}
                        />
                        <span>Bông hoa điểm tốt 🌸</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          checked={deedType === 'heart'}
                          onChange={() => setDeedType('heart')}
                        />
                        <span>Trái tim yêu thương ❤️</span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              )}

              {studentDeeds.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có ghi nhận việc tốt nào trong tuần.</p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {studentDeeds.map((d) => (
                    <div key={d.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2">
                      {d.type === 'flower' ? (
                        <Flower2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Heart className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>{d.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{d.date}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{d.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emotions */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Smile className="w-4 h-4 text-sky-500" />
                Lịch sử nhật ký cảm xúc
              </h4>
              {studentEmotions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có nhật ký cảm xúc nào được chia sẻ.</p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {studentEmotions.map((e) => {
                    const emoLabels: Record<string, { label: string; icon: string; bg: string }> = {
                      happy: { label: 'Vui vẻ', icon: '😊', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                      peaceful: { label: 'Bình yên', icon: '😌', bg: 'bg-sky-50 text-sky-800 border-sky-200' },
                      neutral: { label: 'Bình thường', icon: '😐', bg: 'bg-slate-50 text-slate-700 border-slate-200' },
                      worried: { label: 'Lo lắng', icon: '😟', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
                      sad: { label: 'Buồn', icon: '😢', bg: 'bg-rose-50 text-rose-800 border-rose-200' },
                    };
                    const emo = emoLabels[e.emotion] || emoLabels.happy;

                    return (
                      <div key={e.id} className={`p-2.5 rounded-xl border text-xs ${emo.bg}`}>
                        <div className="flex items-center justify-between font-semibold">
                          <span>{emo.icon} {emo.label}</span>
                          <span className="text-[10px] opacity-75 font-normal">{e.date}</span>
                        </div>
                        {e.reflection && (
                          <p className="mt-1 italic">"{e.reflection}"</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* AI Pedagogical Suggestion Box */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>Trợ lý AI: Gợi ý nhận xét & Kế hoạch đồng hành (Chuẩn Thông tư 27)</span>
              </div>
              <button
                onClick={handleAiComment}
                disabled={aiGenerating}
                className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {aiGenerating ? 'AI đang phân tích...' : 'AI phân tích & gợi ý'}
              </button>
            </div>

            {aiSuggestion ? (
              <div className="mt-3 p-4 rounded-xl bg-white border border-indigo-100 text-xs leading-relaxed text-slate-800 whitespace-pre-line shadow-xs">
                {aiSuggestion}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiSuggestion);
                      showToast('Đã sao chép nhận xét AI vào clipboard!', 'success');
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Sao chép nhận xét
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-indigo-900/70 italic">
                Nhấn "AI phân tích & gợi ý" để nhận nhận xét đánh giá định kỳ theo Thông tư 27 dựa trên năng lực và sở trường thực tế của em {s.name}.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Mã bảo mật nội bộ Lớp 4A4 • Dữ liệu lưu an toàn trên hệ sinh thái</span>
          <button
            onClick={() => setSelectedStudentForModal(null)}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
