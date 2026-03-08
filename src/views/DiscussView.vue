<template>
  <div class="discuss-container">
    <div class="discuss-bg"></div>
    
    <!-- ========== Setup Phase ========== -->
    <div v-if="phase === 'setup'" class="discuss-content">
      <!-- Header -->
      <div class="discuss-header">
        <router-link to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回首页</span>
        </router-link>
        <h1 class="discuss-title">
          <JasmineIcons name="discuss" :size="32" />
          <span>情境讨论模式</span>
        </h1>
        <p class="discuss-subtitle">小组共同讨论农场情境，找出最佳应对方案</p>
      </div>

      <!-- 配置面板 -->
      <div class="config-cards">
        <!-- 人数推荐 -->
        <div class="config-card">
          <div class="card-header">
            <span class="card-icon">👥</span>
            <h3>依学生人数选择题数</h3>
          </div>
          <div class="recommend-grid">
            <button
              v-for="rec in questionCountBySize" :key="rec.label"
              @click="selectedCount = rec.recommended"
              class="recommend-btn"
              :class="{ 'recommend-active': selectedCount === rec.recommended }"
            >
              <div class="recommend-label">{{ rec.label }}</div>
              <div class="recommend-value">推荐 {{ rec.recommended }} 题</div>
              <div class="recommend-desc">{{ rec.desc }}</div>
            </button>
          </div>
        </div>

        <!-- 自定义设置 -->
        <div class="config-card">
          <div class="card-header">
            <span class="card-icon">🎯</span>
            <h3>自定义题目数量与类别</h3>
          </div>
          
          <div class="count-selector">
            <span class="selector-label">总题数</span>
            <div class="selector-controls">
              <button @click="selectedCount = Math.max(3, selectedCount - 1)" class="count-btn">−</button>
              <AnimatedNumber :value="selectedCount" class="count-value" />
              <button @click="selectedCount = Math.min(25, selectedCount + 1)" class="count-btn">+</button>
            </div>
            <span class="selector-hint">最少3题，最多25题</span>
          </div>

          <div class="category-selector">
            <span class="selector-label">选择题目类别</span>
            <div class="category-grid">
              <button
                v-for="cat in categories" :key="cat.id"
                @click="toggleCategory(cat.id)"
                class="category-btn"
                :class="{ 'category-active': selectedCategories.includes(cat.id) }"
                :style="selectedCategories.includes(cat.id) ? { '--cat-color': cat.color } : {}"
              >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-label">{{ cat.label }}</span>
                <span class="cat-count">{{ cat.count }} 题</span>
                <span v-if="selectedCategories.includes(cat.id)" class="cat-check">✓</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 时间设置 -->
        <div class="config-card">
          <div class="card-header">
            <span class="card-icon">⏱️</span>
            <h3>每题讨论时间</h3>
          </div>
          <div class="time-options">
            <button
              v-for="t in [60, 90, 120, 180]" :key="t"
              @click="discussTime = t"
              class="time-btn"
              :class="{ 'time-active': discussTime === t }"
            >
              {{ t }} 秒
            </button>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="action-bar">
        <div class="action-stats">
          <div class="stat">
            <span class="stat-value">{{ actualCount }}</span>
            <span class="stat-label">题目总数</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">{{ discussTime }}s</span>
            <span class="stat-label">每题时间</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">~{{ Math.round(actualCount * discussTime / 60) }}分</span>
            <span class="stat-label">预计时长</span>
          </div>
        </div>
        <button
          @click="startDiscussion"
          :disabled="selectedCategories.length === 0"
          class="start-btn"
          :class="{ 'start-btn-disabled': selectedCategories.length === 0 }"
        >
          <span v-if="selectedCategories.length === 0">请至少选择一个类别</span>
          <span v-else>开始讨论 →</span>
        </button>
      </div>
    </div>

    <!-- ========== Question Phase ========== -->
    <div v-if="phase === 'question'" class="discuss-content">
      <!-- 进度条 -->
      <div class="question-progress">
        <div class="progress-info">
          <span>第 {{ currentIndex + 1 }} / {{ queue.length }} 题</span>
          <div class="timer-badge" :class="{ 'timer-warning': timeLeft <= 15 }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span class="timer-value">{{ timeLeft }}s</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: ((currentIndex) / queue.length * 100) + '%' }"></div>
        </div>
        <div class="time-bar">
          <div class="time-fill" :style="{ width: (timeLeft / discussTime * 100) + '%' }" :class="{ 'time-warning': timeLeft <= 15 }"></div>
        </div>
      </div>

      <!-- 题目卡片 -->
      <div class="question-card">
        <div class="question-header">
          <span class="question-category" :style="{ background: currentQ.categoryColor, color: 'white' }">
            {{ currentQ.categoryLabel }}
          </span>
          <span class="question-difficulty">难度：{{ currentQ.difficulty }}</span>
          <span class="question-roles">相关角色：{{ currentQ.roles.join('、') }}</span>
        </div>
        <div class="question-icon">{{ currentQ.icon }}</div>
        <h2 class="question-title">{{ currentQ.title }}</h2>
        <p class="question-scenario">{{ currentQ.scenario }}</p>
      </div>

      <!-- 选项 -->
      <div class="options-grid">
        <button
          v-for="opt in currentQ.options" :key="opt.key"
          @click="selectAnswer(opt.key)"
          class="option-card"
          :class="getOptionClass(opt.key)"
        >
          <span class="option-key">{{ opt.key }}</span>
          <span class="option-text">{{ opt.text }}</span>
        </button>
      </div>

      <!-- 揭晓按钮 -->
      <button
        v-if="selectedAnswer && !showAnswer"
        @click="revealAnswer"
        class="reveal-btn"
      >
        揭晓答案
      </button>

      <!-- 答案解析 -->
      <Transition name="fade-up">
        <div v-if="showAnswer" class="answer-panel">
          <div class="answer-result" :class="selectedAnswer === currentQ.answer ? 'result-correct' : 'result-wrong'">
            <div class="result-icon">{{ selectedAnswer === currentQ.answer ? '🎉' : '📚' }}</div>
            <h3>{{ selectedAnswer === currentQ.answer ? '答对了！' : `正确答案是 ${currentQ.answer}` }}</h3>
          </div>
          <p class="answer-explanation">{{ currentQ.explanation }}</p>
          
          <button @click="nextQuestion" class="next-btn">
            {{ currentIndex + 1 < queue.length ? '下一题 →' : '查看结果' }}
          </button>
        </div>
      </Transition>
    </div>

    <!-- ========== Result Phase ========== -->
    <div v-if="phase === 'result'" class="discuss-content">
      <div class="result-card">
        <div class="result-emoji">{{ scoreEmoji }}</div>
        <h2 class="result-title">讨论结束！</h2>
        <p class="result-subtitle">共 {{ queue.length }} 题</p>
        <div class="result-score">
          <AnimatedNumber :value="correctCount" class="score-number" />
          <span class="score-total">/ {{ queue.length }}</span>
        </div>
        <p class="result-label">答对题数</p>
        <p class="result-message">{{ scoreMessage }}</p>
      </div>

      <!-- 答题回顾 -->
      <div class="review-list">
        <div v-for="(rec, i) in history" :key="i" class="review-item" :class="rec.correct ? 'review-correct' : 'review-wrong'">
          <div class="review-status">
            <span class="status-icon">{{ rec.correct ? '✓' : '✕' }}</span>
          </div>
          <div class="review-content">
            <div class="review-title">{{ rec.title }}</div>
            <div class="review-meta">
              你选 <strong>{{ rec.selected }}</strong>，正解 <strong>{{ rec.answer }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="result-actions">
        <button @click="resetToSetup" class="restart-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
            <path d="M3 3v9h9"/>
          </svg>
          重新设定
        </button>
        <router-link to="/" class="home-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { scenarios, questionCountBySize } from '../data/discussScenarios.js'
import JasmineIcons from '../components/JasmineIcons.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'

// 设定
const phase = ref('setup')
const selectedCount = ref(8)
const selectedCategories = ref(['weather', 'pest', 'disease', 'management'])
const discussTime = ref(90)

const categories = [
  { id: 'weather', label: '天气', icon: '🌦️', color: '#3B82F6', count: 8 },
  { id: 'pest', label: '虫害', icon: '🐛', color: '#EF4444', count: 6 },
  { id: 'disease', label: '病害', icon: '🍄', color: '#8B5CF6', count: 5 },
  { id: 'management', label: '管理', icon: '📋', color: '#10B981', count: 6 },
]

const toggleCategory = (id) => {
  const idx = selectedCategories.value.indexOf(id)
  if (idx >= 0) {
    if (selectedCategories.value.length > 1) selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(id)
  }
}

// 计算实际可出题数
const availableScenarios = computed(() =>
  scenarios.filter(s => selectedCategories.value.includes(s.category))
)
const actualCount = computed(() => Math.min(selectedCount.value, availableScenarios.value.length))

// 游戏状态
const queue = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const showAnswer = ref(false)
const history = ref([])
const timeLeft = ref(90)
let timer = null

const currentQ = computed(() => queue.value[currentIndex.value])

// 开始讨论
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
      ? 'option-selected'
      : 'option-default'
  }
  if (key === currentQ.value.answer) return 'option-correct'
  if (key === selectedAnswer.value) return 'option-wrong'
  return 'option-disabled'
}

// 结果
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
  if (rate >= 0.9) return '太厉害了！你们是真正的茉莉花农场专家！'
  if (rate >= 0.7) return '做得很好！再多练习几次会更上一层楼！'
  if (rate >= 0.5) return '不错的开始，继续学习教学内容加强知识！'
  return '多看看教学区的内容，然后再来挑战一次吧！'
})

const resetToSetup = () => {
  clearInterval(timer)
  phase.value = 'setup'
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
@reference "tailwindcss";

.discuss-container {
  min-height: 100vh;
  background: #FDFBF7;
  position: relative;
}

.discuss-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse 100% 50% at 50% 0%, rgba(122, 155, 125, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 50% 100%, rgba(200, 178, 140, 0.05) 0%, transparent 50%),
    #FDFBF7;
  pointer-events: none;
}

.discuss-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* ========== Header ========== */
.discuss-header {
  margin-bottom: 32px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-bottom: 16px;
}

.back-link:hover {
  color: #374151;
}

.discuss-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.discuss-subtitle {
  font-size: 15px;
  color: #64748B;
}

/* ========== Config Cards ========== */
.config-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.config-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.card-icon {
  font-size: 20px;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

/* 推荐网格 */
.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.recommend-btn {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recommend-btn:hover {
  border-color: #CBD5E1;
  background: #F1F5F9;
}

.recommend-active {
  border-color: #C88F34;
  background: rgba(200, 143, 52, 0.08);
}

.recommend-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.recommend-value {
  font-size: 16px;
  font-weight: 700;
  color: #C88F34;
  margin-bottom: 2px;
}

.recommend-desc {
  font-size: 12px;
  color: #94A3B8;
}

/* 数量选择器 */
.count-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F1F5F9;
}

.selector-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.selector-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 18px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.count-value {
  font-size: 28px;
  font-weight: 700;
  color: #C88F34;
  min-width: 50px;
  text-align: center;
}

.selector-hint {
  font-size: 13px;
  color: #94A3B8;
}

/* 类别选择 */
.category-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.category-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.category-active {
  border-color: var(--cat-color, #C88F34);
  background: rgba(200, 143, 52, 0.05);
}

.cat-icon {
  font-size: 20px;
}

.cat-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  flex: 1;
}

.cat-count {
  font-size: 12px;
  color: #94A3B8;
}

.cat-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--cat-color, #C88F34);
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 时间选项 */
.time-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.time-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.time-active {
  border-color: #C88F34;
  background: rgba(200, 143, 52, 0.1);
  color: #C88F34;
}

/* ========== Action Bar ========== */
.action-bar {
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 16px 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.action-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #94A3B8;
  display: block;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #E2E8F0;
}

.start-btn {
  padding: 12px 28px;
  border-radius: 10px;
  background: #C88F34;
  color: white;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn:hover:not(:disabled) {
  background: #B07D2A;
  box-shadow: 0 4px 12px rgba(200, 143, 52, 0.3);
}

.start-btn-disabled {
  background: #E2E8F0;
  color: #94A3B8;
  cursor: not-allowed;
}

/* ========== Question Phase ========== */
.question-progress {
  margin-bottom: 24px;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #64748B;
}

.timer-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #F1F5F9;
  font-weight: 600;
  color: #5B7A5E;
}

.timer-warning {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.timer-value {
  font-family: 'SF Mono', monospace;
  font-size: 15px;
}

.progress-bar {
  height: 4px;
  background: #E2E8F0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: #5B7A5E;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.time-bar {
  height: 3px;
  background: #F1F5F9;
  border-radius: 2px;
  overflow: hidden;
}

.time-fill {
  height: 100%;
  background: #C88F34;
  border-radius: 2px;
  transition: width 1s linear;
}

.time-warning {
  background: #EF4444;
}

/* Question Card */
.question-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  padding: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.question-category {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.question-difficulty,
.question-roles {
  font-size: 13px;
  color: #94A3B8;
}

.question-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.question-title {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 16px;
  line-height: 1.4;
}

.question-scenario {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
  background: #F8FAFC;
  padding: 16px;
  border-radius: 12px;
  text-align: left;
}

/* Options */
.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

@media (min-width: 640px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.option-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-radius: 12px;
  border: 2px solid #E2E8F0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.option-card:hover:not(.option-correct):not(.option-wrong):not(.option-disabled) {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.option-default {
  border-color: #E2E8F0;
}

.option-selected {
  border-color: #C88F34;
  background: rgba(200, 143, 52, 0.05);
}

.option-correct {
  border-color: #22C55E;
  background: rgba(34, 197, 94, 0.05);
}

.option-wrong {
  border-color: #EF4444;
  background: rgba(239, 68, 68, 0.05);
}

.option-disabled {
  border-color: #F1F5F9;
  background: #F8FAFC;
  opacity: 0.6;
  cursor: default;
}

.option-key {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #64748B;
  flex-shrink: 0;
}

.option-selected .option-key,
.option-correct .option-key {
  background: currentColor;
  color: white;
}

.option-text {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
}

/* Reveal Button */
.reveal-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: #D4704A;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}

.reveal-btn:hover {
  background: #C05A3A;
  box-shadow: 0 4px 12px rgba(212, 112, 74, 0.3);
}

/* Answer Panel */
.answer-panel {
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  margin-top: 20px;
}

.answer-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.result-correct {
  background: rgba(34, 197, 94, 0.08);
}

.result-wrong {
  background: rgba(239, 68, 68, 0.08);
}

.result-icon {
  font-size: 28px;
}

.answer-result h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
}

.answer-explanation {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
  margin-bottom: 20px;
}

.next-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  background: #5B7A5E;
  color: white;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-btn:hover {
  background: #4A6350;
}

/* ========== Result Phase ========== */
.result-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  padding: 40px;
  text-align: center;
  margin-bottom: 24px;
}

.result-emoji {
  font-size: 64px;
  margin-bottom: 16px;
}

.result-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.result-subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 24px;
}

.result-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 8px;
}

.score-number {
  font-size: 56px;
  font-weight: 800;
  color: #5B7A5E;
}

.score-total {
  font-size: 24px;
  font-weight: 600;
  color: #94A3B8;
}

.result-label {
  font-size: 14px;
  color: #64748B;
  margin-bottom: 16px;
}

.result-message {
  font-size: 15px;
  color: #374151;
  background: #F8FAFC;
  padding: 12px 20px;
  border-radius: 10px;
}

/* Review List */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.review-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  background: white;
  border: 1px solid #E2E8F0;
}

.review-correct {
  border-color: #22C55E;
  background: rgba(34, 197, 94, 0.03);
}

.review-wrong {
  border-color: #EF4444;
  background: rgba(239, 68, 68, 0.03);
}

.review-status {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.review-correct .review-status {
  background: #22C55E;
  color: white;
}

.review-wrong .review-status {
  background: #EF4444;
  color: white;
}

.review-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.review-meta {
  font-size: 12px;
  color: #94A3B8;
}

.review-meta strong {
  color: #64748B;
}

/* Result Actions */
.result-actions {
  display: flex;
  gap: 12px;
}

.restart-btn,
.home-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.restart-btn {
  background: #C88F34;
  color: white;
  border: none;
}

.restart-btn:hover {
  background: #B07D2A;
}

.home-btn {
  background: #F1F5F9;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.home-btn:hover {
  background: #E2E8F0;
  color: #374151;
}

/* Transitions */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 640px) {
  .recommend-grid {
    grid-template-columns: 1fr;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-stats {
    justify-content: center;
  }
}
</style>
