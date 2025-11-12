import React from 'react';

const CheckoutPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">معلومات الشحن</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input type="text" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input type="email" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input type="tel" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <textarea className="input-field" rows={3}></textarea>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">طريقة الدفع</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="payment" className="ml-2" />
                <span>الدفع عند الاستلام</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" className="ml-2" />
                <span>بطاقة ائتمانية</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" className="ml-2" />
                <span>تحويل بنكي</span>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">ملخص الطلب</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>منتج رقم 1 × 1</span>
                <span>299 ريال</span>
              </div>
              <div className="flex justify-between">
                <span>منتج رقم 2 × 2</span>
                <span>398 ريال</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>25 ريال</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>المجموع الكلي</span>
                <span>722 ريال</span>
              </div>
            </div>
            <button className="btn-primary w-full">تأكيد الطلب</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;