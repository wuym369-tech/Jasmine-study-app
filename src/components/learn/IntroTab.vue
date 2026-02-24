<template>
  <div class="space-y-10">

    <!-- 关键数据 -->
    <section>
      <h2 class="section-title">📊 横州茉莉花关键数据</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white rounded-2xl p-5 text-center border border-green-100 shadow-sm">
          <div class="text-3xl mb-1">{{ stat.icon }}</div>
          <div class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ stat.label }}</div>
        </div>
      </div>
      <p class="mt-3 text-center text-green-700 font-medium text-sm">
        🌏 全球每10朵茉莉花，就有6朵来自广西横州
      </p>
    </section>

    <!-- 茉莉花品种 -->
    <section>
      <h2 class="section-title">🌸 茉莉花品种介绍</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="v in varieties" :key="v.id"
          class="rounded-2xl border-2 p-6" :class="v.color">
          <div class="text-4xl text-center mb-3">{{ v.icon }}</div>
          <h3 class="text-lg font-bold text-center mb-1" :class="v.textColor">{{ v.name }}</h3>
          <div class="inline-block text-xs px-2 py-1 rounded-full bg-white bg-opacity-70 text-gray-600 mb-3 w-full text-center">
            {{ v.highlight }}
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ v.desc }}</p>
          <div class="space-y-1 text-xs text-gray-500">
            <div class="flex justify-between"><span>植株高度</span><span class="font-medium">{{ v.height }}</span></div>
            <div class="flex justify-between"><span>花瓣数量</span><span class="font-medium">{{ v.petals }}</span></div>
            <div class="flex justify-between"><span>香气浓度</span><span>{{ v.fragrance }}</span></div>
            <div class="flex justify-between"><span>栽培难度</span><span>{{ v.cultivation }}</span></div>
            <div class="flex justify-between"><span>主要用途</span><span class="font-medium">{{ v.use }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 横州优势 -->
    <section>
      <h2 class="section-title">🏆 为什么是横州？</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="adv in advantages" :key="adv.title"
          class="bg-white rounded-xl p-5 border border-green-100 flex gap-4">
          <div class="text-3xl">{{ adv.icon }}</div>
          <div>
            <h3 class="font-bold text-green-800 mb-1">{{ adv.title }}</h3>
            <p class="text-sm text-gray-600">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 历史时间轴 -->
    <section>
      <h2 class="section-title">📜 横州茉莉花历史</h2>
      <div class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200"></div>
        <div class="space-y-6">
          <div v-for="event in timeline" :key="event.year" class="flex gap-4 relative">
            <div class="w-12 h-12 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center text-xl flex-shrink-0 z-10">
              {{ event.icon }}
            </div>
            <div class="bg-white rounded-xl p-4 border border-green-100 flex-1">
              <div class="font-bold text-green-700 text-sm mb-1">{{ event.year }}</div>
              <p class="text-gray-600 text-sm">{{ event.text }}</p>
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
.section-title {
  @apply text-xl font-bold text-green-800 mb-4;
}
</style>
