<#
  Produces the WinSW service definition for the AIESI 2027 Next.js service.

  Non-secret env values come from -ValuesFile (NAME=VALUE lines, one per line).
  Secrets never appear on a command line: SESSION_SECRET and ADMIN_USERNAMES are
  read from AIESI_SESSION_SECRET / AIESI_ADMIN_USERNAMES in the process
  environment, and PRIVATE_KEY_ENCRYPT is resolved here, in this order:
      1. AIESI_PRIVATE_KEY_ENCRYPT in the environment
      2. the PRIVATE_KEY_ENCRYPT= line of -EnvFile (re-applied on every deploy)
      3. the value already installed in -Destination (skipped with -ForceKey)
      4. Read-Host prompt (-PromptForKey, or -ForceKey without another source)

  A passphrase that differs from the apiv3 one by a single character makes every
  login fail, so values are trimmed of surrounding whitespace/quotes and their
  fingerprint (sha256 prefix / length) is printed for comparison.
  SESSION_SECRET is generated (32 random bytes, 64 hex) on the first deploy.
#>
param(
  [Parameter(Mandatory = $true)][string]$Template,
  [Parameter(Mandatory = $true)][string]$Destination,
  [Parameter(Mandatory = $true)][string]$ValuesFile,
  [string]$AppDir = '',
  [string]$LogDir = '',
  [string]$EnvFile = '',
  [switch]$ForceKey,
  [switch]$PromptForKey
)

$ErrorActionPreference = 'Stop'
$placeholders = @('REPLACE_WITH_BACKEND_AES_KEY', 'REPLACE_WITH_RANDOM_64_HEX')

function Get-ExistingEnvValue([xml]$doc, [string]$name) {
  $node = $doc.SelectSingleNode("/service/env[@name='$name']")
  if ($null -eq $node) { return '' }
  $value = $node.GetAttribute('value')
  if ($placeholders -contains $value) { return '' }
  return $value
}

function Normalize-Secret([string]$value) {
  if ($null -eq $value) { return '' }
  $v = $value.Trim()
  if ($v.Length -ge 2 -and (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'")))) {
    $v = $v.Substring(1, $v.Length - 2).Trim()
  }
  return $v
}

function Get-Fingerprint([string]$value) {
  if ($value -eq '') { return 'unset' }
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $hex = -join ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($value)) | ForEach-Object { $_.ToString('x2') })
  return "$($hex.Substring(0,8))/$($value.Length)"
}

function Get-EnvFileValue([string]$path, [string]$name) {
  if ($path -eq '' -or -not (Test-Path -LiteralPath $path)) { return '' }
  foreach ($line in Get-Content -LiteralPath $path) {
    $trimmed = $line.Trim()
    if ($trimmed -eq '' -or $trimmed.StartsWith('#')) { continue }
    $split = $trimmed.IndexOf('=')
    if ($split -lt 1) { continue }
    if ($trimmed.Substring(0, $split).Trim() -ne $name) { continue }
    return $trimmed.Substring($split + 1)
  }
  return ''
}

if (-not (Test-Path -LiteralPath $Template)) {
  throw "Service template not found: $Template"
}

$xml = [xml](Get-Content -LiteralPath $Template -Raw)

$existing = $null
if (Test-Path -LiteralPath $Destination) {
  try { $existing = [xml](Get-Content -LiteralPath $Destination -Raw) } catch { $existing = $null }
}

$values = [ordered]@{}
foreach ($line in Get-Content -LiteralPath $ValuesFile) {
  $trimmed = $line.Trim()
  if ($trimmed -eq '' -or $trimmed.StartsWith('#')) { continue }
  $split = $trimmed.IndexOf('=')
  if ($split -lt 1) { continue }
  $values[$trimmed.Substring(0, $split)] = $trimmed.Substring($split + 1)
}

foreach ($name in @('SESSION_SECRET', 'ADMIN_USERNAMES')) {
  $values[$name] = [string]([Environment]::GetEnvironmentVariable("AIESI_$name"))
  if ([string]::IsNullOrWhiteSpace($values[$name]) -and $null -ne $existing) {
    $values[$name] = Get-ExistingEnvValue $existing $name
  }
}

# PRIVATE_KEY_ENCRYPT decides whether apiv3 can decrypt the credentials this
# server sends; a stale wrong value must never survive a deploy silently.
$keySource = ''
$key = [string]([Environment]::GetEnvironmentVariable('AIESI_PRIVATE_KEY_ENCRYPT'))
if (-not [string]::IsNullOrWhiteSpace($key)) { $keySource = 'env' }

if ($keySource -eq '') {
  $fromFile = Get-EnvFileValue $EnvFile 'PRIVATE_KEY_ENCRYPT'
  if (-not [string]::IsNullOrWhiteSpace($fromFile)) {
    $key = $fromFile
    $keySource = "env-file ($EnvFile)"
  }
}

if ($keySource -eq '' -and -not $ForceKey -and $null -ne $existing) {
  $fromInstalled = Get-ExistingEnvValue $existing 'PRIVATE_KEY_ENCRYPT'
  if (-not [string]::IsNullOrWhiteSpace($fromInstalled)) {
    $key = $fromInstalled
    $keySource = 'installed'
  }
}

if ($keySource -eq '' -and ($PromptForKey -or $ForceKey)) {
  Write-Host '    PRIVATE_KEY_ENCRYPT is the AES passphrase apiv3 uses for credentials.'
  $key = Read-Host '    PRIVATE_KEY_ENCRYPT'
  if (-not [string]::IsNullOrWhiteSpace($key)) { $keySource = 'prompt' }
}

$values['PRIVATE_KEY_ENCRYPT'] = $key

if ([string]::IsNullOrWhiteSpace($values['SESSION_SECRET'])) {
  $bytes = New-Object byte[] 32
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $values['SESSION_SECRET'] = -join ($bytes | ForEach-Object { $_.ToString('x2') })
  Write-Host '    SESSION_SECRET generated (64 hex, kept on later redeploys)'
}

if ([string]::IsNullOrWhiteSpace($values['PRIVATE_KEY_ENCRYPT'])) {
  throw 'PRIVATE_KEY_ENCRYPT is empty. Put PRIVATE_KEY_ENCRYPT=<passphrase> in a .env.local next to the payload, or run deploy.bat /key and type it.'
}

foreach ($name in @('PRIVATE_KEY_ENCRYPT', 'SESSION_SECRET')) {
  $raw = [string]$values[$name]
  $normalized = Normalize-Secret $raw
  if ($normalized -ne $raw) {
    Write-Host "    ${name}: da bo khoang trang/dau nhay bao quanh"
  }
  $values[$name] = $normalized
}

$service = $xml.SelectSingleNode('/service')
if ($null -eq $service) { throw "Template has no <service> root: $Template" }

if ($AppDir -ne '') {
  $node = $xml.SelectSingleNode('/service/workingdirectory')
  if ($null -eq $node) {
    $node = $xml.CreateElement('workingdirectory')
    $service.AppendChild($node) | Out-Null
  }
  $node.InnerText = $AppDir
}

if ($LogDir -ne '') {
  $node = $xml.SelectSingleNode('/service/logpath')
  if ($null -eq $node) {
    $node = $xml.CreateElement('logpath')
    $service.AppendChild($node) | Out-Null
  }
  $node.InnerText = $LogDir
}

foreach ($name in $values.Keys) {
  $node = $xml.SelectSingleNode("/service/env[@name='$name']")
  if ($null -eq $node) {
    $node = $xml.CreateElement('env')
    $node.SetAttribute('name', $name)
    $service.AppendChild($node) | Out-Null
  }
  $node.SetAttribute('value', [string]$values[$name])
}

$dir = Split-Path -Parent $Destination
if ($dir -ne '' -and -not (Test-Path -LiteralPath $dir)) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$xml.Save($Destination)
Write-Host "    service definition written: $Destination"
Write-Host "    PRIVATE_KEY_ENCRYPT fingerprint: $(Get-Fingerprint $values['PRIVATE_KEY_ENCRYPT'])"
Write-Host "    nguon khoa: $keySource"
