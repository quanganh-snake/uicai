# AIESI 2027 Conference Website

Next.js website for the International Conference on Artificial Intelligence, Engineering and Sustainable Innovation (AIESI 2027).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/aiesi-2027](http://localhost:3000/aiesi-2027) to view the conference website.

The shared header, including the AIESI 2027 wordmark, is implemented in `src/components/layout/Navbar.tsx`. Global brand colors and typography live in `src/app/globals.css`.

## Authentication flow

- `src/proxy.ts` redirects unauthenticated requests for `/admin`,
  `/aiesi-2027/submissions`, `/aiesi-2027/aiesi-demo`, and `/profile` to
  `/auth/login`. The public `/aiesi-2027/join` route keeps its submission
  guidelines visible to guests. Authenticated users are redirected away from
  login, registration, resend-verification, and email-verification routes to
  `/aiesi-2027`.
- `POST /api/auth/login` validates the browser payload, encrypts `TenDangNhap`
  and `MatKhau` separately with CryptoJS AES, then forwards them to
  `${API_URL}/api/auth/login`. On success, the backend sets its
  `access_token` response cookie and a non-CORS-exposed
  `X-Auth-Access-Token` server-to-server fallback header. The frontend accepts
  split or combined `Set-Cookie`, that fallback header, and legacy JSON token
  fields, then stores the normalized user, token, and absolute expiry in an
  HMAC-signed `HttpOnly` frontend cookie. The backend returns the account
  classification in the `Role` key as CryptoJS AES ciphertext
  (`U2FsdGVkX1…` → `"0"` student, `"1"` lecturer, `"2"` other); the BFF
  decrypts it with `PRIVATE_KEY_ENCRYPT` and stores the typed session `Role`
  (`AuthRole` = `0 | 1 | 2`). A plain number or numeric string in `Role` is
  accepted unchanged; no other key is treated as the classification. Every
  claim — id, username, email, full name, `HT_GROUPUSER_ID`, `Role`, token — is
  resolved against `user`, nested `body.user`/`body.nguoiDung`/`body.data`,
  `body`, and the response root in that priority order, because the provider
  may split profile data and account classification between those objects.
  Malformed successful responses, a missing `Role` claim, and a `Role` outside
  `0|1|2` (including ciphertext that does not decrypt) return distinct contract
  errors instead of the network-only “Không thể kết nối…” message. If IIS
  replaces a rejected login's JSON body with a plain `400`, `401`, or `403`
  response, the BFF preserves that authentication status and returns a safe
  account/email-verification message instead of misreporting `502`; the login
  form then links to `/auth/resend-verification`. Structured failed logins are
  relayed as status plus message only; upstream payload fields and the token are
  never included in the browser JSON response. Email values
  returned as CryptoJS AES ciphertext are decrypted server-side with
  `PRIVATE_KEY_ENCRYPT` before session and Navbar display; already-plain email
  values remain unchanged. Credentials are not exposed in the browser response.
- For accounts classified as `Loai = 2`, the backend authenticates and loads the
  user from `HT_NguoiDungNgoai`; `verifyJWT` maps
  `HT_NguoiDungNgoai_ID` to `req.HT_USER` so uploads and file ownership use the
  authenticated external-user ID. The legacy `Dang_Nguoi_Dang` login procedure
  uses a different table and must not be used for this branch.
- `GET /api/auth/session` returns the current user for server-rendered UI.
  `DELETE /api/auth/session` signs the user out.
- `/profile` reads the authenticated session on the server and displays the
  current user's full name, username, email, and user ID.
- The shared Navbar shows **Sign in** for guests. Authenticated users receive
  **Profile**, **Submission History**, and **Sign Out** account actions.
  Administrators also receive **Review Submissions**, which links to
  `/admin/submissions`; the mobile navigation exposes the same authorized items.

Set `API_URL` for the server-side authentication endpoint. It falls back to
`NEXT_PUBLIC_API_URL`, then `https://apiv3.uneti.edu.vn`. Set
`PRIVATE_KEY_ENCRYPT` to the same AES passphrase used by the backend. Set a
separate high-entropy `SESSION_SECRET` for signing authentication cookies; the
server falls back to `PRIVATE_KEY_ENCRYPT` only for existing deployments. Keep
these server variables in `.env.local`; never prefix either secret with
`NEXT_PUBLIC_`.
Set `ADMIN_USERNAMES` to a comma-separated server-side allowlist of usernames
that may access admin routes. An empty or missing allowlist denies admin access.

Proxy performs an optimistic route check. Protected API and data operations
must still validate the backend token before returning private data.

## Paper submission

- `/aiesi-2027/join` is public. **Submit Now** opens the paper-submission form
  for authenticated users; guests see an English sign-in-required dialog whose
  **Sign in now** action navigates to `/auth/login`. The form includes a Quill
  abstract editor and up to five `.doc`, `.docx`, or `.pdf` attachments.
- `/aiesi-2027/submissions` loads real records from
  `KHCN_AIESI_BaiDang_Load_Paged`, renders API pagination, and shows the exact
  `STT`, `Title`, `Abstract`, `Authors`, `Keywords`, `File`, `Status`,
  `Submitted at`, and `Actions` columns. `STT` continues across pages.
  `Title`, `Abstract`, `Authors`, and `Keywords` are collapsed to two lines when
  needed. Overflowing values get **Show more** and **Show less** controls;
  shorter values do not render an expansion action. Abstract HTML is sanitized
  before rendering. Each attachment appears as a file icon with **Preview** and
  opens in a near-full-screen Microsoft Office Web Viewer dialog. Search applies
  to the current page. For submitters, **Edit** and **Cancel** are available only
  while status is `NULL` (`Gửi lên`); editing preserves attachments and backend
  metadata, while cancellation performs a full-record update with status `-1`.
- Sessions preserve `HT_GROUPUSER_ID`. Staff login tokens merge the detailed
  account's group array into the signed JWT claims. Group `"1"` explicitly
  requests `HT_USER_Create=NULL`, sees all submissions, and gets **Approve** and
  **Reject** actions for active submissions. Clicking **Preview** on a submitted
  record first uses the full-record Edit API to set status `1`; **Approve** and
  **Reject** set status `2` and `-2`, respectively. Other accounts are forcibly
  restricted by the API to their authenticated user ID, even if they submit a
  different owner filter.
- `/admin/submissions` is an administrator-only, read-only mock review queue.
  It groups submitted papers by submitter account and shows each paper's current
  review status.
- `POST /api/submissions` validates the authenticated session and form, uploads
  attachments through `KHCN_AIESI_Upload`, then creates the paper through
  `KHCN_AIESI_BaiDang_Add_Para`. It maps the public form fields to the backend
  `KHCN_AIESI_BaiDang_*` contract and authenticates both calls with the
  server-side `access_token` cookie.
  New submissions set `KHCN_AIESI_BaiDang_NguonTiepNhan = 1` for WEB,
  derive `KHCN_AIESI_BaiDang_LoaiTaiKhoan` from the signed-in user’s validated
  `Role` value (`0`, `1`, or `2`), and send
  `KHCN_AIESI_BaiDang_EmailNguoiGui` — the signed-in account's email, taken
  from the signed session (never from the browser form) so the backend can mail
  the submission-received notification. An account whose session carries no
  valid address submits with an empty string instead of failing.
- New submissions persist `KHCN_AIESI_BaiDang_TrangThai = NULL`. Status values
  are `NULL` (Gửi lên), `1` (Người xử lý đã xem), `2` (Người xử lý duyệt),
  `-1` (Người đăng tự huỷ), and `-2` (Người xử lý không duyệt).
- If record creation fails after upload, the route calls
  `KHCN_AIESI_DeleteFile` to remove the abandoned files. The backend cleanup job
  remains the fallback when immediate cleanup is unavailable.
- Submission success and non-session errors use the shared status dialog, which
  supports `warning`, `error`, `info`, `question`, and `success` icon variants.
- Authenticated pages check the same-origin session endpoint while active. An
  invalid or expired signed session returns the user to login.
- If the local session expires while the submission dialog is open, or if the
  submission backend rejects an expired token with `401`/`403`, the submission
  route clears the authentication cookie. The current text fields and attached
  files are stored locally for up to one hour, the user is sent to login, and a
  top-right expiration toast is shown. A successful login returns to
  `/aiesi-2027/join`, reopens the dialog, and restores the draft. Cancelling
  login, following another login page link, cancelling the restored dialog, or
  completing submission deletes the stored draft.


## KHCN AIESI integration demo

- `/aiesi-2027/aiesi-demo` is an authenticated CRUD demo backed by the
  `KHCN_AIESI` Express module.
- Browser code calls only same-origin `/api/khcn-aiesi/*` handlers. Each handler
  validates the `icai_auth_session` cookie, creates the backend
  `access_token` cookie server-side, validates request/response boundaries with
  Zod, and disables fetch caching.
- The demo covers paged load and filters, detail, add, full-record edit, soft
  delete, multi-file upload, and physical file deletion. Soft delete does not
  remove files.
- The current frontend session stores only an access token. Backend refresh
  cookies are therefore not synchronized; production refresh support requires
  extending the HttpOnly session contract.

Required server-only environment:

```bash
KHCN_AIESI_API_URL=https://apiv3.uneti.edu.vn
KHCN_AIESI_FILE_PUBLIC_URL=https://apiv3.uneti.edu.vn
```

The backend must run at the configured origin, and the user must sign in before
opening the demo. Do not expose either setting through a `NEXT_PUBLIC_*`
variable.

## Deployment (IIS — aiesi2027.uneti.edu.vn)

`next.config.ts` builds with `output: "standalone"`. IIS does not run Next.js
itself: it terminates TLS for `aiesi2027.uneti.edu.vn` and reverse-proxies to
`node server.js` on `127.0.0.1:3100` (URL Rewrite + ARR).

### Option 1: build and deploy on the Windows server

Open **PowerShell as Administrator** in a repository checkout:

```powershell
Set-Location C:\path\to\icai-clone
corepack enable
.\deploy\iis\deploy.bat
```

`deploy.bat` installs dependencies, runs `pnpm package:iis`, mirrors the payload
to `C:\Websites\aiesi2027`, installs or updates the `aiesi2027-next` WinSW
service, configures IIS, starts the service, and verifies the deployment. It is
safe to run again after an update:

```powershell
Set-Location C:\path\to\icai-clone
git pull --ff-only
.\deploy\iis\deploy.bat
```

### Option 2: deploy the generated ZIP

Create the portable artifact on any build machine with Node.js 20.9 or newer:

```bash
corepack enable
pnpm build:iis
```

The command installs the frozen lockfile for the current host plus Windows x64,
builds the standalone app, verifies the native `sharp-win32-x64` addon and
libvips DLLs, then writes `aiesi2027-dist.zip`. The archive contains `app/`,
`site/`, `service/`, and the deployment scripts directly at its root.

Copy the archive to the IIS server, extract it into a clean staging directory,
then run the packaged deployment script from an elevated PowerShell window:

```powershell
$release = "C:\Deploy\aiesi2027-new"
Remove-Item $release -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive .\aiesi2027-dist.zip -DestinationPath $release
Set-Location $release
.\deploy.bat
```

Verify the Node service and public site:

```powershell
Invoke-WebRequest http://127.0.0.1:3100/api/auth/session -UseBasicParsing
(Invoke-WebRequest https://aiesi2027.uneti.edu.vn/aiesi-2027 -UseBasicParsing).StatusCode
```

`dist-iis/app` is the service working directory, `dist-iis/site/web.config` is
the IIS site root, and `dist-iis/service` holds the WinSW definition. The proxy
rule must forward `X-Forwarded-Proto: https`, otherwise `icai_auth_session` is
issued without the `Secure` flag. Full prerequisites, apphost commands, runtime
environment variables, and troubleshooting:
[`deploy/iis/README.md`](deploy/iis/README.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
