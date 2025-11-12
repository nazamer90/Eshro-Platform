import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OriginalHomePage from './components/OriginalHomePage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import StoresPage from './pages/StoresPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen" dir="rtl">
            <Routes>
              <Route path="/" element={<OriginalHomePage />} />
              <Route path="/modern" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <HomePage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/stores" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <StoresPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/products" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <ProductsPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/product/:id" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <ProductDetailPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/cart" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <CartPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/checkout" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <CheckoutPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/login" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <LoginPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/register" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <RegisterPage />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/profile" element={
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <ProfilePage />
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontFamily: 'Cairo, sans-serif',
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;