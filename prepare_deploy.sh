#!/bin/bash

echo "🚀 Preparando projeto para deploy..."
echo ""

# Criar arquivo .gitignore se não existir
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/
.venv/
venv/
ENV/

# Environment variables
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.pytest_cache/

# Production
/frontend/build
EOF
    echo "✅ .gitignore criado"
else
    echo "✅ .gitignore já existe"
fi

# Verificar arquivos necessários
echo ""
echo "🔍 Verificando arquivos necessários..."

files_to_check=(
    "netlify.toml"
    "render.yaml"
    "DEPLOYMENT_GUIDE.md"
    "frontend/package.json"
    "backend/requirements.txt"
    "backend/server.py"
)

all_good=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file NÃO ENCONTRADO"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "✅ Todos os arquivos necessários estão presentes!"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo ""
    echo "1. Leia o guia completo: DEPLOYMENT_GUIDE.md"
    echo "2. Crie uma conta no MongoDB Atlas"
    echo "3. Faça push deste código para um repositório GitHub"
    echo "4. Configure o backend no Render"
    echo "5. Configure o frontend na Netlify"
    echo ""
    echo "🎉 Seu projeto está pronto para deploy!"
else
    echo "⚠️  Alguns arquivos estão faltando. Verifique a estrutura do projeto."
fi
