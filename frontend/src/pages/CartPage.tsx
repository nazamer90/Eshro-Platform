import React from 'react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">سلة التسوق</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">منتج رقم 1</h3>
                <p className="text-gray-600">299 ريال</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="w-8 h-8 bg-gray-200 rounded-full">-</button>
                <span className="w-8 text-center">1</span>
                <button className="w-8 h-8 bg-gray-200 rounded-full">+</button>
              </div>
              <button className="text-red-500 hover:text-red-700">حذف</button>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">منتج رقم 2</h3>
                <p className="text-gray-600">199 ريال</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="w-8 h-8 bg-gray-200 rounded-full">-</button>
                <span className="w-8 text-center">2</span>
                <button className="w-8 h-8 bg-gray-200 rounded-full">+</button>
              </div>
              <button className="text-red-500 hover:text-red-700">حذف</button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">ملخص الطلب</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>697 ريال</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>25 ريال</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>المجموع الكلي</span>
                <span>722 ريال</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full block text-center">
              إتمام الطلب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;