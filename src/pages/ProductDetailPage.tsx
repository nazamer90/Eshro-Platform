import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">منتج رقم {id}</h1>
          <p className="text-gray-600 mb-6">
            هذا وصف تفصيلي للمنتج. يحتوي على جميع المعلومات المهمة التي يحتاجها العميل لاتخاذ قرار الشراء.
          </p>
          
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">299 ريال</span>
            <span className="text-lg text-gray-500 line-through mr-4">399 ريال</span>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
            <select className="input-field w-20">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <button className="btn-primary flex-1">إضافة للسلة</button>
            <button className="btn-secondary">إضافة للمفضلة</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;