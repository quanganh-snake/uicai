@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ============================================================
rem  AIESI 2027 - IIS setup for aiesi2027.uneti.edu.vn
rem  - installs IIS features, URL Rewrite 2.1, ARR 3.0
rem  - enables ARR proxy + forwarded-header server variables
rem  - points the existing IIS site at %ROOT%\site
rem  Run as Administrator. Safe to re-run. Pass /nopause when called by deploy.bat.
rem ============================================================

set "ROOT=C:\Websites\aiesi2027"
set "SITE_NAME=aiesi2027.uneti.edu.vn"
set "APPCMD=%windir%\system32\inetsrv\appcmd.exe"
set "TEMPDIR=%TEMP%\aiesi2027-setup"
if /i "%~1"=="/nopause" set "NOPAUSE=1"
set "REWRITE_URL=https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi"
set "ARR_URL=https://download.microsoft.com/download/E/9/8/E9849D6A-020E-47E4-9FD0-A023E99B54EB/requestRouter_amd64.msi"

net session >nul 2>&1
if errorlevel 1 (
  echo [FAIL] Right-click this file and choose "Run as administrator".
  goto :fail
)

echo.
echo === 1/7 IIS features ===
for %%F in (
  IIS-WebServerRole
  IIS-WebServer
  IIS-CommonHttpFeatures
  IIS-StaticContent
  IIS-HttpErrors
  IIS-HttpRedirect
  IIS-HttpLogging
  IIS-RequestFiltering
  IIS-Security
  IIS-Performance
  IIS-HttpCompressionStatic
  IIS-WebServerManagementTools
  IIS-ManagementConsole
) do (
  dism /online /enable-feature /featurename:%%F /all /norestart >nul 2>&1
)
echo     IIS features ensured.

if not exist "%APPCMD%" (
  echo [FAIL] appcmd.exe not found - IIS is not installed. Reboot if DISM asked for it, then re-run.
  goto :fail
)

echo.
echo === 2/7 URL Rewrite 2.1 ===
"%APPCMD%" list config -section:system.webServer/globalModules | find /i "RewriteModule" >nul
if not errorlevel 1 (
  echo     Already installed.
) else (
  call :install "URL Rewrite 2.1" "%REWRITE_URL%" "rewrite_amd64_en-US.msi"
  if errorlevel 1 goto :fail
)

echo.
echo === 3/7 Application Request Routing 3.0 ===
"%APPCMD%" list config -section:system.webServer/globalModules | find /i "ApplicationRequestRouting" >nul
if not errorlevel 1 (
  echo     Already installed.
) else (
  call :install "ARR 3.0" "%ARR_URL%" "requestRouter_amd64.msi"
  if errorlevel 1 goto :fail
)

if defined NEEDS_RESET (
  echo     New modules installed - restarting IIS ...
  iisreset /noforce >nul 2>&1
)
echo.
echo === 4/7 Enable ARR proxy ===
"%APPCMD%" set config -section:system.webServer/proxy /enabled:"True" /preserveHostHeader:"True" /commit:apphost >nul
if errorlevel 1 (
  echo [FAIL] Could not enable the ARR proxy. Is ARR installed? Reboot and re-run.
  goto :fail
)
echo     proxy enabled, preserveHostHeader=True

echo.
echo === 5/7 Allow forwarded-header server variables ===
rem x-forwarded-proto drives the Secure flag on the icai_auth_session cookie.
for %%V in (HTTP_X_FORWARDED_PROTO HTTP_X_FORWARDED_HOST) do (
  "%APPCMD%" set config -section:system.webServer/rewrite/allowedServerVariables /-"[name='%%V']" /commit:apphost >nul 2>&1
  "%APPCMD%" set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='%%V']" /commit:apphost >nul
  if errorlevel 1 (
    echo [FAIL] Could not allow %%V.
    goto :fail
  )
  echo     %%V allowed
)

echo.
echo === 6/7 Folders and web.config ===
if not exist "%ROOT%\app\server.js" (
  echo [FAIL] %ROOT%\app\server.js missing - extract dist-iis so that app\, site\, service\ sit directly under %ROOT%.
  goto :fail
)
if not exist "%ROOT%\site" mkdir "%ROOT%\site"
if not exist "%ROOT%\logs" mkdir "%ROOT%\logs"
if exist "%~dp0site\web.config" (
  copy /y "%~dp0site\web.config" "%ROOT%\site\web.config" >nul 2>&1
) else if exist "%~dp0web.config" (
  copy /y "%~dp0web.config" "%ROOT%\site\web.config" >nul 2>&1
)
if not exist "%ROOT%\site\web.config" (
  echo [FAIL] %ROOT%\site\web.config missing - copy it from dist-iis\site.
  goto :fail
)
echo     %ROOT%\site\web.config in place

echo.
echo === 7/7 Point the IIS site at %ROOT%\site ===
"%APPCMD%" list site "%SITE_NAME%" >nul 2>&1
if errorlevel 1 (
  echo [FAIL] IIS site "%SITE_NAME%" not found. Create it first, or fix SITE_NAME at the top of this file.
  "%APPCMD%" list sites
  goto :fail
)

rem appcmd lives in a quoted path: run it into a temp file instead of a
rem back-quoted for /f, where the nested quotes break command parsing.
set "POOL="
if not exist "%TEMPDIR%" mkdir "%TEMPDIR%"
"%APPCMD%" list app "%SITE_NAME%/" /text:applicationPool > "%TEMPDIR%\pool.txt" 2>nul
for /f "usebackq tokens=* delims=" %%P in ("%TEMPDIR%\pool.txt") do set "POOL=%%P"
del "%TEMPDIR%\pool.txt" >nul 2>&1
if "!POOL!"=="" (
  echo [FAIL] Could not read the application pool of "%SITE_NAME%".
  goto :fail
)

"%APPCMD%" set vdir "%SITE_NAME%/" /physicalPath:"%ROOT%\site" >nul
if errorlevel 1 (
  echo [FAIL] Could not set the physical path of "%SITE_NAME%".
  goto :fail
)
"%APPCMD%" set apppool "!POOL!" /managedRuntimeVersion:"" >nul
"%APPCMD%" set apppool "!POOL!" /startMode:"AlwaysRunning" >nul 2>&1
icacls "%ROOT%\site" /grant "IIS AppPool\!POOL!":(OI)(CI)R >nul 2>&1
"%APPCMD%" recycle apppool "!POOL!" >nul 2>&1
"%APPCMD%" start site "%SITE_NAME%" >nul 2>&1
echo     site "%SITE_NAME%" -^> %ROOT%\site  (pool "!POOL!", No Managed Code)

echo.
echo === Result ===
"%APPCMD%" list site "%SITE_NAME%"
"%APPCMD%" list vdir "%SITE_NAME%/"
echo.
curl.exe -s -o nul -w "node backend 127.0.0.1:3100 -> HTTP %%{http_code}\n" http://127.0.0.1:3100/api/auth/session 2>nul
if errorlevel 1 echo node backend 127.0.0.1:3100 -^> not reachable
echo.
echo IIS is configured. Remaining steps:
echo   1. service\aiesi2027-next.xml: set PRIVATE_KEY_ENCRYPT and SESSION_SECRET
echo   2. cd %ROOT%\service ^&^& copy WinSW.NET4.exe aiesi2027-next.exe ^&^& aiesi2027-next.exe install ^&^& aiesi2027-next.exe start
echo   3. bind the TLS certificate to https://%SITE_NAME% (SNI) in IIS Manager
echo   4. browse https://%SITE_NAME%/
goto :end

:install
echo     Downloading %~1 ...
if not exist "%TEMPDIR%" mkdir "%TEMPDIR%"
curl.exe -L -s -o "%TEMPDIR%\%~3" "%~2"
if errorlevel 1 (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -Uri '%~2' -OutFile '%TEMPDIR%\%~3' -UseBasicParsing } catch { exit 1 }"
)
if not exist "%TEMPDIR%\%~3" (
  echo [FAIL] Download failed. Fetch %~2 manually, then install it and re-run this script.
  exit /b 1
)
echo     Installing %~1 ...
msiexec /i "%TEMPDIR%\%~3" /quiet /norestart
set "RC=%errorlevel%"
if not "%RC%"=="0" if not "%RC%"=="3010" (
  echo [FAIL] msiexec returned %RC% for %~1. Install the MSI manually: %TEMPDIR%\%~3
  exit /b 1
)
echo     %~1 installed.
set "NEEDS_RESET=1"
exit /b 0

:fail
set "RC=1"

:end
if not defined RC set "RC=0"
echo.
if not defined NOPAUSE pause
endlocal & exit /b %RC%
