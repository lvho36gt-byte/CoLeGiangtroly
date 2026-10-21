import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  RotateCcw,
  Bot,
  School,
  User,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Image,
} from 'lucide-react';
import { checkAiHealth } from '../../services/geminiService';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaultData,
    aiStatus,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState({
    schoolName: settings.schoolName,
    teacherName: settings.teacherName,
    className: settings.className,
    schoolYear: settings.schoolYear,
    slogan: settings.slogan,
    roomNumber: settings.roomNumber,
    teacherAvatarUrl: settings.teacherAvatarUrl || '',
  });

  const [checkingAi, setCheckingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleCheckAi = async () => {
    setCheckingAi(true);
    setAiReport(null);
    try {
      const status = await checkAiHealth();
      if (status.hasApiKey) {
        setAiReport('✓ Kết nối máy chủ và Google Gemini API thành công! Trợ lý Bạn Đồng Hành AI đã sẵn sàng hoạt động.');
      } else {
        setAiReport('⚠️ Máy chủ đang chạy nhưng biến môi trường GEMINI_API_KEY chưa được cấu hình. Vui lòng thiết lập key trong bảng Settings > Secrets của AI Studio để mở khóa đầy đủ tính năng AI.');
      }
    } catch {
      setAiReport('✕ Không thể kết nối tới endpoint kiểm tra sức khỏe của máy chủ.');
    } finally {
      setCheckingAi(false);
    }
  };

  const handleExportBackup = () => {
    const data = {
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_Lop4A4_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Đã xuất file sao lưu dữ liệu lớp học!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-800 to-slate-900 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase backdrop-blur-xs">
            Quản trị hệ thống
          </span>
          <h2 className="text-2xl font-black mt-1">Cài Đặt & Cấu Hình Lớp Học</h2>
          <p className="text-xs text-slate-300 mt-1">
            Tùy chỉnh thông tin giáo viên, lớp học, slogan và kiểm tra kết nối dịch vụ trí tuệ nhân tạo.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <School className="w-5 h-5 text-sky-600" />
          <span>Thông Tin Đơn Vị & Giáo Viên Chủ Nhiệm</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700">Tên trường học:</label>
            <input
              type="text"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Giáo viên chủ nhiệm:</label>
            <input
              type="text"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Tên lớp:</label>
            <input
              type="text"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Năm học:</label>
            <input
              type="text"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
              value={formData.schoolYear}
              onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700">Phòng học:</label>
            <input
              type="text"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700">Khẩu hiệu / Slogan lớp học:</label>
            <input
              type="text"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-slate-500" />
              <span>Link ảnh đại diện cô giáo (tùy chọn thay cho hình minh họa):</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              value={formData.teacherAvatarUrl}
              onChange={(e) => setFormData({ ...formData, teacherAvatarUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] hover:from-[#11478a] hover:to-[#2aa4dc] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi cài đặt</span>
          </button>
        </div>
      </form>

      {/* AI Diagnostic Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bot className="w-5 h-5 text-amber-500" />
          <span>Kiểm Tra Dịch Vụ Trí Tuệ Nhân Tạo (Google Gemini)</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Trạng thái kết nối hiện tại:</span>
              <p className="text-slate-500 mt-0.5">
                {aiStatus.hasApiKey
                  ? 'Đã phát hiện GEMINI_API_KEY trên máy chủ'
                  : 'Chưa cấu hình GEMINI_API_KEY (đang ở chế độ Demo)'}
              </p>
            </div>
            <button
              onClick={handleCheckAi}
              disabled={checkingAi}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors disabled:opacity-50"
            >
              {checkingAi ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}
            </button>
          </div>

          {aiReport && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 leading-relaxed font-semibold">
              {aiReport}
            </div>
          )}
        </div>
      </div>

      {/* Backup and Reset */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <RotateCcw className="w-5 h-5 text-rose-500" />
          <span>Sao Lưu & Khôi Phục Dữ Liệu Lớp Học</span>
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Tải tệp sao lưu JSON</span>
          </button>

          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục dữ liệu mẫu 4A4</span>
          </button>
        </div>
      </div>
    </div>
  );
};
