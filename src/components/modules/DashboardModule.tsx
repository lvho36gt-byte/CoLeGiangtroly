import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Flower2,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const {
    students,
    attendance,
    tasks,
    goodDeeds,
    announcements,
    messages,
    plans,
    emotions,
    setActiveTab,
    setSelectedStudentForModal,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'semester'>('week');

  // Compute live statistics
  const totalStudents = students.length;
  const attendanceRecords = Object.values(attendance.records);
  const presentCount = attendanceRecords.filter((r) => r === 'present').length;
  const lateCount = attendanceRecords.filter((r) => r === 'late').length;
  const absentCount = attendanceRecords.filter((r) => r.startsWith('absent')).length;

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const attentionStudents = students.filter((s) => s.needsAttention);
  const totalGoodDeeds = goodDeeds.length;
  const totalFlowers = students.reduce((acc, s) => acc + s.flowerCount, 0);
  const totalHearts = students.reduce((acc, s) => acc + s.heartCount, 0);

  const parentCollaborations = announcements.reduce((acc, a) => acc + a.responsesCount, 0) + messages.length;

  // Emotion stats
  const happyEmotions = emotions.filter((e) => e.emotion === 'happy' || e.emotion === 'peaceful').length;
  const happinessIndex = emotions.length > 0 ? Math.round((happyEmotions / emotions.length) * 100) : 95;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Bar with Time Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-amber-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Bảng Điều Khiển Tổng Quan Lớp 4A4</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Trực quan thời gian thực
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp từ các hoạt động, điểm danh và nhật ký rèn luyện của học sinh.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          {(['day', 'week', 'month', 'semester'] as const).map((filter) => {
            const labels = {
              day: 'Hôm nay',
              week: 'Tuần này',
              month: 'Tháng này',
              semester: 'Học kỳ I',
            };
            return (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeFilter === filter
                    ? 'bg-white text-[#1558AA] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div
          onClick={() => setActiveTab('records')}
          className="p-5 rounded-3xl bg-linear-to-br from-blue-50 to-sky-100/70 border border-sky-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800">Sĩ số lớp 4A4</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-950">{totalStudents}</span>
            <span className="text-xs font-semibold text-sky-700">học sinh</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-800/80 flex items-center justify-between">
            <span>Nam: {students.filter((s) => s.gender === 'Nam').length} • Nữ: {students.filter((s) => s.gender === 'Nữ').length}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Attendance Today */}
        <div
          onClick={() => setActiveTab('care_management')}
          className="p-5 rounded-3xl bg-linear-to-br from-emerald-50 to-teal-100/70 border border-emerald-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Có mặt hôm nay</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-950">{presentCount}</span>
            <span className="text-xs font-semibold text-emerald-700">/{totalStudents} ({Math.round((presentCount / totalStudents) * 100)}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-800/80 flex items-center justify-between">
            <span>{lateCount > 0 ? `${lateCount} đi muộn` : 'Đúng giờ'} • {absentCount} vắng</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Tasks Done */}
        <div
          onClick={() => setActiveTab('happy_activities')}
          className="p-5 rounded-3xl bg-linear-to-br from-purple-50 to-indigo-100/70 border border-purple-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800">Nhiệm vụ hoàn thành</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-950">{completedTasks}</span>
            <span className="text-xs font-semibold text-purple-700">/{totalTasks} mục ({taskCompletionRate}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-800/80 flex items-center justify-between">
            <span>{tasks.filter((t) => t.status === 'in_progress').length} đang thực hiện</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Need Attention */}
        <div
          onClick={() => setActiveTab('care_management')}
          className="p-5 rounded-3xl bg-linear-to-br from-amber-50 to-orange-100/70 border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Cần tìm hiểu thêm</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950">{attentionStudents.length}</span>
            <span className="text-xs font-semibold text-amber-800">học sinh</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800/80 flex items-center justify-between">
            <span>Đồng hành nâng đỡ kịp thời</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 5: Positive Deeds & Flowers */}
        <div
          onClick={() => setActiveTab('happy_activities')}
          className="p-5 rounded-3xl bg-linear-to-br from-pink-50 to-rose-100/70 border border-pink-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-900">Bông hoa việc tốt</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Flower2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-950">{totalFlowers}</span>
            <span className="text-xs font-semibold text-rose-700">bông hoa</span>
          </div>
          <div className="mt-2 text-[11px] text-pink-800/80 flex items-center justify-between">
            <span>{totalHearts} trái tim yêu thương</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 6: Parent Collaboration */}
        <div
          onClick={() => setActiveTab('parent_connect')}
          className="p-5 rounded-3xl bg-linear-to-br from-indigo-50 to-blue-100/70 border border-indigo-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">Phối hợp phụ huynh</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-950">{parentCollaborations}</span>
            <span className="text-xs font-semibold text-indigo-700">lượt phản hồi</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-800/80 flex items-center justify-between">
            <span>{announcements.length} thông báo • {messages.length} trao đổi</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 7: Happiness Index */}
        <div
          onClick={() => setActiveTab('happiness_map')}
          className="p-5 rounded-3xl bg-linear-to-br from-amber-50 to-yellow-100/70 border border-yellow-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Chỉ số hạnh phúc lớp</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950">{happinessIndex}%</span>
            <span className="text-xs font-semibold text-amber-800">tích cực</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800/80 flex items-center justify-between">
            <span>Dựa trên nhật ký cảm xúc</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 8: Weekly Homeroom Plan Progress */}
        <div
          onClick={() => setActiveTab('records')}
          className="p-5 rounded-3xl bg-linear-to-br from-teal-50 to-emerald-100/70 border border-teal-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900">Kế hoạch chủ nhiệm</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-950">Tuần 8</span>
            <span className="text-xs font-semibold text-teal-700">Đang triển khai</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-800/80 flex items-center justify-between">
            <span>{plans.length} bản kế hoạch số hóa</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Middle Interactive Section: Real-time Charts & Group Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Progress distribution across 4 groups (Tổ 1 - Tổ 4) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#36B8F2]" />
                <span>Tiến bộ & Hoạt động tích cực theo 4 Tổ học tập</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tính toán dựa trên số lượng Hoa việc tốt, Trái tim và nhiệm vụ đã hoàn thành.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {(['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const).map((groupName, idx) => {
              const groupStudents = students.filter((s) => s.group === groupName);
              const groupFlowers = groupStudents.reduce((acc, s) => acc + s.flowerCount, 0);
              const groupHearts = groupStudents.reduce((acc, s) => acc + s.heartCount, 0);
              const groupAvgLearning =
                groupStudents.length > 0
                  ? (
                      groupStudents.reduce((acc, s) => acc + s.progressScores.learning, 0) /
                      groupStudents.length
                    ).toFixed(1)
                  : '0';

              const colors = [
                'bg-sky-500 text-sky-800 border-sky-200',
                'bg-emerald-500 text-emerald-800 border-emerald-200',
                'bg-purple-500 text-purple-800 border-purple-200',
                'bg-amber-500 text-amber-800 border-amber-200',
              ];

              return (
                <div key={groupName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${colors[idx].split(' ')[0]}`} />
                      <span className="font-extrabold text-sm text-slate-800">{groupName}</span>
                      <span className="text-xs text-slate-500">({groupStudents.length} học sinh)</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="text-amber-600 flex items-center gap-1">
                        <Flower2 className="w-3.5 h-3.5" /> {groupFlowers} hoa
                      </span>
                      <span className="text-rose-600 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {groupHearts} tim
                      </span>
                      <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">
                        Điểm TB: {groupAvgLearning}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[idx].split(' ')[0]} transition-all duration-700`}
                      style={{ width: `${Math.min(100, (groupFlowers + groupHearts) * 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2 / Attention Panel: Gentle early-support notifications */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Góc Đồng Hành & Quan Tâm</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                {attentionStudents.length} em cần lưu ý
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Các biểu hiện cần tìm hiểu thêm một cách tế nhị, hỗ trợ kịp thời mà không tạo áp lực.
            </p>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {attentionStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudentForModal(s)}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/70 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${s.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                        {s.name.charAt(s.name.lastIndexOf(' ') + 1)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {s.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">{s.code} • {s.group}</span>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Chi tiết →
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-amber-900 bg-white/80 p-2 rounded-xl border border-amber-200 leading-relaxed">
                    {s.attentionReason || 'Có dấu hiệu cần thêm sự khích lệ và đồng hành.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setActiveTab('care_management')}
              className="w-full py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Mở Phân hệ Quản lý & Chăm sóc</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Weekly Agenda & AI Assistant Quick Jump */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly events & tasks */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Nhiệm vụ & Sự kiện trong tuần</h3>
            </div>
            <button
              onClick={() => setActiveTab('happy_activities')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Xem tất cả ({tasks.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-[#FFFDF5] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                    {t.category}
                  </span>
                  <span className={`text-[11px] font-bold ${
                    t.status === 'completed'
                      ? 'text-emerald-600'
                      : t.status === 'in_progress'
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}>
                    {t.status === 'completed' ? '✓ Đã xong' : t.status === 'in_progress' ? '⏳ Đang làm' : '○ Chưa làm'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{t.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Hạn chót: {t.dueDate}</span>
                  <span className="font-semibold text-slate-600">{t.studentName || 'Cả lớp'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Quick Assistant Banner */}
        <div className="lg:col-span-4 bg-linear-to-br from-[#1558AA] to-[#36B8F2] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-amber-200 backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trợ lý AI 4A4</span>
            </div>
            <h3 className="text-xl font-black">Bạn Đồng Hành AI</h3>
            <p className="text-xs text-sky-100 mt-2 leading-relaxed">
              Cô giáo cần soạn giáo án sinh hoạt, viết nhận xét Thông tư 27 hay xử lý tình huống sư phạm? Trợ lý AI sẵn sàng hỗ trợ chỉ sau một nút bấm!
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setActiveTab('ai_assistant')}
              className="w-full py-3 rounded-2xl bg-white hover:bg-amber-50 text-[#1558AA] font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Mở Trung tâm Trợ lý AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
