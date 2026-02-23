<template>
  <div class="space-y-8">

    <!-- 說明 -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
      ⚠️ 及早發現、及早防治是關鍵！定期檢查葉背和嫩梢，發現異狀立即處理。
    </div>

    <!-- 蟲害 -->
    <section>
      <h2 class="text-xl font-bold text-red-700 mb-4">🐛 蟲害（6種）</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="pest in pests" :key="pest.id"
          class="rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="[pest.color, selectedPest === pest.id ? 'ring-2 ring-offset-1 ring-green-400' : '']"
          @click="selectedPest = selectedPest === pest.id ? null : pest.id">

          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ pest.icon }}</span>
              <div>
                <h3 class="font-bold text-gray-800">{{ pest.name }}</h3>
                <span class="text-xs text-gray-400">{{ pest.nameEn }}</span>
              </div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full font-medium" :class="pest.badge">
              危害：{{ pest.severity }}
            </span>
          </div>

          <div class="text-xs text-gray-500 mb-2">🗓️ {{ pest.season }}</div>

          <!-- 展開詳情 -->
          <div v-if="selectedPest === pest.id" class="mt-3 space-y-3 border-t border-gray-200 pt-3">
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">⚡ 有利條件</div>
              <p class="text-xs text-gray-600">{{ pest.conditions }}</p>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">🔍 症狀識別</div>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="s in pest.symptoms" :key="s">• {{ s }}</li>
              </ul>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">🛡️ 預防方法</div>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="p in pest.prevention" :key="p">• {{ p }}</li>
              </ul>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">💊 防治方法</div>
              <p class="text-xs text-gray-600">{{ pest.treatment }}</p>
            </div>
          </div>

          <div class="text-xs text-gray-400 mt-2 text-center">
            {{ selectedPest === pest.id ? '▲ 收起' : '▼ 點擊查看詳情' }}
          </div>
        </div>
      </div>
    </section>

    <!-- 病害 -->
    <section>
      <h2 class="text-xl font-bold text-purple-700 mb-4">🍄 病害（5種）</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="disease in diseases" :key="disease.id"
          class="rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="[disease.color, selectedDisease === disease.id ? 'ring-2 ring-offset-1 ring-purple-400' : '']"
          @click="selectedDisease = selectedDisease === disease.id ? null : disease.id">

          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ disease.icon }}</span>
              <div>
                <h3 class="font-bold text-gray-800">{{ disease.name }}</h3>
                <span class="text-xs text-gray-400">{{ disease.nameEn }}</span>
              </div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full font-medium" :class="disease.badge">
              危害：{{ disease.severity }}
            </span>
          </div>

          <div class="text-xs text-gray-500 mb-2">🗓️ {{ disease.season }}</div>

          <div v-if="selectedDisease === disease.id" class="mt-3 space-y-3 border-t border-gray-200 pt-3">
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">⚡ 有利條件</div>
              <p class="text-xs text-gray-600">{{ disease.conditions }}</p>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">🔍 症狀識別</div>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="s in disease.symptoms" :key="s">• {{ s }}</li>
              </ul>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">🛡️ 預防方法</div>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="p in disease.prevention" :key="p">• {{ p }}</li>
              </ul>
            </div>
            <div>
              <div class="text-xs font-bold text-gray-600 mb-1">💊 防治方法</div>
              <p class="text-xs text-gray-600">{{ disease.treatment }}</p>
            </div>
          </div>

          <div class="text-xs text-gray-400 mt-2 text-center">
            {{ selectedDisease === disease.id ? '▲ 收起' : '▼ 點擊查看詳情' }}
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pests, diseases } from '../../data/learnContent.js'

const selectedPest = ref(null)
const selectedDisease = ref(null)
</script>
