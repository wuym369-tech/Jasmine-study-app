<template>
  <div class="growth-container">

    <!-- 全年周期概览 -->
    <section class="content-section">
      <h2 class="section-title">📅 全年管理周期</h2>
      <div class="months-list">
        <div
          v-for="m in monthlyGrowth" :key="m.month"
          class="month-card"
          :class="m.color"
          @click="selected = selected === m.month ? null : m.month"
        >
          <!-- 标题栏 -->
          <div class="month-header">
            <span class="month-icon">{{ m.icon }}</span>
            <div class="month-info">
              <div class="month-title-row">
                <span class="month-name">{{ m.month }}</span>
                <span class="month-badge" :class="m.badge">{{ m.status }}</span>
              </div>
              <p class="month-meta">{{ m.season }} · 气温 {{ m.temp }}</p>
            </div>
            <span class="month-toggle">{{ selected === m.month ? '▲' : '▼' }}</span>
          </div>

          <!-- 展开详情 -->
          <div v-if="selected === m.month" class="month-details">
            <div class="details-grid">
              <div class="detail-box water-box">
                <div class="detail-label">💧 浇水</div>
                <p class="detail-text">{{ m.water }}</p>
              </div>
              <div class="detail-box fertilizer-box">
                <div class="detail-label">🌿 施肥</div>
                <p class="detail-text">{{ m.fertilizer }}</p>
              </div>
            </div>
            <div class="detail-box tasks-box">
              <div class="detail-label">📋 本月重要工作</div>
              <ul class="task-list">
                <li v-for="task in m.tasks" :key="task" class="task-item">
                  <span class="task-check">✓</span>{{ task }}
                </li>
              </ul>
            </div>
            <div v-if="m.warning" class="warning-box">
              <span class="warning-icon">⚠️</span>
              <p class="warning-text">{{ m.warning }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 生长里程碑 -->
    <section class="content-section">
      <h2 class="section-title">🏁 从种植到采收 — 生长里程碑</h2>
      <div class="milestones-grid">
        <div v-for="(m, i) in growthMilestones" :key="m.phase" class="milestone-card">
          <div class="milestone-connector" v-if="i < growthMilestones.length - 1">
            <div class="milestone-dot">{{ m.icon }}</div>
            <div class="milestone-line"></div>
          </div>
          <div class="milestone-dot" v-else>{{ m.icon }}</div>
          <div class="milestone-content">
            <div class="milestone-phase">{{ m.phase }}</div>
            <div class="milestone-days">{{ m.days }}</div>
            <p class="milestone-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 修剪指南 -->
    <section class="content-section">
      <h2 class="section-title">✂️ 修剪管理指南</h2>
      <div class="pruning-tip">
        💡 茉莉花每条新枝只开一次花，<strong>修剪的好坏直接决定一年能开几批花</strong>。正确修剪可确保每年开三批！
      </div>
      <div class="pruning-grid">
        <div v-for="guide in pruningGuide" :key="guide.name" class="pruning-card" :class="guide.color">
          <div class="pruning-icon">{{ guide.icon }}</div>
          <h3 class="pruning-name">{{ guide.name }}</h3>
          <div class="pruning-timing">{{ guide.timing }}</div>
          <div class="pruning-importance">{{ guide.importance }}</div>
          <ol class="pruning-steps">
            <li v-for="(step, i) in guide.steps" :key="i" class="step-item">
              <span class="step-number">{{ i+1 }}</span>{{ step }}
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!--
    TODO: 病虫害日历 - 待添加 pestCalendar 数据后显示
    <section class="content-section">
      <h2 class="section-title">🐛 全年病虫害日历</h2>
      <div class="pest-calendar">
        <div v-for="p in pestCalendar" :key="p.pest" class="pest-item">
          <div class="pest-icon">{{ p.icon }}</div>
          <div class="pest-content">
            <div class="pest-name">{{ p.pest }}</div>
            <div class="pest-season">{{ p.season }}</div>
            <p class="pest-desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>
    -->

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { monthlyGrowth, growthMilestones, pruningGuide } from '../../data/learnContent.js'

const selected = ref(null)
</script>

<style scoped>
@reference "tailwindcss";

.growth-container {
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

/* 月份列表 - 更寬鬆 */
.months-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.month-card {
  border-radius: 20px;
  border: 2px solid;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  background: white;
}

.month-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.month-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.month-icon {
  font-size: 40px;
}

.month-info {
  flex: 1;
}

.month-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.month-name {
  font-size: 22px;
  font-weight: 700;
  color: #374151;
}

.month-badge {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 500;
}

.month-meta {
  font-size: 15px;
  color: #8B7355;
}

.month-toggle {
  font-size: 18px;
  color: #64748B;
  padding: 8px;
}

/* 月份詳情 */
.month-details {
  padding: 0 24px 24px;
  border-top: 1px dashed rgba(139, 115, 85, 0.2);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.detail-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px;
}

.detail-label {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}

.water-box .detail-label { color: #3B82F6; }
.fertilizer-box .detail-label { color: #16A34A; }

.detail-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  font-size: 15px;
  color: #374151;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.task-check {
  color: #22C55E;
  font-weight: 700;
  flex-shrink: 0;
}

.warning-box {
  background: rgba(239, 68, 68, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.warning-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.warning-text {
  font-size: 15px;
  color: #DC2626;
  line-height: 1.6;
}

/* 里程碑 - 更寬鬆 */
.milestones-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .milestones-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.milestone-card {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  padding: 28px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.milestone-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.milestone-dot {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(91, 122, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.milestone-line {
  width: 3px;
  flex: 1;
  background: linear-gradient(to bottom, #7A9B7D, #C8B28C);
  margin: 8px 0;
}

.milestone-content {
  flex: 1;
}

.milestone-phase {
  font-size: 20px;
  font-weight: 700;
  color: #5B7A5E;
  margin-bottom: 6px;
}

.milestone-days {
  font-size: 15px;
  color: #7A9B7D;
  margin-bottom: 10px;
}

.milestone-desc {
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
}

/* 修剪指南 */
.pruning-tip {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 16px;
  padding: 20px 24px;
  font-size: 16px;
  color: #92400E;
  line-height: 1.7;
}

.pruning-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .pruning-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.pruning-card {
  border-radius: 24px;
  border: 2px solid;
  padding: 32px 28px;
  background: white;
}

.pruning-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.pruning-name {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #374151;
  margin-bottom: 10px;
}

.pruning-timing {
  font-size: 15px;
  text-align: center;
  color: #64748B;
  margin-bottom: 12px;
}

.pruning-importance {
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  color: #5B7A5E;
  background: rgba(91, 122, 94, 0.1);
  padding: 10px 16px;
  border-radius: 20px;
  margin-bottom: 24px;
}

.pruning-steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step-item {
  font-size: 15px;
  color: #374151;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.6;
}

.step-number {
  width: 28px;
  height: 28px;
  background: rgba(91, 122, 94, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #5B7A5E;
  flex-shrink: 0;
}

/* 病虫害日历 */
.pest-calendar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pest-item {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(139, 115, 85, 0.1);
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.pest-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.pest-content {
  flex: 1;
}

.pest-name {
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
}

.pest-season {
  font-size: 14px;
  color: #DC2626;
  font-weight: 500;
  margin-bottom: 10px;
}

.pest-desc {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
}

/* 保留原有的顏色類 */
.border-green-200 { border-color: rgba(34, 197, 94, 0.3); }
.border-yellow-200 { border-color: rgba(234, 179, 8, 0.3); }
.border-orange-200 { border-color: rgba(251, 146, 60, 0.3); }
.border-blue-200 { border-color: rgba(59, 130, 246, 0.3); }
.border-purple-200 { border-color: rgba(168, 85, 247, 0.3); }
.border-red-200 { border-color: rgba(239, 68, 68, 0.3); }
.bg-green-100 { background-color: rgba(34, 197, 94, 0.1); }
.bg-yellow-100 { background-color: rgba(234, 179, 8, 0.1); }
.bg-orange-100 { background-color: rgba(251, 146, 60, 0.1); }
.bg-blue-100 { background-color: rgba(59, 130, 246, 0.1); }
.bg-purple-100 { background-color: rgba(168, 85, 247, 0.1); }
.bg-red-100 { background-color: rgba(239, 68, 68, 0.1); }
</style>
