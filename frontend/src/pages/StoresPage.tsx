import React from 'react';

const StoresPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">المتاجر</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">متجر الإلكترونيات</h3>
          <p className="text-gray-600 mb-4">أحدث الأجهزة الإلكترونية والتقنية</p>
          <button className="btn-primary">زيارة المتجر</button>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">متجر الأزياء</h3>
          <p className="text-gray-600 mb-4">أجمل الأزياء والملابس العصرية</p>
          <button className="btn-primary">زيارة المتجر</button>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">متجر المنزل</h3>
          <p className="text-gray-600 mb-4">كل ما تحتاجه لمنزلك</p>
          <button className="btn-primary">زيارة المتجر</button>
        </div>
      </div>
    </div>
  );
};

export default StoresPage;