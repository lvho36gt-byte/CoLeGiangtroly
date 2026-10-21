import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, DiaryEntry, HomeroomPlan } from '../../types';
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  BookOpen,
  Calendar,
  Sparkles,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Filter,
  UserPlus,
  LayoutGrid,
  Table as TableIcon,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  RotateCcw,
  Star,
  Phone,
  Eye,
  Heart,
  Flower2,
} from 'lucide-react';
import { callGemini } from '../../services/geminiService';

export const RecordsModule: React.FC = () => {
  const {
    students,
    addStudent,
    deleteStudent,
    deleteMultipleStudents,
    clearAllStudents,
    resetTo31GiangStudents,
    batchImportStudents,
    setSelectedStudentForModal,
    exportStudentsCSV,
    diary,
    addDiaryEntry,
    deleteDiaryEntry,
    plans,
    addPlan,
    togglePlanTask,
    settings,
    showToast,
  } = useApp();

  const [subTab, setSubTab] = useState<'students' | 'diary' | 'plans'>('students');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Search & Filters for student list
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [filterNeedsAttention, setFilterNeedsAttention] = useState(false);

  // Multi-select for batch delete
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // Add student form modal state
  const [newStudentData, setNewStudentData] = useState({
    code: '',
    name: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    dob: '2016-01-01',
    group: 'Tổ 1' as 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4',
    hobbies: '',
    strengths: '',
    challenges: '',
    goals: '',
    parentName: '',
    parentPhone: '',
    dream: '',
    needsAttention: false,
    attentionReason: '',
  });

  // Diary state
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryCategory, setDiaryCategory] = useState<DiaryEntry['category']>('Hoạt động ngày');
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);

  // Plan state
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    title: '',
    type: 'week' as 'week' | 'month' | 'semester' | 'year',
    period: '',
    objectives: '',
    notes: '',
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hobbies.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.strengths.some((str) => str.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    const matchAttention = !filterNeedsAttention || s.needsAttention;

    return matchSearch && matchGroup && matchAttention;
  });

  // Multi-select helpers
  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleOpenAddModal = () => {
    const nextNum = students.length + 1;
    const suggestedCode = `4A4-${nextNum < 10 ? '0' + nextNum : nextNum}`;
    setNewStudentData({
      code: suggestedCode,
      name: '',
      gender: 'Nam',
      dob: '2016-01-01',
      group: 'Tổ 1',
      hobbies: '',
      strengths: '',
      challenges: '',
      goals: 'Tiến bộ từng ngày cùng bạn bè',
      parentName: '',
      parentPhone: '',
      dream: '',
      needsAttention: false,
      attentionReason: '',
    });
    setShowAddStudentModal(true);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name.trim()) {
      showToast('Vui lòng nhập họ và tên học sinh', 'warning');
      return;
    }

    addStudent({
      name: newStudentData.name.trim(),
      gender: newStudentData.gender,
      dob: newStudentData.dob,
      group: newStudentData.group,
      hobbies: newStudentData.hobbies.split(',').map((item) => item.trim()).filter(Boolean),
      strengths: newStudentData.strengths.split(',').map((item) => item.trim()).filter(Boolean),
      challenges: newStudentData.challenges.split(',').map((item) => item.trim()).filter(Boolean),
      goals: newStudentData.goals || 'Tiến bộ từng ngày cùng bạn bè',
      needsAttention: newStudentData.needsAttention,
      attentionReason: newStudentData.needsAttention ? newStudentData.attentionReason : undefined,
      avatarColor: newStudentData.gender === 'Nữ' ? 'bg-pink-500' : 'bg-sky-500',
      parentName: newStudentData.parentName || 'Phụ huynh',
      parentPhone: newStudentData.parentPhone || '0900***000',
      progressScores: { learning: 8, qualities: 9, capabilities: 8, teamwork: 8, responsibility: 8, activities: 8 },
      dream: newStudentData.dream || 'Ước mơ tuổi thơ',
      flowerCount: 0,
      heartCount: 0,
    });

    setShowAddStudentModal(false);
  };

  const confirmDeleteSingleStudent = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentToDelete.id));
      setStudentToDelete(null);
    }
  };

  const confirmBatchDelete = () => {
    deleteMultipleStudents(selectedStudentIds);
    setSelectedStudentIds([]);
    setShowBatchDeleteModal(false);
  };

  const confirmClearAll = () => {
    clearAllStudents();
    setSelectedStudentIds([]);
    setShowClearAllModal(false);
  };

  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const lines = importText.trim().split('\n');
    const newStudents: Partial<Student>[] = [];

    lines.forEach((line) => {
      // Name, Gender, Group, ParentName, Phone
      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length > 0 && parts[0] && !parts[0].toLowerCase().includes('họ và tên')) {
        newStudents.push({
          name: parts[0],
          gender: (parts[1] === 'Nữ' ? 'Nữ' : 'Nam') as 'Nam' | 'Nữ',
          group: (['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].includes(parts[2]) ? parts[2] : 'Tổ 1') as any,
          parentName: parts[3] || 'Phụ huynh',
          parentPhone: parts[4] || '0900***000',
        });
      }
    });

    if (newStudents.length > 0) {
      batchImportStudents(newStudents);
      setShowImportModal(false);
      setImportText('');
    } else {
      showToast('Định dạng văn bản chưa đúng. Vui lòng kiểm tra lại.', 'warning');
    }
  };

  const handleSaveDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryTitle.trim() || !diaryContent.trim()) return;

    let aiSummary: string | undefined;
    let aiActionItems: string[] | undefined;

    setIsAiSummarizing(true);
    try {
      const prompt = `Bạn là trợ lý AI sư phạm cho cô giáo Lê Thị Giang, chủ nhiệm lớp 4A4. Hãy đọc nhật ký chủ nhiệm sau và đưa ra:
1. Tóm tắt ngắn gọn tâm lý sư phạm (1-2 câu).
2. 2-3 hành động gợi ý cô giáo nên làm để hỗ trợ học sinh hoặc gắn kết lớp.

Nhật ký:
Tiêu đề: ${diaryTitle}
Phân loại: ${diaryCategory}
Nội dung: ${diaryContent}

Trả về định dạng JSON:
{"summary": "...", "actions": ["...", "..."]}`;

      const res = await callGemini(prompt);
      if (res.text) {
        try {
          const cleanJson = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          aiSummary = parsed.summary;
          aiActionItems = parsed.actions;
        } catch {
          aiSummary = res.text.slice(0, 200);
        }
      }
    } catch {
      // non-blocking
    } finally {
      setIsAiSummarizing(false);
    }

    addDiaryEntry({
      title: diaryTitle.trim(),
      content: diaryContent.trim(),
      category: diaryCategory,
      tags: [diaryCategory, 'Lớp 4A4'],
      aiSummary,
      aiActionItems,
    });

    setDiaryTitle('');
    setDiaryContent('');
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanData.title.trim()) return;

    const objectivesList = newPlanData.objectives
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    addPlan({
      title: newPlanData.title.trim(),
      type: newPlanData.type,
      period: newPlanData.period || 'Tuần học hiện tại',
      objectives: objectivesList.length > 0 ? objectivesList : ['Nâng cao nền nếp và tinh thần đoàn kết của lớp'],
      tasks: [
        { content: 'Ổn định chuyên cần và nhắc nhở thời khóa biểu', responsible: 'Cô Giang', deadline: 'Đầu tuần', completed: true },
        { content: 'Kiểm tra vệ sinh và trang trí góc học tập', responsible: 'Ban cán sự lớp', deadline: 'Giữa tuần', completed: false },
        { content: 'Sinh hoạt lớp theo chuyên đề và trao hoa việc tốt', responsible: 'Cả lớp', deadline: 'Thứ Sáu', completed: false },
      ],
      notes: newPlanData.notes || 'Khích lệ tinh thần các em còn nhút nhát.',
    });

    setShowAddPlanModal(false);
    setNewPlanData({ title: '', type: 'week', period: '', objectives: '', notes: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub Tabs Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-2.5 rounded-3xl border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              subTab === 'students'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh sách & Hồ sơ học sinh ({students.length})</span>
          </button>

          <button
            onClick={() => setSubTab('diary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              subTab === 'diary'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Nhật ký chủ nhiệm số ({diary.length})</span>
          </button>

          <button
            onClick={() => setSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              subTab === 'plans'
                ? 'bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kế hoạch chủ nhiệm ({plans.length})</span>
          </button>
        </div>

        {subTab === 'students' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs">
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'card' ? 'bg-white text-sky-800 shadow-2xs font-bold' : 'text-slate-600'
                }`}
                title="Dạng thẻ lưới"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'table' ? 'bg-white text-sky-800 shadow-2xs font-bold' : 'text-slate-600'
                }`}
                title="Dạng bảng danh sách"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={exportStudentsCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              title="Xuất danh sách ra Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất CSV</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              title="Nhập nhanh danh sách học sinh"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nhập CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: STUDENTS DIRECTORY */}
      {subTab === 'students' && (
        <div className="space-y-4">
          {/* PRIMARY ACTION BAR - NÚT THÊM VÀ XÓA HỌC SINH + NẠP 31 HỌC SINH CÔ GIANG */}
          <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-sky-50 via-amber-50 to-emerald-50 border-2 border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-200 text-[#1558AA]">
                  Quản lý danh sách lớp 4A4
                </span>
                <span className="text-xs font-extrabold text-slate-700">
                  Hiện có: <strong className="text-xl text-[#1558AA]">{students.length}</strong> học sinh (Mục tiêu: 31 học sinh)
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Cô giáo Lê Thị Giang có thể thêm học sinh mới, xóa học sinh hoặc nạp nhanh chuẩn 31 học sinh của lớp.
              </p>
            </div>

            {/* MAIN ACTION BUTTONS */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* NÚT THÊM HỌC SINH */}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                title="Mở biểu mẫu thêm học sinh mới vào lớp"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
                <span>+ Thêm học sinh</span>
              </button>

              {/* NÚT XÓA HỌC SINH HIỆN TẠI */}
              {students.length > 0 && (
                <button
                  onClick={() => setShowClearAllModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 text-xs sm:text-sm font-black shadow-xs hover:border-rose-400 active:scale-95 transition-all"
                  title="Xóa toàn bộ danh sách học sinh hiện tại để nhập mới"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Xóa học sinh hiện tại</span>
                </button>
              )}

              {/* NÚT NẠP LẠI 31 HỌC SINH CHUẨN CÔ GIANG */}
              <button
                onClick={resetTo31GiangStudents}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-[#1558AA] border border-sky-300 text-xs font-bold transition-all shadow-2xs hover:scale-[1.01]"
                title="Nạp lại đầy đủ 31 học sinh chính thức của Cô Lê Thị Giang"
              >
                <RotateCcw className="w-4 h-4 text-[#36B8F2]" />
                <span className="hidden lg:inline">Nạp chuẩn 31 học sinh cô Giang</span>
                <span className="lg:hidden">Nạp 31 HS</span>
              </button>
            </div>
          </div>

          {/* BATCH SELECTION BANNER (when items are selected) */}
          {selectedStudentIds.length > 0 && (
            <div className="bg-amber-100/90 border-2 border-amber-300 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-800" />
                <span className="text-xs sm:text-sm font-extrabold text-amber-950">
                  Đã chọn {selectedStudentIds.length} học sinh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBatchDeleteModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa {selectedStudentIds.length} học sinh đã chọn</span>
                </button>
                <button
                  onClick={() => setSelectedStudentIds([])}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          )}

          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã HS, sở thích, thế mạnh..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Select All Checkbox Button */}
              {filteredStudents.length > 0 && (
                <button
                  onClick={handleSelectAllFiltered}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Chọn tất cả học sinh đang hiển thị"
                >
                  {selectedStudentIds.length === filteredStudents.length ? (
                    <CheckSquare className="w-4 h-4 text-sky-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Chọn tất cả ({filteredStudents.length})</span>
                </button>
              )}

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs">
                {(['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const).map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      selectedGroup === group
                        ? 'bg-white text-sky-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {group === 'all' ? 'Tất cả tổ' : group}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setFilterNeedsAttention(!filterNeedsAttention)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition-colors ${
                  filterNeedsAttention
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ⚠️ Cần quan tâm ({students.filter((s) => s.needsAttention).length})
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: CARD GRID */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((s, index) => {
                const isSelected = selectedStudentIds.includes(s.id);

                return (
                  <div
                    key={s.id}
                    className={`p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between relative group ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-300 shadow-md bg-sky-50/20'
                        : 'border-amber-100/90 shadow-xs hover:shadow-md hover:border-sky-300'
                    }`}
                  >
                    <div>
                      {/* Top row: Checkbox, Avatar, Name, Code, Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Selection Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSelectStudent(s.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-sky-600 fill-sky-100" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                            )}
                          </button>

                          <div
                            onClick={() => setSelectedStudentForModal(s)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <div className={`w-12 h-12 rounded-2xl ${s.avatarColor} text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0`}>
                              {s.name.charAt(s.name.lastIndexOf(' ') + 1)}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                                <span>{s.name}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">#{index + 1}</span>
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                                  {s.code}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                                  {s.group}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {s.gender}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                            🌸 {s.flowerCount}
                          </span>
                          <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                            ❤️ {s.heartCount}
                          </span>
                        </div>
                      </div>

                      {s.needsAttention && (
                        <div className="mt-3 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
                          <span>⚠️ {s.attentionReason || 'Cần tìm hiểu thêm'}</span>
                        </div>
                      )}

                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <p className="line-clamp-1">
                          <strong className="text-slate-800">Thế mạnh:</strong> {s.strengths.join(', ') || 'Chăm ngoan'}
                        </p>
                        <p className="line-clamp-1">
                          <strong className="text-slate-800">Sở thích:</strong> {s.hobbies.join(', ') || 'Vẽ tranh, đọc truyện'}
                        </p>
                        <p className="line-clamp-1 text-slate-500 italic">
                          <strong className="text-slate-700 not-italic">Ước mơ:</strong> "{s.dream || 'Đang khám phá'}"
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: Parent info, Delete button, View profile button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-500 truncate max-w-[140px]" title={`PH: ${s.parentName} - ${s.parentPhone}`}>
                        <span>PH: {s.parentName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* NÚT XÓA HỌC SINH NÀY */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentToDelete(s);
                          }}
                          className="flex items-center gap-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100/70 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors border border-rose-200 shadow-2xs"
                          title={`Xóa học sinh ${s.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Xóa</span>
                        </button>

                        {/* NÚT XEM HỒ SƠ */}
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForModal(s)}
                          className="flex items-center gap-1 text-[#1558AA] hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors border border-sky-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#36B8F2]" />
                          <span>Hồ sơ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 text-center w-10">
                        <button
                          type="button"
                          onClick={handleSelectAllFiltered}
                          className="text-slate-400 hover:text-sky-600"
                        >
                          {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </th>
                      <th className="p-3 text-center w-12">STT</th>
                      <th className="p-3">Mã HS</th>
                      <th className="p-3">Họ và tên</th>
                      <th className="p-3">Giới tính</th>
                      <th className="p-3">Tổ</th>
                      <th className="p-3">Ngày sinh</th>
                      <th className="p-3">Phụ huynh & SĐT</th>
                      <th className="p-3">Khen thưởng</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s, idx) => {
                      const isSelected = selectedStudentIds.includes(s.id);
                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-sky-50/40' : ''
                          }`}
                        >
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelectStudent(s.id)}
                              className="text-slate-400 hover:text-sky-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-sky-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px]">
                              {s.code}
                            </span>
                          </td>
                          <td className="p-3 font-extrabold text-slate-900">
                            <button
                              onClick={() => setSelectedStudentForModal(s)}
                              className="hover:text-blue-700 hover:underline text-left flex items-center gap-1.5"
                            >
                              <span>{s.name}</span>
                              {s.needsAttention && (
                                <span className="text-amber-600 text-xs" title="Cần quan tâm">⚠️</span>
                              )}
                            </button>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{s.gender}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                              {s.group}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{s.dob}</td>
                          <td className="p-3 text-slate-600">
                            <div>{s.parentName}</div>
                            <div className="text-[10px] text-slate-400">{s.parentPhone}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 font-bold text-[11px]">
                              <span className="text-amber-600">🌸 {s.flowerCount}</span>
                              <span className="text-rose-600">❤️ {s.heartCount}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedStudentForModal(s)}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#1558AA] hover:bg-sky-100 font-bold text-[11px] transition-colors border border-sky-200"
                                title="Xem chi tiết hồ sơ"
                              >
                                Xem
                              </button>
                              <button
                                onClick={() => setStudentToDelete(s)}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition-colors border border-rose-200 flex items-center gap-1"
                                title={`Xóa học sinh ${s.name}`}
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                <span>Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700">Chưa có học sinh nào phù hợp</h4>
              <p className="text-xs text-slate-500">
                Cô có thể thêm học sinh mới hoặc bấm nút nạp lại 31 học sinh chuẩn của lớp 4A4.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  + Thêm học sinh
                </button>
                <button
                  onClick={resetTo31GiangStudents}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  Nạp 31 học sinh chuẩn
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: HOMEROOM DIARY */}
      {subTab === 'diary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Diary Entry Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Ghi chép Nhật ký Chủ nhiệm mới</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ghi lại sự việc, quan sát tâm lý hoặc trao đổi với phụ huynh. AI sẽ tự động phân tích và gợi ý hành động cần làm.
            </p>

            <form onSubmit={handleSaveDiary} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Phân loại nhật ký:</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500"
                  value={diaryCategory}
                  onChange={(e) => setDiaryCategory(e.target.value as any)}
                >
                  <option value="Hoạt động ngày">Hoạt động ngày</option>
                  <option value="Quan sát tâm lý">Quan sát tâm lý học sinh</option>
                  <option value="Họp phụ huynh">Trao đổi / Phối hợp phụ huynh</option>
                  <option value="Khen thưởng">Tuyên dương & Khen thưởng</option>
                  <option value="Kế hoạch tuần">Ý tưởng & Kế hoạch tuần</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Tiêu đề nhật ký:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quan sát tiết học trải nghiệm, Đôi bạn cùng tiến..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={diaryTitle}
                  onChange={(e) => setDiaryTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Nội dung ghi chép chi tiết:</label>
                <textarea
                  rows={4}
                  placeholder="Mô tả quan sát về thái độ, hành vi, khó khăn hoặc điểm tiến bộ của các con..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAiSummarizing}
                className="w-full py-2.5 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isAiSummarizing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI đang phân tích tâm lý sư phạm...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Lưu nhật ký & Nhận phân tích AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Diary Log List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">
                Lịch sử Nhật ký Chủ nhiệm ({diary.length})
              </h3>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {diary.map((entry) => (
                <div key={entry.id} className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                        {entry.category}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{entry.date}</span>
                    </div>

                    <button
                      onClick={() => deleteDiaryEntry(entry.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Xóa nhật ký"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{entry.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {entry.content}
                  </p>

                  {/* AI Summary and Action Items */}
                  {entry.aiSummary && (
                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Trợ lý AI phân tích:</span>
                      </div>
                      <p className="text-indigo-950 leading-relaxed">{entry.aiSummary}</p>
                      {entry.aiActionItems && entry.aiActionItems.length > 0 && (
                        <div className="mt-1 pt-2 border-t border-indigo-100 space-y-1">
                          <strong className="text-[11px] text-indigo-900 block">Việc cần làm gợi ý:</strong>
                          {entry.aiActionItems.map((act, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: HOMEROOM PLANS */}
      {subTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Kế hoạch Chủ nhiệm Số hóa</h3>
              <p className="text-xs text-slate-500">
                Xây dựng và kiểm tra tiến độ các mục tiêu theo Tuần, Tháng, Học kỳ và Năm học.
              </p>
            </div>
            <button
              onClick={() => setShowAddPlanModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Lập kế hoạch mới</span>
            </button>
          </div>

          <div className="space-y-6">
            {plans.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                        Kế hoạch {p.type === 'week' ? 'Tuần' : p.type === 'month' ? 'Tháng' : p.type === 'semester' ? 'Học kỳ' : 'Năm học'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">Thời gian: {p.period}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mt-1">{p.title}</h4>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In kế hoạch</span>
                  </button>
                </div>

                {/* Objectives */}
                <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Mục tiêu trọng tâm:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {p.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-800">
                        <span className="text-amber-500 font-bold shrink-0">✦</span>
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Checklist */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Danh mục công việc & Người thực hiện:</h5>
                  <div className="space-y-2">
                    {p.tasks.map((task, idx) => (
                      <div
                        key={idx}
                        onClick={() => togglePlanTask(p.id, idx)}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          task.completed
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                          />
                          <span className={`font-semibold ${task.completed ? 'line-through opacity-70' : ''}`}>
                            {task.content}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] shrink-0">
                          <span>Phụ trách: <strong>{task.responsible}</strong></span>
                          <span>Hạn: <strong>{task.deadline}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {p.notes && (
                  <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
                    Ghi chú: {p.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: THÊM HỌC SINH MỚI */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-amber-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Thêm học sinh mới vào Lớp 4A4</h3>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Họ và tên học sinh (*):</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Hoàng Gia Bảo"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 font-semibold"
                    value={newStudentData.name}
                    onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Mã học sinh:</label>
                  <input
                    type="text"
                    placeholder="4A4-32"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                    value={newStudentData.code}
                    onChange={(e) => setNewStudentData({ ...newStudentData, code: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Giới tính:</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    value={newStudentData.gender}
                    onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.target.value as any })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Tổ học tập:</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    value={newStudentData.group}
                    onChange={(e) => setNewStudentData({ ...newStudentData, group: e.target.value as any })}
                  >
                    <option value="Tổ 1">Tổ 1</option>
                    <option value="Tổ 2">Tổ 2</option>
                    <option value="Tổ 3">Tổ 3</option>
                    <option value="Tổ 4">Tổ 4</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Ngày sinh:</label>
                  <input
                    type="date"
                    className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-200 text-xs"
                    value={newStudentData.dob}
                    onChange={(e) => setNewStudentData({ ...newStudentData, dob: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Sở trường / Điểm mạnh (cách nhau dấu phẩy):</label>
                <input
                  type="text"
                  placeholder="Hòa đồng, thích vẽ tranh, học tốt môn Toán"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={newStudentData.strengths}
                  onChange={(e) => setNewStudentData({ ...newStudentData, strengths: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Sở thích:</label>
                <input
                  type="text"
                  placeholder="Đọc truyện tranh, đá bóng, nuôi mèo..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={newStudentData.hobbies}
                  onChange={(e) => setNewStudentData({ ...newStudentData, hobbies: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Ước mơ của học sinh:</label>
                <input
                  type="text"
                  placeholder="Bác sĩ, họa sĩ, kỹ sư robot, giáo viên..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={newStudentData.dream}
                  onChange={(e) => setNewStudentData({ ...newStudentData, dream: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Họ tên phụ huynh:</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    value={newStudentData.parentName}
                    onChange={(e) => setNewStudentData({ ...newStudentData, parentName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Số điện thoại phụ huynh:</label>
                  <input
                    type="text"
                    placeholder="0987***000"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    value={newStudentData.parentPhone}
                    onChange={(e) => setNewStudentData({ ...newStudentData, parentPhone: e.target.value })}
                  />
                </div>
              </div>

              {/* Needs attention toggle */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={newStudentData.needsAttention}
                    onChange={(e) => setNewStudentData({ ...newStudentData, needsAttention: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Học sinh này cần cô giáo quan tâm, hỗ trợ đặc biệt</span>
                </label>
                {newStudentData.needsAttention && (
                  <input
                    type="text"
                    placeholder="Lý do cần quan tâm (nhút nhát, khó khăn tính toán, lo âu...)"
                    className="w-full px-3 py-1.5 rounded-xl border border-amber-300 text-xs bg-white"
                    value={newStudentData.attentionReason}
                    onChange={(e) => setNewStudentData({ ...newStudentData, attentionReason: e.target.value })}
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold shadow-sm transition-all"
                >
                  Thêm vào lớp 4A4
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA TỪNG HỌC SINH */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-rose-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Xác nhận xóa học sinh?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cô có chắc chắn muốn xóa học sinh <strong className="text-rose-700 font-extrabold">{studentToDelete.name}</strong> ({studentToDelete.code}) khỏi danh sách lớp 4A4 không?
              </p>
              <p className="text-[11px] text-slate-400 italic">
                (Cô có thể thêm lại hoặc bấm "Nạp chuẩn 31 học sinh cô Giang" bất cứ lúc nào).
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteSingleStudent}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/20 transition-all"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA NHIỀU HỌC SINH ĐÃ CHỌN */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-rose-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Xóa {selectedStudentIds.length} học sinh đã chọn?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cô có chắc chắn muốn xóa đồng thời <strong className="text-rose-700">{selectedStudentIds.length} học sinh</strong> đã được tích chọn khỏi danh sách lớp không?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmBatchDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/20 transition-all"
              >
                Xóa {selectedStudentIds.length} học sinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA TOÀN BỘ HỌC SINH HIỆN TẠI */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border-2 border-rose-300 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Xóa toàn bộ học sinh hiện tại?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cô có chắc chắn muốn xóa TOÀN BỘ <strong className="text-rose-700 font-extrabold">{students.length} học sinh hiện tại</strong> của lớp 4A4 để nhập mới từ đầu không?
              </p>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 text-left">
                💡 <strong>Ghi chú:</strong> Sau khi xóa, cô luôn có thể nhấn nút <span className="font-bold underline">"Nạp chuẩn 31 học sinh cô Giang"</span> để khôi phục lại danh sách lớp bất kỳ khi nào.
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmClearAll}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/20 transition-all"
              >
                Xóa tất cả học sinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NHẬP DANH SÁCH CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-amber-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-black text-slate-900">Nhập danh sách học sinh từ CSV / Excel</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportCSVSubmit} className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Dán danh sách học sinh theo từng dòng (mỗi dòng cách nhau dấu phẩy): <br />
                <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800">
                  Họ và tên, Giới tính (Nam/Nữ), Tổ (Tổ 1-4), Tên PH, Số điện thoại
                </code>
              </p>

              <textarea
                rows={6}
                placeholder={`Nguyễn Văn An, Nam, Tổ 1, Nguyễn Văn Bình, 0981234567\nTrần Thị Mai, Nữ, Tổ 2, Trần Văn Cường, 0978901234`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-sky-500"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                required
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-sky-600 to-[#1558AA] text-white font-extrabold shadow-sm"
                >
                  Tiến hành nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LẬP KẾ HOẠCH MỚI */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-amber-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Lập Kế hoạch Chủ nhiệm mới</h3>
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Tiêu đề kế hoạch:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kế hoạch tuần 9: Thi đua lập thành tích chào mừng ngày 20/11"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={newPlanData.title}
                  onChange={(e) => setNewPlanData({ ...newPlanData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Loại kế hoạch:</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    value={newPlanData.type}
                    onChange={(e) => setNewPlanData({ ...newPlanData, type: e.target.value as any })}
                  >
                    <option value="week">Kế hoạch Tuần</option>
                    <option value="month">Kế hoạch Tháng</option>
                    <option value="semester">Kế hoạch Học kỳ</option>
                    <option value="year">Kế hoạch Năm học</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Thời gian thực hiện:</label>
                  <input
                    type="text"
                    placeholder="Tuần 9 (Tháng 11/2026)"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    value={newPlanData.period}
                    onChange={(e) => setNewPlanData({ ...newPlanData, period: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Mục tiêu trọng tâm (mỗi dòng một mục tiêu):</label>
                <textarea
                  rows={3}
                  placeholder={`100% học sinh đi học đúng giờ\nTrao ít nhất 20 đóa hoa việc tốt\nĐẩy mạnh đôi bạn cùng tiến môn Toán`}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                  value={newPlanData.objectives}
                  onChange={(e) => setNewPlanData({ ...newPlanData, objectives: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Ghi chú thêm:</label>
                <input
                  type="text"
                  placeholder="Chú ý các em học sinh có hoàn cảnh đặc biệt..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  value={newPlanData.notes}
                  onChange={(e) => setNewPlanData({ ...newPlanData, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-[#1558AA] to-[#36B8F2] text-white font-extrabold shadow-sm"
                >
                  Lưu kế hoạch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
