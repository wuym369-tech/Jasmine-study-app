<template>
  <div class="min-h-screen bg-green-50">
    <!-- 頂部導覽 -->
    <div class="bg-white border-b border-green-100 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center gap-4 py-3">
          <router-link to="/" class="text-green-600 hover:text-green-800 text-sm flex-shrink-0">← 首頁</router-link>
          <h1 class="text-lg font-bold text-green-800 flex-shrink-0">📚 茉莉花教學</h1>
          <!-- 標籤頁 -->
          <div class="flex gap-1 overflow-x-auto flex-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              :class="activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-500 hover:text-green-700 hover:bg-green-50'"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 內容區 -->
    <div class="max-w-5xl mx-auto px-4 py-8">
      <Transition name="fade" mode="out-in">
        <component :is="currentComponent" :key="activeTab" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IntroTab from '../components/learn/IntroTab.vue'
import GrowthTab from '../components/learn/GrowthTab.vue'
import RolesTab from '../components/learn/RolesTab.vue'
import PestTab from '../components/learn/PestTab.vue'
import HarvestTab from '../components/learn/HarvestTab.vue'

const tabs = [
  { id: 'intro', label: '茉莉花簡介', icon: '🌸' },
  { id: 'growth', label: '生長週期', icon: '🌱' },
  { id: 'roles', label: '六大職責', icon: '👥' },
  { id: 'pest', label: '病蟲害圖鑑', icon: '🐛' },
  { id: 'harvest', label: '採收知識', icon: '✂️' },
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
