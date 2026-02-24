<template>
  <div class="space-y-10">

    <!-- 全年周期概览 -->
    <section>
      <h2 class="section-title">📅 全年管理周期</h2>
      <div class="space-y-3">
        <div
          v-for="m in monthlyGrowth" :key="m.month"
          class="rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="m.color"
          @click="selected = selected === m.month ? null : m.month"
        >
          <!-- 标题栏 -->
          <div class="flex items-center gap-4 p-4">
            <span class="text-3xl">{{ m.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-gray-800">{{ m.month }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="m.badge">{{ m.status }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">{{ m.season }} · 气温 {{ m.temp }}</p>
            </div>
            <span class="text-gray-400 text-sm flex-shrink-0">{{ selected === m.month ? '▲' : '▼' }}</span>
          </div>

          <!-- 展开详情 -->
          <div v-if="selected === m.month" class="px-4 pb-4 border-t border-gray-200 pt-3 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-white bg-opacity-70 rounded-xl p-3">
                <div class="text-xs font-bold text-blue-700 mb-2">💧 浇水</div>
                <p class="text-xs text-gray-700">{{ m.water }}</p>
              </div>
              <div class="bg-white bg-opacity-70 rounded-xl p-3">
                <div class="text-xs font-bold text-green-700 mb-2">🌿 施肥</div>
                <p class="text-xs text-gray-700">{{ m.fertilizer }}</p>
              </div>
            </div>
            <div class="bg-white bg-opacity-70 rounded-xl p-3">
              <div class="text-xs font-bold text-gray-700 mb-2">📋 本月重要工作</div>
              <ul class="space-y-1">
                <li v-for="task in m.tasks" :key="task" class="text-xs text-gray-700 flex gap-2">
                  <span class="text-green-500 flex-shrink-0">✓</span>{{ task }}
                </li>
              </ul>
            </div>
            <div v-if="m.warning" class="bg-red-50 rounded-xl p-3 flex gap-2">
              <span class="text-red-500 flex-shrink-0">⚠️</span>
              <p class="text-xs text-red-700">{{ m.warning }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 生长里程碑 -->
    <section>
      <h2 class="section-title">🏁 从种植到采收 — 生长里程碑</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(m, i) in growthMilestones" :key="m.phase"
          class="bg-white rounded-xl border border-green-100 p-4 flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
              {{ m.icon }}
            </div>
            <div v-if="i < growthMilestones.length - 1" class="w-0.5 bg-green-200 flex-1 my-1"></div>
          </div>
          <div class="flex-1">
            <div class="font-bold text-green-800 text-sm">{{ m.phase }}</div>
            <div class="text-xs text-green-500 mb-1">{{ m.days }}</div>
            <p class="text-xs text-gray-600">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 修剪指南 -->
    <section>
      <h2 class="section-title">✂️ 修剪管理指南</h2>
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-800">
        💡 茉莉花每条新枝只开一次花，<strong>修剪的好坏直接决定一年能开几批花</strong>。正确修剪可确保每年开三批！
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="guide in pruningGuide" :key="guide.name"
          class="rounded-2xl border-2 p-5" :class="guide.color">
          <div class="text-3xl text-center mb-2">{{ guide.icon }}</div>
          <h3 class="font-bold text-center text-gray-800 mb-1">{{ guide.name }}</h3>
          <div class="text-xs text-center text-gray-500 mb-1">{{ guide.timing }}</div>
          <div class="text-xs text-center font-medium text-green-700 mb-3 bg-white bg-opacity-60 rounded-full py-1">
            {{ guide.importance }}
          </div>
          <ol class="space-y-1.5">
            <li v-for="(step, i) in guide.steps" :key="i" class="text-xs text-gray-700 flex gap-2">
              <span class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0 text-xs">{{ i+1 }}</span>
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- 温度需求速查 -->
    <section>
      <h2 class="section-title">🌡️ 温度需求速查</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="t in tempGuide" :key="t.label"
          class="flex items-center gap-3 bg-white rounded-xl p-4 border" :class="t.border">
          <span class="text-2xl">{{ t.icon }}</span>
          <div>
            <div class="font-medium text-sm" :class="t.textColor">{{ t.temp }}</div>
            <div class="text-xs text-gray-500">{{ t.label }}</div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { monthlyGrowth, growthMilestones, pruningGuide } from '../../data/learnContent.js'

const selected = ref(null)

const tempGuide = [
  { temp: '32-37°C', label: '花蕾发育最快，香气最浓', icon: '🔥', border: 'border-red-200', textColor: 'text-red-600' },
  { temp: '25-35°C', label: '最适合生长和开花的温度范围', icon: '☀️', border: 'border-yellow-200', textColor: 'text-yellow-600' },
  { temp: '20°C+', label: '花蕾开始形成的最低温度', icon: '🌤️', border: 'border-green-200', textColor: 'text-green-600' },
  { temp: '10°C以下', label: '生长基本停止，进入休眠', icon: '🌡️', border: 'border-blue-200', textColor: 'text-blue-600' },
  { temp: '3-5°C', label: '叶片开始受损，需紧急保护', icon: '❄️', border: 'border-indigo-200', textColor: 'text-indigo-600' },
  { temp: '0°C以下', label: '枝条严重受损，可能整株死亡', icon: '🥶', border: 'border-purple-200', textColor: 'text-purple-600' },
]
</script>

<style scoped>
@reference "tailwindcss";
.section-title {
  @apply text-xl font-bold text-green-800 mb-4;
}
</style>
