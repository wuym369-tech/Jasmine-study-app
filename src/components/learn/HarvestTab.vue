<template>
  <div class="space-y-10">

    <!-- 採收時機 -->
    <section>
      <h2 class="section-title">⏰ 採收時機判斷</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="point in harvestKnowledge.timing.points" :key="point.label"
          class="bg-white rounded-xl p-4 border border-green-100 flex gap-3">
          <div class="w-2 bg-green-400 rounded-full flex-shrink-0"></div>
          <div>
            <div class="font-medium text-green-800 text-sm">{{ point.label }}</div>
            <div class="text-gray-600 text-sm mt-0.5">{{ point.value }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 三個採收批次 -->
    <section>
      <h2 class="section-title">🗓️ 一年三批採收</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="season in harvestKnowledge.seasons" :key="season.name"
          class="rounded-2xl border-2 p-5" :class="season.color">
          <div class="text-3xl text-center mb-2">{{ season.icon }}</div>
          <h3 class="font-bold text-center text-gray-800 mb-1">{{ season.name }}</h3>
          <div class="text-center text-sm text-gray-500 mb-2">{{ season.period }}</div>
          <div class="text-center text-lg mb-3">{{ season.quality }}</div>
          <p class="text-sm text-gray-600 text-center">{{ season.desc }}</p>
        </div>
      </div>
      <p class="text-center text-sm text-green-600 mt-3">整個採收季節約 4月15日 至 10月15日，共 6 個月</p>
    </section>

    <!-- 採摘技術 -->
    <section>
      <h2 class="section-title">✂️ 正確採摘技術</h2>
      <div class="bg-white rounded-2xl border border-green-100 p-6">
        <ul class="space-y-3">
          <li v-for="(point, i) in harvestKnowledge.technique.points" :key="i"
            class="flex gap-3 items-start">
            <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0 mt-0.5">{{ i + 1 }}</span>
            <span class="text-sm text-gray-700">{{ point }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 品質分級 -->
    <section>
      <h2 class="section-title">🏅 鮮花品質分級</h2>
      <div class="space-y-3">
        <div v-for="grade in harvestKnowledge.grades" :key="grade.grade"
          class="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
          <span class="font-bold text-lg min-w-[3rem]" :class="grade.color">{{ grade.grade }}</span>
          <span class="text-sm text-gray-600">{{ grade.criteria }}</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2">品質評判口訣：好花「靈、厚、長」（香氣靈秀、厚實、持久）；劣花「浮、短、悶」</p>
    </section>

    <!-- 產量預期 -->
    <section>
      <h2 class="section-title">📈 每畝產量預期</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="y in harvestKnowledge.yield" :key="y.year"
          class="bg-white rounded-xl p-5 border border-green-100 text-center">
          <div class="font-bold text-green-700 mb-1">{{ y.year }}</div>
          <div class="text-xl font-bold text-gray-800">{{ y.amount }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ y.note }}</div>
        </div>
      </div>
    </section>

    <!-- 從花到茶 -->
    <section>
      <h2 class="section-title">🍵 從茉莉花到茉莉花茶</h2>
      <div class="relative">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="step in harvestKnowledge.teaProcess" :key="step.step"
            class="bg-white rounded-xl p-4 border border-green-100 text-center relative">
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
              {{ step.step }}
            </div>
            <div class="font-medium text-green-800 text-sm mb-1">{{ step.name }}</div>
            <div class="text-xs text-gray-500">{{ step.desc }}</div>
          </div>
        </div>
        <p class="text-center text-xs text-gray-500 mt-3">頂級茉莉花茶可反覆窨製最多 <strong>9次</strong>，每次都加入新鮮花苞，層層疊香</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { harvestKnowledge } from '../../data/learnContent.js'
</script>

<style scoped>
@reference "tailwindcss";
.section-title {
  @apply text-xl font-bold text-green-800 mb-4;
}
</style>
