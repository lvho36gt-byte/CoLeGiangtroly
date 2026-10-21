/**
 * Service to communicate with the server-side Gemini API (/api/gemini/generate)
 * Follows the AI Studio security standards and pedagogical guidelines.
 */

export interface GeminiResponse {
  text?: string;
  error?: string;
  message?: string;
  isAvailable: boolean;
}

/**
 * Checks server health and Gemini configuration status
 */
export async function checkAiHealth(): Promise<{ hasApiKey: boolean; isOnline: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { hasApiKey: false, isOnline: false };
    const data = await res.json();
    return { hasApiKey: Boolean(data.hasApiKey), isOnline: true };
  } catch {
    return { hasApiKey: false, isOnline: false };
  }
}

/**
 * Executes a Gemini request via the server-side proxy
 */
export async function callGemini(
  prompt: string,
  systemInstruction?: string
): Promise<GeminiResponse> {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, systemInstruction }),
    });

    if (res.status === 503) {
      const data = await res.json().catch(() => ({}));
      return {
        isAvailable: false,
        error: 'CHƯA_KẾT_NỐI_AI',
        message: data.message || 'Chưa kết nối AI: Hệ thống máy chủ chưa được cấu hình GEMINI_API_KEY. Vui lòng cài đặt API Key trong bảng Secrets của AI Studio.',
      };
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        isAvailable: false,
        error: data.error || 'LỖI_MÁY_CHỦ',
        message: data.message || `Lỗi máy chủ (${res.status}): Không thể gọi dịch vụ AI lúc này.`,
      };
    }

    const data = await res.json();
    return {
      isAvailable: true,
      text: data.text || '',
    };
  } catch (err: any) {
    return {
      isAvailable: false,
      error: 'NETWORK_ERROR',
      message: 'Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra kết nối mạng của bạn.',
    };
  }
}

// System instruction for homeroom teacher assistant
const HOMEROOM_SYSTEM_INSTRUCTION = `
Bạn là "Bạn Đồng Hành AI" - Trợ lý thông minh cao cấp dành riêng cho giáo viên chủ nhiệm tiểu học Việt Nam (Lớp 4, Trường Tiểu học Khoái Châu 1, cô giáo Lê Thị Giang).
Nguyên tắc sư phạm cốt lõi:
1. Thấu hiểu yêu thương, giáo dục tích cực, tôn trọng cá tính và sự phát triển riêng của từng học sinh.
2. Tuyệt đối không gắn nhãn tiêu cực (học sinh cá biệt, yếu kém, hư hỏng) hay đưa ra chẩn đoán y tế, tâm thần. Dùng cụm từ: "có dấu hiệu cần tìm hiểu thêm", "cần thêm sự khích lệ".
3. Phù hợp chuẩn Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học.
4. Trình bày tiếng Việt chuẩn mực, mạch lạc, khoa học, giàu tính thực tiễn và tính nhân văn.
5. Luôn nhắc nhở: "Mọi nhận xét và kế hoạch cần được cô giáo chủ nhiệm kiểm tra, điều chỉnh phù hợp với thực tế lớp học."
`;

/**
 * AI Tool 1: Phân tích phiếu khảo sát thấu hiểu học sinh và đề xuất kế hoạch đồng hành
 */
export async function analyzeStudentSurvey(
  surveyData: any,
  studentName?: string
): Promise<GeminiResponse> {
  const prompt = `
Dưới đây là dữ liệu phiếu khảo sát đầu năm của học sinh ${studentName || 'lớp 4'}:
- Sở thích & Ước mơ: "${surveyData.q1_hobbiesAndDreams || 'Chưa có'}"
- Điểm mạnh bản thân: "${surveyData.q2_myStrengths || 'Chưa có'}"
- Khó khăn cảm nhận: "${surveyData.q3_myDifficulties || 'Chưa có'}"
- Môi trường mong muốn: "${surveyData.q4_desiredEnvironment || 'Chưa có'}"
- Người muốn chia sẻ khi cần giúp đỡ: "${surveyData.q5_trustedPerson || 'Chưa có'}"
- Hoạt động yêu thích: "${surveyData.favoriteActivity || 'Chưa có'}"
- Em cảm thấy vui khi: "${surveyData.feelHappyWhen || 'Chưa có'}"

Hãy đóng vai chuyên gia tâm lý giáo dục tiểu học và đưa ra "BÁO CÁO THẤU HIỂU & KẾ HOẠCH ĐỒNG HÀNH" chi tiết gồm:
1. ĐIỂM MẠNH & TIỀM NĂNG NỔI BẬT (Phân tích sở thích, năng khiếu và nét đẹp tâm hồn)
2. NHU CẦU ĐƯỢC THẤU HIỂU & KHÓ KHĂN CẦN QUAN TÂM (Nhìn nhận khách quan, không phán xét)
3. MỤC TIÊU PHÁT TRIỂN CÁ NHÂN VỪA SỨC (Các bước tiến nhỏ trong 4 tuần tới)
4. HOẠT ĐỘNG LỚP HỌC GỢI Ý (Nhiệm vụ, trò chơi hoặc vai trò giúp em tỏa sáng)
5. BIỆN PHÁP PHỐI HỢP VỚI GIA ĐÌNH (Gợi ý lời nhắn trao đổi thân mật cùng cha mẹ)
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}

/**
 * AI Tool 2: Cố vấn chủ nhiệm - Xử lý tình huống sư phạm thực tế
 */
export async function advisePedagogicalSituation(
  situation: string,
  classContext?: string
): Promise<GeminiResponse> {
  const prompt = `
Tình huống sư phạm giáo viên đang gặp phải tại lớp 4:
"${situation}"

Bối cảnh thêm (nếu có): ${classContext || 'Lớp 4A4 Trường TH Khoái Châu 1'}

Hãy đưa ra giải pháp tư vấn toàn diện gồm:
1. PHÂN TÍCH NGUYÊN NHÂN TÂM LÝ & HOÀN CẢNH (Vì sao học sinh lại có hành vi đó?)
2. NGUYÊN TẮC ỨNG XỬ TỨC THỜI (Giáo viên nên làm gì ngay tại thời điểm đó để bảo vệ lòng tự trọng của trẻ?)
3. KẾ HOẠCH GIẢI QUYẾT BỀN VỮNG (Các bước tiếp cận: trò chuyện riêng, phối hợp tổ học sinh, trao đổi phụ huynh)
4. BÀI HỌC KỸ NĂNG SỐNG TÍCH HỢP CHO CẢ LỚP (Cách biến tình huống thành cơ hội giáo dục lòng nhân ái cho tập thể)
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}

/**
 * AI Tool 3: Thiết kế hoạt động lớp hạnh phúc (Trò chơi, sinh hoạt lớp, gắn kết)
 */
export async function designHappyActivity(
  topic: string,
  durationMinutes: number = 35
): Promise<GeminiResponse> {
  const prompt = `
Hãy thiết kế một hoạt động giáo dục tích cực / trò chơi trải nghiệm cho học sinh Lớp 4 (độ tuổi 9-10 tuổi):
- Chủ đề: "${topic}"
- Thời lượng dự kiến: ${durationMinutes} phút
- Mục tiêu: Rèn luyện kỹ năng cảm xúc - xã hội (SEL), tinh thần hợp tác, không tạo áp lực thắng thua tiêu cực.

Yêu cầu xuất bản kế hoạch chi tiết gồm:
1. TÊN HOẠT ĐỘNG (Sinh động, bắt tai, gây hào hứng cho học sinh lớp 4)
2. MỤC TIÊU CỤ THỂ (Phẩm chất, năng lực, cảm xúc)
3. CHUẨN BỊ (Đồ dùng đơn giản, dễ kiếm)
4. TIẾN TRÌNH 4 BƯỚC THỰC HIỆN:
   - Bước 1: Khởi động - Khơi dậy cảm xúc
   - Bước 2: Trải nghiệm tương tác - Kết nối đồng đội
   - Bước 3: Đúc kết bài học - Lắng nghe tâm sự
   - Bước 4: Lan tỏa yêu thương - Hành động sau giờ học
5. LỜI DẶN DÒ Ý NGHĨA CỦA CÔ GIÁO
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}

/**
 * AI Tool 4: Trợ lý viết nhận xét học sinh chuẩn Thông tư 27/2020/TT-BGDĐT
 */
export async function generateTT27Comments(
  studentInfo: any,
  aspect: 'all' | 'learning' | 'qualities' | 'capabilities' = 'all'
): Promise<GeminiResponse> {
  const prompt = `
Hãy soạn thảo nhận xét đánh giá học sinh tiểu học Lớp 4 định kỳ theo đúng tinh thần và ngôn ngữ của Thông tư 27/2020/TT-BGDĐT:
- Tên học sinh: ${studentInfo.name} (${studentInfo.gender})
- Điểm mạnh đã ghi nhận: ${studentInfo.strengths?.join(', ') || 'Chăm ngoan, tích cực'}
- Nét nổi bật/sở thích: ${studentInfo.hobbies?.join(', ') || 'Hòa đồng'}
- Khó khăn/Vấn đề cần rèn luyện: ${studentInfo.challenges?.join(', ') || 'Cần thêm sự tự tin khi nói trước lớp'}
- Khía cạnh cần tập trung: ${aspect === 'all' ? 'Toàn diện (Học tập, Năng lực, Phẩm chất)' : aspect}

Yêu cầu ngôn ngữ:
- Tích cực, khích lệ, ghi nhận sự tiến bộ của bản thân học sinh.
- Chỉ rõ điểm tiến bộ và biện pháp giúp học sinh hoàn thiện hơn mà không gây mặc cảm.
- Cung cấp 3 phương án để cô giáo lựa chọn:
  * Phương án 1: Ngắn gọn, súc tích (chuẩn vào học bạ / sổ điểm điện tử)
  * Phương án 2: Ấm áp, truyền cảm hứng (gửi cha mẹ học sinh)
  * Phương án 3: Chi tiết, cụ thể hóa từng biểu hiện năng lực và phẩm chất
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}

/**
 * AI Tool 5: Phân tích xu hướng và tạo báo cáo tiến bộ lớp học
 */
export async function analyzeClassProgress(
  classDataSummary: string
): Promise<GeminiResponse> {
  const prompt = `
Dưới đây là dữ liệu tổng hợp về lớp 4A4 Trường Tiểu học Khoái Châu 1:
${classDataSummary}

Hãy phân tích dữ liệu trên và xuất báo cáo:
1. ĐÁNH GIÁ TỔNG QUAN KHÔNG GIAN LỚP HỌC HẠNH PHÚC (Tỷ lệ chuyên cần, mức độ tham gia, năng lượng tích cực)
2. CÁC ĐIỂM SÁNG TIÊU BIỂU TRONG TUẦN (Những tiến bộ rõ rệt của tập thể và cá nhân)
3. NHỮNG DẤU HIỆU CẦN TÌM HIỂU THÊM & ĐỀ XUẤT CAN THIỆP SỚM (Biện pháp sư phạm êm dịu, tế nhị)
4. GỢI Ý ĐỊNH HƯỚNG CÔNG TÁC CHỦ NHIỆM CHO TUẦN TIẾP THEO
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}

/**
 * Soạn thông báo phụ huynh với các giọng văn khác nhau
 */
export async function draftParentNotification(
  topic: string,
  details: string,
  tone: 'Ấm áp' | 'Trang trọng' | 'Ngắn gọn' | 'Khích lệ' = 'Ấm áp'
): Promise<GeminiResponse> {
  const prompt = `
Hãy soạn thảo một bức thư/thông báo gửi tới Quý phụ huynh học sinh Lớp 4A4 (Trường Tiểu học Khoái Châu 1 - GVCN: Lê Thị Giang):
- Nội dung/Chủ đề: "${topic}"
- Chi tiết cần truyền tải: "${details}"
- Giọng điệu mong muốn: "${tone}"

Yêu cầu:
- Thể hiện sự tôn trọng, đồng hành giữa nhà trường và gia đình.
- Ngôn từ trong sáng, chuẩn mực sư phạm, tạo sự an tâm và gắn kết cho cha mẹ.
- Có cấu trúc rõ ràng: Lời chào, lý do/nội dung, đề xuất phối hợp, lời cảm ơn và lời chúc ấm áp.
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}

/**
 * Sinh phiếu học tập / phiếu tự đánh giá / khảo sát A4
 */
export async function generateWorksheet(
  activityTitle: string,
  targetObjective: string,
  questionCount: number = 5
): Promise<GeminiResponse> {
  const prompt = `
Hãy thiết kế một "PHIẾU HOẠT ĐỘNG CHỦ NHIỆM LỚP 4" dạng bản in khổ A4:
- Tên hoạt động: "${activityTitle}"
- Mục tiêu cần đạt: "${targetObjective}"
- Số lượng câu hỏi/nội dung tương tác: ${questionCount} câu

Yêu cầu thiết kế thân thiện với trẻ 9-10 tuổi:
- Có khung Họ tên, Lớp, Tổ, Ngày thực hiện, Biểu tượng cảm xúc tự chấm điểm (😊 🌟 ❤️).
- Câu hỏi gợi mở, có hình thức trắc nghiệm cảm xúc, vẽ tranh ngắn, hoặc hoàn thành câu.
- Dưới mỗi câu có chỗ cho học sinh viết hoặc tích chọn.
- Phần cuối có: "Góc gửi gắm tới cô giáo thân yêu" và "Lời động viên của cô giáo".
`;
  return callGemini(prompt, HOMEROOM_SYSTEM_INSTRUCTION);
}
