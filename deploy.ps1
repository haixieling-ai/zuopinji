#Requires -Version 5.1
# Next.js Deploy Script - Run: powershell -ExecutionPolicy Bypass -File .\deploy.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$serverIp = "8.218.150.12"
$serverUser = "root"
$serverPath = "/var/www/portfolio"
$appName = "portfolio"

function Fail { param($m) Write-Host "[ERR] $m" -ForegroundColor Red; exit 1 }
function Info { param($m) Write-Host $m -ForegroundColor Cyan }
function Ok { param($m) Write-Host $m -ForegroundColor Green }

# Step 1: Build
Ok "`n==== 1. Building Next.js ===="
try {
    npm run build 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { Fail "Build failed" }
}
catch {
    Fail "Build error: $_"
}

# Step 2: SSH trust
Ok "`n==== 2. SSH trust ===="
$sshDir = Join-Path $env:USERPROFILE ".ssh"
$knownHosts = Join-Path $sshDir "known_hosts"
if (-not (Test-Path $sshDir)) { New-Item -ItemType Directory -Path $sshDir -Force | Out-Null }
try {
    ssh-keyscan -H $serverIp 2>$null | Out-File -Append -FilePath $knownHosts -Encoding ASCII
}
catch { }

# Step 3: Upload
$list = @(".next", "public", "package.json", "package-lock.json")
if (Test-Path "next.config.js") { $list += "next.config.js" }
elseif (Test-Path "next.config.mjs") { $list += "next.config.mjs" }
elseif (Test-Path "next.config.ts") { $list += "next.config.ts" }

Ok "`n==== 3. Uploading files ===="
foreach ($f in $list) {
    $p = Join-Path $PSScriptRoot $f
    if (-not (Test-Path $p)) { Write-Host "[WARN] Skip (not found): $f" -ForegroundColor Yellow; continue }
    Info "[>>] Uploading: $f"
    & scp -o StrictHostKeyChecking=no -o Compression=yes -o ConnectTimeout=30 -r $p "${serverUser}@${serverIp}:${serverPath}/"
    if ($LASTEXITCODE -ne 0) {
        Fail "Upload failed: $f (check network, port 22, SSH auth, server path)"
    }
}

# Step 4: Remote npm install + PM2
Ok "`n==== 4. Server install and PM2 ===="
$cmd = "cd $serverPath && npm install --production && (pm2 restart $appName 2>/dev/null || pm2 start npm --name $appName -- start) && pm2 save"
try {
    ssh "${serverUser}@${serverIp}" $cmd 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { Fail "Remote command failed (check npm/pm2 on server)" }
}
catch {
    Fail "SSH failed: $_"
}

Ok "`n[OK] Deploy done. Visit http://$serverIp"
