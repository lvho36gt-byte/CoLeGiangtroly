import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HappinessPillar } from '../../types';
import {
  Compass,
  Heart,
  MessageSquareHeart,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  Flower2,
  Star,
  Plus,
  Smile,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HappinessMapModule: React.FC = () => {
  const {
    happinessPillars,
    addPillarBlossom,
    students,
    setSelectedStudentForModal,
    showToast,
  } = useApp();

  const [activePillarId, setActivePillarId] = useState<string>('loved');
  const [gardenFilter, setGardenFilter] = useState<'all' | 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4'>('all');

  const selectedPillar = happinessPillars.find((p) => p.id === activePillarId) || happinessPillars[0];

  const handleAddBlossom = (pillarId: string) => {
    addPillarBlossom(pillarId);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const filteredStudents = gardenFilter === 'all'
    ? students
    : students.filter((s) => s.group === gardenFilter);

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'MessageSquareHeart':
        return <MessageSquareHeart className="w-5 h-5 text-sky-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black tracking-wide uppercase backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Trọng tâm Sáng tạo Sư phạm 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            BẢN ĐỒ HẠNH PHÚC LỚP 4A4
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 max-w-2xl leading-relaxed">
            Cây Hạnh Phúc với 5 trụ cột vững chãi: <strong>Được yêu thương – Được lắng nghe – Được tôn trọng – Được phát triển – Được kết nối</strong>. Nơi mỗi học sinh là một bông hoa rạng rỡ với ước mơ và thế mạnh riêng biệt!
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-center shrink-0">
          <span className="text-xs font-bold text-pink-100">Tổng đóa hoa nở rộ</span>
          <span className="text-4xl font-black mt-1">
            {happinessPillars.reduce((acc, p) => acc + p.activitiesCount, 0)} 🌸
          </span>
          <span className="text-[10px] text-pink-100 mt-1">Thắp sáng lớp học 4A4</span>
        </div>
      </div>

      {/* SECTION 1: CÂY HẠNH PHÚC & 5 TRỤ CỘT */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>Cây Hạnh Phúc & 5 Trụ Cột Yêu Thương</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                Giáo dục tích cực
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn từng trụ cột để xem minh chứng hoạt động và thêm hoa hạnh phúc lên cây.
            </p>
          </div>
        </div>

        {/* 5 Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {happinessPillars.map((pillar) => {
            const isSelected = activePillarId === pillar.id;

            return (
              <div
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-linear-to-b from-amber-50 to-orange-50 border-amber-400 shadow-md scale-[1.02]'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center">
                      {getPillarIcon(pillar.iconName)}
                    </div>
                    <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg">
                      {pillar.score}%
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {pillar.vietnameseTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">🌸 {pillar.activitiesCount} đóa hoa</span>
                  <span className="text-amber-700 font-semibold">{isSelected ? '● Đang xem' : 'Xem'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tree Interactive Centerpiece */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-b from-[#FFFDF5] via-amber-50/40 to-emerald-50/40 border-2 border-amber-200/80 shadow-inner flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Visual Tree representation */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center relative py-6">
            <div className="relative">
              {/* Giant tree visual */}
              <div className="text-7xl sm:text-8xl animate-pulse-soft select-none">
                🌳
              </div>

              {/* Floating blossoms around tree */}
              <div className="absolute -top-3 -left-4 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-pink-600 shadow-xs border border-pink-200 animate-float">
                ❤️ Yêu thương ({happinessPillars.find((p) => p.id === 'loved')?.activitiesCount})
              </div>
              <div className="absolute top-2 -right-6 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-sky-600 shadow-xs border border-sky-200 animate-float" style={{ animationDelay: '1s' }}>
                💬 Lắng nghe ({happinessPillars.find((p) => p.id === 'listened')?.activitiesCount})
              </div>
              <div className="absolute -bottom-2 -left-6 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 shadow-xs border border-amber-200 animate-float" style={{ animationDelay: '1.5s' }}>
                🛡️ Tôn trọng ({happinessPillars.find((p) => p.id === 'respected')?.activitiesCount})
              </div>
              <div className="absolute -bottom-2 -right-4 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-xs border border-emerald-200 animate-float" style={{ animationDelay: '2s' }}>
                🌱 Phát triển ({happinessPillars.find((p) => p.id === 'growing')?.activitiesCount})
              </div>
            </div>

            <p className="mt-4 text-xs font-extrabold text-slate-800">
              CÂY HẠNH PHÚC LỚP 4A4 (TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1)
            </p>
            <p className="text-[11px] text-slate-500 italic mt-0.5">
              "Trồng cây hạnh phúc – Gặt hái tình thương"
            </p>
          </div>

          {/* Selected Pillar Detail Card */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h4 className="font-black text-slate-900 text-sm">
                  Trụ cột: {selectedPillar.vietnameseTitle}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Điểm số gắn kết: {selectedPillar.score}/100
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {selectedPillar.description}
            </p>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-950 block">Minh chứng & Hoạt động tiêu biểu:</span>
              <p className="text-slate-700">{selectedPillar.highlightAction}</p>
            </div>

            <button
              onClick={() => handleAddBlossom(selectedPillar.id)}
              className="w-full py-2.5 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Flower2 className="w-4 h-4" />
              <span>Ghi nhận & Thêm đóa hoa hạnh phúc lên cây 🌸</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: KHU VƯỜN ƯỚC MƠ (MỖI HỌC SINH LÀ MỘT ƯỚC MƠ ĐÁNG QUÝ) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <h3 className="text-xl font-black text-slate-900">
                Khu Vườn Ước Mơ: "Mỗi Học Sinh Là Một Ước Mơ Đáng Quý"
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tất cả {students.length} học sinh được đại diện bằng một bông hoa rực rỡ, không phân biệt điểm số, không xếp hạng hơn kém.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs">
            {(['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const).map((group) => (
              <button
                key={group}
                onClick={() => setGardenFilter(group)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  gardenFilter === group
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {group === 'all' ? `Toàn bộ vườn (${students.length} em)` : group}
              </button>
            ))}
          </div>
        </div>

        {/* 30 Flower Cards representing 30 students */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedStudentForModal(s)}
              className="p-4 rounded-2xl bg-linear-to-b from-white to-[#FFFDF5] border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-125 transition-transform inline-block">
                    {s.flowerCount > 10 ? '🌺' : s.flowerCount > 5 ? '🌸' : '🌼'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {s.group}
                  </span>
                </div>

                <h4 className="font-black text-slate-900 text-xs sm:text-sm mt-2 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {s.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold">{s.code}</p>

                <div className="mt-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px]">
                  <span className="font-bold text-amber-900 block">Ước mơ tuổi thơ:</span>
                  <p className="text-slate-700 italic line-clamp-2">"{s.dream}"</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>🌸 {s.flowerCount} Hoa</span>
                <span>❤️ {s.heartCount} Tim</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
