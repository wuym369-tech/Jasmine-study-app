<template>
  <div class="pest-container">

    <!-- 说明 -->
    <div class="pest-warning">
      ⚠️ 及早发现、及早防治是关键！定期检查叶背和嫩梢，发现异状立即处理。
    </div>

    <!-- 虫害 -->
    <section class="content-section">
      <h2 class="section-title pest-title">🐛 虫害（6种）</h2>
      <div class="pest-grid">
        <div v-for="pest in pests" :key="pest.id" class="pest-card"
          :class="[pest.color, expandedPests.has(pest.id) ? 'is-selected' : '']"
          @click="togglePest(pest.id)">

          <div class="pest-header">
            <div class="pest-basic">
              <span class="pest-icon">{{ pest.icon }}</span>
              <div class="pest-names">
                <h3 class="pest-name">{{ pest.name }}</h3>
                <span class="pest-en">{{ pest.nameEn }}</span>
              </div>
            </div>
            <span class="pest-severity" :class="pest.badge">危害：{{ pest.severity }}</span>
          </div>

          <div class="pest-season">🗓️ {{ pest.season }}</div>

          <!-- 展开详情 -->
          <div v-if="expandedPests.has(pest.id)" class="pest-details">
            <div class="detail-block">
              <div class="detail-label">⚡ 有利条件</div>
              <p class="detail-text">{{ pest.conditions }}</p>
            </div>
            <div class="detail-block">
              <div class="detail-label">🔍 症状识别</div>
              <ul class="detail-list">
                <li v-for="s in pest.symptoms" :key="s">• {{ s }}</li>
              </ul>
            </div>
            <div class="detail-block">
              <div class="detail-label">🛡️ 预防方法</div>
              <ul class="detail-list">
                <li v-for="p in pest.prevention" :key="p">• {{ p }}</li>
              </ul>
            </div>
            <div class="detail-block">
              <div class="detail-label">💊 防治方法</div>
              <p class="detail-text">{{ pest.treatment }}</p>
            </div>
          </div>

          <div class="pest-toggle">
            {{ expandedPests.has(pest.id) ? '▲ 收起' : '▼ 点击查看详情' }}
          </div>
        </div>
      </div>
    </section>

    <!-- 病害 -->
    <section class="content-section">
      <h2 class="section-title disease-title">🍄 病害（5种）</h2>
      <div class="pest-grid">
        <div v-for="disease in diseases" :key="disease.id" class="pest-card"
          :class="[disease.color, expandedDiseases.has(disease.id) ? 'is-selected' : '']"
          @click="toggleDisease(disease.id)">

          <div class="pest-header">
            <div class="pest-basic">
              <span class="pest-icon">{{ disease.icon }}</span>
              <div class="pest-names">
                <h3 class="pest-name">{{ disease.name }}</h3>
                <span class="pest-en">{{ disease.nameEn }}</span>
              </div>
            </div>
            <span class="pest-severity" :class="disease.badge">危害：{{ disease.severity }}</span>
          </div>

          <div class="pest-season">🗓️ {{ disease.season }}</div>

          <div v-if="expandedDiseases.has(disease.id)" class="pest-details">
            <div class="detail-block">
              <div class="detail-label">⚡ 有利条件</div>
              <p class="detail-text">{{ disease.conditions }}</p>
            </div>
            <div class="detail-block">
              <div class="detail-label">🔍 症状识别</div>
              <ul class="detail-list">
                <li v-for="s in disease.symptoms" :key="s">• {{ s }}</li>
              </ul>
            </div>
            <div class="detail-block">
              <div class="detail-label">🛡️ 预防方法</div>
              <ul class="detail-list">
                <li v-for="p in disease.prevention" :key="p">• {{ p }}</li>
              </ul>
            </div>
            <div class="detail-block">
              <div class="detail-label">💊 防治方法</div>
              <p class="detail-text">{{ disease.treatment }}</p>
            </div>
          </div>

          <div class="pest-toggle">
            {{ expandedDiseases.has(disease.id) ? '▲ 收起' : '▼ 点击查看详情' }}
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pests, diseases } from '../../data/learnContent.js'

// 使用 Set 来存储已展开的卡片 ID，可以同时展开多个
const expandedPests = ref(new Set())
const expandedDiseases = ref(new Set())

// 切换虫害卡片展开状态
const togglePest = (id) => {
  const newSet = new Set(expandedPests.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  expandedPests.value = newSet
}

// 切换病害卡片展开状态
const toggleDisease = (id) => {
  const newSet = new Set(expandedDiseases.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  expandedDiseases.value = newSet
}
</script>

<style scoped>
@reference "tailwindcss";

.pest-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 8px 0 32px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pest-warning {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 16px;
  padding: 20px 24px;
  font-size: 16px;
  color: #92400E;
  line-height: 1.7;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.pest-title { color: #DC2626; }
.disease-title { color: #9333EA; }

/* 病虫害卡片网格 */
.pest-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .pest-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.pest-card {
  background: white;
  border-radius: 24px;
  border: 2px solid;
  padding: 28px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.pest-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.pest-card.is-selected {
  box-shadow: 0 0 0 4px rgba(91, 122, 94, 0.2);
}

.pest-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.pest-basic {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pest-icon {
  font-size: 36px;
}

.pest-names {
  display: flex;
  flex-direction: column;
}

.pest-name {
  font-size: 20px;
  font-weight: 700;
  color: #374151;
}

.pest-en {
  font-size: 13px;
  color: #94A3B8;
}

.pest-severity {
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: 500;
  flex-shrink: 0;
}

.pest-season {
  font-size: 15px;
  color: #64748B;
  margin-bottom: 8px;
}

/* 展开详情 */
.pest-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(139, 115, 85, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-label {
  font-size: 15px;
  font-weight: 700;
  color: #374151;
}

.detail-text {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-list li {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
}

.pest-toggle {
  font-size: 14px;
  color: #94A3B8;
  text-align: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(139, 115, 85, 0.1);
}

/* 颜色类 */
.border-red-200 { border-color: rgba(239, 68, 68, 0.3); }
.border-orange-200 { border-color: rgba(251, 146, 60, 0.3); }
.border-yellow-200 { border-color: rgba(234, 179, 8, 0.3); }
.border-green-200 { border-color: rgba(34, 197, 94, 0.3); }
.border-purple-200 { border-color: rgba(168, 85, 247, 0.3); }
.border-blue-200 { border-color: rgba(59, 130, 246, 0.3); }

.bg-red-100 { background-color: rgba(239, 68, 68, 0.1); }
.bg-orange-100 { background-color: rgba(251, 146, 60, 0.1); }
.bg-yellow-100 { background-color: rgba(234, 179, 8, 0.1); }
.bg-green-100 { background-color: rgba(34, 197, 94, 0.1); }
.bg-purple-100 { background-color: rgba(168, 85, 247, 0.1); }
.bg-blue-100 { background-color: rgba(59, 130, 246, 0.1); }

.text-red-700 { color: #B91C1C; }
.text-orange-700 { color: #C2410C; }
.text-yellow-700 { color: #A16207; }
.text-green-700 { color: #15803D; }
.text-purple-700 { color: #7E22CE; }
.text-blue-700 { color: #1D4ED8; }
</style>
