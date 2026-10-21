import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  Heart,
  BookOpen,
  ArrowRight,
  Sun,
  Smile,
  Flower2,
  Award,
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, settings, students } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#36B8F2]/15 via-[#FFFDF5] to-[#FF7A21]/15 border-2 border-amber-200/90 shadow-lg p-6 sm:p-10 mb-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-linear-to-bl from-amber-300/30 to-pink-300/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-linear-to-tr from-sky-300/30 to-emerald-300/20 blur-2xl pointer-events-none" />

      {/* Floating Rainbow / Hearts */}
      <div className="absolute top-6 right-12 hidden lg:flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-pink-200 shadow-sm animate-bounce duration-1000">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
        <span className="text-xs font-bold text-rose-700">Lớp học Hạnh phúc 4A4</span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading and action buttons */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-amber-400/20 to-orange-400/20 border border-amber-300/60 text-amber-900 text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Mô hình Giáo dục Tiểu học Đổi mới Sáng tạo 2026</span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              <span className="text-[#1558AA]">AI ĐỒNG HÀNH</span> <br />
              <span className="bg-linear-to-r from-[#FF7A21] via-[#F35BA2] to-[#36B8F2] bg-clip-text text-transparent">
                KIẾN TẠO LỚP 4 HẠNH PHÚC
              </span>
            </h2>
            <p className="mt-3 text-base sm:text-lg font-semibold text-slate-700 leading-relaxed">
              “Quản lý lớp hiệu quả – Thấu hiểu yêu thương – Phát triển toàn diện học sinh lớp 4.”
            </p>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-2xl">
              Hệ sinh thái số hóa công tác chủ nhiệm tại <strong>{settings.schoolName}</strong> do cô giáo <strong>{settings.teacherName}</strong> chủ nhiệm. Nơi công nghệ AI trở thành người bạn đồng hành tin cậy, thấu hiểu từng ước mơ và nâng bước học trò.
            </p>
          </div>

          {/* Slogan pill */}
          <div className="p-3 bg-white/90 rounded-2xl border border-sky-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-amber-200" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-sky-900 italic">
              {settings.slogan}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] hover:from-[#11478a] hover:to-[#2aa4dc] text-white text-sm font-extrabold shadow-md shadow-sky-500/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Bắt đầu quản lý lớp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('ai_assistant')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-[#FF7A21] to-[#f59e0b] hover:from-[#e56816] hover:to-[#d97706] text-white text-sm font-extrabold shadow-md shadow-orange-500/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4" />
              <span>Khám phá trợ lý AI</span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300/80 text-sm font-extrabold shadow-xs hover:border-slate-400 transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#36B8F2]" />
              <span>Xem hồ sơ chủ nhiệm số</span>
            </button>
          </div>
        </div>

        {/* Right Column: Educational Classroom Illustration */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square bg-linear-to-b from-sky-100 via-amber-50 to-emerald-50 rounded-3xl p-5 border-2 border-amber-300/70 shadow-xl flex flex-col justify-between overflow-hidden">
            {/* Rainbow arc banner */}
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-12 border-amber-300/40 border-t-pink-400/40 border-r-sky-400/40 pointer-events-none" />

            {/* Top row badges in illustration */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-2xl shadow-xs border border-sky-200">
                <span className="text-xl">🏫</span>
                <span className="text-xs font-bold text-slate-800">TH Khoái Châu 1</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black px-3 py-1.5 rounded-2xl text-xs shadow-xs">
                <span>Lớp 4A4</span>
              </div>
            </div>

            {/* Center Visual: Teacher, AI Robot, and Children */}
            <div className="relative py-4 flex items-center justify-center">
              {/* Teacher Avatar Card */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={settings.teacherAvatarUrl || '/assets/aistudio/image_d91f7d2f.png'}
                    alt={settings.teacherName}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover object-top border-4 border-white shadow-2xl ring-4 ring-sky-300/50 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-linear-to-tr from-[#1558AA] to-[#36B8F2] text-white p-1 rounded-full border-2 border-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                </div>
                <div className="mt-2.5 bg-white/95 px-3.5 py-1 rounded-xl shadow-sm border border-sky-100 text-center">
                  <p className="text-xs font-black text-sky-950">Cô giáo {settings.teacherName}</p>
                  <p className="text-[10px] text-slate-500 font-bold">Giáo viên Chủ nhiệm</p>
                </div>
              </div>

              {/* Friendly Robot Friend */}
              <div className="absolute right-3 -top-1 z-30 animate-float">
                <div className="bg-linear-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-2xl shadow-lg border-2 border-white flex flex-col items-center">
                  <Bot className="w-7 h-7 text-amber-300" />
                  <span className="text-[10px] font-black mt-1">AI 4A4</span>
                </div>
              </div>

              {/* Cheerful Student Badges */}
              <div className="absolute left-2 bottom-0 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-2xl border border-pink-200 shadow-xs">
                <span className="text-base">🎒</span>
                <div className="text-[10px] font-bold text-slate-800">
                  <span>{students.length} Học sinh</span>
                </div>
              </div>
            </div>

            {/* Bottom bar inside illustration */}
            <div className="grid grid-cols-3 gap-2 text-center z-10">
              <div className="bg-white/85 p-2 rounded-xl border border-slate-100 shadow-2xs">
                <Smile className="w-4 h-4 text-emerald-600 mx-auto" />
                <span className="text-[10px] font-bold text-slate-700 block mt-0.5">Yêu thương</span>
              </div>
              <div className="bg-white/85 p-2 rounded-xl border border-slate-100 shadow-2xs">
                <Flower2 className="w-4 h-4 text-amber-500 mx-auto" />
                <span className="text-[10px] font-bold text-slate-700 block mt-0.5">Việc tốt</span>
              </div>
              <div className="bg-white/85 p-2 rounded-xl border border-slate-100 shadow-2xs">
                <Award className="w-4 h-4 text-pink-500 mx-auto" />
                <span className="text-[10px] font-bold text-slate-700 block mt-0.5">Tiến bộ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
