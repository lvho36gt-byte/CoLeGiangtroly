import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, GoodDeed } from '../../types';
import {
  Sparkles,
  Flower2,
  Heart,
  CheckCircle2,
  Clock,
  RotateCw,
  Gift,
  Star,
  Users,
  Compass,
  Smile,
  Plus,
  Trash2,
  Send,
  Award,
  Play,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HappyActivitiesModule: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    goodDeeds,
    addGoodDeed,
    students,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'good_deeds' | 'games' | 'smart_homeroom'>('tasks');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState<Task['category']>('Việc tốt');
  const [taskAssignee, setTaskAssignee] = useState<string>('all');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-25');
  const [showAddTask, setShowAddTask] = useState(false);

  // Good deed form
  const [deedStudentId, setDeedStudentId] = useState<string>(students[0]?.id || 'hs-01');
  const [deedTitle, setDeedTitle] = useState('');
  const [deedDesc, setDeedDesc] = useState('');
  const [deedType, setDeedType] = useState<'flower' | 'heart'>('flower');
  const [showAddDeed, setShowAddDeed] = useState(false);

  // Mini-Game 1: Vòng quay nhiệm vụ tốt (Lucky Wheel)
  const wheelMissions = [
    'Giúp bạn cùng bàn kê lại ghế ngay ngắn',
    'Nói 1 lời khen ngợi chân thành với bạn trong tổ',
    'Tự giác tưới nước cho bồn hoa trước cửa lớp',
    'Cùng bạn giải 1 bài toán thử thách vui',
    'Thu gom rác vụn xung quanh chỗ ngồi',
    'Viết một mảnh giấy cảm ơn gửi vào Chiếc Hộp Yêu Thương',
    'Cho bạn mượn đồ dùng học tập khi bạn cần',
    'Mỉm cười và chào bác bảo vệ, cô lao công trường',
  ];
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Mini-Game 3: Chiếc hộp yêu thương (Love & Gratitude Box)
  const [loveNotes, setLoveNotes] = useState([
    { id: 'ln-1', from: 'Bảo Anh', to: 'Cô giáo Giang', message: 'Em cảm ơn cô đã luôn mỉm cười và động viên em tự tin hơn!', date: '2026-10-20' },
    { id: 'ln-2', from: 'Minh An', to: 'Tiến Dũng', message: 'Cảm ơn cậu đã chỉ tớ cách làm bài toán chu vi hình vuông nhé!', date: '2026-10-20' },
    { id: 'ln-3', from: 'Khánh Linh', to: 'Cả Lớp 4A4', message: 'Chúc tổ chúng mình luôn đoàn kết và giành thật nhiều hoa điểm mười!', date: '2026-10-19' },
  ]);
  const [noteFrom, setNoteFrom] = useState('');
  const [noteTo, setNoteTo] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Mini-Game 5: Thử thách 7 ngày tử tế
  const [kindnessDays, setKindnessDays] = useState([
    { day: 1, title: 'Ngày 1: Lời chào thân thiện', completed: true },
    { day: 2, title: 'Ngày 2: Giúp đỡ bạn bè một việc nhỏ', completed: true },
    { day: 3, title: 'Ngày 3: Nói lời cảm ơn chân thành', completed: true },
    { day: 4, title: 'Ngày 4: Nhặt rác giữ lớp sạch đẹp', completed: true },
    { day: 5, title: 'Ngày 5: Lắng nghe bạn mà không ngắt lời', completed: false },
    { day: 6, title: 'Ngày 6: Chia sẻ đồ dùng cùng bạn', completed: false },
    { day: 7, title: 'Ngày 7: Viết thư tri ân thầy cô và cha mẹ', completed: false },
  ]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const assignedStudent = students.find((s) => s.id === taskAssignee);

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      category: taskCategory,
      assignedTo: taskAssignee,
      studentName: assignedStudent?.name,
      group: assignedStudent?.group,
      status: 'in_progress',
      dueDate: taskDueDate,
      points: 15,
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowAddTask(false);
  };

  const handleCreateGoodDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deedTitle.trim()) return;

    const student = students.find((s) => s.id === deedStudentId);
    if (!student) return;

    addGoodDeed({
      studentId: student.id,
      studentName: student.name,
      group: student.group,
      title: deedTitle.trim(),
      description: deedDesc.trim() || 'Hành động đẹp được ghi nhận tại Lớp 4A4',
      type: deedType,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    setDeedTitle('');
    setDeedDesc('');
    setShowAddDeed(false);
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wheelMissions.length);
      const chosen = wheelMissions[randomIndex];
      setSpinResult(chosen);
      setSpinning(false);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      showToast('Chúc mừng em đã quay được nhiệm vụ tử tế!', 'success');
    }, 1800);
  };

  const handleAddLoveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteFrom.trim() || !noteTo.trim() || !noteContent.trim()) return;

    setLoveNotes((prev) => [
      {
        id: `ln-${Date.now()}`,
        from: noteFrom.trim(),
        to: noteTo.trim(),
        message: noteContent.trim(),
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
    });

    setNoteFrom('');
    setNoteTo('');
    setNoteContent('');
    showToast('Bức thư yêu thương đã được bỏ vào chiếc hộp ấm áp!', 'success');
  };

  const toggleKindnessDay = (dayNum: number) => {
    setKindnessDays((prev) =>
      prev.map((d) => (d.day === dayNum ? { ...d, completed: !d.completed } : d))
    );
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'tasks'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 inline-block mr-1.5" />
            <span>Nhiệm vụ tuần ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('good_deeds')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'good_deeds'
                ? 'bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flower2 className="w-4 h-4 inline-block mr-1.5" />
            <span>Góc Lời hay – Việc tốt ({goodDeeds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'games'
                ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-1.5" />
            <span>6 Trò chơi & Trải nghiệm Hạnh phúc</span>
          </button>

          <button
            onClick={() => setActiveTab('smart_homeroom')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'smart_homeroom'
                ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-1.5" />
            <span>Sinh hoạt lớp thông minh (5 bước)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: NHIỆM VỤ TUẦN */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Nhiệm Vụ Rèn Luyện & Học Tập Lớp 4A4</h3>
              <p className="text-xs text-slate-500">
                Giao nhiệm vụ vừa sức theo 3 trạng thái: Chưa thực hiện – Đang thực hiện – Hoàn thành.
              </p>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 rounded-2xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Giao nhiệm vụ mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Chưa thực hiện */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs">
                <span>○ Chưa thực hiện</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 text-[10px]">
                  {tasks.filter((t) => t.status === 'pending').length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === 'pending')
                  .map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {t.category}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs">{t.title}</h4>
                      <p className="text-[11px] text-slate-500">{t.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{t.studentName || 'Cả lớp'}</span>
                        <button
                          onClick={() => updateTaskStatus(t.id, 'in_progress')}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Bắt đầu →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: Đang thực hiện */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-100 text-amber-900 font-bold text-xs">
                <span>⏳ Đang thực hiện</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-amber-900 text-[10px]">
                  {tasks.filter((t) => t.status === 'in_progress').length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === 'in_progress')
                  .map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {t.category}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs">{t.title}</h4>
                      <p className="text-[11px] text-slate-500">{t.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{t.studentName || 'Cả lớp'}</span>
                        <button
                          onClick={() => {
                            updateTaskStatus(t.id, 'completed');
                            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          ✓ Đánh dấu xong
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Hoàn thành */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-xs">
                <span>✓ Đã hoàn thành</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-emerald-900 text-[10px]">
                  {tasks.filter((t) => t.status === 'completed').length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === 'completed')
                  .map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                          {t.category}
                        </span>
                        <span className="text-xs text-emerald-600 font-bold">+{t.points} điểm</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs line-through opacity-80">{t.title}</h4>
                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{t.studentName || 'Cả lớp'}</span>
                        <span className="text-emerald-700 font-bold">Hoàn thành xuất sắc 🌸</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GÓC LỜI HAY - VIỆC TỐT */}
      {activeTab === 'good_deeds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex-wrap gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-amber-500" />
                <span>Góc Lời Hay – Việc Tốt Lớp 4A4</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ghi nhận các hành động tử tế, biết giúp đỡ bạn bè, tôn trọng thầy cô và giữ gìn trường lớp.
              </p>
            </div>
            <button
              onClick={() => setShowAddDeed(true)}
              className="px-4 py-2 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4" />
              <span>Ghi nhận việc tốt mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goodDeeds.map((deed) => (
              <div
                key={deed.id}
                className="p-5 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg shrink-0">
                      {deed.type === 'flower' ? '🌸' : '❤️'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{deed.studentName}</h4>
                      <span className="text-[11px] text-slate-400">{deed.group} • {deed.date}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Đã xác nhận
                  </span>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                  <h5 className="font-bold text-xs text-amber-950">{deed.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{deed.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 6 MINI-GAMES & EXPERIENCES */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game 1: Vòng quay nhiệm vụ tốt */}
            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-amber-500" />
                  <span>1. Vòng Quay Nhiệm Vụ Tốt</span>
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  Khởi động giờ học
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quay ngẫu nhiên một việc tốt nhỏ mỗi sáng để rèn luyện thói quen tử tế và lan tỏa niềm vui.
              </p>

              <div className="p-8 text-center bg-linear-to-b from-amber-50 to-orange-50 rounded-3xl border border-amber-200 relative overflow-hidden">
                <div className={`w-32 h-32 rounded-full border-8 border-amber-400 bg-white mx-auto shadow-md flex items-center justify-center transition-all ${spinning ? 'animate-spin' : ''}`}>
                  <Sparkles className="w-12 h-12 text-amber-500" />
                </div>

                {spinResult && (
                  <div className="mt-4 p-3 bg-white rounded-2xl border border-amber-300 shadow-xs animate-in zoom-in-95">
                    <span className="text-[11px] font-bold text-amber-800 uppercase block">Nhiệm vụ hôm nay:</span>
                    <p className="text-sm font-black text-slate-900 mt-1">"{spinResult}"</p>
                  </div>
                )}

                <button
                  onClick={handleSpinWheel}
                  disabled={spinning}
                  className="mt-5 px-6 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {spinning ? 'Đang quay may mắn...' : 'Quay bánh xe tử tế 🎡'}
                </button>
              </div>
            </div>

            {/* Game 2: Chiếc hộp yêu thương */}
            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-500" />
                  <span>2. Chiếc Hộp Yêu Thương</span>
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold">
                  Hòm thư biết ơn
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nơi học sinh và cô giáo gửi gắm những lời tri ân, động viên và lời cảm ơn bí mật.
              </p>

              <form onSubmit={handleAddLoveNote} className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Người gửi (Tên em)"
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    value={noteFrom}
                    onChange={(e) => setNoteFrom(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Gửi tới bạn/cô giáo..."
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    value={noteTo}
                    onChange={(e) => setNoteTo(e.target.value)}
                    required
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Viết lời nhắn gửi yêu thương..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
                >
                  Bỏ thư vào chiếc hộp 💌
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {loveNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-xl bg-pink-50/60 border border-pink-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-pink-950">
                      <span>{note.from} ➔ {note.to}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{note.date}</span>
                    </div>
                    <p className="mt-1 text-slate-700 italic">"{note.message}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Game 3: Thử thách 7 ngày tử tế */}
            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span>3. Thử Thách 7 Ngày Tử Tế</span>
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  {kindnessDays.filter((d) => d.completed).length}/7 Ngày
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mỗi ngày hoàn thành 1 hành động đẹp để thắp sáng ngôi sao tử tế của chính mình.
              </p>

              <div className="space-y-2">
                {kindnessDays.map((kd) => (
                  <div
                    key={kd.day}
                    onClick={() => toggleKindnessDay(kd.day)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      kd.completed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={kd.completed}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 pointer-events-none"
                      />
                      <span className={`font-semibold ${kd.completed ? 'line-through opacity-70' : ''}`}>
                        {kd.title}
                      </span>
                    </div>
                    <span className="text-amber-500 font-bold">{kd.completed ? '⭐' : '☆'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Game 4: Cây Lời Cảm Ơn */}
            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-emerald-500" />
                  <span>4. Cây Lời Cảm Ơn & Tri Ân</span>
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  Vườn tri ân
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mỗi lời cảm ơn chân thành sẽ biến thành một chiếc lá xanh tươi trên cây tri ân của lớp 4A4.
              </p>

              <div className="p-6 text-center bg-linear-to-b from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="text-4xl">🌳</div>
                <h5 className="font-extrabold text-slate-900 text-sm">
                  Cây Tri Ân Đã Nhận Được 48 Lời Cảm Ơn
                </h5>
                <p className="text-xs text-emerald-900">
                  "Biết ơn cha mẹ, biết ơn thầy cô và biết ơn bạn bè đã cùng đồng hành."
                </p>
                <button
                  onClick={() => {
                    confetti({ particleCount: 35, spread: 60 });
                    showToast('Đã gửi thêm một lời tri ân lên cây!', 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  + Treo lời cảm ơn lên cây 🌿
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SINH HOẠT LỚP THÔNG MINH */}
      {activeTab === 'smart_homeroom' && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase">
                Kịch bản sinh hoạt hiện đại
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Kịch Bản Sinh Hoạt Lớp Hạnh Phúc (5 Bước Chuẩn Sư Phạm)
              </h3>
              <p className="text-xs text-slate-500">Ứng dụng AI giúp giáo viên điều phối tiết sinh hoạt sôi nổi, truyền cảm hứng.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              In kịch bản
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black flex items-center justify-center text-xs">1</span>
              <h5 className="font-extrabold text-sky-950">Khởi động (5 phút)</h5>
              <p className="text-slate-600 leading-relaxed">
                Vũ điệu nụ cười hoặc quay "Bánh xe việc tốt" để tạo năng lượng tích cực đầu giờ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs">2</span>
              <h5 className="font-extrabold text-amber-950">Vinh danh việc tốt (10 phút)</h5>
              <p className="text-slate-600 leading-relaxed">
                Đọc thư trong "Chiếc hộp yêu thương", trao hoa điểm tốt và trái tim cho các cá nhân tiêu biểu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xs">3</span>
              <h5 className="font-extrabold text-emerald-950">Nhìn lại tuần qua (8 phút)</h5>
              <p className="text-slate-600 leading-relaxed">
                Lớp trưởng và các tổ trưởng báo cáo ngắn gọn dựa trên số liệu khách quan, không chỉ trích.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-xs">4</span>
              <h5 className="font-extrabold text-purple-950">Thảo luận chuyên đề (10 phút)</h5>
              <p className="text-slate-600 leading-relaxed">
                Thảo luận tình huống kỹ năng sống: "Lắng nghe để thấu hiểu", "Giúp bạn vượt qua thử thách".
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs">5</span>
              <h5 className="font-extrabold text-rose-950">Cây cam kết (5 phút)</h5>
              <p className="text-slate-600 leading-relaxed">
                Cả lớp cùng cam kết 1 hành động tích cực cho tuần mới và kết thúc bằng một tràng pháo tay giòn giã.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-amber-200">
            <h3 className="text-lg font-black text-slate-900">Giao nhiệm vụ rèn luyện mới</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Tên nhiệm vụ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giữ gìn bàn học ngăn nắp, Hỗ trợ bạn ôn tập..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Mô tả cụ thể:</label>
                <textarea
                  rows={2}
                  placeholder="Nội dung cần thực hiện..."
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-xs"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Danh mục:</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                  >
                    <option value="Học tập">Học tập</option>
                    <option value="Nền nếp">Nền nếp</option>
                    <option value="Kỹ năng sống">Kỹ năng sống</option>
                    <option value="Hoạt động nhóm">Hoạt động nhóm</option>
                    <option value="Việc tốt">Việc tốt</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Giao cho:</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                  >
                    <option value="all">Toàn thể lớp 4A4</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.group})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1558AA] text-white font-bold hover:bg-[#11478a] shadow-xs"
                >
                  Giao nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GOOD DEED */}
      {showAddDeed && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-amber-200">
            <h3 className="text-lg font-black text-slate-900">Ghi nhận Lời Hay – Việc Tốt</h3>
            <form onSubmit={handleCreateGoodDeed} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Chọn học sinh được khen thưởng:</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  value={deedStudentId}
                  onChange={(e) => setDeedStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name} ({s.group})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Hành động tử tế / Việc tốt:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giúp bạn bê bàn ghế, Động viên bạn khi bạn buồn..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                  value={deedTitle}
                  onChange={(e) => setDeedTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Mô tả chi tiết:</label>
                <textarea
                  rows={2}
                  placeholder="Kể lại hoàn cảnh việc tốt..."
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-xs"
                  value={deedDesc}
                  onChange={(e) => setDeedDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Biểu tượng khen thưởng:</label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deedType"
                      checked={deedType === 'flower'}
                      onChange={() => setDeedType('flower')}
                    />
                    <span>🌸 Bông hoa việc tốt (+1 hoa)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deedType"
                      checked={deedType === 'heart'}
                      onChange={() => setDeedType('heart')}
                    />
                    <span>❤️ Trái tim yêu thương (+1 tim)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDeed(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-xs"
                >
                  Tặng hoa/tim 🌸
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
