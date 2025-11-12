# 🔧 دليل حل مشاكل النشر - منصة إشرو

## 🚨 المشاكل الشائعة وحلولها

### 1️⃣ مشكلة Vercel - pnpm lockfile

**الخطأ:**
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile"
```

**الحل:** ✅ تم إصلاحه
- تم تحديث `vercel.json` لاستخدام npm بدلاً من pnpm
- تم إضافة `--legacy-peer-deps` للتوافق
- تم حذف `pnpm-lock.yaml` المتضارب

### 2️⃣ مشكلة Railway - متغيرات البيئة

**الخطأ:**
```
Database connection failed
```

**الحل:**
1. تأكد من إضافة متغيرات البيئة في Railway:
   - `DATABASE_URL` = connection string من Neon
   - `JWT_SECRET` = مفتاح سري قوي
   - `NODE_ENV` = production

### 3️⃣ مشكلة Neon - قاعدة البيانات

**الخطأ:**
```
relation "users" does not exist
```

**الحل:**
1. في Neon SQL Editor، شغل محتوى `backend/database/schema.sql`
2. تأكد من تشغيل جميع الجداول والفهارس

### 4️⃣ مشكلة CORS

**الخطأ:**
```
Access to fetch blocked by CORS policy
```

**الحل:**
- تأكد من إضافة Frontend URL في Backend CORS settings
- في Railway، أضف متغير البيئة:
  ```
  FRONTEND_URL=https://your-vercel-app.vercel.app
  ```

## 🔄 خطوات إعادة النشر

### إذا فشل النشر:

1. **تحقق من Logs:**
   - Railway: اذهب إلى Deployments → View Logs
   - Vercel: اذهب إلى Functions → View Function Logs

2. **أعد النشر:**
   ```bash
   git add .
   git commit -m "Fix deployment issue"
   git push origin main
   ```

3. **اختبر محلياً أولاً:**
   ```bash
   # Frontend
   cd frontend && npm run build
   
   # Backend
   cd backend && npm start
   ```

## 📋 Checklist قبل النشر

### ✅ Neon PostgreSQL
- [ ] تم إنشاء المشروع
- [ ] تم تشغيل schema.sql
- [ ] تم نسخ connection string

### ✅ Railway Backend
- [ ] تم ربط GitHub repo
- [ ] تم اختيار مجلد "backend"
- [ ] تم إضافة متغيرات البيئة
- [ ] تم نسخ Railway URL

### ✅ Vercel Frontend
- [ ] تم ربط GitHub repo
- [ ] تم اختيار مجلد "frontend"
- [ ] تم إضافة VITE_API_URL
- [ ] تم اختبار البناء

## 🆘 إذا لم تنجح الحلول

1. تحقق من أن جميع الملفات محدثة في GitHub
2. امسح cache في Vercel/Railway
3. أعد النشر من الصفر
4. تأكد من أن جميع URLs صحيحة

---

**💡 نصيحة:** احتفظ بنسخة من جميع URLs ومتغيرات البيئة في مكان آمن!