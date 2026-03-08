<template>
  <div class="learn-container">
    <!-- 顶部导航 - Adaline 风格 -->
    <div class="learn-nav">
      <div class="nav-content">
        <router-link to="/" class="nav-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回</span>
        </router-link>
        
        <div class="nav-brand">
          <JasmineIcons name="learn" :size="28" />
          <span>茉莉花教学</span>
        </div>
        
        <!-- 标签导航 -->
        <div class="nav-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="nav-tab"
            :class="{ 'nav-tab-active': activeTab === tab.id }"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="learn-content">
      <Transition name="fade-slide" mode="out-in">
        <component :is="currentComponent" :key="activeTab" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import JasmineIcons from '../components/JasmineIcons.vue'
import IntroTab from '../components/learn/IntroTab.vue'
import GrowthTab from '../components/learn/GrowthTab.vue'
import RolesTab from '../components/learn/RolesTab.vue'
import PestTab from '../components/learn/PestTab.vue'
import HarvestTab from '../components/learn/HarvestTab.vue'

const tabs = [
  { id: 'intro', label: '茉莉花简介', icon: '🌸' },
  { id: 'growth', label: '生长周期', icon: '🌱' },
  { id: 'roles', label: '六大职责', icon: '👥' },
  { id: 'pest', label: '病虫害图鉴', icon: '🐛' },
  { id: 'harvest', label: '采收知识', icon: '✂️' },
]

const componentMap = {
  intro: IntroTab,
  growth: GrowthTab,
  roles: RolesTab,
  pest: PestTab,
  harvest: HarvestTab,
}

const activeTab = ref('intro')
const currentComponent = computed(() => componentMap[activeTab.value])
</script>

<style scoped>
@reference "tailwindcss";

.learn-container {
  min-height: 100vh;
  background: #FDFBF7;
}

/* ========== 导航栏 ========== */
.learn-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(253, 251, 247, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.nav-back:hover {
  background: #F1F5F9;
  color: #374151;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  padding-right: 24px;
  border-right: 1px solid #E2E8F0;
  flex-shrink: 0;
}

/* 标签导航 */
.nav-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-tab:hover {
  background: #F1F5F9;
  color: #374151;
}

.nav-tab-active {
  background: #5B7A5E;
  color: white;
}

.nav-tab-active:hover {
  background: #4A6350;
  color: white;
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  font-size: 14px;
}

/* ========== 内容区 ========== */
.learn-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-content {
    padding: 12px 16px;
    flex-wrap: wrap;
  }
  
  .nav-brand {
    padding-right: 0;
    border-right: none;
  }
  
  .nav-tabs {
    order: 3;
    width: 100%;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #E2E8F0;
  }
}
</style>
