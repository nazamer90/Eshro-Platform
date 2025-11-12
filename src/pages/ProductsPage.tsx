import React from 'react';

const ProductsPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">المنتجات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">منتج رقم 1</h3>
          <p className="text-gray-600 mb-2">وصف المنتج</p>
          <p className="text-xl font-bold text-blue-600 mb-4">299 ريال</p>
          <button className="btn-primary w-full">إضافة للسلة</button>
        </div>
        
        <div className="card">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">منتج رقم 2</h3>
          <p className="text-gray-600 mb-2">وصف المنتج</p>
          <p className="text-xl font-bold text-blue-600 mb-4">199 ريال</p>
          <button className="btn-primary w-full">إضافة للسلة</button>
        </div>
        
        <div className="card">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">منتج رقم 3</h3>
          <p className="text-gray-600 mb-2">وصف المنتج</p>
          <p className="text-xl font-bold text-blue-600 mb-4">399 ريال</p>
          <button className="btn-primary w-full">إضافة للسلة</button>
        </div>
        
        <div className="card">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">منتج رقم 4</h3>
          <p className="text-gray-600 mb-2">وصف المنتج</p>
          <p className="text-xl font-bold text-blue-600 mb-4">499 ريال</p>
          <button className="btn-primary w-full">إضافة للسلة</button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;