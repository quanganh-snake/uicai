# Hướng dẫn tích hợp API KHCN_AIESI với Next.js App Router 16

Tài liệu này mô tả **đúng hợp đồng backend hiện tại** của module `KHCN_AIESI` và một **kiến trúc frontend đề xuất** cho `icai-clone`. Hai phần này được phân biệt rõ để tránh coi một quyết định phía Next.js là hành vi đã có ở Express.

## 1. Phạm vi và kiến trúc

### 1.1. Phạm vi

- Backend base path: `/api/SP_KHCN_AIESI`.
- Có **9 HTTP route**, tương ứng **8 hành vi**: load, load phân trang, detail, add, edit, xóa mềm, upload và xóa file (xóa file hỗ trợ cả `DELETE` lẫn `POST`).
- Tất cả route yêu cầu người dùng đã đăng nhập.
- Ví dụ áp dụng cho Next.js App Router 16, TypeScript strict, Zod 4 và native `fetch`.
- Dữ liệu phụ thuộc phiên người dùng luôn dùng `cache: "no-store"`.

### 1.2. Hợp đồng backend hiện tại

Backend Express chạy `verifyJWT` trước router này. Middleware chỉ đọc:

```text
Cookie: access_token=<jwt>; refresh_token=<jwt>
```

Nó **không đọc `Authorization: Bearer ...`** cho module này. `access_token` hợp lệ cung cấp `req.HT_USER`; nếu access token hết hạn, middleware có thể dùng `refresh_token` và phát cookie mới. Module không có middleware role riêng: người dùng đăng nhập hợp lệ đều có thể gọi CRUD; upload/xóa file kiểm tra thư mục sở hữu theo `req.HT_USER`.

### 1.3. Kiến trúc đề xuất cho `icai-clone`

```text
Client Component
  -> /api/khcn-aiesi/* (Next.js Route Handler, cùng origin)
  -> Cookie: access_token=...; refresh_token=... (server-to-server)
  -> Express /api/SP_KHCN_AIESI/*
```

Route Handler là BFF và phải:

1. đọc `icai_auth_session` bằng `await cookies()`;
2. kiểm tra lại session ở từng operation, không chỉ dựa vào `proxy.ts`;
3. validate input bằng Zod;
4. chuyển credential thành **cookie backend đúng tên**;
5. gọi backend bằng native `fetch` và `cache: "no-store"`;
6. chuẩn hóa lỗi bất nhất trước khi trả browser.

> **Cảnh báo tương thích auth bắt buộc:** `icai-clone` hiện lưu token trong `icai_auth_session`, và một BFF có sẵn gửi token bằng Bearer. Cách đó **không tương thích** với module KHCN_AIESI hiện tại. Không được khẳng định hoặc giả định Bearer hoạt động. Route Handler mới phải gửi cookie `access_token` (và `refresh_token` nếu phiên thực sự lưu token này), hoặc backend phải được thay đổi có chủ đích để chấp nhận Bearer. Chỉ forward nguyên cookie `icai_auth_session` cũng không có tác dụng vì Express không biết tên/định dạng cookie đó.

Hiện `AuthSession` của frontend chỉ thể hiện `token?`. Nếu đây là access token thì BFF có thể tạo header cookie `access_token`. Tuy nhiên, nếu không lưu refresh token, luồng refresh của backend không thể hoạt động đầy đủ. Cần chọn rõ một trong hai phương án trước khi triển khai production:

- mở rộng session HttpOnly phía Next.js để giữ riêng access/refresh token và đồng bộ token mới một cách an toàn; hoặc
- thay đổi auth backend có chủ đích để hỗ trợ credential contract khác.

Không đưa token ra Client Component, không đặt token vào biến `NEXT_PUBLIC_*`, không log token/cookie, và không forward toàn bộ cookie browser sang backend.

## 2. Cấu hình môi trường server-only

```env
# .env.local — ví dụ, không phải secret thật
KHCN_AIESI_API_URL=https://apiv3.uneti.edu.vn
KHCN_AIESI_FILE_PUBLIC_URL=https://apiv3.uneti.edu.vn
```

- `KHCN_AIESI_API_URL`: origin backend, không có dấu `/` cuối; chỉ đọc trong code server.
- `KHCN_AIESI_FILE_PUBLIC_URL`: origin dùng để tạo URL file tuyệt đối. Có thể bằng API origin hoặc public CDN/reverse-proxy origin.
- Có thể tái sử dụng `API_URL` nếu dự án đã thống nhất biến đó. Không dùng `NEXT_PUBLIC_API_URL` cho BFF authenticated này.
- Không đặt secret/token trong tài liệu, source control hoặc biến `NEXT_PUBLIC_*`.

```ts
// src/lib/khcn-aiesi/config.ts
import "server-only";
import { z } from "zod";

const envSchema = z.object({
  KHCN_AIESI_API_URL: z.url(),
  KHCN_AIESI_FILE_PUBLIC_URL: z.url(),
});

const env = envSchema.parse({
  KHCN_AIESI_API_URL: process.env.KHCN_AIESI_API_URL,
  KHCN_AIESI_FILE_PUBLIC_URL: process.env.KHCN_AIESI_FILE_PUBLIC_URL,
});

export const KHCN_AIESI_API_BASE = new URL(
  "/api/SP_KHCN_AIESI/",
  env.KHCN_AIESI_API_URL,
);
export const KHCN_AIESI_FILE_BASE = env.KHCN_AIESI_FILE_PUBLIC_URL;
```

## 3. Danh mục đủ 9 route backend

| # | Method | Path sau base `/api/SP_KHCN_AIESI` | Input | Thành công |
|---:|---|---|---|---|
| 1 | `GET` | `/KHCN_AIESI_BaiDang_Load` | không có | envelope danh sách |
| 2 | `GET` | `/KHCN_AIESI_BaiDang_Load_Paged` | query phân trang/lọc | danh sách + `pagination` |
| 3 | `GET` | `/KHCN_AIESI_BaiDang_Load_R_Para_File` | query `KHCN_AIESI_BaiDang_ID` | envelope, `body` là array 0–1 phần tử |
| 4 | `POST` | `/KHCN_AIESI_BaiDang_Add_Para` | JSON | envelope kết quả SP |
| 5 | `PUT` | `/KHCN_AIESI_BaiDang_Edit_Para` | JSON | envelope kết quả SP |
| 6 | `DELETE` | `/KHCN_AIESI_BaiDang_Del_Para` | JSON body | xóa mềm, envelope kết quả SP |
| 7 | `POST` | `/KHCN_AIESI_Upload` | multipart field `files` | metadata file |
| 8 | `DELETE` | `/KHCN_AIESI_DeleteFile` | JSON `{ fileUrls }` | kết quả từng file |
| 9 | `POST` | `/KHCN_AIESI_DeleteFile` | JSON `{ fileUrls }` | giống route #8 |

Backend không dùng path parameter ở bất kỳ route nào.

## 4. Types TypeScript

```ts
export interface UploadedFile {
  TenFileGoc: string;
  TenFileSlug: string;
  /** Backend trả path tương đối /uploads/...; BFF nên đổi thành URL tuyệt đối. */
  URL: string;
}

export interface KHCNAIESIBaiDang {
  KHCN_AIESI_BaiDang_Chon: boolean;
  KHCN_AIESI_BaiDang_ID: string;
  KHCN_AIESI_BaiDang_TenBai: string | null;
  KHCN_AIESI_BaiDang_TomTat: string | null;
  KHCN_AIESI_BaiDang_TacGia: string | null;
  KHCN_AIESI_BaiDang_TuKhoa: string | null;
  KHCN_AIESI_BaiDang_LinkFile: UploadedFile[];
  KHCN_AIESI_BaiDang_TrangThai: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ID: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: string | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: string | null;
  KHCN_AIESI_BaiDang_NguonTiepNhan: number | null;
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: number | null;
  KHCN_AIESI_BaiDang_EmailNguoiGui?: string | null;
  // Detail dùng SELECT * nên có thể có thêm metadata DB:
  HT_USER_Create?: number | null;
  HT_USER_Editor?: number | null;
  KHCN_AIESI_BaiDang_DateCreate?: string | null;
  KHCN_AIESI_BaiDang_DateEditor?: string | null;
  KHCN_AIESI_BaiDang_HienThi?: boolean;
  KHCN_AIESI_BaiDang_SuDung?: string | null;
}

export interface ApiSuccess<T> {
  code: 200;
  arrayLength: number;
  message: string;
  rowsAffected: number;
  body: T;
}

export interface PagedSuccess<T> {
  code: 200;
  message: string;
  body: T[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface AddKHCNAIESIBody {
  KHCN_AIESI_BaiDang_TenBai: string;
  KHCN_AIESI_BaiDang_TomTat: string;
  KHCN_AIESI_BaiDang_TacGia: string;
  KHCN_AIESI_BaiDang_TuKhoa: string;
  KHCN_AIESI_BaiDang_LinkFile?: UploadedFile[] | string;
  KHCN_AIESI_BaiDang_TrangThai?: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ID?: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian?: string | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung?: string;
  KHCN_AIESI_BaiDang_NguonTiepNhan?: number;
  KHCN_AIESI_BaiDang_LoaiTaiKhoan?: number;
  KHCN_AIESI_BaiDang_EmailNguoiGui?: string;
}

export interface EditKHCNAIESIBody extends AddKHCNAIESIBody {
  KHCN_AIESI_BaiDang_ID: string;
  KHCN_AIESI_BaiDang_TrangThai: number | null;
  KHCN_AIESI_BaiDang_NguonTiepNhan: number;
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: number;
}

export interface DeleteKHCNAIESIBody {
  KHCN_AIESI_BaiDang_ID: string;
}

export interface DeleteUploadedFilesBody {
  fileUrls: string[];
}

export interface DeleteFilesSuccess {
  code: 200;
  message: string;
  deletedFiles: string[];
  errors?: Array<{ fileUrl: string; error: string }>;
}

/** Envelope ổn định do BFF trả cho browser, không phải shape gốc của Express. */
export type BffResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { status: number; message: string; details?: unknown } };
```

Không cho browser gửi `HT_USER_Create` hoặc `HT_USER_Editor`. Backend hiện cho phép body override rồi mới fallback sang `req.HT_USER`, nhưng BFF nên loại hai field này và để backend lấy user từ cookie xác thực.

## 5. Hợp đồng chi tiết từng hành vi

### 5.1. Load toàn bộ

```http
GET /api/SP_KHCN_AIESI/KHCN_AIESI_BaiDang_Load
```

Không có query/body. HTTP 200 trả `ApiSuccess<KHCNAIESIBaiDang[]>`. Chỉ gồm bản ghi `HienThi = 1`, sắp xếp ID giảm dần. `KHCN_AIESI_BaiDang_LinkFile` được backend parse từ JSON; JSON hỏng trở thành `[]`.

### 5.2. Load phân trang và lọc

```http
GET /api/SP_KHCN_AIESI/KHCN_AIESI_BaiDang_Load_Paged?pageNumber=1&pageSize=10
```

| Query | Ý nghĩa |
|---|---|
| `pageNumber`, `pageSize` | số nguyên tối thiểu 1; mặc định 1 và 10; backend không áp max `pageSize` |
| `SoTrang`, `SoBanGhiTrenTrang` | alias tương ứng của hai trường trên |
| `searchText` | alias tên bài, bị trường đầy đủ ghi đè |
| `trangThai` | alias trạng thái, bị trường đầy đủ ghi đè |
| `KHCN_AIESI_BaiDang_ID` | lọc `LIKE`, không bắt buộc UUID đầy đủ |
| `KHCN_AIESI_BaiDang_TenBai` | `LIKE` |
| `KHCN_AIESI_BaiDang_TomTat` | `LIKE` |
| `KHCN_AIESI_BaiDang_TacGia` | `LIKE` |
| `KHCN_AIESI_BaiDang_TuKhoa` | `LIKE` |
| `KHCN_AIESI_BaiDang_LinkFile` | `LIKE` trên JSON text |
| `KHCN_AIESI_BaiDang_TrangThai` | `LIKE` |
| `KHCN_AIESI_BaiDang_NguoiXuLy_ID` | `LIKE` sau cast |
| `KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian` | `LIKE` trên `dd/MM/yyyy` |
| `KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung` | `LIKE` |
| `KHCN_AIESI_BaiDang_NguonTiepNhan` | `LIKE` |
| `KHCN_AIESI_BaiDang_LoaiTaiKhoan` | `LIKE` |
| `HT_USER_Create` | lọc chính xác theo chủ sở hữu bài đăng; **chỉ admin được truyền** |

Chuỗi rỗng/whitespace thành `null`. Response là `PagedSuccess<KHCNAIESIBaiDang>` và **không có** `arrayLength`/`rowsAffected`.

#### Phạm vi dữ liệu theo tài khoản

Backend quyết định `HT_USER_Create` từ JWT, không tin query của client:

- Tài khoản admin — `HT_GROUPUSER_ID` (mảng nhóm quyền trong token) chứa `"1"` — mặc định nhận `NULL`, tức xem tất cả bài đăng. Admin có thể truyền query `HT_USER_Create=<id>` để lọc theo một tài khoản cụ thể; giá trị không parse được thành số nguyên bị coi như `NULL`.
- Tài khoản không phải admin luôn bị ép `HT_USER_Create = <id user hiện tại>`; query `HT_USER_Create` do client gửi bị bỏ qua, nên không thể xem bài của người khác.
- Nếu không xác định được ID số nguyên của người dùng không phải admin, backend trả HTTP 400 với message `Không xác định được người dùng để lọc bài đăng.`

Vì vậy BFF không cần và không nên tự suy luận quyền; chỉ forward query `HT_USER_Create` khi UI admin thực sự chọn lọc theo tài khoản.

### 5.3. Detail

```http
GET /api/SP_KHCN_AIESI/KHCN_AIESI_BaiDang_Load_R_Para_File?KHCN_AIESI_BaiDang_ID=<uuid>
```

ID cần là UUID hợp lệ dù backend không validate trước DB. HTTP 200 trả `ApiSuccess<KHCNAIESIBaiDang[]>`; `body` luôn là array 0 hoặc 1 phần tử, không phải object/null. Chỉ tìm bản ghi còn hiển thị. Do SQL dùng `SELECT *`, detail có thể có metadata bổ sung như các optional field trong type.

### 5.4. Add

```http
POST /api/SP_KHCN_AIESI/KHCN_AIESI_BaiDang_Add_Para
Content-Type: application/json
```

Body theo `AddKHCNAIESIBody`. Giới hạn DB đáng chú ý: `TenBai` và `TuKhoa` là `nvarchar(2000)`; `TomTat`, `TacGia` là `nvarchar(max)`. Backend stringify `LinkFile` nếu là array; giá trị falsy thành `"[]"`. Bài gửi mới dùng trạng thái `NULL`, `KHCN_AIESI_BaiDang_NguonTiepNhan = 1` cho nguồn WEB, và `KHCN_AIESI_BaiDang_LoaiTaiKhoan` lấy trực tiếp từ `user.Role` (kiểu `AuthRole`: `0`, `1`, hoặc `2`) đã được validate và lưu trong session đã ký. `KHCN_AIESI_BaiDang_EmailNguoiGui` lấy từ `user.email` trong session đã ký (không nhận từ form trình duyệt) để backend gửi email thông báo khi tiếp nhận bài; email không hợp lệ hoặc rỗng thì gửi `""` chứ không chặn việc gửi bài. Login API trả `Role` dưới dạng chuỗi AES (`U2FsdGVkX1…`); BFF giải mã bằng `PRIVATE_KEY_ENCRYPT` trước khi validate. Login response thiếu `Role` hợp lệ sẽ không tạo session; claim thiếu và claim ngoài miền `0|1|2` (kể cả ciphertext không giải mã được) trả thông báo lỗi khác nhau. Người xử lý/thời gian là `null`, nội dung xử lý `""`; ID mới do DB sinh.

HTTP 200 trả `ApiSuccess<unknown[]>`, thường `body: []` vì stored procedure không `SELECT`; không được kỳ vọng ID vừa tạo. Sau add, nếu UI cần record mới thì reload/paged lại.

Quy ước `KHCN_AIESI_BaiDang_TrangThai`:

| Giá trị | Trạng thái |
|---:|---|
| `NULL` | Gửi lên |
| `1` | Người xử lý đã xem |
| `2` | Người xử lý duyệt |
| `-1` | Người đăng tự huỷ |
| `-2` | Người xử lý không duyệt |

### 5.5. Edit

```http
PUT /api/SP_KHCN_AIESI/KHCN_AIESI_BaiDang_Edit_Para
Content-Type: application/json
```

Body theo `EditKHCNAIESIBody`. Đây **không phải partial update**: gửi đủ record, gồm UUID, nội dung và các trường trạng thái/nguồn/loại tài khoản. HTTP 200 là `ApiSuccess<unknown[]>`, thường `body: []`.

Trang lịch sử chỉ cho người gửi sửa nội dung hoặc tự huỷ khi trạng thái hiện tại là `NULL`. BFF kiểm tra chủ sở hữu và trạng thái hiện tại trước khi forward full-record update; tự huỷ gửi trạng thái `-1`. Với tài khoản có nhóm quyền `"1"`, lần đầu bấm **Preview** trên bài ở trạng thái `NULL` sẽ gọi Edit với full record để cập nhật trạng thái thành `1` trước khi mở file. Các action **Approve** và **Reject** gọi Edit với full record và lần lượt cập nhật trạng thái thành `2` và `-2`.

### 5.6. Xóa mềm bài đăng

```http
DELETE /api/SP_KHCN_AIESI/KHCN_AIESI_BaiDang_Del_Para
Content-Type: application/json

{"KHCN_AIESI_BaiDang_ID":"<uuid>"}
```

Stored procedure đặt `HienThi = 0`, cập nhật editor/thời gian và lịch sử. Nó không xóa file vật lý. HTTP 200 là `ApiSuccess<unknown[]>`, thường `body: []`.

### 5.7. Upload

```http
POST /api/SP_KHCN_AIESI/KHCN_AIESI_Upload
Content-Type: multipart/form-data; boundary=...
```

- Field chính xác: `files`; hỗ trợ nhiều file.
- Tối đa **10 file/request**, **50 MiB/file**.
- Extension cho phép: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.zip`, `.rar`.
- Backend chỉ kiểm tra extension, không thấy MIME sniffing; frontend check chỉ cải thiện UX, không thay thế kiểm tra server.
- File lưu dưới `uploads/KHCN_AIESI/BD_<HT_USER>/<slug>_<timestamp>.<ext>`.
- HTTP 200:

```json
{
  "code": 200,
  "message": "Tải file thành công.",
  "body": [
    {
      "TenFileGoc": "Tài liệu.pdf",
      "TenFileSlug": "tai-lieu_1760000000000.pdf",
      "URL": "/uploads/KHCN_AIESI/BD_123/tai-lieu_1760000000000.pdf"
    }
  ]
}
```

Lỗi upload là JSON: 400 khi thiếu file, quá 10 file, quá 50 MiB, extension không hợp lệ hoặc không xác định được user; 500 khi controller lỗi bất ngờ.

### 5.8. Xóa file qua DELETE hoặc POST

```http
DELETE /api/SP_KHCN_AIESI/KHCN_AIESI_DeleteFile
POST   /api/SP_KHCN_AIESI/KHCN_AIESI_DeleteFile
Content-Type: application/json

{"fileUrls":["/uploads/KHCN_AIESI/BD_123/tai-lieu_1760000000000.pdf"]}
```

Hai method có cùng hợp đồng. Backend bỏ query/hash, normalize path bắt đầu bằng `/uploads/`, `uploads/` hoặc `/`. Người dùng chỉ được xóa file dưới `KHCN_AIESI/BD_<HT_USER>/`. File không tồn tại được coi là đã xóa thành công nên operation idempotent.

HTTP 200 có thể là thành công một phần:

```json
{
  "code": 200,
  "message": "Xử lý xóa file hoàn tất.",
  "deletedFiles": [],
  "errors": [
    {
      "fileUrl": "/uploads/KHCN_AIESI/BD_999/file.pdf",
      "error": "Không có quyền xóa tệp này."
    }
  ]
}
```

Không được chỉ dựa vào status 200; phải kiểm tra `errors`. Khi không có lỗi, property `errors` bị bỏ. Body thiếu/rỗng/sai kiểu trả JSON 400; outer handler lỗi trả JSON 500.

## 6. Response và lỗi bất nhất của backend

- Load/detail/add/edit/xóa mềm thành công dùng envelope có `arrayLength` và `rowsAffected`.
- Paged thành công dùng shape riêng có `pagination`.
- Upload và xóa file dùng các shape riêng.
- Với sáu operation CRUD/load, lỗi data/controller HTTP 400 là **plain string** (thường `text/html; charset=utf-8`), không phải JSON `{ code, message }`.
- UUID sai, trường thiếu hoặc kiểu không chuyển sang SQL được thường rơi vào HTTP 400 với message driver/SQL.
- Auth lỗi HTTP 401 là JSON có thể gồm `code`, `message`, `isAuthenticated: false`, `action: "LOGOUT"`.
- Không chuyển nguyên SQL/driver detail nhạy cảm ra UI production; BFF log server-side có kiểm soát và trả message an toàn.

## 7. Cấu trúc file đề xuất

```text
src/
  app/api/khcn-aiesi/
    posts/route.ts             # GET load/paged, POST add
    posts/detail/route.ts      # GET detail
    posts/update/route.ts      # PUT edit
    posts/delete/route.ts      # DELETE soft delete
    files/upload/route.ts      # POST multipart
    files/delete/route.ts      # DELETE và tùy chọn POST
  lib/khcn-aiesi/
    config.ts                  # server-only env
    backend.ts                 # auth cookie, fetch, normalize lỗi
    schemas.ts                 # Zod input/response boundary
    types.ts
    client.ts                  # browser gọi các BFF route cùng origin
```

Tên BFF là contract nội bộ đề xuất, không phải route backend. Có thể gộp route khác đi, nhưng nên giữ resource/action rõ và migrate đồng bộ mọi caller.

## 8. Route Handler mẫu hoàn chỉnh

### 8.1. Helper server-to-server và chuẩn hóa lỗi

```ts
// src/lib/khcn-aiesi/backend.ts
import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { KHCN_AIESI_API_BASE } from "./config";

export class BackendHttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

async function backendCookieHeader(): Promise<string> {
  const store = await cookies();
  const session = parseAuthSession(store.get(AUTH_COOKIE_NAME)?.value);
  if (!session?.token) throw new BackendHttpError(401, "Phiên đăng nhập không hợp lệ.");

  // Contract hiện có chỉ chứng minh session.token. Không bịa refresh token.
  // Nếu AuthSession được mở rộng, nối thêm `; refresh_token=...` ở server.
  return `access_token=${encodeURIComponent(session.token)}`;
}

export async function fetchKHCNAIESI(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const headers = new Headers(init.headers);
  headers.set("Cookie", await backendCookieHeader());
  headers.set("Accept", "application/json");

  const response = await fetch(new URL(path, KHCN_AIESI_API_BASE), {
    ...init,
    headers,
    cache: "no-store",
  });
  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const backendMessage =
      typeof payload === "string"
        ? payload
        : payload && typeof payload === "object" && "message" in payload
          ? String(payload.message)
          : "Backend trả lỗi không xác định.";

    // Có thể log correlation/status ở server, nhưng không log Cookie/token.
    throw new BackendHttpError(
      response.status,
      response.status === 401 ? "Phiên đăng nhập đã hết hạn." : backendMessage,
      payload,
    );
  }
  return payload;
}

export function toErrorResponse(error: unknown): Response {
  if (error instanceof BackendHttpError) {
    return Response.json(
      { ok: false, error: { status: error.status, message: error.message } },
      { status: error.status },
    );
  }
  return Response.json(
    { ok: false, error: { status: 502, message: "Không thể kết nối dịch vụ KHCN_AIESI." } },
    { status: 502 },
  );
}
```

`Set-Cookie` từ backend không tự cập nhật được token nằm bên trong `icai_auth_session`. Nếu dùng refresh, phải triển khai rõ việc parse cookie backend mới và ghi lại session HttpOnly ở response Next.js; không được giả định `fetch` server tự có cookie jar.

### 8.2. GET có query và POST JSON

```ts
// src/app/api/khcn-aiesi/posts/route.ts
import { z } from "zod";
import { fetchKHCNAIESI, toErrorResponse } from "@/lib/khcn-aiesi/backend";

const querySchema = z.object({
  pageNumber: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10), // giới hạn BFF
  searchText: z.string().trim().optional(),
  trangThai: z.string().trim().optional(),
  // Chỉ UI admin mới gửi; backend bỏ qua nếu tài khoản không phải admin.
  HT_USER_Create: z.coerce.number().int().positive().optional(),
});

const addSchema = z.object({
  KHCN_AIESI_BaiDang_TenBai: z.string().trim().min(1).max(2000),
  KHCN_AIESI_BaiDang_TomTat: z.string(),
  KHCN_AIESI_BaiDang_TacGia: z.string(),
  KHCN_AIESI_BaiDang_TuKhoa: z.string().max(2000),
  KHCN_AIESI_BaiDang_LinkFile: z.array(z.object({
    TenFileGoc: z.string(), TenFileSlug: z.string(), URL: z.string(),
  })).default([]),
  KHCN_AIESI_BaiDang_TrangThai: z.number().int().nullable().default(null),
  KHCN_AIESI_BaiDang_NguoiXuLy_ID: z.number().int().nullable().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: z.string().nullable().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: z.string().default(""),
  KHCN_AIESI_BaiDang_NguonTiepNhan: z.number().int().default(0),
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: z.number().int().default(0),
}).strict(); // loại HT_USER_Create/Editor và field ngoài contract

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: { status: 400, message: "Query không hợp lệ.", details: parsed.error.flatten() } },
      { status: 400 },
    );
  }
  const query = new URLSearchParams({
    pageNumber: String(parsed.data.pageNumber),
    pageSize: String(parsed.data.pageSize),
  });
  if (parsed.data.searchText) query.set("searchText", parsed.data.searchText);
  if (parsed.data.trangThai) query.set("trangThai", parsed.data.trangThai);
  if (parsed.data.HT_USER_Create !== undefined) {
    query.set("HT_USER_Create", String(parsed.data.HT_USER_Create));
  }

  try {
    const data = await fetchKHCNAIESI(`KHCN_AIESI_BaiDang_Load_Paged?${query}`);
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const parsed = addSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: { status: 400, message: "Dữ liệu bài đăng không hợp lệ.", details: parsed.error.flatten() } },
      { status: 400 },
    );
  }
  try {
    const data = await fetchKHCNAIESI("KHCN_AIESI_BaiDang_Add_Para", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
```

Trong code thật, validate response backend bằng schema Zod tương ứng (`safeParse`) trước khi trả client; response sai shape nên thành 502 thay vì `as Type`.

### 8.3. Upload multipart và URL file tuyệt đối

```ts
// src/app/api/khcn-aiesi/files/upload/route.ts
import { fetchKHCNAIESI, toErrorResponse } from "@/lib/khcn-aiesi/backend";
import { KHCN_AIESI_FILE_BASE } from "@/lib/khcn-aiesi/config";

const allowed = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "png", "jpg", "jpeg", "gif", "zip", "rar",
]);
const MAX_FILES = 10;
const MAX_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const incoming = await request.formData();
  const files = incoming.getAll("files").filter((value): value is File => value instanceof File);
  const invalid = files.length < 1 || files.length > MAX_FILES || files.some((file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    return file.size > MAX_BYTES || !allowed.has(extension);
  });
  if (invalid) {
    return Response.json(
      { ok: false, error: { status: 400, message: "File không đạt giới hạn upload." } },
      { status: 400 },
    );
  }

  const outgoing = new FormData();
  for (const file of files) outgoing.append("files", file, file.name);

  try {
    const raw = await fetchKHCNAIESI("KHCN_AIESI_Upload", {
      method: "POST",
      body: outgoing,
      // Không tự đặt Content-Type; fetch phải sinh multipart boundary.
    }) as { code: 200; message: string; body: UploadedFile[] };
    const data = {
      ...raw,
      body: raw.body.map((file) => ({
        ...file,
        URL: new URL(file.URL, KHCN_AIESI_FILE_BASE).toString(),
      })),
    };
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
```

Không nối URL bằng string. `new URL(relativePath, origin).toString()` xử lý dấu `/` đúng và tạo URL tuyệt đối. Khi gửi yêu cầu xóa file, ưu tiên lưu cả path tương đối backend hoặc chuyển URL tuyệt đối về `pathname`; không phụ thuộc host để kiểm tra ownership.

### 8.4. Route Handler DELETE có JSON body

```ts
// src/app/api/khcn-aiesi/posts/delete/route.ts
import { z } from "zod";
import { fetchKHCNAIESI, toErrorResponse } from "@/lib/khcn-aiesi/backend";

const schema = z.object({ KHCN_AIESI_BaiDang_ID: z.uuid() }).strict();

export async function DELETE(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: { status: 400, message: "ID bài đăng không hợp lệ." } },
      { status: 400 },
    );
  }
  try {
    const data = await fetchKHCNAIESI("KHCN_AIESI_BaiDang_Del_Para", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
```

## 9. Client native `fetch`

Client chỉ gọi BFF cùng origin; không đọc token và không gửi Bearer.

```ts
async function parseBff<T>(response: Response): Promise<T> {
  const result = await response.json() as BffResult<T>;
  if (!response.ok || !result.ok) {
    throw new Error(result.ok ? "Yêu cầu thất bại." : result.error.message);
  }
  return result.data;
}

export async function getPosts(input: {
  pageNumber: number;
  pageSize: number;
  searchText?: string;
  /** Chỉ dùng ở màn admin để lọc bài theo tài khoản tạo. */
  htUserCreate?: number;
}) {
  const query = new URLSearchParams({
    pageNumber: String(input.pageNumber),
    pageSize: String(input.pageSize),
  });
  if (input.searchText) query.set("searchText", input.searchText);
  if (input.htUserCreate !== undefined) {
    query.set("HT_USER_Create", String(input.htUserCreate));
  }
  const response = await fetch(`/api/khcn-aiesi/posts?${query}`, {
    cache: "no-store",
  });
  return parseBff<PagedSuccess<KHCNAIESIBaiDang>>(response);
}

export async function addPost(body: AddKHCNAIESIBody) {
  const response = await fetch("/api/khcn-aiesi/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseBff<ApiSuccess<unknown[]>>(response);
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);
  const response = await fetch("/api/khcn-aiesi/files/upload", {
    method: "POST",
    body: formData, // không đặt Content-Type
  });
  return parseBff<{ code: 200; message: string; body: UploadedFile[] }>(response);
}

export async function softDeletePost(id: string) {
  const response = await fetch("/api/khcn-aiesi/posts/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ KHCN_AIESI_BaiDang_ID: id }),
  });
  return parseBff<ApiSuccess<unknown[]>>(response);
}

export async function deleteFiles(fileUrls: string[]) {
  const response = await fetch("/api/khcn-aiesi/files/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrls }),
  });
  const result = await parseBff<DeleteFilesSuccess>(response);
  if (result.errors?.length) {
    // Hiển thị từng lỗi; HTTP 200 không đồng nghĩa mọi file đã xóa.
    throw new Error(result.errors.map((item) => item.error).join("; "));
  }
  return result;
}
```

`credentials: "include"` không cần cho request cùng origin theo mặc định; có thể ghi rõ nếu dự án muốn. Điều quan trọng là browser chỉ gửi cookie `icai_auth_session` cho Next.js, còn BFF tạo cookie backend server-to-server.

## 10. Quy tắc chuẩn hóa lỗi ở BFF

| Tình huống | Status BFF đề xuất | Response browser |
|---|---:|---|
| Zod input lỗi | 400 | message an toàn + `details` field-level |
| thiếu/hỏng `icai_auth_session` | 401 | yêu cầu đăng nhập lại |
| backend auth 401 | 401 | hết phiên; UI logout/redirect theo policy |
| backend CRUD plain string 400 | 400 | message đã lọc; không giả định JSON |
| backend upload/delete-file JSON 400/500 | giữ 400/500 | lấy `message` JSON |
| network/timeout/JSON sai shape | 502 | dịch vụ upstream không khả dụng |
| cấu hình server thiếu | fail fast khi khởi động; hoặc 503 có kiểm soát | không lộ env/secret |
| delete-file HTTP 200 có `errors` | 200 transport, partial failure trong data | UI xử lý từng phần tử |

Nếu thêm timeout, dùng `AbortSignal.timeout(...)` hoặc signal có cleanup. Không retry mutation tự động vì add/edit/upload có thể đã thành công ở backend.

## 11. Checklist kiểm chứng triển khai

### Cấu hình và auth

- [ ] `KHCN_AIESI_API_URL` và file public origin chỉ tồn tại phía server, không chứa secret trong source.
- [ ] Mỗi Route Handler dùng `await cookies()` và tự kiểm tra `icai_auth_session`.
- [ ] Request backend có cookie `access_token`; tuyệt đối không dùng Bearer nếu backend chưa được đổi có chủ đích.
- [ ] Nếu cần refresh, session có refresh token an toàn và xử lý `Set-Cookie` backend rõ ràng; không giả định cookie jar tự động.
- [ ] Không log token, cookie, credential hoặc payload nhạy cảm.

### HTTP contract

- [ ] Đã map đủ 9 method/path đúng bảng endpoint.
- [ ] Detail gửi UUID qua query và xử lý `body` array 0–1.
- [ ] Edit gửi full record, không coi là PATCH.
- [ ] Xóa mềm gửi JSON body dù method là `DELETE`.
- [ ] Xóa file hỗ trợ method đã chọn (`DELETE`, và `POST` nếu cần compatibility) và kiểm tra `errors` trong HTTP 200.
- [ ] Mọi fetch dữ liệu người dùng có `cache: "no-store"`.

### Validation và file

- [ ] Zod validate input tại BFF và validate response quan trọng từ backend.
- [ ] `pageNumber/pageSize` có giới hạn BFF hợp lý.
- [ ] Upload dùng field `files`, tối đa 10 file, 50 MiB/file và đúng allowlist extension.
- [ ] Không tự đặt `Content-Type` cho `FormData`.
- [ ] URL `/uploads/...` được đổi bằng `new URL(path, publicOrigin)` thành URL tuyệt đối.
- [ ] UI hiểu soft delete không xóa file vật lý; quy trình cần xóa file phải gọi operation riêng.
- [ ] Không cho browser override `HT_USER_Create`/`HT_USER_Editor` trong body add/edit.
- [ ] Query `HT_USER_Create` chỉ hiển thị ở UI admin; không coi nó là cơ chế phân quyền vì backend tự ép phạm vi theo JWT.

### Lỗi và UX

- [ ] Parser lỗi hỗ trợ cả JSON và plain string.
- [ ] SQL/driver detail không bị lộ cho người dùng cuối.
- [ ] 401 dẫn đến luồng hết phiên nhất quán.
- [ ] Upload báo rõ thiếu file/quá số lượng/quá dung lượng/sai extension.
- [ ] Partial delete-file hiển thị file đã xóa và file lỗi riêng.
- [ ] Add thành công không kỳ vọng backend trả ID; UI reload dữ liệu khi cần.

### Kiểm tra thủ công

- [ ] Gọi load, paged với filter, detail có/không có record.
- [ ] Add rồi reload; edit rồi detail; soft delete rồi xác nhận record không còn trong load.
- [ ] Upload 1 và nhiều file hợp lệ; thử file thứ 11, file >50 MiB và extension cấm.
- [ ] Xóa file thuộc user, file không tồn tại và file của user khác.
- [ ] Thử thiếu session, access token hết hạn, backend offline và backend trả plain-string 400.
- [ ] Xác nhận DevTools browser không thấy token trong JS, request body, query hoặc response.
