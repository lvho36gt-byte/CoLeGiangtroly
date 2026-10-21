import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  BrainCircuit,
  Bot,
  HeartHandshake,
  TrendingUp,
  Sparkles,
  MessageCircle,
  FileText,
  BarChart3,
  Compass,
  Award,
  Settings,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: number | string;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, students, goodDeeds, tasks } = useApp();

  const attentionCount = students.filter((s) => s.needsAttention).length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: '1. Tổng quan lớp học',
      shortLabel: 'Tổng quan',
      icon: LayoutDashboard,
      color: 'text-[#1558AA]',
    },
    {
      id: 'records',
      label: '2. Hồ sơ chủ nhiệm số',
      shortLabel: 'Hồ sơ số',
      icon: FolderKanban,
      color: 'text-indigo-600',
      badge: `${students.length} HS`,
    },
    {
      id: 'understanding',
      label: '3. Thấu hiểu học sinh',
      shortLabel: 'Thấu hiểu',
      icon: BrainCircuit,
      color: 'text-[#36B8F2]',
    },
    {
      id: 'ai_assistant',
      label: '4. Trợ lý AI chủ nhiệm',
      shortLabel: 'Trợ lý AI',
      icon: Bot,
      color: 'text-[#FF7A21]',
      badge: 'AI',
    },
    {
      id: 'care_management',
      label: '5. Quản lý & Chăm sóc',
      shortLabel: 'Chăm sóc',
      icon: HeartHandshake,
      color: 'text-rose-600',
      badge: attentionCount > 0 ? attentionCount : undefined,
    },
    {
      id: 'progress',
      label: '6. Theo dõi tiến bộ',
      shortLabel: 'Tiến bộ',
      icon: TrendingUp,
      color: 'text-[#28B77C]',
    },
    {
      id: 'happy_activities',
      label: '7. Hoạt động lớp hạnh phúc',
      shortLabel: 'Hoạt động',
      icon: Sparkles,
      color: 'text-amber-500',
      badge: inProgressTasks > 0 ? inProgressTasks : undefined,
    },
    {
      id: 'parent_connect',
      label: '8. Kết nối phụ huynh',
      shortLabel: 'Phụ huynh',
      icon: MessageCircle,
      color: 'text-purple-600',
    },
    {
      id: 'library',
      label: '9. Học liệu chủ nhiệm số',
      shortLabel: 'Học liệu',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      id: 'report_evidence',
      label: '10. Báo cáo & Minh chứng',
      shortLabel: 'Báo cáo',
      icon: BarChart3,
      color: 'text-emerald-700',
    },
    {
      id: 'happiness_map',
      label: '⭐ Bản đồ Hạnh phúc 4A4',
      shortLabel: 'Bản đồ HP',
      icon: Compass,
      color: 'text-pink-600',
      badge: 'Đặc sắc',
    },
    {
      id: 'settings',
      label: '⚙️ Cài đặt',
      shortLabel: 'Cài đặt',
      icon: Settings,
      color: 'text-slate-600',
    },
  ];

  return (
    <nav className="mb-8 no-print">
      {/* Scrollable Horizontal Tabs Container */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-3xl border border-amber-200/90 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-md shadow-sky-500/25 scale-[1.02]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-amber-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.shortLabel}</span>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-amber-300 text-amber-950'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
