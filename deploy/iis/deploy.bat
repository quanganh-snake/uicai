@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ============================================================
rem  AIESI 2027 - one-click deploy to IIS (aiesi2027.uneti.edu.vn)
rem
rem  Run as Administrator. Safe to re-run (redeploy / update).
rem
rem  Works in two modes, detected automatically:
rem    repo mode    - this file sits in <repo>\deploy\iis: installs
rem                   dependencies, runs `package:iis`, then deploys.
rem    payload mode - this file sits at the root of dist-iis next to app\:
rem                   skips the build and deploys the prebuilt payload.
rem
rem  Steps: build -> copy payload -> service (WinSW) -> IIS -> verify.
rem ============================================================

set "SITE_NAME=aiesi2027.uneti.edu.vn"
set "ROOT=C:\Websites\aiesi2027"
set "SERVICE_ID=aiesi2027-next"
set "APP_PORT=3100"
set "API_ORIGIN=https://apiv3.uneti.edu.vn"
set "SITE_ORIGIN=https://aiesi2027.uneti.edu.vn"
set "WINSW_URL=https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW.NET4.exe"
set "PNPM_VERSION=pnpm@10.26.1"

set "SCRIPT_DIR=%~dp0"
set "FAILED="
rem deploy.bat /key : nhap lai PRIVATE_KEY_ENCRYPT, bo qua gia tri da cai.
set "FORCE_KEY="
if /i "%~1"=="/key" set "FORCE_KEY=1"

net session >nul 2>&1
if errorlevel 1 (
  echo [FAIL] Right-click this file and choose "Run as administrator".
  goto :end
)

echo.
echo === 1/7 Locate the payload ===
set "REPO="
set "PAYLOAD="
for %%I in ("%SCRIPT_DIR%..\..") do set "REPO_CANDIDATE=%%~fI"
if exist "%REPO_CANDIDATE%\package.json" if exist "%REPO_CANDIDATE%\scripts\package-iis.mjs" (
  set "REPO=%REPO_CANDIDATE%"
  set "PAYLOAD=%REPO_CANDIDATE%\dist-iis"
)
if not defined REPO (
  for %%I in ("%SCRIPT_DIR%.") do set "PAYLOAD=%%~fI"
  if not exist "!PAYLOAD!\app\server.js" (
    echo [FAIL] No source repository and no dist-iis payload found next to this file.
    echo        Run it from ^<repo^>\deploy\iis or from the root of dist-iis.
    goto :end
  )
  echo     payload mode: !PAYLOAD!
) else (
  echo     repo mode: %REPO%
)

rem Payload extracted straight into %ROOT%: nothing to copy, files are in place.
set "INPLACE="
for %%I in ("%ROOT%") do set "ROOT_FULL=%%~fI"
for %%I in ("%PAYLOAD%") do set "PAYLOAD_FULL=%%~fI"
if /i "!PAYLOAD_FULL!"=="!ROOT_FULL!" set "INPLACE=1"

if defined REPO (
  echo.
  echo === 2/7 Build the payload ===
  where node >nul 2>&1
  if errorlevel 1 (
    echo [FAIL] node not found in PATH. Install Node.js 20 LTS or newer for all users.
    goto :end
  )
  for /f "usebackq tokens=*" %%V in (`node -v`) do echo     node %%V

  rem Build-time values: NEXT_PUBLIC_* are inlined into the bundle here.
  rem NODE_ENV stays unset: pnpm/npm would skip devDependencies that the build needs.
  set "API_URL=%API_ORIGIN%"
  set "NEXT_PUBLIC_API_URL=%API_ORIGIN%"
  set "NEXT_PUBLIC_SITE_URL=%SITE_ORIGIN%"
  set "KHCN_AIESI_API_URL=%API_ORIGIN%"
  set "KHCN_AIESI_FILE_PUBLIC_URL=%API_ORIGIN%"

  set "PKG=pnpm"
  where pnpm >nul 2>&1
  if errorlevel 1 (
    corepack enable >nul 2>&1
    corepack prepare %PNPM_VERSION% --activate >nul 2>&1
    where pnpm >nul 2>&1
    if errorlevel 1 set "PKG=npm"
  )
  echo     package manager: !PKG!

  pushd "%REPO%"
  if /i "!PKG!"=="pnpm" (
    call pnpm install --frozen-lockfile
  ) else (
    call npm install --no-audit --no-fund
  )
  if errorlevel 1 (
    popd
    echo [FAIL] Dependency installation failed.
    goto :end
  )
  call !PKG! run package:iis
  if errorlevel 1 (
    popd
    echo [FAIL] Build failed ^(next build / package-iis^).
    goto :end
  )
  popd
  if not exist "%PAYLOAD%\app\server.js" (
    echo [FAIL] %PAYLOAD%\app\server.js missing after the build.
    goto :end
  )
  echo     payload built: %PAYLOAD%
) else (
  echo.
  echo === 2/7 Build the payload ===
  echo     skipped ^(prebuilt payload^)
)

echo.
echo === 3/7 Stop the service while files are replaced ===
sc query "%SERVICE_ID%" >nul 2>&1
if errorlevel 1 (
  echo     service "%SERVICE_ID%" not installed yet
) else (
  net stop "%SERVICE_ID%" >nul 2>&1
  echo     service "%SERVICE_ID%" stopped
)

echo.
echo === 4/7 Copy files to %ROOT% ===
if not exist "%ROOT%" mkdir "%ROOT%"
if not exist "%ROOT%\site" mkdir "%ROOT%\site"
if not exist "%ROOT%\logs" mkdir "%ROOT%\logs"
if not exist "%ROOT%\service" mkdir "%ROOT%\service"

if defined INPLACE (
  echo     payload is already %ROOT% - no copy needed
  if not exist "%ROOT%\app\server.js" (
    echo [FAIL] %ROOT%\app\server.js missing - extract dist-iis so that app\, site\, service\ sit directly under %ROOT%.
    goto :end
  )
  if not exist "%ROOT%\site\web.config" (
    if exist "%SCRIPT_DIR%web.config" copy /y "%SCRIPT_DIR%web.config" "%ROOT%\site\web.config" >nul
  )
  if not exist "%ROOT%\site\web.config" (
    echo [FAIL] %ROOT%\site\web.config missing - copy it from dist-iis\site.
    goto :end
  )
  echo     app\ and site\web.config verified
) else (
  robocopy "%PAYLOAD%\app" "%ROOT%\app" /MIR /NFL /NDL /NJH /NJS /NP >nul
  if errorlevel 8 (
    echo [FAIL] robocopy could not mirror %PAYLOAD%\app to %ROOT%\app.
    goto :end
  )
  echo     app mirrored to %ROOT%\app

  set "WEBCONFIG_SRC=%PAYLOAD%\site\web.config"
  if not exist "!WEBCONFIG_SRC!" set "WEBCONFIG_SRC=%SCRIPT_DIR%web.config"
  if not exist "!WEBCONFIG_SRC!" (
    echo [FAIL] web.config not found ^(looked in %PAYLOAD%\site and %SCRIPT_DIR%^).
    goto :end
  )
  copy /y "!WEBCONFIG_SRC!" "%ROOT%\site\web.config" >nul
  if errorlevel 1 (
    echo [FAIL] Could not copy web.config to %ROOT%\site.
    goto :end
  )
  echo     web.config copied to %ROOT%\site

  rem tools\check-auth-upstream.mjs: kiem chung PRIVATE_KEY_ENCRYPT sau khi deploy.
  set "TOOLS_SRC=%PAYLOAD%\tools\check-auth-upstream.mjs"
  if not exist "!TOOLS_SRC!" set "TOOLS_SRC=%REPO%\scripts\check-auth-upstream.mjs"
  if exist "!TOOLS_SRC!" (
    if not exist "%ROOT%\tools" mkdir "%ROOT%\tools"
    copy /y "!TOOLS_SRC!" "%ROOT%\tools\check-auth-upstream.mjs" >nul
    echo     tools\check-auth-upstream.mjs copied to %ROOT%\tools
  )
)

rem A zip that dropped the dot-prefixed .next folder still starts server.js but
rem answers 404 for every route - catch that here, not during verification.
if not exist "%ROOT%\app\.next\required-server-files.json" (
  echo [FAIL] %ROOT%\app\.next is incomplete ^(required-server-files.json missing^).
  echo        Re-create the payload with `pnpm package:iis` and transfer it with a
  echo        tool that keeps dot-prefixed folders ^(zip -r, 7-Zip, robocopy^).
  goto :end
)
if not exist "%ROOT%\app\.next\server\app\" (
  echo [FAIL] %ROOT%\app\.next\server\app missing - the compiled routes did not arrive.
  echo        Re-create and re-transfer the payload; every route would answer 404.
  goto :end
)
echo     payload completeness verified

echo.
echo === 5/7 Service definition and secrets ===
set "SERVICE_TEMPLATE=%PAYLOAD%\service\%SERVICE_ID%.xml"
if not exist "%SERVICE_TEMPLATE%" set "SERVICE_TEMPLATE=%SCRIPT_DIR%%SERVICE_ID%.xml"
if not exist "%SERVICE_TEMPLATE%" (
  echo [FAIL] %SERVICE_ID%.xml not found ^(looked in %PAYLOAD%\service and %SCRIPT_DIR%^).
  goto :end
)

set "WRITER=%SCRIPT_DIR%write-service-xml.ps1"
if not exist "%WRITER%" (
  echo [FAIL] write-service-xml.ps1 missing next to this file.
  goto :end
)

rem PRIVATE_KEY_ENCRYPT: khoa AES apiv3 dung de giai ma thong tin dang nhap.
rem Batch khong cham vao gia tri khoa (delayed expansion nuot ky tu "!"):
rem chi tim file .env.local va de write-service-xml.ps1 doc / hoi truc tiep.
set "KEYARGS="
set "ENVFILE="
if defined REPO if exist "%REPO%\.env.local" set "ENVFILE=%REPO%\.env.local"
if not defined ENVFILE if exist "%PAYLOAD%\.env.local" set "ENVFILE=%PAYLOAD%\.env.local"
if not defined ENVFILE if exist "%ROOT%\.env.local" set "ENVFILE=%ROOT%\.env.local"
if not defined ENVFILE if exist "%SCRIPT_DIR%.env.local" set "ENVFILE=%SCRIPT_DIR%.env.local"

if defined ENVFILE (
  set "KEYARGS=-EnvFile "!ENVFILE!""
  echo     PRIVATE_KEY_ENCRYPT lay tu !ENVFILE! ^(ap lai moi lan deploy^)
) else (
  rem Khong co .env.local: hoi khi chua co service XML dung duoc.
  set "NEED_KEY=1"
  if exist "%ROOT%\service\%SERVICE_ID%.xml" (
    find /i "REPLACE_WITH_BACKEND_AES_KEY" "%ROOT%\service\%SERVICE_ID%.xml" >nul 2>&1
    if errorlevel 1 set "NEED_KEY="
  )
  if defined NEED_KEY (
    set "KEYARGS=-PromptForKey"
  ) else (
    echo     existing service definition found - secrets preserved
  )
)

rem /key: luon hoi gia tri moi, bo qua ca .env.local lan gia tri da cai.
if defined FORCE_KEY (
  set "KEYARGS=-ForceKey -PromptForKey"
  echo     /key: nhap PRIVATE_KEY_ENCRYPT moi ^(ghi de gia tri da cai^)
)

set "VALUES=%TEMP%\aiesi2027-service-env.txt"
> "%VALUES%" echo NODE_ENV=production
>> "%VALUES%" echo HOSTNAME=127.0.0.1
>> "%VALUES%" echo PORT=%APP_PORT%
>> "%VALUES%" echo API_URL=%API_ORIGIN%
>> "%VALUES%" echo NEXT_PUBLIC_API_URL=%API_ORIGIN%
>> "%VALUES%" echo NEXT_PUBLIC_SITE_URL=%SITE_ORIGIN%
>> "%VALUES%" echo KHCN_AIESI_API_URL=%API_ORIGIN%
>> "%VALUES%" echo KHCN_AIESI_FILE_PUBLIC_URL=%API_ORIGIN%

powershell -NoProfile -ExecutionPolicy Bypass -File "%WRITER%" -Template "%SERVICE_TEMPLATE%" -Destination "%ROOT%\service\%SERVICE_ID%.xml" -ValuesFile "%VALUES%" -AppDir "%ROOT%\app" -LogDir "%ROOT%\logs" %KEYARGS%
set "RC=%errorlevel%"
del "%VALUES%" >nul 2>&1
set "AIESI_PRIVATE_KEY_ENCRYPT="
if not "%RC%"=="0" (
  echo [FAIL] Could not write the service definition.
  goto :end
)

if not exist "%ROOT%\service\%SERVICE_ID%.exe" (
  echo     downloading WinSW ...
  curl.exe -L -s -o "%ROOT%\service\%SERVICE_ID%.exe" "%WINSW_URL%"
  if not exist "%ROOT%\service\%SERVICE_ID%.exe" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -Uri '%WINSW_URL%' -OutFile '%ROOT%\service\%SERVICE_ID%.exe' -UseBasicParsing } catch { exit 1 }"
  )
  if not exist "%ROOT%\service\%SERVICE_ID%.exe" (
    echo [FAIL] Could not download WinSW. Fetch %WINSW_URL% manually,
    echo        save it as %ROOT%\service\%SERVICE_ID%.exe and re-run.
    goto :end
  )
  echo     WinSW saved as %ROOT%\service\%SERVICE_ID%.exe
)

echo.
echo === 6/7 Install and start the Node service ===
rem A foreign listener on the app port makes the service die with EADDRINUSE and
rem makes the verification answer 404 from someone else's process.
netstat -ano | findstr /r /c:"TCP.*:%APP_PORT% .*LISTENING" > "%TEMP%\aiesi2027-port.txt" 2>nul
for /f "usebackq tokens=5" %%P in ("%TEMP%\aiesi2027-port.txt") do set "PORT_PID=%%P"
del "%TEMP%\aiesi2027-port.txt" >nul 2>&1
if defined PORT_PID (
  sc query "%SERVICE_ID%" | find /i "RUNNING" >nul
  if errorlevel 1 (
    echo [FAIL] Port %APP_PORT% is already taken by PID !PORT_PID!:
    tasklist /fi "pid eq !PORT_PID!"
    echo        Stop that process ^(taskkill /pid !PORT_PID! /f^) or change APP_PORT here
    echo        and in site\web.config, then re-run.
    goto :end
  )
)

sc query "%SERVICE_ID%" >nul 2>&1
if errorlevel 1 (
  "%ROOT%\service\%SERVICE_ID%.exe" install
  if errorlevel 1 (
    echo [FAIL] WinSW could not install the service.
    goto :end
  )
  sc config "%SERVICE_ID%" start= auto >nul 2>&1
  echo     service installed
)
net start "%SERVICE_ID%" >nul 2>&1
timeout /t 5 /nobreak >nul
sc query "%SERVICE_ID%" | find /i "RUNNING" >nul
if errorlevel 1 (
  echo [FAIL] Service "%SERVICE_ID%" is not running. Check %ROOT%\logs\%SERVICE_ID%.err.log
  set "FAILED=1"
) else (
  echo     service "%SERVICE_ID%" running
)

echo.
echo === 7/7 IIS features, proxy and site ===
if not exist "%SCRIPT_DIR%setup-iis.bat" (
  echo [FAIL] setup-iis.bat missing next to this file.
  goto :end
)
call "%SCRIPT_DIR%setup-iis.bat" /nopause
if errorlevel 1 set "FAILED=1"

echo.
echo === Verification ===
curl.exe -s -o nul -w "    node 127.0.0.1:%APP_PORT%/api/auth/session -> HTTP %%{http_code}\n" "http://127.0.0.1:%APP_PORT%/api/auth/session"
rem Loopback with the site's host header: proves IIS + rewrite + ARR work even
rem when DNS or the TLS binding does not answer from this machine.
curl.exe -s -o nul -w "    IIS loopback (Host: %SITE_NAME%) -> HTTP %%{http_code}\n" -H "Host: %SITE_NAME%" "http://127.0.0.1/"
curl.exe -s -k -o nul -w "    %SITE_ORIGIN%/ -> HTTP %%{http_code}\n" "%SITE_ORIGIN%/"
curl.exe -s -k -o nul -w "    %SITE_ORIGIN%/aiesi-2027 -> HTTP %%{http_code}\n" "%SITE_ORIGIN%/aiesi-2027"
curl.exe -s -o nul -w "    %API_ORIGIN%/ -> HTTP %%{http_code}\n" "%API_ORIGIN%/"
echo.
rem So khoa da cai voi khoa tham chieu (.env.local) - ket luan tat dinh, offline.
rem Khong co .env.local thi chi kiem tra ket noi toi apiv3: phan hoi dang nhap
rem that bai cua apiv3 khong phan biet duoc khoa sai voi tai khoan sai.
if exist "%ROOT%\tools\check-auth-upstream.mjs" (
  set "CHECKARGS="
  if defined ENVFILE set "CHECKARGS=--expect-env-file "!ENVFILE!""
  node "%ROOT%\tools\check-auth-upstream.mjs" --service-xml "%ROOT%\service\%SERVICE_ID%.xml" --api "%API_ORIGIN%" !CHECKARGS!
  if errorlevel 3 (
    echo     [WARN] Chua ket luan duoc PRIVATE_KEY_ENCRYPT. Kiem tra bang tai khoan that:
    echo            node %ROOT%\tools\check-auth-upstream.mjs --service-xml %ROOT%\service\%SERVICE_ID%.xml --user ^<user^> --pass ^<pass^>
  ) else if errorlevel 2 (
    echo [FAIL] PRIVATE_KEY_ENCRYPT khong khop khoa tham chieu - dang nhap se that bai.
    echo        Chay lai: deploy.bat /key  roi nhap dung passphrase.
    set "FAILED=1"
  )
)
echo.
echo     Expected: node 200, IIS loopback 301 ^(http-^>https redirect rule^),
echo     site 200 on / and /aiesi-2027, apiv3 reachable
echo     ^(401 from %API_ORIGIN%/ is normal: it only answers authenticated routes^).
echo.
if defined FAILED (
  echo Deploy finished WITH ERRORS - read the [FAIL] lines above.
) else (
  echo Deploy finished. Site: %SITE_ORIGIN%/
  echo If HTTPS does not answer, bind the TLS certificate for %SITE_NAME% ^(SNI^) in IIS Manager.
)

:end
echo.
pause
endlocal
