<template>
  <div class="screen-container">
    <!-- 背景效果 -->
    <div class="screen-bg"></div>

    <!-- 未连接 / 等待状态 -->
    <div v-if="!connected || phase === 'no_session'" class="screen-center">
      <div class="connection-icon">
        <JasmineIcons name="jasmine" :size="120" />
      </div>
      <h1 class="screen-title">茉莉花农场竞赛</h1>
      <p class="connection-status">{{ connected ? '等待老师创建场次...' : '连接中...' }}</p>
      
      <!-- 手动输入房间代码 -->
      <div v-if="connected && !roomCode" class="manual-connect">
        <input v-model="roomCodeInput"
          @input="roomCodeInput = roomCodeInput.toUpperCase()"
          maxlength="6"
          placeholder="输入房间代码"
          class="room-input" />
        <button @click="connectWithCode(roomCodeInput)"
          :disabled="roomCodeInput.length < 6"
          class="connect-btn">
          连接
        </button>
      </div>
    </div>

    <!-- 大厅状态 -->
    <div v-else-if="phase === 'lobby'" class="screen-full">
      <div class="lobby-header">
        <div class="lobby-icon">
          <JasmineIcons name="jasmine" :size="100" />
        </div>
        <h1 class="lobby-title">茉莉花农场竞赛</h1>
      </div>

      <div class="room-display" v-if="roomCode">
        <p class="room-label">房间代码</p>
        <div class="room-code-large">{{ roomCode }}</div>
        <div class="room-urls">
          <p class="url-hint">打开浏览器访问</p>
          <div v-for="u in gameUrls" :key="u" class="url-chip">
            {{ u }}
          </div>
        </div>
        <p v-if="isLocalhost" class="localhost-notice">
          建议使用局域网 IP 链接，localhost 学生可能无法访问
        </p>
      </div>

      <!-- 已加入队伍 -->
      <div v-if="teams.length > 0" class="teams-showcase">
        <div class="teams-grid">
          <div v-for="team in teams" :key="team.teamId" class="team-card">
            <div class="team-avatar-large">{{ team.teamName.charAt(0) }}</div>
            <span class="team-name-large">{{ team.teamName }}</span>
          </div>
        </div>
        <p class="teams-count">{{ teams.length }} 支队伍已加入</p>
      </div>
    </div>

    <!-- 答题状态 -->
    <div v-else-if="phase === 'question'" class="screen-full question-mode">
      <!-- 顶部信息 -->
      <div class="question-header">
        <div class="header-left">
          <span class="q-indicator">第 {{ currentIndex + 1 }} / {{ total }} 题</span>
          <div class="q-progress">
            <div class="q-progress-fill" :style="{ width: (currentIndex / total * 100) + '%' }"></div>
          </div>
        </div>
        <div class="header-right">
          <span class="room-tag">房间：{{ roomCode }}</span>
        </div>
      </div>

      <!-- 倒计时 -->
      <div class="countdown-section">
        <div class="countdown-card" :class="{ 'countdown-warning': timeIsLow && timeLeftSec > 0, 'countdown-ended': timeLeftSec === 0 }">
          <div class="countdown-value">
            <AnimatedNumber :value="timeLeftSec" />
          </div>
          <div class="countdown-info">
            <div class="countdown-label">倒数（秒）</div>
            <div v-if="timeIsLow && timeLeftSec > 0" class="countdown-hint">
              {{ questionHint }}
            </div>
            <div v-else-if="timeLeftSec === 0" class="countdown-hint ended">
              时间到
            </div>
          </div>
        </div>
      </div>

      <!-- 题目 -->
      <div class="question-display">
        <div class="q-meta-bar">
          <span class="q-icon-large">{{ currentQuestion?.icon }}</span>
          <span class="q-category">{{ currentQuestion?.categoryLabel }}</span>
          <span class="q-difficulty">{{ currentQuestion?.difficulty }}难度</span>
        </div>
        <h2 class="q-title-large">{{ currentQuestion?.title }}</h2>
        <p class="q-scenario-large">{{ currentQuestion?.scenario }}</p>
      </div>

      <!-- 作答进度 -->
      <div class="answer-progress-section">
        <div class="progress-stats">
          <span class="stats-label">已作答</span>
          <span class="stats-value">
            <AnimatedNumber :value="answeredCount" /> / {{ teams.length }} 队
          </span>
        </div>
        <div class="team-status-grid">
          <div v-for="(team, i) in teams" :key="team.teamId"
            class="status-card"
            :class="{ 'status-answered': i < answeredCount }">
            <div class="status-avatar">{{ team.teamName.charAt(0) }}</div>
            <span class="status-name">{{ team.teamName }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 揭晓状态 -->
    <div v-else-if="phase === 'revealed'" class="screen-full revealed-mode">
      <div class="revealed-header">
        <span class="revealed-indicator">第 {{ currentIndex + 1 }} / {{ total }} 题 — 揭晓</span>
      </div>

      <!-- 题目与答案 -->
      <div class="revealed-question">
        <h2 class="rq-title">{{ currentQuestion?.title }}</h2>
        <div class="rq-answer-box">
          <span class="answer-badge">正确答案</span>
          <span class="answer-value">{{ correctAnswer }}</span>
        </div>
        <p class="rq-explanation">{{ explanation }}</p>
      </div>

      <!-- 次佳答案 -->
      <div v-if="partialAnswer && partialExplanation" class="partial-box">
        <span class="partial-badge">次佳答案（1分）</span>
        <span class="partial-answer">{{ partialAnswer }}. {{ partialText }}</span>
        <p class="partial-explanation">{{ partialExplanation }}</p>
      </div>

      <!-- 积分榜 -->
      <div class="scoreboard-section">
        <h3 class="scoreboard-header">当前积分榜</h3>
        <div class="scoreboard-list">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="scoreboard-row"
            :class="{ 'top-three': i < 3 }">
            <span class="row-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 }}</span>
            <div class="row-info">
              <span class="row-name">{{ team.teamName }}</span>
              <div class="row-bar-bg">
                <div class="row-bar" :style="{ width: maxScore > 0 ? (team.totalScore / maxScore * 100) + '%' : '0%' }"></div>
              </div>
            </div>
            <AnimatedNumber :value="team.totalScore" suffix=" 分" class="row-score" />
          </div>
        </div>
      </div>
    </div>

    <!-- 结束状态 -->
    <div v-else-if="phase === 'ended'" class="screen-full ended-mode">
      <div class="ended-hero">
        <div class="ended-trophy">🏆</div>
        <h1 class="ended-title-large">最终排名</h1>
      </div>

      <div class="final-podium">
        <div v-for="(team, i) in teamScores.slice(0, 3)" :key="team.teamId"
          class="podium-place"
          :class="`place-${i + 1}`">
          <div class="podium-avatar">{{ team.teamName.charAt(0) }}</div>
          <span class="podium-name">{{ team.teamName }}</span>
          <AnimatedNumber :value="team.totalScore" suffix=" 分" class="podium-score" />
        </div>
      </div>

      <div class="final-list">
        <div v-for="(team, i) in teamScores.slice(3)" :key="team.teamId"
          class="final-list-item">
          <span class="list-rank">{{ i + 4 }}</span>
          <span class="list-name">{{ team.teamName }}</span>
          <span class="list-score">{{ team.totalScore }} 分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocket } from '../composables/useSocket.js'
import JasmineIcons from '../components/JasmineIcons.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'

const { socket, connected } = useSocket()

const phase = ref('no_session')
const roomCode = ref('')
const roomCodeInput = ref('')
let retryInterval = null
const teams = ref([])
const teamScores = ref([])
const currentIndex = ref(0)
const total = ref(0)
const currentQuestion = ref(null)
const correctAnswer = ref('')
const explanation = ref('')
const partialAnswer = ref(null)
const partialText = ref(null)
const partialExplanation = ref(null)
const answeredCount = ref(0)
const questionEndsAt = ref(null)
const nowMs = ref(Date.now())
let timerInterval = null

const lanIps = ref([])
const isLocalhost = computed(() => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const baseOrigins = computed(() => {
  if (!isLocalhost.value) return [window.location.origin]
  const port = window.location.port ? `:${window.location.port}` : ''
  const proto = window.location.protocol
  const candidates = lanIps.value.map(ip => `${proto}//${ip}${port}`)
  return candidates.length > 0 ? candidates : [window.location.origin]
})
const gameUrls = computed(() => baseOrigins.value.map(o => o + '/game'))
const maxScore = computed(() => Math.max(...teamScores.value.map(t => t.totalScore), 1))

const timeLeftSec = computed(() => {
  if (!questionEndsAt.value) return 60
  const left = Math.ceil((questionEndsAt.value - nowMs.value) / 1000)
  return Math.max(0, left)
})

const timeIsLow = computed(() => timeLeftSec.value <= 15)

const questionHint = computed(() => {
  return currentQuestion.value?.hint15s || (currentQuestion.value?.roles?.join('／') || '注意「顺序」与「时机」')
})

function startTimer() {
  if (timerInterval) return
  timerInterval = setInterval(() => {
    nowMs.value = Date.now()
  }, 250)
}

function stopTimerTick() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function connectWithCode(rc) {
  roomCode.value = rc.toUpperCase()
  socket.emit('screen:get_state', { roomCode: rc })
}

function startRetry() {
  if (retryInterval || !roomCode.value) return
  retryInterval = setInterval(() => {
    socket.emit('screen:get_state', { roomCode: roomCode.value })
  }, 3000)
}

function stopRetry() {
  if (retryInterval) {
    clearInterval(retryInterval)
    retryInterval = null
  }
}

// Socket listeners
socket.on('screen:state', (data) => {
  stopRetry()
  phase.value = data.phase === 'lobby' ? 'lobby' : data.phase
  roomCode.value = data.roomCode
  teams.value = data.teams || []
  teamScores.value = data.teams?.sort((a, b) => b.totalScore - a.totalScore) || []
  currentIndex.value = data.currentIndex
  total.value = data.total
  answeredCount.value = data.answeredCount || 0
  questionEndsAt.value = data.questionEndsAt || null
  nowMs.value = Date.now()
  if (phase.value === 'question') startTimer()
  else stopTimerTick()
})

socket.on('screen:no_session', () => {
  phase.value = 'no_session'
  startRetry()
})

socket.on('screen:teams_updated', (data) => {
  teams.value = data.teams
})

socket.on('admin:team_joined', (data) => {
  if (!teams.value.find(t => t.teamId === data.teamId)) {
    teams.value.push({ teamId: data.teamId, teamName: data.teamName })
  }
})

socket.on('game:question_started', (data) => {
  phase.value = 'question'
  currentIndex.value = data.questionIndex
  total.value = data.total
  currentQuestion.value = data.question
  answeredCount.value = 0
  correctAnswer.value = ''
  explanation.value = ''
  questionEndsAt.value = data.questionEndsAt || null
  nowMs.value = Date.now()
  startTimer()
})

socket.on('screen:answer_progress', (data) => {
  answeredCount.value = data.answeredCount
})

socket.on('game:answer_revealed', (data) => {
  phase.value = 'revealed'
  correctAnswer.value = data.correctAnswer
  explanation.value = data.explanation
  partialAnswer.value = data.partialAnswer
  partialText.value = data.partialText
  partialExplanation.value = data.partialExplanation
  teamScores.value = data.teamScores
  stopTimerTick()
})

socket.on('game:session_ended', (data) => {
  phase.value = 'ended'
  teamScores.value = data.finalScores
  stopTimerTick()
})

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const rc = params.get('room')
  if (rc) {
    connectWithCode(rc)
  }
  fetch('/api/lan')
    .then(r => r.ok ? r.json() : null)
    .then(data => { lanIps.value = data?.ips || [] })
    .catch(() => { lanIps.value = [] })
})

onUnmounted(() => {
  stopRetry()
  stopTimerTick()
  socket.off('screen:state')
  socket.off('screen:no_session')
  socket.off('screen:teams_updated')
  socket.off('admin:team_joined')
  socket.off('game:question_started')
  socket.off('screen:answer_progress')
  socket.off('game:answer_revealed')
  socket.off('game:session_ended')
})
</script>

<style scoped>
@reference "tailwindcss";

.screen-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2D3A2E 0%, #1E2A20 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.screen-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(122, 155, 125, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(200, 178, 140, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

/* ========== Center Layout ========== */
.screen-center {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.connection-icon {
  margin-bottom: 32px;
  animation: gentle-float 3s ease-in-out infinite;
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.screen-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.connection-status {
  font-size: 20px;
  color: #94A3B8;
  margin-bottom: 32px;
}

/* Manual Connect */
.manual-connect {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.room-input {
  padding: 16px 24px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 24px;
  font-family: 'SF Mono', monospace;
  text-align: center;
  letter-spacing: 0.15em;
  width: 200px;
  outline: none;
  transition: border-color 0.2s ease;
}

.room-input:focus {
  border-color: #FBBF24;
}

.room-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.connect-btn {
  padding: 16px 32px;
  border-radius: 12px;
  background: #FBBF24;
  color: #0F172A;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-btn:hover:not(:disabled) {
  background: #F59E0B;
  transform: translateY(-2px);
}

.connect-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

/* ========== Full Screen Layout ========== */
.screen-full {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

/* ========== Lobby Mode ========== */
.lobby-header {
  text-align: center;
  margin-bottom: 48px;
}

.lobby-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.lobby-title {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.room-display {
  text-align: center;
  margin-bottom: 48px;
}

.room-label {
  font-size: 18px;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 16px;
}

.room-code-large {
  font-size: 120px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: #FBBF24;
  text-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
  margin-bottom: 32px;
}

.room-urls {
  margin-bottom: 16px;
}

.url-hint {
  font-size: 16px;
  color: #64748B;
  margin-bottom: 12px;
}

.url-chip {
  display: inline-block;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: 'SF Mono', monospace;
  font-size: 16px;
  color: #CBD5E1;
  margin: 4px;
}

.localhost-notice {
  font-size: 14px;
  color: #F59E0B;
  background: rgba(245, 158, 11, 0.1);
  padding: 10px 16px;
  border-radius: 8px;
  display: inline-block;
}

/* Teams Showcase */
.teams-showcase {
  margin-top: auto;
  text-align: center;
}

.teams-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 24px;
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slide-up 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.team-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B7A5E, #7A9B7D);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
}

.team-name-large {
  font-size: 20px;
  font-weight: 600;
}

.teams-count {
  font-size: 18px;
  color: #94A3B8;
}

/* ========== Question Mode ========== */
.question-mode {
  padding: 32px 48px;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-left {
  flex: 1;
}

.q-indicator {
  display: block;
  font-size: 18px;
  color: #94A3B8;
  margin-bottom: 8px;
}

.q-progress {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.q-progress-fill {
  height: 100%;
  background: #5B7A5E;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.header-right {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.room-tag {
  font-size: 16px;
  color: #CBD5E1;
}

/* Countdown */
.countdown-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.countdown-card {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  border: 2px solid rgba(251, 191, 36, 0.3);
  backdrop-filter: blur(10px);
}

.countdown-warning {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.15);
}

.countdown-ended {
  border-color: rgba(148, 163, 184, 0.3);
  background: rgba(148, 163, 184, 0.1);
}

.countdown-value {
  font-size: 96px;
  font-weight: 900;
  color: #FBBF24;
  font-family: 'SF Mono', monospace;
  line-height: 1;
}

.countdown-warning .countdown-value {
  color: #EF4444;
}

.countdown-info {
  text-align: left;
}

.countdown-label {
  font-size: 20px;
  color: #CBD5E1;
  margin-bottom: 8px;
}

.countdown-hint {
  font-size: 24px;
  font-weight: 700;
  color: #FBBF24;
}

.countdown-hint.ended {
  color: #94A3B8;
}

.countdown-warning .countdown-hint {
  color: #EF4444;
}

/* Question Display */
.question-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 48px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.q-meta-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.q-icon-large {
  font-size: 64px;
}

.q-category {
  padding: 8px 16px;
  background: rgba(91, 122, 94, 0.3);
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
}

.q-difficulty {
  font-size: 16px;
  color: #94A3B8;
}

.q-title-large {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.3;
  max-width: 900px;
}

.q-scenario-large {
  font-size: 24px;
  color: #CBD5E1;
  line-height: 1.6;
  max-width: 1000px;
}

/* Answer Progress */
.answer-progress-section {
  margin-top: auto;
}

.progress-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.stats-label {
  font-size: 18px;
  color: #94A3B8;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.team-status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.status-answered {
  background: rgba(34, 197, 94, 0.2);
  border-color: #22C55E;
}

.status-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.status-answered .status-avatar {
  background: #22C55E;
}

.status-name {
  font-size: 18px;
  font-weight: 600;
}

/* ========== Revealed Mode ========== */
.revealed-mode {
  padding: 40px 48px;
}

.revealed-header {
  text-align: center;
  margin-bottom: 32px;
}

.revealed-indicator {
  font-size: 18px;
  color: #94A3B8;
}

.revealed-question {
  text-align: center;
  margin-bottom: 32px;
}

.rq-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 24px;
}

.rq-answer-box {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 48px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 20px;
  border: 2px solid #22C55E;
  margin-bottom: 24px;
}

.answer-badge {
  font-size: 14px;
  font-weight: 600;
  color: #22C55E;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.answer-value {
  font-size: 42px;
  font-weight: 800;
  color: #4ADE80;
}

.rq-explanation {
  font-size: 22px;
  color: #CBD5E1;
  line-height: 1.6;
  max-width: 1000px;
  margin: 0 auto;
}

/* Partial Box */
.partial-box {
  max-width: 800px;
  margin: 0 auto 32px;
  padding: 24px;
  background: rgba(234, 179, 8, 0.15);
  border-radius: 16px;
  border: 1px solid rgba(234, 179, 8, 0.3);
  text-align: center;
}

.partial-badge {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #FBBF24;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.partial-answer {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #FCD34D;
  margin-bottom: 12px;
}

.partial-explanation {
  font-size: 18px;
  color: #FDE68A;
  line-height: 1.5;
}

/* Scoreboard */
.scoreboard-section {
  margin-top: auto;
}

.scoreboard-header {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: #94A3B8;
}

.scoreboard-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scoreboard-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scoreboard-row.top-three {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
}

.row-rank {
  width: 50px;
  font-size: 32px;
  text-align: center;
}

.row-info {
  flex: 1;
}

.row-name {
  display: block;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}

.row-bar-bg {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.row-bar {
  height: 100%;
  background: linear-gradient(90deg, #5B7A5E, #7A9B7D);
  border-radius: 4px;
  transition: width 1s ease;
}

.row-score {
  font-size: 28px;
  font-weight: 800;
  color: #FBBF24;
  min-width: 100px;
  text-align: right;
}

/* ========== Ended Mode ========== */
.ended-mode {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ended-hero {
  text-align: center;
  margin-bottom: 48px;
}

.ended-trophy {
  font-size: 100px;
  margin-bottom: 16px;
}

.ended-title-large {
  font-size: 48px;
  font-weight: 800;
}

/* Podium */
.final-podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  margin-bottom: 48px;
}

.podium-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.place-1 {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.2));
  border-color: #FBBF24;
  transform: scale(1.1);
  order: 2;
}

.place-2 {
  background: rgba(148, 163, 184, 0.2);
  border-color: #94A3B8;
  order: 1;
}

.place-3 {
  background: rgba(180, 83, 9, 0.2);
  border-color: #B45309;
  order: 3;
}

.podium-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.place-1 .podium-avatar {
  background: #FBBF24;
  color: #0F172A;
}

.podium-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.podium-score {
  font-size: 32px;
  font-weight: 800;
  color: #FBBF24;
}

/* Final List */
.final-list {
  width: 100%;
  max-width: 600px;
}

.final-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 8px;
}

.list-rank {
  width: 40px;
  font-size: 20px;
  font-weight: 700;
  color: #94A3B8;
  text-align: center;
}

.list-name {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
}

.list-score {
  font-size: 20px;
  font-weight: 700;
  color: #FBBF24;
}
</style>
