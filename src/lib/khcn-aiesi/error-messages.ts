/**
 * Maps raw messages coming back from the backend / BFF (stored-procedure codes
 * such as "SP_KHCN_AIESI_BaiDang_Add_Para_200", legacy Vietnamese BFF strings)
 * to friendly English text. Pure module: safe in Server and Client Components.
 *
 * Provenance of each rule is marked:
 *   [seen]     the exact string exists in this codebase (docs / routes).
 *   [inferred] pattern guessed from the naming convention; NOT confirmed
 *              against the real backend yet. Replace with confirmed codes when
 *              the backend team supplies the full list.
 */

const DEFAULT_FALLBACK = "Something went wrong. Please try again.";

type Action = "add" | "edit" | "del" | "load";

// --- 1. Stored-procedure codes: SP_KHCN_AIESI_<Entity>_<Action>[_...]_<status> ---

// [inferred] Only the "Add_Para_200" example is confirmed by the user; it is the
// message returned when a paper is saved successfully. The suffix is treated as
// an HTTP-like status code and the action as Add/Edit/Del/Load.
const SP_CODE = /^SP_KHCN_AIESI_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*?_(Add|Edit|Del|Load)(?:_[A-Za-z0-9]+)*?_(\d{3})$/i;

const SP_SUCCESS: Record<Action, string> = {
  add: "Your paper has been submitted successfully.",
  edit: "Your submission has been updated successfully.",
  del: "Your submission has been removed successfully.",
  load: "Data loaded successfully.",
};

const SP_FAILURE: Record<Action, string> = {
  add: "We couldn't submit your paper. Please try again.",
  edit: "We couldn't update your submission. Please try again.",
  del: "We couldn't remove your submission. Please try again.",
  load: "We couldn't load the data. Please try again.",
};

function mapStoredProcedureCode(raw: string): string | null {
  const match = SP_CODE.exec(raw.trim());
  if (!match) {
    // Looks like an SP code but has an unknown shape.
    return /^SP_[A-Za-z0-9_]+$/.test(raw.trim()) ? DEFAULT_FALLBACK : null;
  }

  const action = match[1].toLowerCase() as Action;
  const status = Number(match[2]);

  if (status >= 200 && status < 300) return SP_SUCCESS[action]; // [inferred]
  if (status === 401 || status === 403) {
    return "You don't have permission to do that. Please sign in again."; // [inferred]
  }
  if (status === 404) return "We couldn't find that submission."; // [inferred]
  if (status === 409) return "This action conflicts with the current state of the submission."; // [inferred]
  if (status >= 400 && status < 500) {
    return "Some of the information provided is not valid. Please check it and try again."; // [inferred]
  }
  return SP_FAILURE[action]; // [inferred] 5xx and anything else
}

// --- 2. Known Vietnamese strings produced by this app's own BFF routes ---
// [seen] Exact texts from src/app/api/**, src/lib/auth/upstream.ts, backend.ts.

const EXACT_VI: Record<string, string> = {
  // khcn-aiesi/backend.ts + route handlers
  "Phiên đăng nhập không hợp lệ.": "Your session is not valid. Please sign in again.",
  "Phiên đăng nhập đã hết hạn.": "Your session has expired. Please sign in again.",
  "Phiên đăng nhập của bạn đã kết thúc. Vui lòng đăng nhập lại để tiếp tục sử dụng!":
    "Your session has ended. Please sign in again to continue.",
  "Không thể kết nối dịch vụ KHCN_AIESI.":
    "We couldn't reach the submission service. Please try again in a moment.",
  "Dịch vụ KHCN_AIESI không xử lý được yêu cầu.":
    "The submission service couldn't process your request. Please try again.",
  "Dịch vụ KHCN_AIESI trả dữ liệu không hợp lệ.":
    "The submission service returned an unexpected response. Please try again later.",
  "Yêu cầu không hợp lệ. Vui lòng kiểm tra dữ liệu.":
    "The request is not valid. Please check your information and try again.",
  "Yêu cầu không thực hiện được.": "We couldn't complete your request. Please try again.",
  "Query không hợp lệ.": "The search options are not valid.",
  "Dữ liệu bài đăng không hợp lệ.": "The submission details are not valid.",
  "Dữ liệu cập nhật không hợp lệ.": "The update details are not valid.",
  "ID bài đăng không hợp lệ.": "This submission could not be identified.",
  "Danh sách file cần xóa không hợp lệ.": "The list of files to delete is not valid.",
  "Không đọc được dữ liệu upload.": "We couldn't read the uploaded data. Please try again.",
  "Chọn ít nhất một file.": "Please choose at least one file.",
  "Không tìm thấy bài gửi.": "We couldn't find that submission.",
  "Bạn không có quyền sửa bài gửi này.": "You don't have permission to edit this submission.",
  "Chỉ bài đang ở trạng thái Gửi lên mới được sửa hoặc huỷ.":
    "Only submissions in the “Submitted” status can be edited or cancelled.",
  "Người gửi chỉ được sửa nội dung hoặc tự huỷ bài.":
    "You can only edit the content of your submission or cancel it.",
  "Không tải được danh sách bài gửi. Vui lòng thử lại.":
    "We couldn't load your submissions. Please try again.",
  "Tệp đính kèm thiếu tên.": "An attached file has no name.",
  "Tổng dung lượng tệp đính kèm vượt quá 28 MB.": "The attached files exceed the 28 MB total limit.",
  "Không có quyền xóa tệp này.": "You don't have permission to delete this file.",

  // auth routes / lib/auth/upstream.ts
  "Thông tin yêu cầu không hợp lệ. Vui lòng nhập đúng email và tên đăng nhập.":
    "The information provided is not valid. Please enter your email and username correctly.",
  "Không gửi được email xác thực. Vui lòng kiểm tra lại email và tên đăng nhập, hoặc thử lại sau.":
    "We couldn't send the verification email. Please check your email and username, or try again later.",
  "Đã gửi lại email xác thực.": "The verification email has been sent again.",
  "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc.":
    "Your registration details are not valid. Please check the required fields.",
  "Đăng ký không thành công. Tên đăng nhập hoặc email có thể đã được sử dụng, vui lòng kiểm tra lại thông tin.":
    "Registration was not successful. The username or email may already be in use. Please check your details.",
  "Đăng ký thành công.": "Registration successful.",
  "Đăng ký thất bại. Vui lòng thử lại sau.": "Registration failed. Please try again later.",
  "Đăng nhập không thành công. Vui lòng kiểm tra thông tin tài khoản và trạng thái xác thực email.":
    "Sign-in was not successful. Please check your account details and whether your email has been verified.",
  "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.":
    "Sign-in failed. Please check your details and try again.",
  "Đăng nhập thành công": "Signed in successfully.",
  "Tên đăng nhập hoặc mật khẩu không đúng": "Incorrect username or password.",
  "Thông tin đăng nhập không hợp lệ": "The sign-in details are not valid.",
  "Máy chủ xác thực gặp lỗi nội bộ khi xử lý đăng nhập. Vui lòng thử lại sau ít phút.":
    "The sign-in service ran into a problem. Please try again in a few minutes.",
  "Không thể kết nối đến máy chủ xác thực":
    "We couldn't reach the sign-in service. Please try again in a moment.",
  "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng rồi thử lại.":
    "We couldn't connect to the server. Please check your internet connection and try again.",
  "Không thể kết nối đến máy chủ hệ thống. Vui lòng kiểm tra kết nối mạng rồi thử lại.":
    "We couldn't connect to the server. Please check your internet connection and try again.",
  "Máy chủ hệ thống đang gặp lỗi nội bộ. Vui lòng thử lại sau ít phút.":
    "The server ran into a problem. Please try again in a few minutes.",
  "Máy chủ trả về phản hồi không hợp lệ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.":
    "The server returned an unexpected response. Please try again later or contact the administrator.",
  "Máy chủ hệ thống trả về dữ liệu không hợp lệ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.":
    "The server returned an unexpected response. Please try again later or contact the administrator.",
};

// Messages that embed a variable part (file name, HTTP status, limits).
const PATTERNS_VI: Array<[RegExp, (m: RegExpExecArray) => string]> = [
  [
    /^Mỗi lần chỉ được tải tối đa (\d+) file\.?$/,
    (m) => `You can upload up to ${m[1]} files at a time.`,
  ],
  [
    /^File [“"](.+)[”"] sai định dạng hoặc vượt quá 50 MiB\.?$/,
    (m) => `The file “${m[1]}” has an unsupported format or is larger than 50 MiB.`,
  ],
  [/^(.+) vượt quá 50 MB\.?$/, (m) => `${m[1]} is larger than the 50 MB limit.`],
  [
    /^Tải tệp lên thất bại \(HTTP \d+\)\./,
    () => "We couldn't upload your files. Please try again or use smaller files.",
  ],
  [
    /^Hệ thống không lưu được bài báo \(HTTP \d+\)\./,
    () => "We couldn't save your paper. Please try again.",
  ],
  [
    /^Tài khoản người dùng chưa được kích hoạt/,
    () =>
      "Your account is not activated or does not have access to the system. Please contact the administrator.",
  ],
  // [inferred] upstream auth messages are free text; match on keywords only.
  [
    /(email.*(chưa được xác thực|xác thực email))|((chưa được xác thực|xác thực email).*email)/i,
    () => "Your email has not been verified yet. Please verify your email to sign in.",
  ],
];

const HAS_VIETNAMESE =
  /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
// SQL / driver / runtime detail must never reach end users.
const TECHNICAL_DETAIL =
  /(sql|conversion failed|syntax|constraint|violat|transaction|stack|undefined|\[object|econn|etimedout|enotfound|<html|<title)/i;

/**
 * Turns a raw backend/BFF message into friendly English.
 * Also used for *success* messages (e.g. "..._Add_Para_200" means saved).
 *
 * @param rawMessage message as received (may be an SP code, Vietnamese BFF text, or English).
 * @param fallback   optional context-specific fallback for unknown messages.
 */
export function getFriendlyErrorMessage(
  rawMessage: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  const raw = (rawMessage ?? "").trim();
  if (!raw) return fallback;

  const fromCode = mapStoredProcedureCode(raw);
  if (fromCode) return fromCode === DEFAULT_FALLBACK ? fallback : fromCode;

  if (EXACT_VI[raw]) return EXACT_VI[raw];
  for (const [pattern, build] of PATTERNS_VI) {
    const match = pattern.exec(raw);
    if (match) return build(match);
  }

  // Unknown Vietnamese text or technical detail: don't leak it.
  if (HAS_VIETNAMESE.test(raw) || TECHNICAL_DETAIL.test(raw) || raw.length > 200) {
    return fallback;
  }

  // Already plain, short English text (e.g. this app's own English messages).
  return raw;
}
