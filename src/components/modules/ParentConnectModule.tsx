import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParentAnnouncement, ParentMessage, Student } from '../../types';
import {
  MessageCircle,
  Sparkles,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Heart,
  Flower2,
  Copy,
  Plus,
  Calendar,
  Phone,
  FileText,
  User,
  ShieldAlert,
} from 'lucide-react';
import { draftParentNotification } from '../../services/geminiService';

export const ParentConnectModule: React.FC = () => {
  const {
    students,
    announcements,
    addAnnouncement,
    acknowledgeAnnouncement,
    messages,
    sendParentMessage,
    replyParentMessage,
    currentParentStudentId,
    setCurrentParentStudentId,
    role,
    settings,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'announcements' | 'messages' | 'child_view' | 'ai_drafter'>('announcements');

  // AI announcement drafter state
  const [topic, setTopic] = useState('Khen ngợi học sinh tiến bộ trong tuần');
  const [details, setDetails] = useState('Tuần qua cả lớp đạt nhiều bông hoa điểm tốt, các con tự giác kê bàn ghế và đi học đúng giờ.');
  const [tone, setTone] = useState<'Ấm áp' | 'Trang trọng' | 'Ngắn gọn' | 'Khích lệ'>('Ấm áp');
  const [targetAudience, setTargetAudience] = useState<'Toàn thể lớp' | string>('Toàn thể lớp');
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  // Parent message input
  const [parentMsgInput, setParentMsgInput] = useState('');
  const [teacherReplyInput, setTeacherReplyInput] = useState<{ [id: string]: string }>({});

  const currentChild = students.find((s) => s.id === currentParentStudentId) || students[0];

  const handleDraftWithAi = async () => {
    setIsDrafting(true);
    setAiDraft(null);

    try {
      const res = await draftParentNotification(topic, details, tone);
      if (res.isAvailable && res.text) {
        setAiDraft(res.text);
      } else {
        setAiDraft(
          res.message ||
            'Chưa kết nối AI: Hệ thống máy chủ chưa cấu hình GEMINI_API_KEY. Bạn có thể sử dụng mẫu thông báo có sẵn.'
        );
      }
    } catch {
      setAiDraft('Lỗi kết nối khi gọi AI soạn thông báo.');
    } finally {
      setIsDrafting(false);
    }
  };

  const handlePublishDraft = () => {
    if (!aiDraft) return;

    addAnnouncement({
      title: topic,
      content: aiDraft,
      category: 'Khen ngợi',
      tone,
      targetAudience,
    });

    setActiveTab('announcements');
  };

  const handleSendParentMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMsgInput.trim() || !currentChild) return;

    sendParentMessage(parentMsgInput.trim(), currentChild.id);
    setParentMsgInput('');
  };

  const handleReplyMessage = (messageId: string) => {
    const text = teacherReplyInput[messageId];
    if (!text || !text.trim()) return;

    replyParentMessage(messageId, text.trim());
    setTeacherReplyInput({ ...teacherReplyInput, [messageId]: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline-block mr-1.5" />
            <span>Thông báo lớp ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'messages'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-1.5" />
            <span>Hộp thư Phối hợp Cha Mẹ ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('child_view')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'child_view'
                ? 'bg-linear-to-r from-emerald-600 to-teal-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 inline-block mr-1.5" />
            <span>Góc Nhìn Phụ Huynh ({currentChild?.name})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_drafter')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'ai_drafter'
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-1.5" />
            <span>AI Soạn thông báo cha mẹ</span>
          </button>
        </div>

        {/* Child switcher for parent simulation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Xem con:</span>
          <select
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
            value={currentParentStudentId}
            onChange={(e) => setCurrentParentStudentId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (PH: {s.parentName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Thông Báo Chủ Nhiệm Lớp 4A4</h3>
              <p className="text-xs text-slate-500">Cầu nối thông tin chính thức, minh bạch và kịp thời tới toàn thể gia đình.</p>
            </div>
            <button
              onClick={() => setActiveTab('ai_drafter')}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Soạn thông báo mới bằng AI</span>
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => {
              const isAcknowledged = ann.acknowledgedBy.includes(currentChild?.id || '');

              return (
                <div key={ann.id} className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                          {ann.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          Giọng điệu: {ann.tone}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{ann.date}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mt-1">{ann.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        ✓ {ann.responsesCount}/{students.length} phụ huynh đã đọc
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-[#FFFDF5] p-4 rounded-2xl border border-amber-200/80 font-medium">
                    {ann.content}
                  </p>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-slate-400">Gửi tới: <strong>{ann.targetAudience}</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ann.content);
                          showToast('Đã sao chép nội dung thông báo để gửi Zalo/Tin nhắn!', 'success');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép nội dung</span>
                      </button>

                      {currentChild && (
                        <button
                          onClick={() => acknowledgeAnnouncement(ann.id, currentChild.id)}
                          disabled={isAcknowledged}
                          className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                            isAcknowledged
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {isAcknowledged ? '✓ Con đã xác nhận đọc' : 'Xác nhận đã đọc (PH ' + currentChild.name + ')'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: PARENT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Hộp Thư Trao Đổi Riêng Cùng Giáo Viên Chủ Nhiệm</h3>
            <p className="text-xs text-slate-500">
              Kênh trao đổi nội bộ bảo mật, an toàn, không rò rỉ thông tin cá nhân của học sinh.
            </p>

            <form onSubmit={handleSendParentMessage} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Phụ huynh em <strong>{currentChild?.name}</strong> gửi lời nhắn tới cô giáo:
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Dạ chào cô giáo! Hôm nay cháu có chút ho nhẹ, nhờ cô nhắc cháu uống nước ấm giúp gia đình ạ..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500"
                value={parentMsgInput}
                onChange={(e) => setParentMsgInput(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi lời nhắn</span>
              </button>
            </form>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tin nhắn trao đổi gần đây:</h4>
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs">{msg.parentName}</span>
                      <span className="text-slate-400 text-[11px]">(PH em {msg.studentName})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{msg.date}</span>
                  </div>

                  <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{msg.content}"
                  </p>

                  {/* Teacher Reply */}
                  {msg.reply ? (
                    <div className="ml-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
                      <div className="flex items-center justify-between font-bold text-sky-900">
                        <span>Cô giáo {settings.teacherName} phản hồi:</span>
                        <span className="text-[10px] text-slate-400 font-normal">{msg.replyDate}</span>
                      </div>
                      <p className="leading-relaxed">{msg.reply}</p>
                    </div>
                  ) : (
                    <div className="ml-4 flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Nhập phản hồi của cô giáo..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                        value={teacherReplyInput[msg.id] || ''}
                        onChange={(e) =>
                          setTeacherReplyInput({ ...teacherReplyInput, [msg.id]: e.target.value })
                        }
                      />
                      <button
                        onClick={() => handleReplyMessage(msg.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Trả lời
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PARENT'S VIEW OF CHILD (PHỤ HUYNH CHỈ XEM CON MÌNH) */}
      {activeTab === 'child_view' && currentChild && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl ${currentChild.avatarColor} text-white font-black text-xl flex items-center justify-center shadow-md`}>
                {currentChild.name.charAt(currentChild.name.lastIndexOf(' ') + 1)}
              </div>
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Góc Phụ Huynh Xem Con
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{currentChild.name}</h3>
                <p className="text-xs text-slate-500">Mã: {currentChild.code} • {currentChild.group}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block">Tiến bộ ghi nhận:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  🌸 {currentChild.flowerCount} Hoa
                </span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                  ❤️ {currentChild.heartCount} Tim
                </span>
              </div>
            </div>
          </div>

          {/* Child Goals & Milestones */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-wider">Mục tiêu rèn luyện của con:</h4>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              🎯 {currentChild.goals}
            </p>
            <p className="text-xs text-slate-600 italic">
              Ước mơ: "{currentChild.dream}"
            </p>
          </div>

          {/* Child Competencies */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
              Năng lực & Phẩm chất đã được cô giáo xác nhận:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="font-bold text-blue-900 block">Học tập</span>
                <span className="text-xl font-black text-blue-700 mt-1 block">{currentChild.progressScores.learning}/10</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="font-bold text-emerald-900 block">Phẩm chất</span>
                <span className="text-xl font-black text-emerald-700 mt-1 block">{currentChild.progressScores.qualities}/10</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <span className="font-bold text-purple-900 block">Hợp tác nhóm</span>
                <span className="text-xl font-black text-purple-700 mt-1 block">{currentChild.progressScores.teamwork}/10</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Phụ huynh chỉ xem được dữ liệu của con mình, bảo đảm quyền riêng tư của từng học sinh.</span>
          </div>
        </div>
      )}

      {/* VIEW 4: AI ANNOUNCEMENT DRAFTER */}
      {activeTab === 'ai_drafter' && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold uppercase">
                Công cụ Sư phạm AI
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Trợ Lý Soạn Thông Báo Phụ Huynh Bằng AI</h3>
              <p className="text-xs text-slate-500">Tùy biến giọng văn theo 4 phong cách: Ấm áp – Trang trọng – Ngắn gọn – Khích lệ.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Chủ đề thông báo:</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 font-semibold"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Ý chính cần truyền tải:</label>
                <textarea
                  rows={3}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Giọng văn mong muốn:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['Ấm áp', 'Trang trọng', 'Ngắn gọn', 'Khích lệ'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        tone === t
                          ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Đối tượng gửi:</label>
                <select
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                >
                  <option value="Toàn thể lớp">Toàn thể phụ huynh Lớp 4A4</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      Riêng phụ huynh em {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleDraftWithAi}
                disabled={isDrafting}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isDrafting ? 'AI đang soạn thảo...' : 'Soạn thông báo ngay'}</span>
              </button>
            </div>

            {/* AI Output Preview */}
            <div className="lg:col-span-7 bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Bản thảo xem trước (Giọng văn: {tone})
                  </h4>
                  {aiDraft && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiDraft);
                        showToast('Đã sao chép thông báo!', 'success');
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Sao chép
                    </button>
                  )}
                </div>

                {aiDraft ? (
                  <p className="mt-4 text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200 font-medium">
                    {aiDraft}
                  </p>
                ) : (
                  <div className="p-12 text-center text-slate-400 italic text-xs">
                    Nhấn nút "Soạn thông báo ngay" để AI Bạn Đồng Hành tạo nội dung phù hợp với phụ huynh.
                  </div>
                )}
              </div>

              {aiDraft && (
                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={handlePublishDraft}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Phát hành vào bảng thông báo lớp ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
