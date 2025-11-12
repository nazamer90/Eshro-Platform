import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">منصة إشرو</h3>
            <p className="text-gray-300">
              منصة التجارة الإلكترونية الرائدة في المنطقة
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="/stores" className="text-gray-300 hover:text-white transition-colors">المتاجر</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-white transition-colors">المنتجات</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <p className="text-gray-300">info@eshro.com</p>
            <p className="text-gray-300">+966 50 123 4567</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 منصة إشرو. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;