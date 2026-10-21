import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  School,
  UserCheck,
  GraduationCap,
  Users,
  Award,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Bot,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, settings, resetToDefaultData, aiStatus, setActiveTab } = useApp();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs no-print transition-all">
      {/* Top Banner Bar */}
      <div className="bg-linear-to-r from-[#1558AA] via-[#36B8F2] to-[#28B77C] text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <School className="w-3.5 h-3.5" />
            {settings.schoolName}
          </span>
          <span className="opacity-60 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Lớp: <strong className="font-bold underline decoration-amber-300">{settings.className}</strong> ({settings.schoolYear})</span>
          <span className="opacity-60 hidden md:inline">•</span>
          <span className="hidden md:inline">GVCN: <strong>{settings.teacherName}</strong></span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* AI Connection status badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              aiStatus.hasApiKey
                ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/40'
                : 'bg-amber-400/20 text-amber-100 border border-amber-300/40'
            }`}
            title={aiStatus.hasApiKey ? 'Google Gemini AI đang sẵn sàng' : 'Chưa thiết lập GEMINI_API_KEY trong Secrets'}
          >
            <Bot className="w-3 h-3" />
            <span>{aiStatus.hasApiKey ? 'Gemini AI Sẵn sàng' : 'Chế độ Demo (Chưa kết nối AI)'}</span>
          </div>

          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-1 hover:text-amber-200 transition-colors text-[11px] opacity-90 hover:opacity-100"
            title="Khôi phục dữ liệu mẫu ban đầu của lớp 4A4"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Khôi phục dữ liệu mẫu</span>
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Toàn màn hình"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[#FF7A21] via-[#F35BA2] to-[#36B8F2] p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#FF7A21]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-[#1558AA]">
                AI ĐỒNG HÀNH
              </span>
              <span className="text-xs font-bold text-amber-600 hidden sm:inline">
                Khóa học 2026–2027
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              KIẾN TẠO LỚP 4 HẠNH PHÚC
            </h1>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/90 shadow-inner">
          <button
            onClick={() => setRole('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'teacher'
                ? 'bg-white text-[#1558AA] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#36B8F2]" />
            <span>Cô giáo (GVCN)</span>
          </button>

          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#28B77C]" />
            <span>Học sinh</span>
          </button>

          <button
            onClick={() => setRole('parent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'parent'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-[#FF7A21]" />
            <span>Phụ huynh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
