@echo off
echo.
echo ========================================
echo   Security Check for Production
echo ========================================
echo.

set errors=0
set warnings=0

echo Checking .env file...
if not exist "api\.env" (
    echo [ERROR] api\.env file not found!
    echo         Copy .env.example to .env and configure it
    set /a errors+=1
) else (
    echo [OK] .env file exists
)

echo.
echo Checking .gitignore...
findstr /C:".env" "api\.gitignore" >nul
if %errorlevel%==0 (
    echo [OK] .env is in .gitignore
) else (
    echo [ERROR] .env is not in .gitignore!
    set /a errors+=1
)

echo.
echo Checking package.json...
findstr /C:"start" "api\package.json" >nul
if %errorlevel%==0 (
    echo [OK] Start script exists
) else (
    echo [WARNING] No start script in package.json
    set /a warnings+=1
)

echo.
echo Running npm audit...
cd api
call npm audit --audit-level=high --production 2>nul | findstr /C:"found 0 vulnerabilities" >nul
if %errorlevel%==0 (
    echo [OK] No high/critical vulnerabilities found
) else (
    echo [WARNING] Vulnerabilities found. Run npm audit for details
    set /a warnings+=1
)
cd ..

echo.
echo ========================================
echo   Summary
echo ========================================
echo Errors: %errors%
echo Warnings: %warnings%
echo.

if %errors%==0 (
    if %warnings%==0 (
        echo [SUCCESS] All checks passed!
        exit /b 0
    ) else (
        echo [WARNING] Some warnings found. Review before deployment.
        exit /b 0
    )
) else (
    echo [FAILED] Critical errors found. DO NOT deploy until fixed!
    exit /b 1
)
