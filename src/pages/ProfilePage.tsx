import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">الملف الشخصي</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">المعلومات الشخصية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input type="text" className="input-field" value="أحمد محمد" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input type="email" className="input-field" value="ahmed@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input type="tel" className="input-field" value="+966501234567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <textarea className="input-field" rows={3} value="الرياض، المملكة العربية السعودية"></textarea>
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-primary">حفظ التغييرات</button>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">تغيير كلمة المرور</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
                <input type="password" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                <input type="password" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
                <input type="password" className="input-field" />
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-primary">تحديث كلمة المرور</button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">إحصائيات الحساب</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>إجمالي الطلبات</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>إجمالي المشتريات</span>
                <span className="font-semibold">3,450 ريال</span>
              </div>
              <div className="flex justify-between">
                <span>النقاط المكتسبة</span>
                <span className="font-semibold">345 نقطة</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">الطلبات الأخيرة</h3>
            <div className="space-y-3">
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span>طلب #1234</span>
                  <span className="text-green-600">مكتمل</span>
                </div>
                <p className="text-sm text-gray-600">299 ريال</p>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span>طلب #1235</span>
                  <span className="text-yellow-600">قيد التجهيز</span>
                </div>
                <p className="text-sm text-gray-600">450 ريال</p>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>طلب #1236</span>
                  <span className="text-blue-600">تم الشحن</span>
                </div>
                <p className="text-sm text-gray-600">199 ريال</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;