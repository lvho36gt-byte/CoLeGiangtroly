import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassMaterial } from '../../types';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  Search,
  BookOpen,
  Download,
  Copy,
  FolderOpen,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { generateWorksheet } from '../../services/geminiService';

export const LibraryModule: React.FC = () => {
  const { materials, addMaterial, deleteMaterial, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<ClassMaterial | null>(materials[0] || null);

  // AI Worksheet Generator state
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [activityTitle, setActivityTitle] = useState('Phiếu Tự Đánh Giá Tuần: Em Là Búp Măng Xinh');
  const [targetObjective, setTargetObjective] = useState('Rèn luyện tính tự giác, trung thực và nhận biết cảm xúc cá nhân');
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedSheet, setGeneratedSheet] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // New manual material form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ClassMaterial['category']>('Kế hoạch chủ nhiệm');
  const [newDesc, setNewDesc] = useState('');
  const [newContent, setNewContent] = useState('');

  const categories: ClassMaterial['category'][] = [
    'Kế hoạch chủ nhiệm',
    'Phiếu theo dõi nền nếp',
    'Sổ liên lạc số',
    'Bảng thi đua lớp',
    'Hồ sơ tiến bộ học sinh',
    'Góc lớp học hạnh phúc',
  ];

  const filteredMaterials = materials.filter((m) => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleGenerateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedSheet(null);

    try {
      const res = await generateWorksheet(activityTitle, targetObjective, questionCount);
      if (res.isAvailable && res.text) {
        setGeneratedSheet(res.text);
      } else {
        setGeneratedSheet(
          res.message ||
            'Chưa kết nối AI: Hệ thống máy chủ chưa cấu hình GEMINI_API_KEY. Bạn vẫn có thể sao chép các biểu mẫu mẫu trong thư viện.'
        );
      }
    } catch {
      setGeneratedSheet('Lỗi kết nối khi gọi AI tạo phiếu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedToLibrary = () => {
    if (!generatedSheet) return;

    addMaterial({
      title: activityTitle,
      category: 'Góc lớp học hạnh phúc',
      description: targetObjective,
      content: generatedSheet,
      tags: ['AI tạo', 'Phiếu A4', 'Lớp 4A4'],
      isAiGenerated: true,
    });

    setShowAiGenerator(false);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addMaterial({
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Tài liệu giáo viên chủ nhiệm biên soạn',
      content: newContent.trim(),
      tags: [newCategory, 'Lớp 4A4'],
      isAiGenerated: false,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & AI Generator Action */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-blue-600 via-sky-600 to-teal-500 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase backdrop-blur-xs">
            Học liệu số hóa 2026–2027
          </span>
          <h2 className="text-2xl font-black mt-1">Thư Viện Học Liệu Chủ Nhiệm Số Lớp 4</h2>
          <p className="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed">
            Hệ thống biểu mẫu, kế hoạch, sổ liên lạc và phiếu học tập được chuẩn hóa theo chương trình GDPT 2018 và Thông tư 27.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiGenerator(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI tạo phiếu chủ nhiệm A4</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài liệu</span>
          </button>
        </div>
      </div>

      {/* 6 Category Pills & Search */}
      <div className="bg-white p-4 rounded-3xl border border-amber-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({materials.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat} ({materials.filter((m) => m.category === cat).length})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu học tập, bảng thi đua, sổ liên lạc..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Library Grid: Left Document List + Right A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Danh mục tài liệu ({filteredMaterials.length})
          </h4>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => setSelectedMaterial(mat)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMaterial?.id === mat.id
                    ? 'bg-sky-50/80 border-sky-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-sky-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold">
                      {mat.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMaterial(mat.id);
                    }}
                    className="text-slate-300 hover:text-rose-500 p-1"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h5 className="font-extrabold text-slate-900 text-xs mt-2 line-clamp-1">{mat.title}</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{mat.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Ngày tạo: {mat.dateCreated}</span>
                  {mat.isAiGenerated && (
                    <span className="text-amber-600 font-bold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> AI soạn
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: A4 Sheet Preview & Printing */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs flex flex-col justify-between">
          {selectedMaterial ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {selectedMaterial.category}
                  </span>
                  <h3 className="font-black text-slate-900 text-base mt-1">{selectedMaterial.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In bản A4</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMaterial.content);
                      showToast('Đã sao chép nội dung học liệu!', 'success');
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Document Sheet Preview */}
              <div className="p-6 bg-[#FFFDF5] rounded-2xl border border-amber-200/80 shadow-inner font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-line min-h-[360px] max-h-[500px] overflow-y-auto">
                <div className="text-center font-bold text-slate-900 pb-4 border-b border-amber-200/60 font-sans mb-3">
                  <p className="text-[11px] text-slate-500 uppercase">TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1 - LỚP 4A4</p>
                  <p className="text-sm font-black text-slate-900 mt-1 uppercase">{selectedMaterial.title}</p>
                </div>
                {selectedMaterial.content}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs">Chọn tài liệu bên trái để xem trước và in khổ A4.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: AI WORKSHEET GENERATOR */}
      {showAiGenerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-amber-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-950 font-black text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>AI Tạo Phiếu Chủ Nhiệm & Bảng Tự Đánh Giá A4</span>
              </div>
              <button
                onClick={() => setShowAiGenerator(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateSheet} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Tên hoạt động / Tên phiếu:</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-indigo-500"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Mục tiêu sư phạm cần đạt:</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={targetObjective}
                  onChange={(e) => setTargetObjective(e.target.value)}
                  required
                />
              </div>

              <div className="w-48">
                <label className="font-bold text-slate-700">Số lượng câu hỏi / mục kiểm tra:</label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'AI đang thiết kế phiếu A4...' : 'Thiết kế phiếu học tập ngay'}</span>
              </button>
            </form>

            {generatedSheet && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="font-bold text-slate-900 text-xs uppercase">Bản thảo A4 vừa sinh:</h5>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs max-h-56 overflow-y-auto whitespace-pre-line">
                  {generatedSheet}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    In thử
                  </button>
                  <button
                    onClick={handleSaveGeneratedToLibrary}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
                  >
                    Lưu vào thư viện học liệu ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD MANUAL MATERIAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-amber-200">
            <h3 className="text-lg font-black text-slate-900">Thêm tài liệu mới vào thư viện</h3>
            <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Tiêu đề tài liệu:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bảng kiểm thi đua tuần 9..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Chủ đề / Phân loại:</label>
                <select
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Mô tả tóm tắt:</label>
                <input
                  type="text"
                  placeholder="Mô tả mục đích sử dụng..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Nội dung tài liệu:</label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung văn bản, tiêu chí..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 shadow-xs"
                >
                  Lưu tài liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
