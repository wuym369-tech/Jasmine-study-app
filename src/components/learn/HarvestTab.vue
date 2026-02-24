<template>
  <div class="space-y-10">

    <!-- 采收时机 -->
    <section>
      <h2 class="section-title">⏰ 采收时机判断</h2>
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

    <!-- 人工采摘 重点说明 -->
    <section>
      <h2 class="section-title">✋ 人工采摘技术（重点）</h2>
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-800">
        ⚠️ <strong>茉莉花必须全程人工采摘，严禁使用剪刀等工具采花！</strong><br>
        工具会压伤花蕾细胞壁，导致精油挥发和香气损失，大幅降低品质与收购价格。剪刀只用于修剪植株，不用于采花。
      </div>
      <div class="bg-white rounded-2xl border border-green-100 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-bold text-green-800 mb-3">👆 正确采摘手法</h3>
            <ol class="space-y-3">
              <li v-for="(step, i) in harvestKnowledge.technique.steps" :key="i"
                class="flex gap-3 items-start text-sm text-gray-700">
                <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold flex-shrink-0 text-xs">{{ i+1 }}</span>
                {{ step }}
              </li>
            </ol>
          </div>
          <div>
            <h3 class="font-bold text-green-800 mb-3">📋 采摘标准与效率</h3>
            <div class="space-y-3">
              <div v-for="info in harvestKnowledge.technique.info" :key="info.label"
                class="bg-green-50 rounded-xl p-3">
                <div class="text-xs font-bold text-green-700 mb-1">{{ info.label }}</div>
                <div class="text-sm text-gray-700">{{ info.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 三个采收批次 -->
    <section>
      <h2 class="section-title">🗓️ 一年三批采收</h2>
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
      <p class="text-center text-sm text-green-600 mt-3">整个采收季节约 4月15日 至 10月15日，共 6 个月</p>
    </section>

    <!-- 品质分级 -->
    <section>
      <h2 class="section-title">🏅 鲜花品质分级</h2>
      <div class="space-y-3">
        <div v-for="grade in harvestKnowledge.grades" :key="grade.grade"
          class="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
          <span class="font-bold text-lg min-w-[3rem]" :class="grade.color">{{ grade.grade }}</span>
          <span class="text-sm text-gray-600">{{ grade.criteria }}</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2">品质评判口诀：好花「灵、厚、长」（香气灵秀、厚实、持久）；劣花「浮、短、闷」</p>
    </section>

    <!-- 产量预期 -->
    <section>
      <h2 class="section-title">📈 每亩产量预期</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="y in harvestKnowledge.yield" :key="y.year"
          class="bg-white rounded-xl p-5 border border-green-100 text-center">
          <div class="font-bold text-green-700 mb-1">{{ y.year }}</div>
          <div class="text-xl font-bold text-gray-800">{{ y.amount }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ y.note }}</div>
        </div>
      </div>
    </section>

    <!-- 从花到茶 -->
    <section>
      <h2 class="section-title">🍵 从茉莉花到茉莉花茶</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="step in harvestKnowledge.teaProcess" :key="step.step"
          class="bg-white rounded-xl p-4 border border-green-100 text-center">
          <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
            {{ step.step }}
          </div>
          <div class="font-medium text-green-800 text-sm mb-1">{{ step.name }}</div>
          <div class="text-xs text-gray-500">{{ step.desc }}</div>
        </div>
      </div>
      <p class="text-center text-xs text-gray-500 mt-3">顶级茉莉花茶可反复窨制最多 <strong>9次</strong>，每次都加入新鲜花蕾，层层叠香</p>
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
