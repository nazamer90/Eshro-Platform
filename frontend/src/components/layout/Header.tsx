import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            منصة إشرو
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              الرئيسية
            </Link>
            <Link to="/stores" className="text-gray-700 hover:text-blue-600 transition-colors">
              المتاجر
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              المنتجات
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition-colors">
              السلة
            </Link>
            <Link to="/login" className="btn-primary">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;