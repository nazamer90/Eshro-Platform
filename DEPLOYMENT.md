# دليل نشر منصة إشرو

## 1. إعداد قاعدة البيانات على Neon PostgreSQL

### الخطوات:
1. اذهب إلى https://neon.tech
2. سجل الدخول باستخدام GitHub
3. أنشئ مشروع جديد باسم "eshro-platform"
4. احفظ connection string الذي ستحصل عليه
5. في SQL Editor، شغل محتوى ملف `backend/database/schema.sql`

## 2. نشر Backend على Railway

### الخطوات:
1. اذهب إلى https://railway.app
2. سجل الدخول باستخدام GitHub
3. أنشئ مشروع جديد
4. اربط المشروع بـ GitHub repository
5. اختر مجلد `backend` كـ root directory
6. أضف متغيرات البيئة التالية:

```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=3001
```

### ملف railway.json موجود بالفعل ويحتوي على:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 3. نشر Frontend على Vercel

### الخطوات:
1. اذهب إلى https://vercel.com
2. سجل الدخول باستخدام GitHub
3. استورد المشروع من GitHub
4. اختر مجلد `frontend` كـ root directory
5. أضف متغير البيئة:

```
VITE_API_URL=https://your-railway-backend-url.railway.app/api
```

### ملف vercel.json موجود بالفعل ويحتوي على:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 4. اختبار المنصة

بعد النشر، ستحصل على:
- Frontend URL: https://your-project.vercel.app
- Backend URL: https://your-project.railway.app

### الميزات المتاحة:
- ✅ الصفحة الرئيسية مع دعم العربية
- ✅ صفحة المتاجر
- ✅ صفحة المنتجات
- ✅ صفحة تفاصيل المنتج
- ✅ سلة التسوق
- ✅ صفحة الدفع
- ✅ تسجيل الدخول والتسجيل
- ✅ الملف الشخصي
- ✅ API كامل للمتاجر والمنتجات والطلبات
- ✅ نظام المصادقة JWT
- ✅ قاعدة بيانات PostgreSQL كاملة

## 5. الملفات المهمة

### Backend:
- `server.js` - الخادم الرئيسي
- `routes/` - جميع API endpoints
- `config/database.js` - إعدادات قاعدة البيانات
- `database/schema.sql` - هيكل قاعدة البيانات

### Frontend:
- `src/App.tsx` - التطبيق الرئيسي
- `src/pages/` - جميع الصفحات
- `src/components/` - المكونات المشتركة
- `src/contexts/` - إدارة الحالة
- `src/services/api.ts` - خدمات API

## 6. متغيرات البيئة المطلوبة

### Backend (.env):
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=3001
```

### Frontend (.env):
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

## 7. الأوامر المفيدة

### Backend:
```bash
npm install
npm start        # للإنتاج
npm run dev      # للتطوير
```

### Frontend:
```bash
npm install
npm run build    # للبناء
npm run dev      # للتطوير
npm run preview  # لمعاينة البناء
```

## 8. استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ في الاتصال بقاعدة البيانات**: تأكد من صحة DATABASE_URL
2. **خطأ CORS**: تأكد من إعداد CORS في backend
3. **خطأ في البناء**: تأكد من تثبيت جميع dependencies

### لوجز مفيدة:
- Railway: تحقق من deployment logs
- Vercel: تحقق من function logs
- Neon: تحقق من query logs