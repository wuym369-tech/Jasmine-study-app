<template>
  <div class="harvest-container">

    <!-- 采收时机 -->
    <section class="content-section">
      <h2 class="section-title">⏰ 采收时机判断</h2>
      <div class="timing-grid">
        <div v-for="point in harvestKnowledge.timing.points" :key="point.label" class="timing-card">
          <div class="timing-bar"></div>
          <div class="timing-content">
            <div class="timing-label">{{ point.label }}</div>
            <div class="timing-value">{{ point.value }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 人工采摘 重点说明 -->
    <section class="content-section">
      <h2 class="section-title">✋ 人工采摘技术（重点）</h2>
      <div class="technique-warning">
        ⚠️ <strong>茉莉花必须全程人工采摘，严禁使用剪刀等工具采花！</strong><br>
        工具会压伤花蕾细胞壁，导致精油挥发和香气损失，大幅降低品质与收购价格。剪刀只用于修剪植株，不用于采花。
      </div>
      <div class="technique-panel">
        <div class="technique-grid">
          <div class="technique-column">
            <h3 class="column-title">👆 正确采摘手法</h3>
            <ol class="steps-list">
              <li v-for="(step, i) in harvestKnowledge.technique.steps" :key="i" class="step-item">
                <span class="step-number">{{ i+1 }}</span>{{ step }}
              </li>
            </ol>
          </div>
          <div class="technique-column">
            <h3 class="column-title">📋 采摘标准与效率</h3>
            <div class="info-list">
              <div v-for="info in harvestKnowledge.technique.info" :key="info.label" class="info-card">
                <div class="info-label">{{ info.label }}</div>
                <div class="info-value">{{ info.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 三个采收批次 -->
    <section class="content-section">
      <h2 class="section-title">🗓️ 一年三批采收</h2>
      <div class="seasons-grid">
        <div v-for="season in harvestKnowledge.seasons" :key="season.name" class="season-card" :class="season.color">
          <div class="season-icon">{{ season.icon }}</div>
          <h3 class="season-name">{{ season.name }}</h3>
          <div class="season-period">{{ season.period }}</div>
          <div class="season-quality">{{ season.quality }}</div>
          <p class="season-desc">{{ season.desc }}</p>
        </div>
      </div>
      <p class="seasons-note">整个采收季节约 4月15日 至 10月15日，共 6 个月</p>
    </section>

    <!-- 品质分级 -->
    <section class="content-section">
      <h2 class="section-title">🏅 鲜花品质分级</h2>
      <div class="grades-list">
        <div v-for="grade in harvestKnowledge.grades" :key="grade.grade" class="grade-item">
          <span class="grade-badge" :class="grade.color">{{ grade.grade }}</span>
          <span class="grade-criteria">{{ grade.criteria }}</span>
        </div>
      </div>
      <p class="grades-tip">品质评判口诀：好花「灵、厚、长」（香气灵秀、厚实、持久）；劣花「浮、短、闷」</p>
    </section>

    <!-- 产量预期 -->
    <section class="content-section">
      <h2 class="section-title">📈 每亩产量预期</h2>
      <div class="yield-grid">
        <div v-for="y in harvestKnowledge.yield" :key="y.year" class="yield-card">
          <div class="yield-year">{{ y.year }}</div>
          <div class="yield-amount">{{ y.amount }}</div>
          <div class="yield-note">{{ y.note }}</div>
        </div>
      </div>
    </section>

    <!-- 从花到茶 -->
    <section class="content-section">
      <h2 class="section-title">🍵 从茉莉花到茉莉花茶</h2>
      <div class="process-grid">
        <div v-for="step in harvestKnowledge.teaProcess" :key="step.step" class="process-card">
          <div class="process-step">{{ step.step }}</div>
          <div class="process-icon">{{ step.icon }}</div>
          <div class="process-name">{{ step.name }}</div>
          <div class="process-time">{{ step.time }}</div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { harvestKnowledge } from '../../data/learnContent.js'
</script>

<style scoped>
@reference "tailwindcss";

.harvest-container {
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

/* 采收时机 */
.timing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .timing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.timing-card {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  display: flex;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.timing-bar {
  width: 6px;
  background: linear-gradient(to bottom, #7A9B7D, #C8B28C);
  flex-shrink: 0;
}

.timing-content {
  padding: 24px;
  flex: 1;
}

.timing-label {
  font-size: 17px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 8px;
}

.timing-value {
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
}

/* 采摘技术 */
.technique-warning {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 20px 24px;
  font-size: 16px;
  color: #DC2626;
  line-height: 1.8;
}

.technique-panel {
  background: white;
  border-radius: 24px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.technique-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 768px) {
  .technique-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.column-title {
  font-size: 20px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 20px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
}

.step-number {
  width: 32px;
  height: 32px;
  background: rgba(91, 122, 94, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #5B7A5E;
  flex-shrink: 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: rgba(91, 122, 94, 0.05);
  border-radius: 16px;
  padding: 20px;
}

.info-label {
  font-size: 14px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 8px;
}

.info-value {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
}

/* 三批采收 */
.seasons-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .seasons-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.season-card {
  border-radius: 24px;
  border: 2px solid;
  padding: 32px 24px;
  text-align: center;
  background: white;
}

.season-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.season-name {
  font-size: 22px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}

.season-period {
  font-size: 15px;
  color: #64748B;
  margin-bottom: 12px;
}

.season-quality {
  font-size: 28px;
  font-weight: 800;
  color: #5B7A5E;
  margin-bottom: 16px;
}

.season-desc {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
}

.seasons-note {
  text-align: center;
  font-size: 16px;
  color: #5B7A5E;
  font-weight: 500;
  margin-top: 8px;
}

/* 品质分级 */
.grades-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grade-item {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.grade-badge {
  font-size: 18px;
  font-weight: 800;
  min-width: 60px;
  text-align: center;
}

.grade-criteria {
  font-size: 16px;
  color: #64748B;
  flex: 1;
  line-height: 1.6;
}

.grades-tip {
  font-size: 14px;
  color: #8B7355;
  margin-top: 8px;
  font-style: italic;
}

/* 产量预期 */
.yield-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .yield-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.yield-card {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.yield-year {
  font-size: 18px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 12px;
}

.yield-amount {
  font-size: 36px;
  font-weight: 800;
  color: #374151;
  margin-bottom: 8px;
}

.yield-note {
  font-size: 14px;
  color: #64748B;
}

/* 制茶流程 */
.process-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .process-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.process-card {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.process-step {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #7A9B7D, #9BB89E);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  margin: 0 auto 16px;
}

.process-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.process-name {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
}

.process-time {
  font-size: 13px;
  color: #64748B;
}

/* 顏色類 */
.border-green-200 { border-color: rgba(34, 197, 94, 0.3); }
.border-yellow-200 { border-color: rgba(234, 179, 8, 0.3); }
.border-orange-200 { border-color: rgba(251, 146, 60, 0.3); }

.text-green-600 { color: #16A34A; }
.text-yellow-600 { color: #CA8A04; }
.text-orange-600 { color: #EA580C; }
</style>
