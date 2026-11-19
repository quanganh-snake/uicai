# Deploy AIESI 2027 on IIS — aiesi2027.uneti.edu.vn

Next.js 16 runs as a Node process (`output: "standalone"`); IIS serves the
public domain and reverse-proxies to it. IIS does not execute Next.js itself.

```
Browser ──HTTPS──> IIS (aiesi2027.uneti.edu.vn)
                     │  URL Rewrite + ARR
                     └──HTTP──> 127.0.0.1:3100  node server.js (Windows service)
                                     │
                                     └──HTTPS──> https://apiv3.uneti.edu.vn
```

## 0. One-click deploy (`deploy.bat`)

`deploy/iis/deploy.bat` performs the whole deployment — build, file copy,
Windows service, IIS configuration, verification — in a single run. Copy this
repository (or the `dist-iis` payload) to the server, then **right-click
`deploy.bat` → Run as administrator**.

It detects where it runs:

| Location | Behaviour |
| --- | --- |
| `<repo>\deploy\iis\deploy.bat` | installs dependencies (pnpm via corepack, npm fallback), runs `package:iis`, then deploys `dist-iis` |
| `dist-iis\deploy.bat` (next to `app\`) | skips the build and deploys the prebuilt payload |
| payload extracted straight into `C:\Websites\aiesi2027` | same as above, and the copy step is skipped because source and destination are the same folder |

Steps performed, all idempotent:

1. Build the payload (repo mode only). `NEXT_PUBLIC_*` are set from the
   variables at the top of the file before `next build`, so the bundle is
   inlined with the production origins even without a `.env.local` on the server.
2. Stop the `aiesi2027-next` service if it is already installed.
3. `robocopy /MIR` the standalone app to `C:\Websites\aiesi2027\app`, copy
   `web.config` to `C:\Websites\aiesi2027\site` and
   `tools\check-auth-upstream.mjs` to `C:\Websites\aiesi2027\tools`, create
   `logs\` and `service\`.
4. Write `C:\Websites\aiesi2027\service\aiesi2027-next.xml` through
   `write-service-xml.ps1`: runtime env from the file's variables,
   `SESSION_SECRET` generated (64 hex) on first deploy. `PRIVATE_KEY_ENCRYPT` is
   resolved in this order: `AIESI_PRIVATE_KEY_ENCRYPT` in the environment, the
   `PRIVATE_KEY_ENCRYPT=` line of the first `.env.local` found next to the repo,
   the payload, `C:\Websites\aiesi2027` or `deploy.bat`, the value already
   installed, then a prompt. **A `.env.local` is re-applied on every deploy**, so
   a wrong key installed earlier is overwritten; `deploy.bat /key` always prompts
   for a new value and ignores both `.env.local` and the installed one.
   `SESSION_SECRET` and `ADMIN_USERNAMES` are
   still read back from the installed definition and preserved. Secrets never
   travel on a command line, and the deploy prints only the key fingerprint
   (`sha256` prefix / length).
5. Download `WinSW.NET4.exe` as `service\aiesi2027-next.exe` when missing,
   install the service (`start= auto`) and start it.
6. Run `setup-iis.bat /nopause`: IIS features, URL Rewrite 2.1, ARR 3.0, ARR
   proxy with `preserveHostHeader`, the forwarded-header server variables, and
   repoint the existing site `aiesi2027.uneti.edu.vn` at `…\site`.
7. Verify: `http://127.0.0.1:3100/api/auth/session`, `https://aiesi2027.uneti.edu.vn/`,
   `https://aiesi2027.uneti.edu.vn/aiesi-2027`, reachability of
   `https://apiv3.uneti.edu.vn`, and `tools\check-auth-upstream.mjs` on the
   installed `PRIVATE_KEY_ENCRYPT`. With a `.env.local` present it compares the
   installed key with that reference and fails the deploy on a mismatch
   (`[FAIL] PRIVATE_KEY_ENCRYPT khong khop khoa tham chieu`); without one it only
   checks that apiv3 answers and prints the command for a real-account test.

Change `ROOT`, `SITE_NAME`, `APP_PORT`, `API_ORIGIN` or `SITE_ORIGIN` at the top
of `deploy.bat` if the deployment differs (`web.config` and the service template
must match the port and domain). A redeploy after new commits is the same
one click: it stops the service, mirrors the new build and starts it again.

The TLS certificate binding for `https://aiesi2027.uneti.edu.vn` (SNI) is the
only manual step; IIS does not allow scripting a certificate it does not have.
The sections below document the same work performed manually.

## 1. Server prerequisites

- Node.js 20 LTS or newer (`node -v`), installed for all users.
- IIS with [URL Rewrite 2.1](https://www.iis.net/downloads/microsoft/url-rewrite)
  and [Application Request Routing 3.0](https://www.iis.net/downloads/microsoft/application-request-routing).
- [WinSW](https://github.com/winsw/winsw/releases) (`WinSW.NET4.exe`) or NSSM to
  run the Node process as a service.
- TLS certificate for `aiesi2027.uneti.edu.vn` in the local machine store.

`setup-iis.bat` (shipped at the root of `dist-iis`) performs the IIS part
automatically — run it **as administrator** on the server after extracting the
payload to `C:\Websites\aiesi2027`:

```bat
C:\Websites\aiesi2027\setup-iis.bat
```

It enables the IIS features, installs URL Rewrite 2.1 and ARR 3.0 when missing
(silent MSI download), enables the ARR proxy with `preserveHostHeader`, allows
`HTTP_X_FORWARDED_PROTO` / `HTTP_X_FORWARDED_HOST`, copies `web.config` into
`site\`, and repoints the existing IIS site `aiesi2027.uneti.edu.vn` at
`C:\Websites\aiesi2027\site` (pool set to No Managed Code). It is idempotent;
change `ROOT` / `SITE_NAME` at the top of the file if your paths differ.

The equivalent manual commands:

```powershell
$appcmd = "$env:windir\system32\inetsrv\appcmd.exe"
& $appcmd set config -section:system.webServer/proxy /enabled:"True" /preserveHostHeader:"True" /commit:apphost
& $appcmd set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='HTTP_X_FORWARDED_PROTO']" /commit:apphost
& $appcmd set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='HTTP_X_FORWARDED_HOST']" /commit:apphost
& $appcmd set vdir "aiesi2027.uneti.edu.vn/" /physicalPath:"C:\Websites\aiesi2027\site"
```

`HTTP_X_FORWARDED_PROTO` is mandatory: `shouldUseSecureCookie()` uses it to set
the `Secure` flag on the `icai_auth_session` cookie. Without it the session
cookie is issued without `Secure` over an HTTPS site.

## 2. Build the payload (on the build machine)

```bash
pnpm build:iis
```

`build:iis` installs the frozen lockfile, builds the standalone app, assembles
`dist-iis`, verifies the Windows x64 Sharp native files, and creates the ZIP.

Output:

| Path | Purpose |
| --- | --- |
| `dist-iis/app/` | Service working directory copied to `C:\Websites\aiesi2027\app` |
| `dist-iis/site/web.config` | IIS site configuration |
| `dist-iis/service/aiesi2027-next.xml` | WinSW service template |
| `aiesi2027-dist.zip` | Transferable artifact; the `dist-iis` contents are at the ZIP root |

`NEXT_PUBLIC_*` values are inlined at build time. Build with the production
values already set (`.env.local` in this repo is configured for
`https://apiv3.uneti.edu.vn` / `https://aiesi2027.uneti.edu.vn`); changing them
later requires a rebuild, not a service restart.

Two constraints make the payload portable, both handled by the repo:

- `.npmrc` sets `node-linker=hoisted`. `output: "standalone"` copies
  `node_modules` verbatim, and pnpm's default symlinked layout only resolves
  through its `.pnpm` real paths. `scripts/package-iis.mjs` additionally copies
  with `dereference: true`, so the transferred payload contains no symlinks.
- `pnpm-workspace.yaml` installs optional dependencies for the current build
  host and Windows x64. `package:iis` requires `@img/sharp-win32-x64`, while
  `scripts/archive-iis.mjs` also verifies its native `.node` addon and libvips
  DLL before creating the ZIP. A macOS build therefore remains runnable on the
  Windows IIS server.

## 3. Runtime environment (service)

Server-only values are read from the service environment at startup:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `HOSTNAME` | `127.0.0.1` (never expose Node directly) |
| `PORT` | `3100` (must match `web.config`; 3000 is taken by another Node app on this server) |
| `API_URL` | `https://apiv3.uneti.edu.vn` |
| `KHCN_AIESI_API_URL` | `https://apiv3.uneti.edu.vn` |
| `KHCN_AIESI_FILE_PUBLIC_URL` | `https://apiv3.uneti.edu.vn` |
| `PRIVATE_KEY_ENCRYPT` | the AES passphrase apiv3 uses (credentials, `Role`, email) |
| `SESSION_SECRET` | separate 64-hex random value for cookie signing |
| `ADMIN_USERNAMES` | comma-separated admin logins; empty denies `/admin/*` |

Generate a session secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Install and start the service:

```powershell
cd C:\Websites\aiesi2027\service
Copy-Item WinSW.NET4.exe aiesi2027-next.exe
.\aiesi2027-next.exe install
.\aiesi2027-next.exe start
Invoke-WebRequest http://127.0.0.1:3100/api/auth/session -UseBasicParsing
```

## 4. IIS site

```powershell
New-WebAppPool -Name "aiesi2027"
Set-ItemProperty IIS:\AppPools\aiesi2027 -Name managedRuntimeVersion -Value ""   # No Managed Code
New-Website -Name "aiesi2027" -ApplicationPool "aiesi2027" `
  -PhysicalPath "C:\Websites\aiesi2027\site" -HostHeader "aiesi2027.uneti.edu.vn" -Port 80
New-WebBinding -Name "aiesi2027" -Protocol https -Port 443 -HostHeader "aiesi2027.uneti.edu.vn" -SslFlags 1
# Bind the certificate (SNI) in IIS Manager or with netsh, then:
Restart-WebAppPool -Name "aiesi2027"
```

The site physical path only holds `web.config`; all content is proxied. The app
pool runs no managed code and serves no files, so its identity needs read access
to that folder only.

## 5. Verification

```powershell
Invoke-WebRequest https://aiesi2027.uneti.edu.vn/ -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest https://aiesi2027.uneti.edu.vn/api/auth/session -UseBasicParsing
# Session cookie must come back with Secure + HttpOnly after a real login:
curl.exe -i -X POST https://aiesi2027.uneti.edu.vn/api/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"TenDangNhap\":\"<user>\",\"MatKhau\":\"<pass>\"}"
```

Expected: `/` returns 200 HTML, `/api/auth/session` returns
`{"isAuthenticated":false,"user":null}` when signed out, and a successful login
returns `Set-Cookie: icai_auth_session=…; HttpOnly; Secure; SameSite=Lax`.

When a login fails, the message identifies the layer:

| Response | Cause |
| --- | --- |
| `502 Không thể kết nối đến máy chủ xác thực` | the server cannot reach `https://apiv3.uneti.edu.vn` (proxy/firewall/DNS) |
| `400 Đăng nhập không thành công…` | apiv3 answered its short `Bad Request` rejection: wrong credentials **or** a `PRIVATE_KEY_ENCRYPT` apiv3 cannot decrypt |
| `502 Máy chủ xác thực gặp lỗi nội bộ khi xử lý đăng nhập…` | apiv3 answered its iisnode host error page instead of JSON; same two possible causes |
| `502 Máy chủ xác thực trả dữ liệu không đúng hợp đồng.` / missing-`Role` message | apiv3 answered JSON that does not carry the expected claims |

apiv3 returns JSON **only** when both the passphrase and the account are right;
every failed login returns HTML, and which of the two HTML shapes comes back
varies between calls. The shape therefore never tells wrong-password from
wrong-key apart — the fingerprint and a real-account test do.

Each of these also writes one `[auth/login] …` line to
`C:\Websites\aiesi2027\logs\aiesi2027-next.err.log` with the upstream status,
content type, body snippet and the `PRIVATE_KEY_ENCRYPT` fingerprint — never the
credentials.

Check the installed key — offline, by comparing it with the passphrase known to
work (a `.env.local`, a fingerprint, or the value itself):

```powershell
node C:\Websites\aiesi2027\tools\check-auth-upstream.mjs `
  --service-xml C:\Websites\aiesi2027\service\aiesi2027-next.xml `
  --expect-env-file C:\Websites\aiesi2027\.env.local
# or: --expect <passphrase> | --expect <hex8/length>
```

`KEY SAI` means the installed passphrase differs from the reference: re-run
`deploy.bat /key` (or put `PRIVATE_KEY_ENCRYPT=…` in a `.env.local` next to
`deploy.bat`), which rewrites the service definition and restarts the service.

Prove the whole path with a real account — the only live test that separates a
wrong key from a wrong password:

```powershell
node C:\Websites\aiesi2027\tools\check-auth-upstream.mjs `
  --service-xml C:\Websites\aiesi2027\service\aiesi2027-next.xml `
  --user <user> --pass <pass>
```

`KEY OK: apiv3 chấp nhận khoá, đăng nhập thành công` means this server's key and
that account work against apiv3. Without `--expect` or an account the tool only
reports reachability and exits `3` (`KHÔNG XÁC ĐỊNH`).

## 6. Updates

```powershell
.\aiesi2027-next.exe stop
# replace C:\Websites\aiesi2027\app with the new dist-iis\app
.\aiesi2027-next.exe start
```

`web.config` only changes when the port, domain, or upload limit changes.
