<template>
  <div class="park-website">
    <!-- 导航栏 -->
    <nav class="park-nav" :class="{ 'nav-scrolled': isScrolled }">
      <div class="nav-container">
        <div class="nav-brand">
          <img src="/images/jasmine-logo.png" alt="香香花园" class="nav-logo" />
          <span class="brand-text">香香花园研学基地</span>
        </div>
        <div class="nav-links">
          <a href="#hero" class="nav-link">首页</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section - 全屏 -->
    <section id="hero" class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-star">★</span>
          <span>广西植能现代农业有限公司旗下园区</span>
        </div>
        
        <h1 class="hero-title">
          <span class="title-main">香香花园</span>
          <span class="title-sub">研学活动平台</span>
        </h1>
        
        <p class="hero-desc">
          探索茉莉花的奥秘，体验现代农业的魅力<br>
          学习农耕智慧，传承茉莉花茶文化
        </p>
        
        <div class="hero-actions">
          <router-link to="/learn" class="hero-btn btn-primary">
            <span>开始学习</span>
          </router-link>
          <router-link to="/game" class="hero-btn btn-secondary">
            <span>参与竞赛</span>
          </router-link>
          <router-link to="/reality" class="hero-btn btn-accent">
            <span>🌍 现实挑战</span>
          </router-link>
        </div>
      </div>
      
      <!--
      TODO: 功能区块完善后显示滚动提示
      <div class="scroll-hint" @click="scrollToContent">
        <span>探索更多</span>
        <svg class="scroll-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
      -->
    </section>

    <!--
    TODO: 研学项目区块 - 待完善后显示
    <section class="features-section">
      ...
    </section>
    -->

    <!--
    TODO: 关于园区区块 - 待完善内容后显示
    <section id="about" class="about-section">
      ...
    </section>
    -->

    <!--
    TODO: 园区数据区块 - 待完善后显示
    <section id="stats" class="stats-section">
      ...
    </section>
    -->

    <!--
    TODO: 园区数据区块 - 待完善后显示
    <section id="stats" class="stats-section">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">🌸</div>
          <div class="stat-number">12.5万吨</div>
          <div class="stat-label">年茉莉花产量</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏭</div>
          <div class="stat-number">150+家</div>
          <div class="stat-label">花茶加工企业</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-number">百亿元</div>
          <div class="stat-label">综合产值</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🌍</div>
          <div class="stat-number">40+国</div>
          <div class="stat-label">出口国家和地区</div>
        </div>
      </div>
    </section>
    -->

    <!-- 页脚 -->
    <footer class="park-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="/images/jasmine-logo.png" alt="香香花园" class="footer-logo" />
          <div class="footer-info">
            <span class="footer-title">香香花园研学基地</span>
            <span class="footer-subtitle">广西植能现代农业有限公司</span>
          </div>
        </div>
        <div class="footer-links">
          <a href="#hero" class="footer-link">返回顶部</a>
          <span class="footer-divider">|</span>
          <span class="footer-copyright">© 2026 香香花园研学平台</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}


onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@reference "tailwindcss";

/* ========== 基础布局 - 奶油色系 ========== */
.park-website {
  min-height: 100vh;
  background: #FDFBF7;
  color: #2D3748;
  overflow-x: hidden;
}

/* ========== 导航栏 - 柔和奶油色 ========== */
.park-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.3s ease;
  background: transparent;
}

.nav-scrolled {
  background: rgba(253, 251, 247, 0.95);
  backdrop-filter: blur(20px);
  padding: 12px 0;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
  box-shadow: 0 2px 20px rgba(139, 115, 85, 0.05);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #5B7A5E;
}

.nav-scrolled .brand-text {
  color: #5B7A5E;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-scrolled .nav-link {
  color: #64748B;
}

.nav-link:hover {
  color: #5B7A5E;
}

/* ========== Hero Section - 柔和绿色调 ========== */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 40px 80px;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(91, 122, 94, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 80% 60% at 80% 100%, rgba(200, 178, 140, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 20% 100%, rgba(139, 115, 85, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, #F5F0E8 0%, #FDFBF7 30%, #F8F5F0 70%, #FDFBF7 100%);
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235B7A5E' fill-opacity='0.04'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20zm-40 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm80 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(139, 115, 85, 0.2);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #8B7355;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.badge-star {
  color: #C8B28C;
}

.hero-title {
  margin-bottom: 24px;
}

.title-main {
  display: block;
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #5B7A5E;
  margin-bottom: 8px;
}

.title-sub {
  display: block;
  font-size: 32px;
  font-weight: 300;
  color: #8B7355;
  letter-spacing: 0.15em;
}

.hero-desc {
  font-size: 20px;
  color: #64748B;
  line-height: 1.8;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #5B7A5E;
  color: white;
  box-shadow: 0 4px 20px rgba(91, 122, 94, 0.25);
}

.btn-primary:hover {
  background: #4A6350;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(91, 122, 94, 0.35);
}

.btn-secondary {
  background: white;
  color: #5B7A5E;
  border: 2px solid rgba(91, 122, 94, 0.3);
}

.btn-secondary:hover {
  border-color: #5B7A5E;
  background: rgba(91, 122, 94, 0.05);
}

.btn-accent {
  background: linear-gradient(135deg, #D4A574 0%, #C8956D 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(212, 165, 116, 0.25);
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(212, 165, 116, 0.35);
}

/* 向下滚动提示 */
.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #8B7355;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.scroll-hint:hover {
  color: #5B7A5E;
}

.scroll-arrow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* ========== Features Section - 柔和圆润卡片 ========== */
.features-section {
  padding: 60px 40px;
  background: #FDFBF7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px 32px;
  border-radius: 32px;
  text-decoration: none;
  color: white;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 320px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 柔和的绿色 - 教学 */
.feature-tea {
  background: linear-gradient(135deg, #7A9B7D 0%, #9BB89E 50%, #B8D4B8 100%);
}

/* 柔和的暖棕色 - 讨论 */
.feature-warm {
  background: linear-gradient(135deg, #C8B28C 0%, #D4C4A8 50%, #E0D6C4 100%);
  color: #5D4E37;
}

/* 柔和的珊瑚 - 竞赛 */
.feature-coral {
  background: linear-gradient(135deg, #D4A88C 0%, #E0B89E 50%, #ECD0B8 100%);
  color: #5D4E37;
}

/* 柔和的灰色 - 控制台 */
.feature-soft {
  background: linear-gradient(135deg, #8B9A8B 0%, #A8B5A8 50%, #C4D0C4 100%);
}

.feature-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.feature-icon {
  margin-bottom: 24px;
  opacity: 0.95;
}

.feature-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.feature-desc {
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.6;
  flex: 1;
}

.feature-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-arrow {
  background: rgba(255, 255, 255, 0.35);
  transform: translateX(4px);
}

/* ========== About Section ========== */
.about-section {
  padding: 120px 40px;
  background: white;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

@media (max-width: 968px) {
  .about-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.about-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-placeholder {
  width: 100%;
  aspect-ratio: 1;
  max-width: 400px;
  background: linear-gradient(135deg, rgba(91, 122, 94, 0.08), rgba(200, 178, 140, 0.08));
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border: 2px dashed rgba(91, 122, 94, 0.2);
}

.visual-caption {
  font-size: 14px;
  color: #8B7355;
}

.about-content {
  color: #2D3748;
}

.section-label {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(91, 122, 94, 0.1);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #5B7A5E;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.section-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  color: #2D3748;
}

.title-accent {
  color: #5B7A5E;
}

.about-text {
  font-size: 17px;
  color: #64748B;
  line-height: 1.8;
  margin-bottom: 40px;
}

.about-highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.highlight-item {
  text-align: center;
  padding: 28px 20px;
  background: #FDFBF7;
  border-radius: 24px;
  border: 1px solid rgba(139, 115, 85, 0.1);
}

.highlight-number {
  display: block;
  font-size: 32px;
  font-weight: 800;
  color: #5B7A5E;
  margin-bottom: 4px;
}

.highlight-label {
  font-size: 14px;
  color: #8B7355;
}

/* ========== Stats Section - 柔和深色 ========== */
.stats-section {
  padding: 100px 40px;
  background: linear-gradient(135deg, #5B7A5E 0%, #7A9B7D 50%, #8B9B8B 100%);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 968px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  text-align: center;
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
}

/* ========== Footer ========== */
.park-footer {
  padding: 50px 40px;
  background: #F5F0E8;
  border-top: 1px solid rgba(139, 115, 85, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.footer-info {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 18px;
  font-weight: 700;
  color: #5B7A5E;
}

.footer-subtitle {
  font-size: 13px;
  color: #8B7355;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #8B7355;
}

.footer-link {
  color: #64748B;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #5B7A5E;
}

.footer-divider {
  color: rgba(139, 115, 85, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 20px;
  }
  
  .nav-links {
    display: none;
  }
  
  .hero-section {
    padding: 100px 20px 60px;
  }
  
  .title-main {
    font-size: 48px;
  }
  
  .title-sub {
    font-size: 22px;
  }
  
  .hero-desc {
    font-size: 17px;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-btn {
    width: 100%;
    justify-content: center;
  }
  
  .features-section {
    padding: 40px 20px;
  }
  
  .feature-card {
    padding: 32px 24px;
    border-radius: 24px;
  }
  
  .about-section {
    padding: 80px 20px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .about-highlights {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    padding: 60px 20px;
  }
  
  .park-footer {
    padding: 40px 20px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-brand {
    flex-direction: column;
  }
}
</style>
