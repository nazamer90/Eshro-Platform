import React, { useEffect } from 'react';
import '../styles/fonts.css';
import '../styles/original-design.css';

const OriginalHomePage: React.FC = () => {
  useEffect(() => {
    // تأثيرات الجسيمات التفاعلية
    const createParticles = () => {
      const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
      }> = [];

      // إنشاء الجسيمات
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };

      animate();
    };

    createParticles();

    const handleResize = () => {
      const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="original-homepage">
      {/* الهيدر المهني */}
      <header className="professional-header">
        <div className="header-content">
          <div className="logo-section">
            <a href="/" className="logo">إشرو</a>
            <div className="logo-subtitle">منصة التجارة الإلكترونية</div>
          </div>
          
          <nav className="main-nav">
            <a href="#home" className="nav-link active">الرئيسية</a>
            <a href="#stores" className="nav-link">المتاجر</a>
            <a href="#products" className="nav-link">المنتجات</a>
            <a href="#about" className="nav-link">من نحن</a>
            <a href="#contact" className="nav-link">اتصل بنا</a>
          </nav>

          <div className="action-buttons">
            <a href="/login" className="btn-secondary">تسجيل الدخول</a>
            <a href="/register" className="btn-primary">إنشاء متجر</a>
          </div>
        </div>
      </header>

      {/* القسم الرئيسي */}
      <section className="hero-section">
        <canvas id="particles-canvas" className="particle-bg"></canvas>
        <div className="hero-content">
          <h1 className="hero-title">منصة إشرو للتجارة الإلكترونية</h1>
          <p className="hero-subtitle">
            انتقل من التجارة التقليدية إلى التجارة الإلكترونية بكل يسر
            وأنشئ متجرك الخاص خلال دقائق مع أدوات احترافية متقدمة
          </p>
          <div className="hero-cta">
            <a href="/register" className="btn-primary">ابدأ متجرك الآن</a>
            <a href="#features" className="btn-secondary">اكتشف المزيد</a>
          </div>
        </div>
      </section>

      {/* قسم الإحصائيات */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">متجر نشط</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">منتج متاح</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">25K+</span>
            <span className="stat-label">عميل راضي</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99%</span>
            <span className="stat-label">معدل الرضا</span>
          </div>
        </div>
      </section>

      {/* قسم الميزات */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="section-title">لماذا تختار منصة إشرو؟</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3 className="feature-title">إنشاء متجر سريع</h3>
              <p className="feature-description">
                أنشئ متجرك الإلكتروني في دقائق معدودة بأدوات سهلة الاستخدام
                وقوالب احترافية جاهزة للتخصيص
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3 className="feature-title">مدفوعات آمنة</h3>
              <p className="feature-description">
                نظام دفع متقدم وآمن يدعم جميع وسائل الدفع المحلية والعالمية
                مع حماية كاملة للبيانات المالية
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">تحليلات متقدمة</h3>
              <p className="feature-description">
                احصل على تقارير مفصلة عن مبيعاتك وعملائك مع رؤى ذكية
                لتحسين أداء متجرك وزيادة الأرباح
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">إدارة الشحن</h3>
              <p className="feature-description">
                نظام شحن متكامل مع شركات الشحن المحلية والعالمية
                مع تتبع الطلبات وإشعارات تلقائية للعملاء
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">متوافق مع الجوال</h3>
              <p className="feature-description">
                متجرك سيعمل بشكل مثالي على جميع الأجهزة والشاشات
                مع تجربة مستخدم سلسة ومتجاوبة
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">تخصيص كامل</h3>
              <p className="feature-description">
                خصص متجرك بالكامل ليعكس هويتك التجارية مع أدوات
                تصميم متقدمة وقوالب احترافية متنوعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر المهني */}
      <footer className="professional-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>منصة إشرو</h3>
            <p>منصة التجارة الإلكترونية الرائدة في المنطقة العربية</p>
          </div>
          
          <div className="footer-section">
            <h3>روابط سريعة</h3>
            <ul>
              <li><a href="/stores">المتاجر</a></li>
              <li><a href="/products">المنتجات</a></li>
              <li><a href="/about">من نحن</a></li>
              <li><a href="/contact">اتصل بنا</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>الدعم</h3>
            <ul>
              <li><a href="/help">مركز المساعدة</a></li>
              <li><a href="/faq">الأسئلة الشائعة</a></li>
              <li><a href="/terms">الشروط والأحكام</a></li>
              <li><a href="/privacy">سياسة الخصوصية</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>تواصل معنا</h3>
            <ul>
              <li>📧 info@eshro.com</li>
              <li>📞 +966 50 123 4567</li>
              <li>📍 الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 منصة إشرو. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default OriginalHomePage;