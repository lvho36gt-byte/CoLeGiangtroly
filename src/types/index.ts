export type UserRole = 'teacher' | 'student' | 'parent';

export type EmotionType = 'happy' | 'peaceful' | 'neutral' | 'worried' | 'sad';

export interface EmotionEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  emotion: EmotionType;
  reflection?: string;
  isPrivate?: boolean;
}

export interface Student {
  id: string;
  code: string; // Mã học sinh: 4A4-01, 4A4-02...
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  group: 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
  hobbies: string[];
  strengths: string[];
  challenges: string[];
  goals: string;
  needsAttention: boolean;
  attentionReason?: string;
  avatarColor: string;
  parentName: string;
  parentPhone: string;
  progressScores: {
    learning: number; // 1-10
    qualities: number; // Phẩm chất (1-10)
    capabilities: number; // Năng lực (1-10)
    teamwork: number; // Kỹ năng hợp tác (1-10)
    responsibility: number; // Tinh thần trách nhiệm (1-10)
    activities: number; // Hoạt động tập thể (1-10)
  };
  dream: string;
  flowerCount: number;
  heartCount: number;
}

export interface SurveyResponse {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  // 5 nhóm khảo sát
  q1_hobbiesAndDreams: string; // Sở thích và ước mơ
  q2_myStrengths: string; // Điểm mạnh bản thân
  q3_myDifficulties: string; // Điều em cảm thấy khó khăn
  q4_desiredEnvironment: string; // Môi trường học tập em mong muốn
  q5_trustedPerson: string; // Người em muốn chia sẻ khi cần giúp đỡ
  favoriteActivity: string;
  feelHappyWhen: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: 'all' | string; // 'all' or studentId
  studentName?: string;
  group?: string;
  category: 'Học tập' | 'Nền nếp' | 'Kỹ năng sống' | 'Hoạt động nhóm' | 'Việc tốt';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  points: number;
}

export interface GoodDeed {
  id: string;
  studentId: string;
  studentName: string;
  group: string;
  title: string;
  description: string;
  date: string;
  type: 'heart' | 'flower';
  verifiedByTeacher: boolean;
}

export interface AttendanceRecord {
  date: string;
  records: {
    [studentId: string]: 'present' | 'absent_excused' | 'absent_unexcused' | 'late';
  };
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: 'Hoạt động ngày' | 'Họp phụ huynh' | 'Khen thưởng' | 'Quan sát tâm lý' | 'Kế hoạch tuần';
  tags: string[];
  aiSummary?: string;
  aiActionItems?: string[];
}

export interface HomeroomPlan {
  id: string;
  title: string;
  type: 'week' | 'month' | 'semester' | 'year';
  period: string; // e.g., "Tuần 8 (Tháng 10/2026)"
  objectives: string[];
  tasks: {
    content: string;
    responsible: string;
    deadline: string;
    completed: boolean;
  }[];
  notes: string;
}

export interface ParentAnnouncement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'Họp phụ huynh' | 'Nhắc lịch học' | 'Khen ngợi' | 'Phối hợp rèn luyện' | 'Cảm ơn';
  tone: 'Ấm áp' | 'Trang trọng' | 'Ngắn gọn' | 'Khích lệ';
  targetAudience: 'Toàn thể lớp' | string; // studentId or 'Toàn thể lớp'
  responsesCount: number;
  acknowledgedBy: string[]; // array of studentIds
}

export interface ParentMessage {
  id: string;
  studentId: string;
  parentName: string;
  studentName: string;
  date: string;
  content: string;
  reply?: string;
  replyDate?: string;
  status: 'pending' | 'replied';
}

export interface ClassMaterial {
  id: string;
  title: string;
  category: 'Kế hoạch chủ nhiệm' | 'Phiếu theo dõi nền nếp' | 'Sổ liên lạc số' | 'Bảng thi đua lớp' | 'Hồ sơ tiến bộ học sinh' | 'Góc lớp học hạnh phúc';
  description: string;
  content: string;
  dateCreated: string;
  tags: string[];
  isAiGenerated?: boolean;
}

export interface ClassSettings {
  schoolName: string;
  teacherName: string;
  className: string;
  schoolYear: string;
  slogan: string;
  teacherAvatarUrl?: string;
  totalStudentsTarget: number;
  roomNumber: string;
}

export interface HappinessPillar {
  id: 'loved' | 'listened' | 'respected' | 'growing' | 'connected';
  title: string;
  vietnameseTitle: string;
  description: string;
  color: string;
  iconName: string;
  score: number; // 0 - 100
  activitiesCount: number;
  highlightAction: string;
}
