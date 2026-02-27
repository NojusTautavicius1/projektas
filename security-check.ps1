# PowerShell Security Check Script for Windows
# Run: .\security-check.ps1

Write-Host "🔒 Running Security Check..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Check 1: .env file not in git
Write-Host "Checking .env file status..."
$envInGit = git ls-files --error-unmatch api/.env 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "❌ CRITICAL: .env file is tracked by git!" -ForegroundColor Red
    Write-Host "   Run: git rm --cached api/.env" -ForegroundColor Yellow
    $errors++
} else {
    Write-Host "✅ .env file is not tracked by git" -ForegroundColor Green
}

# Check 2: .env exists
if (-not (Test-Path "api\.env")) {
    Write-Host "❌ CRITICAL: api\.env file not found!" -ForegroundColor Red
    Write-Host "   Copy .env.example to .env and configure it" -ForegroundColor Yellow
    $errors++
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check 3: JWT_SECRET is set and not default
    $envContent = Get-Content "api\.env" -Raw
    $jwtSecret = ($envContent | Select-String -Pattern "^JWT_SECRET=(.+)$").Matches.Groups[1].Value
    
    if ([string]::IsNullOrEmpty($jwtSecret)) {
        Write-Host "❌ CRITICAL: JWT_SECRET is not set!" -ForegroundColor Red
        $errors++
    } elseif ($jwtSecret -eq "your_secret_key_here" -or $jwtSecret.Length -lt 32) {
        Write-Host "❌ CRITICAL: JWT_SECRET is weak or default!" -ForegroundColor Red
        Write-Host "   Generate a strong secret with: node -e `"console.log(require('crypto').randomBytes(64).toString('hex'))`"" -ForegroundColor Yellow
        $errors++
    } else {
        Write-Host "✅ JWT_SECRET is configured" -ForegroundColor Green
    }
    
    # Check 4: Database password
    $dbPassword = ($envContent | Select-String -Pattern "^MYSQL_PASSWORD=(.*)$").Matches.Groups[1].Value
    if ([string]::IsNullOrEmpty($dbPassword)) {
        Write-Host "⚠️  WARNING: MYSQL_PASSWORD is empty" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "✅ Database password is set" -ForegroundColor Green
    }
    
    # Check 5: Email password
    if ($envContent -match "uijq henm pzyf aiol") {
        Write-Host "❌ CRITICAL: Default email password detected!" -ForegroundColor Red
        Write-Host "   Update EMAIL_PASSWORD with your own app-specific password" -ForegroundColor Yellow
        $errors++
    }
    
    # Check 6: NODE_ENV
    $nodeEnv = ($envContent | Select-String -Pattern "^NODE_ENV=(.+)$").Matches.Groups[1].Value
    if ($nodeEnv -ne "production") {
        Write-Host "⚠️  WARNING: NODE_ENV is not set to 'production'" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "✅ NODE_ENV is set to production" -ForegroundColor Green
    }
}

# Check 7: .gitignore
Write-Host ""
Write-Host "Checking .gitignore..."
$gitignoreContent = Get-Content "api\.gitignore" -Raw
if ($gitignoreContent -match "^\.env$") {
    Write-Host "✅ .env is in .gitignore" -ForegroundColor Green
} else {
    Write-Host "❌ CRITICAL: .env is not in .gitignore!" -ForegroundColor Red
    $errors++
}

if ($gitignoreContent -match "node_modules") {
    Write-Host "✅ node_modules in .gitignore" -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: node_modules should be in .gitignore" -ForegroundColor Yellow
    $warnings++
}

# Check 8: npm audit
Write-Host ""
Write-Host "Running npm audit..."
Push-Location api
$auditResult = npm audit --audit-level=high --production 2>&1
if ($auditResult -match "found 0 vulnerabilities") {
    Write-Host "✅ No high/critical vulnerabilities found" -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: Vulnerabilities found. Run npm audit for details" -ForegroundColor Yellow
    $warnings++
}
Pop-Location

# Check 9: package.json
Write-Host ""
Write-Host "Checking package.json..."
$packageJson = Get-Content "api\package.json" -Raw | ConvertFrom-Json
if ($packageJson.scripts.start) {
    Write-Host "✅ Start script exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: No start script in package.json" -ForegroundColor Yellow
    $warnings++
}

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Security Check Summary" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Green" })
Write-Host "Warnings: $warnings" -ForegroundColor $(if ($warnings -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ All checks passed! Ready for deployment." -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "⚠️  Some warnings found. Review before deployment." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ Critical errors found. DO NOT deploy until fixed!" -ForegroundColor Red
    exit 1
}
