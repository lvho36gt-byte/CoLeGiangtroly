import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Download,
  Save,
  MessageSquare,
  BookOpen,
  Heart,
  Calendar,
  AlertCircle,
  Award,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { callGemini, GeminiResponse } from '../../services/geminiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickAction?: string;
}

export const AiAssistantModule: React.FC = () => {
  const { students, settings, addMaterial, showToast, aiStatus } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: 'Xin chào cô giáo! Em là Bạn Đồng Hành AI của Lớp 4A4 Trường Tiểu học Khoái Châu 1. Hôm nay cô muốn em hỗ trợ công việc chủ nhiệm gì ạ?',
      timestamp: '08:00',
    },
  ]);

  const quickActions = [
    { id: 'qa-1', label: '1. Soạn kế hoạch chủ nhiệm', prompt: 'Hãy soạn giúp cô kế hoạch chủ nhiệm tuần tới cho Lớp 4A4 với chủ đề "Nâng cao ý thức tự giác và đôi bạn cùng tiến", gồm mục tiêu, phân công và kịch bản sinh hoạt.' },
    { id: 'qa-2', label: '2. Viết nhận xét Thông tư 27', prompt: 'Hãy gợi ý 3 mẫu nhận xét học sinh định kỳ lớp 4 theo chuẩn Thông tư 27/2020/TT-BGDĐT: một em học tốt nhưng còn nhút nhát, một em hiếu động tích cực giúp bạn, và một em cần rèn thêm chữ viết.' },
    { id: 'qa-3', label: '3. Gợi ý hoạt động lớp hạnh phúc', prompt: 'Hãy gợi ý 3 trò chơi khởi động tiết sinh hoạt lớp 4A4 giúp các em giải tỏa căng thẳng, gắn kết tình bạn mà không tốn nhiều chi phí chuẩn bị.' },
    { id: 'qa-4', label: '4. Xây dựng nhiệm vụ cá nhân', prompt: 'Gợi ý các nhiệm vụ vừa sức rèn luyện kỹ năng sống cho học sinh lớp 4 (giữ vệ sinh bàn học, đi học đúng giờ, chia sẻ đồ dùng).' },
    { id: 'qa-5', label: '5. Tư vấn tình huống sư phạm', prompt: 'Tư vấn giải quyết tình huống: Trong giờ ra chơi, hai học sinh tranh giành nhau cuốn truyện tranh và to tiếng. Cô giáo nên xử lý thế nào để vừa công bằng vừa dạy các em bài học biết sẻ chia?' },
    { id: 'qa-6', label: '6. Soạn thông báo phụ huynh', prompt: 'Hãy soạn thư ngỏ gửi phụ huynh lớp 4A4 thông báo về phong trào "Hành trình Tử tế và Việc tốt", giọng văn ấm áp, khích lệ cha mẹ đồng hành cùng con.' },
    { id: 'qa-7', label: '7. Phân tích dữ liệu lớp học', prompt: `Phân tích tình hình lớp 4A4: Sĩ số 30 em, hiện có 4 em cần quan tâm đặc biệt (rụt rè, lo lắng kiểm tra, đi muộn). Hãy gợi ý chiến lược chủ nhiệm toàn diện.` },
    { id: 'qa-8', label: '8. Tạo báo cáo sáng kiến', prompt: 'Hãy phác thảo đề cương Báo cáo Sáng kiến kinh nghiệm chủ nhiệm: "Ứng dụng AI và mô hình Lớp học hạnh phúc nâng cao hiệu quả giáo dục học sinh lớp 4".' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response: GeminiResponse = await callGemini(text);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.isAvailable && response.text
          ? response.text
          : (response.message || 'Chưa kết nối AI: Hệ thống máy chủ chưa được cấu hình GEMINI_API_KEY. Bạn vẫn có thể tham khảo các gợi ý mẫu trong kho học liệu.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Rất tiếc, đã xảy ra lỗi kết nối khi xử lý yêu cầu. Cô vui lòng kiểm tra lại đường truyền mạng nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionModifier = (modifier: 'rewrite' | 'shorter' | 'positive' | 'alternative', lastMsgText: string) => {
    let modPrompt = '';
    if (modifier === 'rewrite') {
      modPrompt = `Hãy viết lại nội dung sau đây theo cách diễn đạt phong phú và sáng tạo hơn:\n"${lastMsgText}"`;
    } else if (modifier === 'shorter') {
      modPrompt = `Hãy cô đọng, viết ngắn gọn súc tích lại nội dung sau đây (dưới 150 từ):\n"${lastMsgText}"`;
    } else if (modifier === 'positive') {
      modPrompt = `Hãy viết lại nội dung sau với giọng văn tràn đầy cảm hứng, năng lượng tích cực và khích lệ tình yêu thương:\n"${lastMsgText}"`;
    } else if (modifier === 'alternative') {
      modPrompt = `Hãy đề xuất một phương án/ý tưởng hoàn toàn khác cho nội dung sau:\n"${lastMsgText}"`;
    }
    handleSendMessage(modPrompt);
  };

  const handleSaveToMaterials = (content: string) => {
    addMaterial({
      title: 'Tài liệu chủ nhiệm tạo từ Bạn Đồng Hành AI',
      category: 'Kế hoạch chủ nhiệm',
      description: 'Nội dung soạn thảo tự động bằng trợ lý AI cho Lớp 4A4',
      content,
      tags: ['AI hỗ trợ', 'Chủ nhiệm 4A4', 'Thông tư 27'],
      isAiGenerated: true,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Bot Persona Banner */}
      <div className="bg-linear-to-r from-indigo-600 via-blue-600 to-sky-500 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl shadow-inner shrink-0 animate-float">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">BẠN ĐỒNG HÀNH AI</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xs">
                {aiStatus.hasApiKey ? 'Trực tuyến' : 'Chế độ Demo'}
              </span>
            </div>
            <p className="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed">
              Trợ lý chuyên biệt cho công tác chủ nhiệm Lớp 4A4, thấu hiểu tâm lý lứa tuổi 9–10 và bám sát quy định Thông tư 27/2020/TT-BGDĐT.
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-sky-100/90 hidden md:block">
          <p>GVCN: <strong>{settings.teacherName}</strong></p>
          <p>{settings.schoolName}</p>
        </div>
      </div>

      {/* 8 Quick Action Buttons */}
      <div className="bg-white p-4 rounded-3xl border border-amber-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>8 Thao tác nhanh cho giáo viên chủ nhiệm</span>
          </span>
          <span className="text-[11px] text-slate-400">Chọn nút để AI tự động soạn thảo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {quickActions.map((act) => (
            <button
              key={act.id}
              onClick={() => handleSendMessage(act.prompt)}
              disabled={loading}
              className="p-2.5 rounded-2xl text-left bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-xs font-bold text-slate-800 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              <span className="line-clamp-2">{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Chat message history */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-linear-to-tr from-amber-400 to-orange-500 text-white'
                  }`}
                >
                  {isUser ? 'Cô' : 'AI'}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      isUser
                        ? 'bg-[#1558AA] text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none font-medium'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Actions for Bot Messages */}
                  {!isUser && m.id !== 'msg-init' && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 pl-1">
                      <button
                        onClick={() => handleActionModifier('rewrite', m.text)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        Viết lại
                      </button>
                      <button
                        onClick={() => handleActionModifier('shorter', m.text)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        Ngắn gọn hơn
                      </button>
                      <button
                        onClick={() => handleActionModifier('positive', m.text)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        Tích cực hơn
                      </button>
                      <button
                        onClick={() => handleActionModifier('alternative', m.text)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        Phương án khác
                      </button>
                      <button
                        onClick={() => handleSaveToMaterials(m.text)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold transition-colors flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        <span>Lưu vào học liệu</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.text);
                          showToast('Đã sao chép nội dung phản hồi của AI!', 'success');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className={`text-[10px] text-slate-400 block ${isUser ? 'text-right' : 'text-left'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto items-center">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                AI
              </div>
              <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>Bạn Đồng Hành AI đang suy nghĩ và soạn nội dung sư phạm...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập yêu cầu: Soạn kế hoạch, gợi ý nhận xét học sinh, giải quyết tình huống..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-2xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] hover:from-[#11478a] hover:to-[#2aa4dc] text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi yêu cầu</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>* Mọi nhận xét và thông báo cần được giáo viên kiểm tra và phê duyệt trước khi gửi đi.</span>
            <span className="italic">Chuẩn hóa Thông tư 27</span>
          </div>
        </div>
      </div>
    </div>
  );
};
