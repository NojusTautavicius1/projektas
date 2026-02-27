#!/bin/bash

# Pre-deployment Security Check Script
# Run this before deploying to production

echo "🔒 Running Security Check..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: .env file not in git
echo "Checking .env file status..."
if git ls-files --error-unmatch api/.env 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: .env file is tracked by git!${NC}"
    echo "   Run: git rm --cached api/.env"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ .env file is not tracked by git${NC}"
fi

# Check 2: .env exists
if [ ! -f "api/.env" ]; then
    echo -e "${RED}❌ CRITICAL: api/.env file not found!${NC}"
    echo "   Copy .env.example to .env and configure it"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    # Check 3: JWT_SECRET is set and not default
    JWT_SECRET=$(grep "^JWT_SECRET=" api/.env | cut -d '=' -f2)
    if [ -z "$JWT_SECRET" ]; then
        echo -e "${RED}❌ CRITICAL: JWT_SECRET is not set!${NC}"
        ERRORS=$((ERRORS+1))
    elif [ "$JWT_SECRET" = "your_secret_key_here" ] || [ ${#JWT_SECRET} -lt 32 ]; then
        echo -e "${RED}❌ CRITICAL: JWT_SECRET is weak or default!${NC}"
        echo "   Generate a strong secret with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}✅ JWT_SECRET is configured${NC}"
    fi
    
    # Check 4: Database password is set
    DB_PASSWORD=$(grep "^MYSQL_PASSWORD=" api/.env | cut -d '=' -f2)
    if [ -z "$DB_PASSWORD" ]; then
        echo -e "${YELLOW}⚠️  WARNING: MYSQL_PASSWORD is empty${NC}"
        WARNINGS=$((WARNINGS+1))
    else
        echo -e "${GREEN}✅ Database password is set${NC}"
    fi
    
    # Check 5: Email password
    EMAIL_PASSWORD=$(grep "^EMAIL_PASSWORD=" api/.env | cut -d '=' -f2)
    if [[ "$EMAIL_PASSWORD" == *"uijq henm pzyf aiol"* ]]; then
        echo -e "${RED}❌ CRITICAL: Default email password detected!${NC}"
        echo "   Update EMAIL_PASSWORD with your own app-specific password"
        ERRORS=$((ERRORS+1))
    fi
    
    # Check 6: NODE_ENV
    NODE_ENV=$(grep "^NODE_ENV=" api/.env | cut -d '=' -f2)
    if [ "$NODE_ENV" != "production" ]; then
        echo -e "${YELLOW}⚠️  WARNING: NODE_ENV is not set to 'production'${NC}"
        WARNINGS=$((WARNINGS+1))
    else
        echo -e "${GREEN}✅ NODE_ENV is set to production${NC}"
    fi
fi

# Check 7: Sensitive files in .gitignore
echo ""
echo "Checking .gitignore..."
if grep -q "^\.env$" api/.gitignore; then
    echo -e "${GREEN}✅ .env is in .gitignore${NC}"
else
    echo -e "${RED}❌ CRITICAL: .env is not in .gitignore!${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check 8: Node modules in .gitignore
if grep -q "node_modules" api/.gitignore; then
    echo -e "${GREEN}✅ node_modules in .gitignore${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: node_modules should be in .gitignore${NC}"
    WARNINGS=$((WARNINGS+1))
fi

# Check 9: Look for common sensitive patterns in tracked files
echo ""
echo "Scanning for potential secrets in tracked files..."
PATTERNS=("password.*=.*['\"].*['\"]" "api[_-]?key.*=.*['\"].*['\"]" "secret.*=.*['\"].*['\"]")
for pattern in "${PATTERNS[@]}"; do
    if git grep -i -E "$pattern" -- '*.js' '*.jsx' '*.ts' '*.tsx' 2>/dev/null | grep -v "password:" | grep -v "type=\"password\"" | grep -v "// " | grep -v "/\*"; then
        echo -e "${YELLOW}⚠️  WARNING: Potential hardcoded secrets found (check above)${NC}"
        WARNINGS=$((WARNINGS+1))
        break
    fi
done

# Check 10: npm audit
echo ""
echo "Running npm audit..."
cd api
if npm audit --audit-level=high --production | grep -q "found 0 vulnerabilities"; then
    echo -e "${GREEN}✅ No high/critical vulnerabilities found${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Vulnerabilities found. Run 'npm audit' for details${NC}"
    WARNINGS=$((WARNINGS+1))
fi
cd ..

# Check 11: Package.json scripts
echo ""
echo "Checking package.json..."
if grep -q "\"start\":" api/package.json; then
    echo -e "${GREEN}✅ Start script exists${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: No start script in package.json${NC}"
    WARNINGS=$((WARNINGS+1))
fi

# Summary
echo ""
echo "======================================"
echo "Security Check Summary"
echo "======================================"
echo -e "Errors: ${RED}${ERRORS}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Some warnings found. Review before deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ Critical errors found. DO NOT deploy until fixed!${NC}"
    exit 1
fi
