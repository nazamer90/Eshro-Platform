# 💻 دليل التطوير المحلي - منصة إشرو

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية تشغيل منصة إشرو على جهازك المحلي للتطوير والاختبار.

---

## 📋 المتطلبات الأساسية

### البرامج المطلوبة:
- **Node.js** (v18 أو أحدث) - [تحميل](https://nodejs.org)
- **PostgreSQL** (v13 أو أحدث) - [تحميل](https://postgresql.org)
- **Git** - [تحميل](https://git-scm.com)
- **محرر نصوص** (VS Code مُوصى به)

### التحقق من التثبيت:
```bash
node --version    # يجب أن يكون v18+
npm --version     # يجب أن يكون v8+
psql --version    # يجب أن يكون v13+
git --version     # أي إصدار حديث
```

---

## 🚀 الخطوة 1: تحميل المشروع

### من GitHub:
```bash
# استنساخ المشروع
git clone https://github.com/bennouba/Platform-eishro.git

# الدخول إلى مجلد المشروع
cd Platform-eishro
```

### أو من الملفات المحلية:
```bash
# إذا كان لديك المشروع محلياً
cd /path/to/eishro-platform
```

---

## 🗄️ الخطوة 2: إعداد قاعدة البيانات

### إنشاء قاعدة البيانات:
```bash
# الدخول إلى PostgreSQL
psql -U postgres

# إنشاء قاعدة البيانات
CREATE DATABASE eishro_db;

# إنشاء مستخدم للتطبيق
CREATE USER eishro_user WITH PASSWORD 'eishro_password';

# منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE eishro_db TO eishro_user;

# الخروج
\q
```

### رفع Schema:
```bash
# رفع الهيكل الأساسي
psql -U eishro_user -d eishro_db -f database/schema.sql

# رفع التحسينات
psql -U eishro_user -d eishro_db -f database/multi-store-enhancements.sql
```

---

## 🖥️ الخطوة 3: إعداد Backend

### تثبيت التبعيات:
```bash
cd backend
npm install
```

### إعداد متغيرات البيئة:
```bash
# إنشاء ملف .env
cp .env.example .env

# تحرير الملف
nano .env
```

### محتوى ملف .env:
```env
# Database
DATABASE_URL=postgresql://eishro_user:eishro_password@localhost:5432/eishro_db

# Server
NODE_ENV=development
PORT=3001

# Security
JWT_SECRET=your-super-secret-jwt-key-for-development-only

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### تشغيل Backend:
```bash
# التشغيل العادي
npm start

# أو التشغيل مع إعادة التحميل التلقائي
npm run dev
```

**✅ تأكد من التشغيل**: اذهب إلى http://localhost:3001/health

---

## 🌐 الخطوة 4: إعداد Frontend

### في terminal جديد:
```bash
cd frontend
npm install
```

### إعداد متغيرات البيئة:
```bash
# إنشاء ملف .env.local
touch .env.local

# تحرير الملف
nano .env.local
```

### محتوى ملف .env.local:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=منصة إشرو
VITE_APP_VERSION=1.0.0
```

### تشغيل Frontend:
```bash
# التشغيل مع Hot Reload
npm run dev
```

**✅ تأكد من التشغيل**: اذهب إلى http://localhost:5173

---

## 🧪 الخطوة 5: اختبار النظام

### اختبار Backend APIs:
```bash
# Health Check
curl http://localhost:3001/health

# Get Stores
curl http://localhost:3001/api/stores

# Get Products
curl http://localhost:3001/api/products
```

### اختبار Frontend:
1. افتح http://localhost:5173
2. تأكد من:
   - ✅ تحميل الصفحة الرئيسية
   - ✅ عرض المتاجر والمنتجات
   - ✅ عمل البحث
   - ✅ التنقل بين الصفحات

---

## 🔧 إعدادات التطوير

### VS Code Extensions (مُوصى بها):
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Prettier Configuration:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### ESLint Configuration:
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

---

## 📊 مراقبة التطوير

### Backend Logs:
```bash
# في مجلد backend
tail -f logs/app.log
```

### Database Monitoring:
```sql
-- عرض الاتصالات النشطة
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- عرض حجم قاعدة البيانات
SELECT pg_size_pretty(pg_database_size('eishro_db'));
```

### Frontend Dev Tools:
- **React DevTools**: لمراقبة Components
- **Network Tab**: لمراقبة API calls
- **Console**: لمراقبة الأخطاء

---

## 🔄 سير العمل التطويري

### إضافة ميزة جديدة:
```bash
# إنشاء branch جديد
git checkout -b feature/new-feature

# التطوير والاختبار
# ...

# Commit التغييرات
git add .
git commit -m "Add new feature"

# Push إلى GitHub
git push origin feature/new-feature
```

### اختبار التغييرات:
```bash
# Backend Tests
cd backend
npm test

# Frontend Tests
cd frontend
npm test

# Integration Tests
npm run test:integration
```

---

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ اتصال قاعدة البيانات:
```bash
# تحقق من تشغيل PostgreSQL
sudo systemctl status postgresql

# تحقق من Connection String
echo $DATABASE_URL
```

#### 2. خطأ في تثبيت npm:
```bash
# مسح cache
npm cache clean --force

# إعادة تثبيت
rm -rf node_modules package-lock.json
npm install
```

#### 3. خطأ CORS:
```bash
# تأكد من FRONTEND_URL في Backend .env
# تأكد من VITE_API_URL في Frontend .env.local
```

#### 4. خطأ في الـ Port:
```bash
# تحقق من الـ ports المستخدمة
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
```

---

## 📚 بيانات تجريبية

### إدراج بيانات للاختبار:
```sql
-- مستخدم admin
INSERT INTO users (name, email, password, role) VALUES 
('مدير النظام', 'admin@eishro.com', '$2b$10$hashedpassword', 'admin');

-- متجر تجريبي
INSERT INTO stores (name, description, owner_id, status) VALUES 
('متجر التجربة', 'متجر للاختبار والتطوير', 1, 'active');

-- فئة منتجات
INSERT INTO categories (name, description) VALUES 
('إلكترونيات', 'أجهزة إلكترونية متنوعة');

-- منتج تجريبي
INSERT INTO products (name, description, price, category_id, store_id, status) VALUES 
('هاتف ذكي', 'هاتف للاختبار', 299.99, 1, 1, 'active');
```

---

## 🚀 نشر التغييرات

### إلى المنصات السحابية:
```bash
# Push إلى GitHub (سيؤدي إلى auto-deploy)
git push origin main

# مراقبة الـ deployment
# Railway: https://railway.app/dashboard
# Vercel: https://vercel.com/dashboard
```

---

## 📞 الحصول على المساعدة

### الوثائق:
- **React**: https://react.dev
- **Node.js**: https://nodejs.org/docs
- **PostgreSQL**: https://postgresql.org/docs
- **Vite**: https://vitejs.dev

### Community:
- **Stack Overflow**: للأسئلة التقنية
- **GitHub Issues**: لمشاكل المشروع
- **Discord Communities**: للدعم المباشر

---

## 🎉 نصائح للتطوير الفعال

### 1. استخدم Hot Reload:
- Backend: `npm run dev` (nodemon)
- Frontend: `npm run dev` (Vite HMR)

### 2. اختبر باستمرار:
```bash
# اختبار سريع
npm run test:quick

# اختبار شامل
npm run test:full
```

### 3. راقب الأداء:
- استخدم React DevTools Profiler
- راقب Network requests
- تحقق من Database queries

### 4. اتبع Best Practices:
- كتابة كود نظيف ومنظم
- استخدام TypeScript للـ type safety
- كتابة تعليقات واضحة
- اتباع naming conventions

---

**🎯 الآن أنت جاهز للتطوير على منصة إشرو محلياً!**

للنشر على المنصات السحابية، راجع: `DEPLOYMENT_STEP_BY_STEP.md`