import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  SurveyResponse,
  Task,
  GoodDeed,
  AttendanceRecord,
  EmotionEntry,
  DiaryEntry,
  HomeroomPlan,
  ParentAnnouncement,
  ParentMessage,
  ClassMaterial,
  ClassSettings,
  HappinessPillar,
} from '../types';
import {
  initialSettings,
  initialStudents,
  initialSurveys,
  initialTasks,
  initialGoodDeeds,
  initialAttendance,
  initialEmotions,
  initialDiary,
  initialPlans,
  initialAnnouncements,
  initialMessages,
  initialMaterials,
  initialHappinessPillars,
} from '../data/initialData';
import { checkAiHealth } from '../services/geminiService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentParentStudentId: string;
  setCurrentParentStudentId: (id: string) => void;
  settings: ClassSettings;
  updateSettings: (newSettings: Partial<ClassSettings>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'code'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  deleteMultipleStudents: (ids: string[]) => void;
  clearAllStudents: () => void;
  resetTo31GiangStudents: () => void;
  batchImportStudents: (newStudents: Partial<Student>[]) => void;
  selectedStudentForModal: Student | null;
  setSelectedStudentForModal: (student: Student | null) => void;
  surveys: SurveyResponse[];
  submitSurvey: (survey: Omit<SurveyResponse, 'id' | 'date'>) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  goodDeeds: GoodDeed[];
  addGoodDeed: (deed: Omit<GoodDeed, 'id' | 'date' | 'verifiedByTeacher'>) => void;
  verifyGoodDeed: (id: string) => void;
  attendance: AttendanceRecord;
  updateAttendanceStatus: (studentId: string, status: 'present' | 'absent_excused' | 'absent_unexcused' | 'late') => void;
  markAllPresent: () => void;
  emotions: EmotionEntry[];
  logEmotion: (entry: Omit<EmotionEntry, 'id' | 'date'>) => void;
  diary: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'date'>) => void;
  deleteDiaryEntry: (id: string) => void;
  plans: HomeroomPlan[];
  addPlan: (plan: Omit<HomeroomPlan, 'id'>) => void;
  togglePlanTask: (planId: string, taskIndex: number) => void;
  announcements: ParentAnnouncement[];
  addAnnouncement: (announcement: Omit<ParentAnnouncement, 'id' | 'date' | 'responsesCount' | 'acknowledgedBy'>) => void;
  acknowledgeAnnouncement: (announcementId: string, studentId: string) => void;
  messages: ParentMessage[];
  sendParentMessage: (content: string, studentId: string) => void;
  replyParentMessage: (messageId: string, reply: string) => void;
  materials: ClassMaterial[];
  addMaterial: (material: Omit<ClassMaterial, 'id' | 'dateCreated'>) => void;
  deleteMaterial: (id: string) => void;
  happinessPillars: HappinessPillar[];
  addPillarBlossom: (pillarId: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  resetToDefaultData: () => void;
  exportStudentsCSV: () => void;
  aiStatus: { hasApiKey: boolean; isOnline: boolean };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'lop4_hanhphuc_';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to read from localStorage: ${key}`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write to localStorage: ${key}`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = getStorage<string>('role', 'teacher');
    return saved === 'presentation' ? 'teacher' : (saved as UserRole);
  });
  const [activeTab, setActiveTabState] = useState<string>(() => {
    const saved = getStorage<string>('activeTab', 'overview');
    return saved === 'presentation' ? 'overview' : saved;
  });
  const [currentStudentId, setCurrentStudentId] = useState<string>('hs-01');
  const [currentParentStudentId, setCurrentParentStudentId] = useState<string>('hs-02');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  const [settings, setSettings] = useState<ClassSettings>(() => {
    const saved = getStorage('settings', initialSettings);
    return { ...saved, totalStudentsTarget: 31 };
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = getStorage<Student[]>('students', initialStudents);
    // If hs-31 is missing from saved data, ensure student 31 is included
    if (saved && saved.length > 0 && !saved.some((s) => s.id === 'hs-31')) {
      const student31 = initialStudents.find((s) => s.id === 'hs-31');
      if (student31) {
        return [...saved, student31];
      }
    }
    return saved;
  });
  const [surveys, setSurveys] = useState<SurveyResponse[]>(() => getStorage('surveys', initialSurveys));
  const [tasks, setTasks] = useState<Task[]>(() => getStorage('tasks', initialTasks));
  const [goodDeeds, setGoodDeeds] = useState<GoodDeed[]>(() => getStorage('goodDeeds', initialGoodDeeds));
  const [attendance, setAttendance] = useState<AttendanceRecord>(() => {
    const saved = getStorage<AttendanceRecord>('attendance', initialAttendance);
    if (saved?.records && !saved.records['hs-31']) {
      return { ...saved, records: { ...saved.records, 'hs-31': 'present' } };
    }
    return saved;
  });
  const [emotions, setEmotions] = useState<EmotionEntry[]>(() => getStorage('emotions', initialEmotions));
  const [diary, setDiary] = useState<DiaryEntry[]>(() => getStorage('diary', initialDiary));
  const [plans, setPlans] = useState<HomeroomPlan[]>(() => getStorage('plans', initialPlans));
  const [announcements, setAnnouncements] = useState<ParentAnnouncement[]>(() => getStorage('announcements', initialAnnouncements));
  const [messages, setMessages] = useState<ParentMessage[]>(() => getStorage('messages', initialMessages));
  const [materials, setMaterials] = useState<ClassMaterial[]>(() => getStorage('materials', initialMaterials));
  const [happinessPillars, setHappinessPillars] = useState<HappinessPillar[]>(() => getStorage('happinessPillars', initialHappinessPillars));

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<{ hasApiKey: boolean; isOnline: boolean }>({ hasApiKey: false, isOnline: false });

  // Check AI connection status on mount
  useEffect(() => {
    checkAiHealth().then((status) => {
      setAiStatus(status);
    });
  }, []);

  // Sync to localStorage
  useEffect(() => setStorage('role', role), [role]);
  useEffect(() => setStorage('activeTab', activeTab), [activeTab]);
  useEffect(() => setStorage('settings', settings), [settings]);
  useEffect(() => setStorage('students', students), [students]);
  useEffect(() => setStorage('surveys', surveys), [surveys]);
  useEffect(() => setStorage('tasks', tasks), [tasks]);
  useEffect(() => setStorage('goodDeeds', goodDeeds), [goodDeeds]);
  useEffect(() => setStorage('attendance', attendance), [attendance]);
  useEffect(() => setStorage('emotions', emotions), [emotions]);
  useEffect(() => setStorage('diary', diary), [diary]);
  useEffect(() => setStorage('plans', plans), [plans]);
  useEffect(() => setStorage('announcements', announcements), [announcements]);
  useEffect(() => setStorage('messages', messages), [messages]);
  useEffect(() => setStorage('materials', materials), [materials]);
  useEffect(() => setStorage('happinessPillars', happinessPillars), [happinessPillars]);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'student') {
      setActiveTabState('happy_activities');
    } else if (newRole === 'parent') {
      setActiveTabState('parent_connect');
    }
    showToast(`Đã chuyển sang vai trò: ${newRole === 'teacher' ? 'Cô giáo Chủ nhiệm' : newRole === 'student' ? 'Học sinh' : 'Phụ huynh'}`, 'info');
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSettings = (newSettings: Partial<ClassSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Đã lưu cấu hình lớp học thành công!', 'success');
  };

  const addStudent = (newStudent: Omit<Student, 'id' | 'code'>) => {
    const nextIndex = students.length + 1;
    const code = `4A4-${nextIndex < 10 ? '0' + nextIndex : nextIndex}`;
    const id = `hs-${Date.now().toString().slice(-4)}`;
    const student: Student = {
      ...newStudent,
      id,
      code,
      flowerCount: 0,
      heartCount: 0,
    };
    setStudents((prev) => [student, ...prev]);
    showToast(`Đã thêm học sinh ${student.name} vào danh sách lớp.`, 'success');
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Đã cập nhật hồ sơ học sinh thành công.', 'success');
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    const name = target ? target.name : 'học sinh';
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentForModal?.id === id) {
      setSelectedStudentForModal(null);
    }
    showToast(`Đã xóa ${name} khỏi danh sách lớp 4A4.`, 'warning');
  };

  const deleteMultipleStudents = (ids: string[]) => {
    if (ids.length === 0) return;
    setStudents((prev) => prev.filter((s) => !ids.includes(s.id)));
    if (selectedStudentForModal && ids.includes(selectedStudentForModal.id)) {
      setSelectedStudentForModal(null);
    }
    showToast(`Đã xóa thành công ${ids.length} học sinh khỏi danh sách lớp.`, 'warning');
  };

  const clearAllStudents = () => {
    setStudents([]);
    setSelectedStudentForModal(null);
    showToast('Đã xóa toàn bộ học sinh hiện tại. Cô có thể thêm học sinh mới hoặc nạp lại 31 học sinh chuẩn bất kỳ lúc nào.', 'warning');
  };

  const resetTo31GiangStudents = () => {
    setStudents(initialStudents);
    setSelectedStudentForModal(null);
    const newRecords: Record<string, 'present' | 'absent_excused' | 'absent_unexcused' | 'late'> = {};
    initialStudents.forEach((s) => {
      newRecords[s.id] = 'present';
    });
    setAttendance({ date: '2026-10-21', records: newRecords });
    showToast('Đã nạp thành công 31 học sinh lớp 4A4 của Cô Lê Thị Giang! 🎉', 'success');
  };

  const batchImportStudents = (newStudentsData: Partial<Student>[]) => {
    const imported: Student[] = newStudentsData.map((data, idx) => {
      const num = students.length + idx + 1;
      return {
        id: `hs-import-${Date.now()}-${idx}`,
        code: `4A4-${num < 10 ? '0' + num : num}`,
        name: data.name || `Học sinh mới ${idx + 1}`,
        gender: data.gender || 'Nam',
        dob: data.dob || '2016-01-01',
        group: data.group || 'Tổ 1',
        hobbies: data.hobbies || ['Vẽ tranh', 'Đọc sách'],
        strengths: data.strengths || ['Chăm ngoan'],
        challenges: data.challenges || ['Cần rèn thêm sự tự tin'],
        goals: data.goals || 'Tiến bộ từng ngày cùng lớp 4A4',
        needsAttention: Boolean(data.needsAttention),
        attentionReason: data.attentionReason,
        avatarColor: 'bg-sky-500',
        parentName: data.parentName || 'Phụ huynh học sinh',
        parentPhone: data.parentPhone || '0900***000',
        progressScores: { learning: 8, qualities: 9, capabilities: 8, teamwork: 8, responsibility: 8, activities: 8 },
        dream: data.dream || 'Ước mơ tuổi thơ',
        flowerCount: 0,
        heartCount: 0,
      };
    });
    setStudents((prev) => [...prev, ...imported]);
    showToast(`Đã nhập thành công ${imported.length} học sinh từ tệp.`, 'success');
  };

  const submitSurvey = (surveyData: Omit<SurveyResponse, 'id' | 'date'>) => {
    const newSurvey: SurveyResponse = {
      ...surveyData,
      id: `sur-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setSurveys((prev) => [newSurvey, ...prev.filter((s) => s.studentId !== surveyData.studentId)]);
    showToast('Đã lưu phiếu khảo sát thấu hiểu học sinh!', 'success');
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Đã giao nhiệm vụ mới thành công!', 'success');
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    showToast('Đã cập nhật tiến độ nhiệm vụ.', 'info');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Đã xóa nhiệm vụ.', 'info');
  };

  const addGoodDeed = (deedData: Omit<GoodDeed, 'id' | 'date' | 'verifiedByTeacher'>) => {
    const newDeed: GoodDeed = {
      ...deedData,
      id: `gd-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedByTeacher: true,
    };
    setGoodDeeds((prev) => [newDeed, ...prev]);

    // Increase flower or heart count for student
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === deedData.studentId) {
          return {
            ...s,
            flowerCount: deedData.type === 'flower' ? s.flowerCount + 1 : s.flowerCount,
            heartCount: deedData.type === 'heart' ? s.heartCount + 1 : s.heartCount,
          };
        }
        return s;
      })
    );
    showToast(`Đã ghi nhận việc tốt cho em ${deedData.studentName}!`, 'success');
  };

  const verifyGoodDeed = (id: string) => {
    setGoodDeeds((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verifiedByTeacher: true } : d))
    );
    showToast('Đã phê duyệt và chứng nhận việc tốt!', 'success');
  };

  const updateAttendanceStatus = (studentId: string, status: 'present' | 'absent_excused' | 'absent_unexcused' | 'late') => {
    setAttendance((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [studentId]: status,
      },
    }));
  };

  const markAllPresent = () => {
    const updated: { [studentId: string]: 'present' } = {};
    students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendance((prev) => ({
      ...prev,
      records: updated,
    }));
    showToast('Đã đánh dấu 100% học sinh có mặt hôm nay.', 'success');
  };

  const logEmotion = (entryData: Omit<EmotionEntry, 'id' | 'date'>) => {
    const newEntry: EmotionEntry = {
      ...entryData,
      id: `emo-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setEmotions((prev) => [newEntry, ...prev]);
    showToast('Cảm ơn em đã chia sẻ cảm xúc cùng cô giáo!', 'success');
  };

  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'date'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: `diary-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setDiary((prev) => [newEntry, ...prev]);
    showToast('Đã ghi chép nhật ký chủ nhiệm thành công!', 'success');
  };

  const deleteDiaryEntry = (id: string) => {
    setDiary((prev) => prev.filter((d) => d.id !== id));
    showToast('Đã xóa mục nhật ký.', 'info');
  };

  const addPlan = (planData: Omit<HomeroomPlan, 'id'>) => {
    const newPlan: HomeroomPlan = {
      ...planData,
      id: `plan-${Date.now()}`,
    };
    setPlans((prev) => [newPlan, ...prev]);
    showToast('Đã lưu kế hoạch chủ nhiệm thành công!', 'success');
  };

  const togglePlanTask = (planId: string, taskIndex: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const updatedTasks = [...p.tasks];
          updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
          return { ...p, tasks: updatedTasks };
        }
        return p;
      })
    );
  };

  const addAnnouncement = (annData: Omit<ParentAnnouncement, 'id' | 'date' | 'responsesCount' | 'acknowledgedBy'>) => {
    const newAnn: ParentAnnouncement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      responsesCount: 0,
      acknowledgedBy: [],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Đã phát hành thông báo phụ huynh thành công!', 'success');
  };

  const acknowledgeAnnouncement = (announcementId: string, studentId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === announcementId) {
          const already = a.acknowledgedBy.includes(studentId);
          if (already) return a;
          return {
            ...a,
            acknowledgedBy: [...a.acknowledgedBy, studentId],
            responsesCount: a.responsesCount + 1,
          };
        }
        return a;
      })
    );
    showToast('Đã xác nhận đã đọc thông báo.', 'success');
  };

  const sendParentMessage = (content: string, studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const newMsg: ParentMessage = {
      id: `msg-${Date.now()}`,
      studentId,
      studentName: student?.name || 'Học sinh',
      parentName: student?.parentName || 'Phụ huynh',
      date: new Date().toISOString().split('T')[0],
      content,
      status: 'pending',
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast('Tin nhắn của phụ huynh đã được gửi đến cô giáo!', 'success');
  };

  const replyParentMessage = (messageId: string, reply: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reply,
              replyDate: new Date().toISOString().split('T')[0],
              status: 'replied',
            }
          : m
      )
    );
    showToast('Đã gửi phản hồi đến phụ huynh!', 'success');
  };

  const addMaterial = (matData: Omit<ClassMaterial, 'id' | 'dateCreated'>) => {
    const newMat: ClassMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0],
    };
    setMaterials((prev) => [newMat, ...prev]);
    showToast('Đã thêm học liệu vào thư viện chủ nhiệm số!', 'success');
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('Đã xóa tài liệu khỏi thư viện.', 'info');
  };

  const addPillarBlossom = (pillarId: string) => {
    setHappinessPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId
          ? {
              ...p,
              activitiesCount: p.activitiesCount + 1,
              score: Math.min(100, p.score + 1),
            }
          : p
      )
    );
    showToast('Một đóa hoa hạnh phúc vừa nở rộ trên Cây Hạnh Phúc Lớp 4A4! 🌸', 'success');
  };

  const resetToDefaultData = () => {
    setSettings(initialSettings);
    setStudents(initialStudents);
    setSurveys(initialSurveys);
    setTasks(initialTasks);
    setGoodDeeds(initialGoodDeeds);
    setAttendance(initialAttendance);
    setEmotions(initialEmotions);
    setDiary(initialDiary);
    setPlans(initialPlans);
    setAnnouncements(initialAnnouncements);
    setMessages(initialMessages);
    setMaterials(initialMaterials);
    setHappinessPillars(initialHappinessPillars);
    localStorage.clear();
    showToast('Đã nạp toàn bộ 31 học sinh và dữ liệu lớp 4A4 thành công!', 'success');
  };

  const exportStudentsCSV = () => {
    const header = 'Mã HS,Họ và tên,Giới tính,Ngày sinh,Tổ,Sở trường,Mục tiêu,Hoa việc tốt,Trái tim yêu thương,Phụ huynh,Số điện thoại\n';
    const rows = students
      .map(
        (s) =>
          `"${s.code}","${s.name}","${s.gender}","${s.dob}","${s.group}","${s.strengths.join('; ')}","${s.goals}",${s.flowerCount},${s.heartCount},"${s.parentName}","${s.parentPhone}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Danh_sach_Lop_4A4_${settings.schoolYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất tệp CSV danh sách lớp 4A4 thành công!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        currentStudentId,
        setCurrentStudentId,
        currentParentStudentId,
        setCurrentParentStudentId,
        settings,
        updateSettings,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        deleteMultipleStudents,
        clearAllStudents,
        resetTo31GiangStudents,
        batchImportStudents,
        selectedStudentForModal,
        setSelectedStudentForModal,
        surveys,
        submitSurvey,
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        goodDeeds,
        addGoodDeed,
        verifyGoodDeed,
        attendance,
        updateAttendanceStatus,
        markAllPresent,
        emotions,
        logEmotion,
        diary,
        addDiaryEntry,
        deleteDiaryEntry,
        plans,
        addPlan,
        togglePlanTask,
        announcements,
        addAnnouncement,
        acknowledgeAnnouncement,
        messages,
        sendParentMessage,
        replyParentMessage,
        materials,
        addMaterial,
        deleteMaterial,
        happinessPillars,
        addPillarBlossom,
        toasts,
        showToast,
        dismissToast,
        resetToDefaultData,
        exportStudentsCSV,
        aiStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
