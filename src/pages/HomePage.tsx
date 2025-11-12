import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">منصة إشرو</h1>
            </div>
            <nav className="flex space-x-4 space-x-reverse">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                إنشاء حساب
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            مرحباً بك في{' '}
            <span className="text-indigo-600">منصة إشرو</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            منصة التجارة الإلكترونية الرائدة في ليبيا. تسوق من آلاف المنتجات أو ابدأ متجرك الإلكتروني اليوم.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/stores"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                تصفح المتاجر
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:mr-3">
              <Link
                to="/register?type=merchant"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                ابدأ متجرك
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تسوق آمن</h3>
              <p className="text-gray-600">
                نضمن لك تجربة تسوق آمنة مع أفضل وسائل الحماية والدفع الإلكتروني.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">توصيل سريع</h3>
              <p className="text-gray-600">
                خدمة توصيل سريعة وموثوقة لجميع أنحاء ليبيا مع إمكانية تتبع الطلبات.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">متاجر متنوعة</h3>
              <p className="text-gray-600">
                اكتشف آلاف المنتجات من مئات المتاجر المحلية والعالمية في مكان واحد.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">1000+</div>
              <div className="text-gray-600">منتج</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">100+</div>
              <div className="text-gray-600">متجر</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">5000+</div>
              <div className="text-gray-600">عميل</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">24/7</div>
              <div className="text-gray-600">دعم فني</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">منصة إشرو</h3>
            <p className="text-gray-400 mb-4">
              منصة التجارة الإلكترونية الرائدة في ليبيا
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white">
                الشروط والأحكام
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                اتصل بنا
              </a>
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              © 2024 منصة إشرو. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;