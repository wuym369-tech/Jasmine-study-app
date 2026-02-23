<template>
  <div class="min-h-screen bg-yellow-50">

    <!-- 設定畫面 -->
    <div v-if="phase === 'setup'" class="max-w-2xl mx-auto px-4 py-8">
      <router-link to="/" class="text-green-600 hover:text-green-800 mb-6 inline-block text-sm">← 返回首頁</router-link>
      <h1 class="text-2xl font-bold text-yellow-800 mb-1">💬 情境討論模式</h1>
      <p class="text-yellow-600 text-sm mb-8">小組共同討論農場情境，找出最佳應對方案</p>

      <!-- 人數推薦 -->
      <div class="bg-white rounded-2xl border border-yellow-200 p-5 mb-6">
        <h2 class="font-bold text-gray-700 mb-3">👥 依學生人數選擇題數</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="rec in questionCountBySize" :key="rec.label"
            @click="selectedCount = rec.recommended"
            class="p-3 rounded-xl border-2 text-left transition-all text-sm"
            :class="selectedCount === rec.recommended
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-200 hover:border-yellow-300'"
          >
            <div class="font-medium text-gray-800">{{ rec.label }}</div>
            <div class="text-yellow-600 font-bold">推薦 {{ rec.recommended }} 題</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ rec.desc }}</div>
          </button>
        </div>
      </div>

      <!-- 自訂題數 -->
      <div class="bg-white rounded-2xl border border-yellow-200 p-5 mb-6">
        <h2 class="font-bold text-gray-700 mb-3">🎯 或自訂題目數量與類別</h2>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-sm text-gray-600">總題數</span>
          <button @click="selectedCount = Math.max(3, selectedCount - 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">-</button>
          <span class="text-2xl font-bold text-yellow-600 w-12 text-center">{{ selectedCount }}</span>
          <button @click="selectedCount = Math.min(25, selectedCount + 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">+</button>
          <span class="text-sm text-gray-400">（最少3題，最多25題）</span>
        </div>

        <!-- 類別篩選 -->
        <div class="space-y-2">
          <p class="text-sm text-gray-600 mb-2">選擇題目類別（可複選）：</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories" :key="cat.id"
              @click="toggleCategory(cat.id)"
              class="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
              :class="selectedCategories.includes(cat.id)
                ? cat.activeClass
                : 'border-gray-200 text-gray-500 hover:border-gray-300'"
            >
              {{ cat.icon }} {{ cat.label }}（{{ cat.count }}題）
            </button>
          </div>
        </div>
      </div>

      <!-- 每題討論時間 -->
      <div class="bg-white rounded-2xl border border-yellow-200 p-5 mb-6">
        <h2 class="font-bold text-gray-700 mb-3">⏱️ 每題討論時間</h2>
        <div class="flex gap-3 flex-wrap">
          <button
            v-for="t in [60, 90, 120, 180]" :key="t"
            @click="discussTime = t"
            class="px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all"
            :class="discussTime === t
              ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
              : 'border-gray-200 text-gray-500 hover:border-yellow-300'"
          >
            {{ t }} 秒
          </button>
        </div>
      </div>

      <!-- 開始按鈕 -->
      <button
        @click="startDiscussion"
        :disabled="selectedCategories.length === 0"
        class="w-full py-4 rounded-2xl font-bold text-lg transition-all"
        :class="selectedCategories.length > 0
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      >
        開始討論（共 {{ actualCount }} 題）
      </button>
      <p v-if="selectedCategories.length === 0" class="text-center text-sm text-red-400 mt-2">請至少選擇一個類別</p>
    </div>

    <!-- 討論畫面 -->
    <div v-if="phase === 'question'" class="max-w-2xl mx-auto px-4 py-6">

      <!-- 進度與計時 -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-500">第 {{ currentIndex + 1 }} / {{ queue.length }} 題</span>
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold"
            :class="timeLeft <= 15 ? 'text-red-500' : 'text-yellow-600'">
            {{ timeLeft }}s
          </span>
          <span class="text-sm text-gray-400">討論時間</span>
        </div>
      </div>

      <!-- 進度條 -->
      <div class="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div class="h-full bg-yellow-400 rounded-full transition-all duration-1000"
          :style="{ width: (timeLeft / discussTime * 100) + '%' }"></div>
      </div>

      <!-- 題目卡片 -->
      <div class="bg-white rounded-2xl border-2 border-yellow-200 p-6 mb-5 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="currentQ.categoryColor">
            {{ currentQ.categoryLabel }}
          </span>
          <span class="text-xs text-gray-400">難度：{{ currentQ.difficulty }}</span>
          <span class="text-xs text-gray-400 ml-auto">相關角色：{{ currentQ.roles.join('、') }}</span>
        </div>
        <div class="text-4xl text-center mb-3">{{ currentQ.icon }}</div>
        <h2 class="text-xl font-bold text-gray-800 mb-3 text-center">{{ currentQ.title }}</h2>
        <p class="text-gray-600 text-sm leading-relaxed bg-yellow-50 rounded-xl p-4">{{ currentQ.scenario }}</p>
      </div>

      <!-- 選項 -->
      <div class="space-y-3 mb-6">
        <button
          v-for="opt in currentQ.options" :key="opt.key"
          @click="selectAnswer(opt.key)"
          class="w-full p-4 rounded-xl border-2 text-left transition-all text-sm font-medium"
          :class="getOptionClass(opt.key)"
        >
          <span class="font-bold mr-2">{{ opt.key }}.</span>{{ opt.text }}
        </button>
      </div>

      <!-- 揭曉按鈕 -->
      <button
        v-if="selectedAnswer && !showAnswer"
        @click="revealAnswer"
        class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all"
      >
        揭曉答案
      </button>

      <!-- 解說區 -->
      <div v-if="showAnswer" class="bg-white rounded-2xl border-2 border-green-200 p-5 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">{{ selectedAnswer === currentQ.answer ? '🎉' : '📚' }}</span>
          <h3 class="font-bold text-green-800">
            {{ selectedAnswer === currentQ.answer ? '答對了！' : `正確答案是 ${currentQ.answer}` }}
          </h3>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed">{{ currentQ.explanation }}</p>
      </div>

      <!-- 下一題 -->
      <button
        v-if="showAnswer"
        @click="nextQuestion"
        class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
      >
        {{ currentIndex + 1 < queue.length ? '下一題 →' : '查看結果' }}
      </button>
    </div>

    <!-- 結果畫面 -->
    <div v-if="phase === 'result'" class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl border border-green-200 p-6 text-center mb-6 shadow-sm">
        <div class="text-6xl mb-4">{{ scoreEmoji }}</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">討論結束！</h2>
        <p class="text-gray-500 mb-4">共 {{ queue.length }} 題</p>
        <div class="text-5xl font-bold text-green-600 mb-1">{{ correctCount }} / {{ queue.length }}</div>
        <p class="text-gray-500 text-sm">答對題數</p>
        <p class="text-lg font-medium text-gray-600 mt-2">{{ scoreMessage }}</p>
      </div>

      <!-- 答題回顧 -->
      <div class="space-y-3 mb-6">
        <div v-for="(rec, i) in history" :key="i"
          class="bg-white rounded-xl border p-4 flex gap-3 items-start"
          :class="rec.correct ? 'border-green-200' : 'border-red-200'">
          <span class="text-xl flex-shrink-0">{{ rec.correct ? '✅' : '❌' }}</span>
          <div>
            <div class="font-medium text-gray-800 text-sm">{{ rec.title }}</div>
            <div class="text-xs text-gray-500 mt-0.5">
              你選 <strong>{{ rec.selected }}</strong>，正解 <strong>{{ rec.answer }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button @click="resetToSetup" class="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl">
          重新設定
        </button>
        <router-link to="/" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-center">
          回首頁
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { scenarios, questionCountBySize, scenariosByCategory } from '../data/discussScenarios.js'

// 設定
const phase = ref('setup')
const selectedCount = ref(8)
const selectedCategories = ref(['weather', 'pest', 'disease', 'management'])
const discussTime = ref(90)

const categories = [
  { id: 'weather', label: '天氣', icon: '🌦️', activeClass: 'border-blue-400 bg-blue-50 text-blue-700', count: 8 },
  { id: 'pest', label: '蟲害', icon: '🐛', activeClass: 'border-red-400 bg-red-50 text-red-700', count: 6 },
  { id: 'disease', label: '病害', icon: '🍄', activeClass: 'border-purple-400 bg-purple-50 text-purple-700', count: 5 },
  { id: 'management', label: '管理', icon: '📋', activeClass: 'border-green-400 bg-green-50 text-green-700', count: 6 },
]

const toggleCategory = (id) => {
  const idx = selectedCategories.value.indexOf(id)
  if (idx >= 0) {
    if (selectedCategories.value.length > 1) selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(id)
  }
}

// 計算實際可出題數
const availableScenarios = computed(() =>
  scenarios.filter(s => selectedCategories.value.includes(s.category))
)
const actualCount = computed(() => Math.min(selectedCount.value, availableScenarios.value.length))

// 遊戲狀態
const queue = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const showAnswer = ref(false)
const history = ref([])
const timeLeft = ref(90)
let timer = null

const currentQ = computed(() => queue.value[currentIndex.value])

// 開始討論
const startDiscussion = () => {
  const pool = [...availableScenarios.value].sort(() => Math.random() - 0.5)
  queue.value = pool.slice(0, actualCount.value)
  currentIndex.value = 0
  selectedAnswer.value = null
  showAnswer.value = false
  history.value = []
  phase.value = 'question'
  startTimer()
}

const startTimer = () => {
  clearInterval(timer)
  timeLeft.value = discussTime.value
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const selectAnswer = (key) => {
  if (!showAnswer.value) selectedAnswer.value = key
}

const revealAnswer = () => {
  clearInterval(timer)
  showAnswer.value = true
  history.value.push({
    title: currentQ.value.title,
    selected: selectedAnswer.value,
    answer: currentQ.value.answer,
    correct: selectedAnswer.value === currentQ.value.answer,
  })
}

const nextQuestion = () => {
  if (currentIndex.value + 1 < queue.value.length) {
    currentIndex.value++
    selectedAnswer.value = null
    showAnswer.value = false
    startTimer()
  } else {
    phase.value = 'result'
  }
}

const getOptionClass = (key) => {
  if (!showAnswer.value) {
    return selectedAnswer.value === key
      ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
      : 'border-gray-200 hover:border-yellow-300 text-gray-700'
  }
  if (key === currentQ.value.answer) return 'border-green-400 bg-green-50 text-green-800'
  if (key === selectedAnswer.value) return 'border-red-400 bg-red-50 text-red-700'
  return 'border-gray-200 text-gray-400'
}

// 結果
const correctCount = computed(() => history.value.filter(h => h.correct).length)
const scoreEmoji = computed(() => {
  const rate = correctCount.value / queue.value.length
  if (rate >= 0.9) return '🏆'
  if (rate >= 0.7) return '🌟'
  if (rate >= 0.5) return '👍'
  return '📚'
})
const scoreMessage = computed(() => {
  const rate = correctCount.value / queue.value.length
  if (rate >= 0.9) return '太厲害了！你們是真正的茉莉花農場專家！'
  if (rate >= 0.7) return '做得很好！再多練習幾次會更上一層樓！'
  if (rate >= 0.5) return '不錯的開始，繼續學習教學內容加強知識！'
  return '多看看教學區的內容，然後再來挑戰一次吧！'
})

const resetToSetup = () => {
  clearInterval(timer)
  phase.value = 'setup'
}

onUnmounted(() => clearInterval(timer))
</script>
