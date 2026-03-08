<template>
  <div class="intro-container">

    <!-- 关键数据 -->
    <section class="content-section">
      <h2 class="section-title">📊 横州茉莉花关键数据</h2>
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-value" :class="stat.color">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
      <p class="stats-highlight">
        🌏 全球每10朵茉莉花，就有6朵来自广西横州
      </p>
    </section>

    <!-- 茉莉花品种 -->
    <section class="content-section">
      <h2 class="section-title">🌸 茉莉花品种介绍</h2>
      <div class="varieties-grid">
        <div v-for="v in varieties" :key="v.id" class="variety-card" :class="v.color">
          <div class="variety-icon">{{ v.icon }}</div>
          <h3 class="variety-name" :class="v.textColor">{{ v.name }}</h3>
          <div class="variety-badge">{{ v.highlight }}</div>
          <p class="variety-desc">{{ v.desc }}</p>
          <div class="variety-specs">
            <div class="spec-row"><span>植株高度</span><span class="spec-value">{{ v.height }}</span></div>
            <div class="spec-row"><span>花瓣数量</span><span class="spec-value">{{ v.petals }}</span></div>
            <div class="spec-row"><span>香气浓度</span><span>{{ v.fragrance }}</span></div>
            <div class="spec-row"><span>栽培难度</span><span>{{ v.cultivation }}</span></div>
            <div class="spec-row"><span>主要用途</span><span class="spec-value">{{ v.use }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 横州优势 -->
    <section class="content-section">
      <h2 class="section-title">🏆 为什么是横州？</h2>
      <div class="advantages-grid">
        <div v-for="adv in advantages" :key="adv.title" class="advantage-card">
          <div class="advantage-icon">{{ adv.icon }}</div>
          <div class="advantage-content">
            <h3 class="advantage-title">{{ adv.title }}</h3>
            <p class="advantage-desc">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 历史时间轴 -->
    <section class="content-section">
      <h2 class="section-title">📜 横州茉莉花历史</h2>
      <div class="timeline">
        <div class="timeline-line"></div>
        <div class="timeline-items">
          <div v-for="event in timeline" :key="event.year" class="timeline-item">
            <div class="timeline-dot">{{ event.icon }}</div>
            <div class="timeline-content">
              <div class="timeline-year">{{ event.year }}</div>
              <p class="timeline-text">{{ event.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { varieties, timeline, hengzhouAdvantages as advantages, stats } from '../../data/learnContent.js'
</script>

<style scoped>
@reference "tailwindcss";

/* 平板優化：更大間距、更大字體、更好觸控 */
.intro-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 8px 0 32px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #5B7A5E;
  letter-spacing: -0.02em;
}

/* 關鍵數據 - 更寬鬆 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  border: 1px solid rgba(139, 115, 85, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 15px;
  color: #64748B;
}

.stats-highlight {
  text-align: center;
  font-size: 18px;
  color: #5B7A5E;
  font-weight: 500;
  padding: 20px;
  background: rgba(91, 122, 94, 0.05);
  border-radius: 16px;
  margin-top: 8px;
}

/* 品種卡片 - 更寬鬆 */
.varieties-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}

@media (min-width: 768px) {
  .varieties-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.variety-card {
  border-radius: 24px;
  border: 2px solid;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.variety-card:hover {
  transform: translateY(-4px);
}

.variety-icon {
  font-size: 56px;
  text-align: center;
  margin-bottom: 16px;
}

.variety-name {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
}

.variety-badge {
  display: inline-block;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
  color: #5B7A5E;
  text-align: center;
  margin: 0 auto 20px;
}

.variety-desc {
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
  margin-bottom: 24px;
}

.variety-specs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #64748B;
  padding: 10px 0;
  border-bottom: 1px dashed rgba(139, 115, 85, 0.15);
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-value {
  font-weight: 600;
  color: #374151;
}

/* 優勢卡片 */
.advantages-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.advantage-card {
  background: white;
  border-radius: 20px;
  padding: 28px 24px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  gap: 20px;
  transition: transform 0.2s ease;
}

.advantage-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.advantage-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.advantage-content {
  flex: 1;
}

.advantage-title {
  font-size: 20px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 10px;
}

.advantage-desc {
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
}

/* 時間軸 */
.timeline {
  position: relative;
  padding-left: 60px;
}

.timeline-line {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #7A9B7D, #C8B28C);
  border-radius: 3px;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.timeline-item {
  display: flex;
  gap: 24px;
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -52px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: white;
  border: 3px solid #7A9B7D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.timeline-content {
  background: white;
  border-radius: 20px;
  padding: 24px 28px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  flex: 1;
}

.timeline-year {
  font-size: 18px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 10px;
}

.timeline-text {
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
}

/* 保留原有的顏色類 */
.border-green-200 { border-color: rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.05); }
.border-purple-200 { border-color: rgba(168, 85, 247, 0.3); background: rgba(168, 85, 247, 0.05); }
.border-orange-200 { border-color: rgba(251, 146, 60, 0.3); background: rgba(251, 146, 60, 0.05); }
.text-green-600 { color: #16A34A; }
.text-purple-600 { color: #9333EA; }
.text-orange-600 { color: #EA580C; }
</style>
