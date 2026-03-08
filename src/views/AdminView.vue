<template>
  <div class="admin-container">
    <!-- 背景 -->
    <div class="admin-bg"></div>
    
    <!-- ========== Setup Phase ========== -->
    <div v-if="phase === 'setup'" class="admin-content">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-icon">
          <JasmineIcons name="admin" :size="32" />
        </div>
        <div class="header-text">
          <h1 class="header-title">主持人控制台</h1>
          <p class="header-subtitle">创建并管理竞赛场次</p>
        </div>
      </div>

      <!-- 四大支柱导航 -->
      <div class="pillars-grid">
        <div v-for="pillar in pillars" :key="pillar.key" 
             class="pillar-card"
             :class="{ 'pillar-active': activePillar === pillar.key }"
             @click="activePillar = pillar.key">
          <div class="pillar-icon" :style="{ color: pillar.color }">
            {{ pillar.icon }}
          </div>
          <div class="pillar-content">
            <h3 class="pillar-title">{{ pillar.title }}</h3>
            <p class="pillar-desc">{{ pillar.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 配置面板 -->
      <div class="config-panel">
        <div class="panel-header">
          <span class="panel-badge">配置</span>
          <h2 class="panel-title">竞赛设置</h2>
        </div>

        <!-- 题数选择 -->
        <div class="config-section">
          <label class="config-label">
            <span class="label-icon">📊</span>
            题目数量
          </label>
          <div class="config-options">
            <button v-for="n in [4, 6, 8, 10, 12]" :key="n"
              @click="questionCount = n"
              class="option-btn"
              :class="{ 'option-active': questionCount === n }">
              {{ n }}
            </button>
          </div>
        </div>

        <!-- 类别选择 -->
        <div class="config-section">
          <label class="config-label">
            <span class="label-icon">🏷️</span>
            题目类别 <span class="label-hint">（不选 = 全部）</span>
          </label>
          <div class="config-options">
            <button v-for="cat in categories" :key="cat.key"
              @click="toggleCat(cat.key)"
              class="option-btn option-cat"
              :class="{ 'option-active': selectedCats.includes(cat.key) }">
              {{ cat.icon }} {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- 统计预览 -->
        <div class="stats-preview">
          <div class="stat-item">
            <AnimatedNumber :value="questionCount" suffix=" 题" class="stat-value" />
            <span class="stat-label">题目数量</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <AnimatedNumber :value="selectedCats.length || 4" suffix=" 类" class="stat-value" />
            <span class="stat-label">题目类别</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">~{{ questionCount * 8 }} 分</span>
            <span class="stat-label">预计时长</span>
          </div>
        </div>

        <button @click="createSession" class="create-btn">
          <span class="btn-icon">🚀</span>
          创建竞赛场次
        </button>
      </div>
    </div>

    <!-- ========== Lobby Phase ========== -->
    <div v-else-if="phase === 'lobby'" class="admin-content">
      <div class="phase-header">
        <button @click="cancelSession" class="back-btn">
          <span>←</span> 返回设置
        </button>
        <span class="session-id">场次 {{ sessionId?.slice(-6) }}</span>
      </div>

      <!-- 房间代码展示 -->
      <div class="room-code-card">
        <div class="room-label">房间代码</div>
        <div class="room-code">{{ roomCode }}</div>
        <p class="room-hint">学生输入此代码加入竞赛</p>
        
        <div class="room-urls">
          <div v-for="u in gameUrls" :key="u" class="url-item">
            <span class="url-icon">🔗</span>
            <code class="url-text">{{ u }}</code>
          </div>
        </div>
        <p v-if="isLocalhost" class="localhost-warning">
          ⚠️ 建议使用局域网 IP 链接，localhost 学生可能无法访问
        </p>
      </div>

      <!-- 队伍统计仪表板 -->
      <div class="dashboard-grid">
        <!-- 已加入队伍 -->
        <div class="dashboard-card">
          <div class="card-header">
            <span class="card-icon">👥</span>
            <h3>已加入队伍</h3>
            <span class="card-badge">{{ teams.length }}/6</span>
          </div>
          <div class="teams-grid">
            <div v-for="team in teams" :key="team.teamId" class="team-item">
              <div class="team-avatar">{{ team.teamName.charAt(0) }}</div>
              <span class="team-name">{{ team.teamName }}</span>
            </div>
            <div v-for="n in (6 - teams.length)" :key="n" class="team-item team-empty">
              <div class="team-avatar team-avatar-empty">?</div>
              <span class="team-name">等待加入</span>
            </div>
          </div>
        </div>

        <!-- 实时统计 -->
        <div class="dashboard-card">
          <div class="card-header">
            <span class="card-icon">📈</span>
            <h3>实时统计</h3>
          </div>
          <div class="mini-stats">
            <div class="mini-stat">
              <AnimatedNumber :value="teams.length" class="mini-value" />
              <span class="mini-label">队伍数</span>
            </div>
            <div class="mini-stat">
              <AnimatedNumber :value="questionCount" class="mini-value" />
              <span class="mini-label">题目数</span>
            </div>
            <div class="mini-stat">
              <span class="mini-value">准备中</span>
              <span class="mini-label">状态</span>
            </div>
          </div>
        </div>
      </div>

      <button @click="startQuestion" :disabled="teams.length === 0" class="start-btn">
        <span v-if="teams.length === 0">等待队伍加入...</span>
        <span v-else>开始第 1 题 →</span>
      </button>
    </div>

    <!-- ========== Question Phase ========== -->
    <div v-else-if="phase === 'question'" class="admin-content">
      <div class="phase-header">
        <button @click="backToLobby" class="back-btn">
          <span>←</span> 返回大厅
        </button>
        <div class="progress-indicator">
          <span>第 {{ currentIndex + 1 }} / {{ questionTotal }} 题</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questionTotal * 100) + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 题目卡片 -->
      <div class="question-card">
        <div class="question-meta">
          <span class="question-category">{{ currentQuestion?.categoryLabel }}</span>
          <span class="question-difficulty">{{ currentQuestion?.difficulty }}难度</span>
        </div>
        <h2 class="question-title">{{ currentQuestion?.title }}</h2>
        <p class="question-scenario">{{ currentQuestion?.scenario }}</p>
      </div>

      <!-- 作答状态仪表板 -->
      <div class="answer-dashboard">
        <div class="answer-header">
          <h3>作答状态</h3>
          <div class="answer-count">
            <AnimatedNumber :value="answeredCount" />
            <span>/ {{ teams.length }} 队已提交</span>
          </div>
        </div>
        
        <div class="answer-progress">
          <div class="answer-bar">
            <div class="answer-fill" :style="{ width: (answeredCount / teams.length * 100) + '%' }"></div>
          </div>
          <div class="team-status-list">
            <div v-for="team in teams" :key="team.teamId" 
                 class="team-status"
                 :class="{ 'status-answered': answeredTeams.has(team.teamId) }">
              <span class="status-dot"></span>
              <span class="status-name">{{ team.teamName }}</span>
              <span class="status-icon">{{ answeredTeams.has(team.teamId) ? '✓' : '○' }}</span>
            </div>
          </div>
        </div>
      </div>

      <button @click="revealAnswer" class="reveal-btn">
        揭晓答案 →
      </button>
    </div>

    <!-- ========== Revealed Phase ========== -->
    <div v-else-if="phase === 'revealed'" class="admin-content">
      <div class="phase-header centered">
        <span class="phase-badge">第 {{ currentIndex + 1 }} / {{ questionTotal }} 题</span>
      </div>

      <!-- 答案解析 -->
      <div class="answer-reveal-card">
        <div class="reveal-section correct">
          <div class="reveal-badge">正确答案</div>
          <div class="reveal-answer">{{ correctAnswer }}</div>
          <p class="reveal-explanation">{{ explanation }}</p>
        </div>
        
        <div v-if="partialAnswer" class="reveal-section partial">
          <div class="reveal-badge">次佳答案 (+1分)</div>
          <div class="reveal-answer">{{ partialAnswer }}. {{ partialText }}</div>
          <p class="reveal-explanation">{{ partialExplanation }}</p>
        </div>
      </div>

      <!-- 积分榜 -->
      <div class="scoreboard-card">
        <h3 class="scoreboard-title">
          <span>🏆</span> 当前积分
        </h3>
        <div class="score-list">
          <div v-for="(team, i) in teamScores" :key="team.teamId" class="score-item" :class="{ 'top-three': i < 3 }">
            <div class="score-rank">
              <span v-if="i === 0">🥇</span>
              <span v-else-if="i === 1">🥈</span>
              <span v-else-if="i === 2">🥉</span>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div class="score-info">
              <span class="score-name">{{ team.teamName }}</span>
              <div class="score-bar-bg">
                <div class="score-bar" :style="{ width: maxScore > 0 ? (team.totalScore / maxScore * 100) + '%' : '0%' }"></div>
              </div>
            </div>
            <AnimatedNumber :value="team.totalScore" suffix=" 分" class="score-value" />
          </div>
        </div>
      </div>

      <div class="action-bar">
        <button v-if="currentIndex + 1 < questionTotal" @click="nextQuestion" class="next-btn">
          下一题 →
        </button>
        <button @click="endSession" class="end-btn" :class="{ 'end-btn-primary': currentIndex + 1 >= questionTotal }">
          {{ currentIndex + 1 < questionTotal ? '提前结束' : '公布最终结果' }}
        </button>
      </div>
    </div>

    <!-- ========== Ended Phase ========== -->
    <div v-else-if="phase === 'ended'" class="admin-content">
      <div class="final-header">
        <h1 class="final-title">🏆 最终结果</h1>
        <p class="final-subtitle">竞赛结束，恭喜所有参赛队伍</p>
      </div>

      <div class="podium">
        <div v-for="(team, i) in teamScores.slice(0, 3)" :key="team.teamId" 
             class="podium-item"
             :class="`podium-${i + 1}`">
          <div class="podium-rank">{{ i + 1 }}</div>
          <div class="podium-team">{{ team.teamName }}</div>
          <div class="podium-score">
            <AnimatedNumber :value="team.totalScore" suffix=" 分" />
          </div>
        </div>
      </div>

      <div class="final-scores">
        <div v-for="(team, i) in teamScores" :key="team.teamId" class="final-score-item">
          <span class="final-rank">{{ i + 1 }}</span>
          <span class="final-name">{{ team.teamName }}</span>
          <span class="final-points">{{ team.totalScore }} 分</span>
        </div>
      </div>

      <button @click="resetToSetup" class="new-session-btn">
        <span>+</span> 新建场次
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocket } from '../composables/useSocket.js'
import JasmineIcons from '../components/JasmineIcons.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'

const { socket } = useSocket()

// State
const phase = ref('setup')
const activePillar = ref('configure')
const sessionId = ref(null)
const roomCode = ref('')
const questionCount = ref(8)
const selectedCats = ref([])
const teams = ref([])
const teamScores = ref([])
const answeredTeams = ref(new Set())
const answeredCount = ref(0)
const currentIndex = ref(0)
const questionTotal = ref(0)
const currentQuestion = ref(null)
const correctAnswer = ref('')
const explanation = ref('')
const partialAnswer = ref(null)
const partialText = ref(null)
const partialExplanation = ref(null)

const pillars = [
  { key: 'configure', icon: '⚙️', title: '配置', desc: '设置题目与规则', color: '#5B7A5E' },
  { key: 'lobby', icon: '👥', title: '大厅', desc: '等待队伍加入', color: '#7A9B7D' },
  { key: 'monitor', icon: '📊', title: '监控', desc: '实时跟踪进度', color: '#C88F34' },
  { key: 'results', icon: '🏆', title: '结果', desc: '查看最终排名', color: '#D4704A' },
]

const categories = [
  { key: 'weather', label: '天气', icon: '🌧️' },
  { key: 'pest', label: '虫害', icon: '🐛' },
  { key: 'disease', label: '病害', icon: '🦠' },
  { key: 'management', label: '管理', icon: '👷' },
]

const lanIps = ref([])
const isLocalhost = computed(() => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
})

const baseOrigins = computed(() => {
  if (!isLocalhost.value) return [window.location.origin]
  const port = window.location.port ? `:${window.location.port}` : ''
  const proto = window.location.protocol
  const candidates = lanIps.value.map(ip => `${proto}//${ip}${port}`)
  return candidates.length > 0 ? candidates : [window.location.origin]
})

const gameUrls = computed(() => baseOrigins.value.map(o => o + '/game'))

const maxScore = computed(() => {
  if (teamScores.value.length === 0) return 1
  return Math.max(...teamScores.value.map(t => t.totalScore), 1)
})

function toggleCat(key) {
  const i = selectedCats.value.indexOf(key)
  if (i >= 0) selectedCats.value.splice(i, 1)
  else selectedCats.value.push(key)
}

function createSession() {
  socket.emit('teacher:create_session', {
    questionCount: questionCount.value,
    categories: selectedCats.value,
  })
}

function startQuestion() {
  socket.emit('teacher:start_question', { sessionId: sessionId.value })
}

function revealAnswer() {
  socket.emit('teacher:reveal_answer', { sessionId: sessionId.value })
}

function nextQuestion() {
  socket.emit('teacher:next_question', { sessionId: sessionId.value })
  socket.emit('teacher:start_question', { sessionId: sessionId.value })
}

function endSession() {
  socket.emit('teacher:end_session', { sessionId: sessionId.value })
}

function resetToSetup() {
  phase.value = 'setup'
  sessionId.value = null
  roomCode.value = ''
  teams.value = []
  teamScores.value = []
  answeredTeams.value = new Set()
  answeredCount.value = 0
  currentIndex.value = 0
  questionTotal.value = 0
  currentQuestion.value = null
  localStorage.removeItem('admin_sessionId')
}

function cancelSession() {
  if (sessionId.value) {
    socket.emit('teacher:cancel_session', { sessionId: sessionId.value })
  }
  resetToSetup()
}

function backToLobby() {
  phase.value = 'lobby'
  answeredTeams.value = new Set()
  answeredCount.value = 0
  currentQuestion.value = null
}

// Socket listeners
socket.on('teacher:session_created', (data) => {
  sessionId.value = data.sessionId
  roomCode.value = data.roomCode
  questionTotal.value = data.questionTotal
  phase.value = 'lobby'
  activePillar.value = 'lobby'
  localStorage.setItem('admin_sessionId', data.sessionId)
})

socket.on('teacher:rejoined', (data) => {
  sessionId.value = data.sessionId
  roomCode.value = data.roomCode
  phase.value = data.phase
  questionTotal.value = data.questionTotal
  currentIndex.value = data.currentIndex
  teams.value = data.teams || []
  answeredTeams.value = new Set(Object.keys(data.currentAnswers || {}))
  answeredCount.value = answeredTeams.value.size
})

socket.on('admin:team_joined', (data) => {
  if (!teams.value.find(t => t.teamId === data.teamId)) {
    teams.value.push({ teamId: data.teamId, teamName: data.teamName })
  } else {
    const t = teams.value.find(t => t.teamId === data.teamId)
    if (t) t.teamName = data.teamName
  }
})

socket.on('admin:answer_status', (data) => {
  if (data.hasAnswered) {
    answeredTeams.value.add(data.teamId)
    answeredCount.value = data.answeredCount
  }
})

socket.on('game:question_started', (data) => {
  phase.value = 'question'
  activePillar.value = 'monitor'
  currentIndex.value = data.questionIndex
  questionTotal.value = data.total
  currentQuestion.value = data.question
  answeredTeams.value = new Set()
  answeredCount.value = 0
})

socket.on('game:answer_revealed', (data) => {
  phase.value = 'revealed'
  activePillar.value = 'results'
  correctAnswer.value = data.correctAnswer
  explanation.value = data.explanation
  partialAnswer.value = data.partialAnswer
  partialText.value = data.partialText
  partialExplanation.value = data.partialExplanation
  teamScores.value = data.teamScores
  data.teamScores.forEach(ts => {
    const t = teams.value.find(t => t.teamId === ts.teamId)
    if (t) t.totalScore = ts.totalScore
  })
})

socket.on('game:session_ended', (data) => {
  phase.value = 'ended'
  teamScores.value = data.finalScores
})

onMounted(() => {
  const savedId = localStorage.getItem('admin_sessionId')
  if (savedId) {
    socket.emit('teacher:rejoin', { sessionId: savedId })
  }
  fetch('/api/lan')
    .then(r => r.ok ? r.json() : null)
    .then(data => { lanIps.value = data?.ips || [] })
    .catch(() => { lanIps.value = [] })
})

onUnmounted(() => {
  socket.off('teacher:session_created')
  socket.off('teacher:rejoined')
  socket.off('admin:team_joined')
  socket.off('admin:answer_status')
  socket.off('game:question_started')
  socket.off('game:answer_revealed')
  socket.off('game:session_ended')
})
</script>

<style scoped>
@reference "tailwindcss";

/* ========== 基础布局 ========== */
.admin-container {
  min-height: 100vh;
  background: #FDFBF7;
  position: relative;
}

.admin-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse 100% 50% at 50% 0%, rgba(122, 155, 125, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 90% 90%, rgba(200, 178, 140, 0.04) 0%, transparent 50%),
    #FDFBF7;
  pointer-events: none;
}

.admin-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* ========== Header ========== */
.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(91, 122, 94, 0.1), rgba(123, 163, 126, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(91, 122, 94, 0.15);
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 14px;
  color: #64748B;
  margin-top: 2px;
}

/* ========== 四大支柱导航 ========== */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

@media (min-width: 640px) {
  .pillars-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.pillar-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pillar-card:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pillar-active {
  border-color: #5B7A5E;
  background: linear-gradient(135deg, rgba(91, 122, 94, 0.05), rgba(123, 163, 126, 0.08));
}

.pillar-icon {
  font-size: 24px;
}

.pillar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.pillar-desc {
  font-size: 12px;
  color: #64748B;
  margin-top: 2px;
}

/* ========== 配置面板 ========== */
.config-panel {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 24px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F1F5F9;
}

.panel-badge {
  background: #5B7A5E;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
}

.config-section {
  margin-bottom: 24px;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.label-icon {
  font-size: 16px;
}

.label-hint {
  font-weight: 400;
  color: #94A3B8;
  font-size: 13px;
}

.config-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  border-color: #CBD5E1;
  background: #F1F5F9;
}

.option-active {
  background: #5B7A5E;
  border-color: #5B7A5E;
  color: white;
}

.option-cat {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 统计预览 */
.stats-preview {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
  border-radius: 12px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
  display: block;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #E2E8F0;
}

/* 创建按钮 */
.create-btn {
  width: 100%;
  padding: 14px;
  background: #5B7A5E;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.create-btn:hover {
  background: #4A6350;
  box-shadow: 0 4px 12px rgba(91, 122, 94, 0.3);
}

/* ========== Phase Header ========== */
.phase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.phase-header.centered {
  justify-content: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.session-id {
  font-size: 13px;
  color: #94A3B8;
  font-family: monospace;
}

.phase-badge {
  background: #F1F5F9;
  color: #64748B;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  max-width: 300px;
  text-align: right;
}

.progress-indicator span {
  font-size: 13px;
  color: #64748B;
}

.progress-bar {
  height: 4px;
  background: #E2E8F0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #5B7A5E;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ========== 房间代码卡片 ========== */
.room-code-card {
  background: linear-gradient(135deg, #5B7A5E, #7A9B7D);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: white;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.room-code-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-10%) translateY(-10%); }
  50% { transform: translateX(10%) translateY(10%); }
}

.room-label {
  font-size: 13px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  position: relative;
}

.room-code {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 8px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.room-hint {
  font-size: 14px;
  opacity: 0.85;
  position: relative;
}

.room-urls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.url-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.url-icon {
  font-size: 14px;
}

.url-text {
  font-family: 'SF Mono', monospace;
  opacity: 0.95;
}

.localhost-warning {
  margin-top: 16px;
  font-size: 12px;
  background: rgba(200, 143, 52, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  opacity: 0.95;
}

/* ========== Dashboard Grid ========== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  flex: 1;
}

.card-icon {
  font-size: 18px;
}

.card-badge {
  background: #F1F5F9;
  color: #64748B;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Teams Grid */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (min-width: 480px) {
  .teams-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.team-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 10px;
  border: 1px solid #F1F5F9;
}

.team-empty {
  opacity: 0.5;
}

.team-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B7A5E, #7A9B7D);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.team-avatar-empty {
  background: #E2E8F0;
  color: #94A3B8;
}

.team-name {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

/* Mini Stats */
.mini-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-stat {
  text-align: center;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 10px;
}

.mini-value {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  display: block;
}

.mini-label {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
  display: block;
}

/* Start Button */
.start-btn {
  width: 100%;
  padding: 16px;
  background: #5B7A5E;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn:hover:not(:disabled) {
  background: #4A6350;
  box-shadow: 0 4px 12px rgba(91, 122, 94, 0.3);
}

.start-btn:disabled {
  background: #E2E8F0;
  color: #94A3B8;
  cursor: not-allowed;
}

/* ========== Question Phase ========== */
.question-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  margin-bottom: 20px;
}

.question-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.question-category {
  font-size: 12px;
  font-weight: 500;
  color: #5B7A5E;
  background: rgba(91, 122, 94, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.question-difficulty {
  font-size: 12px;
  color: #64748B;
}

.question-title {
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 12px;
  line-height: 1.4;
}

.question-scenario {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
}

/* Answer Dashboard */
.answer-dashboard {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  margin-bottom: 20px;
}

.answer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.answer-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.answer-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #64748B;
}

.answer-count :deep(.animated-number) {
  font-weight: 700;
  color: #5B7A5E;
}

.answer-progress {
  margin-bottom: 16px;
}

.answer-bar {
  height: 8px;
  background: #F1F5F9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.answer-fill {
  height: 100%;
  background: linear-gradient(90deg, #5B7A5E, #7A9B7D);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.team-status-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.team-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #F8FAFC;
  border-radius: 8px;
  font-size: 13px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #CBD5E1;
}

.status-answered .status-dot {
  background: #22C55E;
}

.status-name {
  flex: 1;
  color: #64748B;
}

.status-answered .status-name {
  color: #374151;
}

.status-icon {
  font-size: 14px;
  color: #CBD5E1;
}

.status-answered .status-icon {
  color: #22C55E;
}

.reveal-btn {
  width: 100%;
  padding: 16px;
  background: #C88F34;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reveal-btn:hover {
  background: #B07D2A;
  box-shadow: 0 4px 12px rgba(200, 143, 52, 0.3);
}

/* ========== Revealed Phase ========== */
.answer-reveal-card {
  margin-bottom: 20px;
}

.reveal-section {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  margin-bottom: 16px;
}

.reveal-section.correct {
  border-color: #5B7A5E;
  background: linear-gradient(135deg, rgba(91, 122, 94, 0.03), rgba(123, 163, 126, 0.05));
}

.reveal-section.partial {
  border-color: #C88F34;
  background: linear-gradient(135deg, rgba(200, 143, 52, 0.03), rgba(224, 168, 76, 0.05));
}

.reveal-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.reveal-section.correct .reveal-badge {
  background: #5B7A5E;
  color: white;
}

.reveal-section.partial .reveal-badge {
  background: #C88F34;
  color: white;
}

.reveal-answer {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 12px;
}

.reveal-explanation {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
}

/* Scoreboard */
.scoreboard-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  margin-bottom: 20px;
}

.scoreboard-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 10px;
}

.score-item.top-three {
  background: linear-gradient(135deg, rgba(91, 122, 94, 0.05), rgba(123, 163, 126, 0.08));
}

.score-rank {
  width: 32px;
  text-align: center;
  font-size: 18px;
}

.score-info {
  flex: 1;
}

.score-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: block;
  margin-bottom: 6px;
}

.score-bar-bg {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.score-bar {
  height: 100%;
  background: linear-gradient(90deg, #5B7A5E, #7A9B7D);
  border-radius: 3px;
  transition: width 0.7s ease;
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: #5B7A5E;
  min-width: 60px;
  text-align: right;
}

/* Action Bar */
.action-bar {
  display: flex;
  gap: 12px;
}

.next-btn {
  flex: 1;
  padding: 14px;
  background: #5B7A5E;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-btn:hover {
  background: #4A6350;
}

.end-btn {
  flex: 1;
  padding: 14px;
  background: #F1F5F9;
  color: #64748B;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.end-btn:hover {
  background: #E2E8F0;
}

.end-btn-primary {
  background: #5B7A5E;
  color: white;
  border-color: #5B7A5E;
}

.end-btn-primary:hover {
  background: #4A6350;
}

/* ========== Ended Phase ========== */
.final-header {
  text-align: center;
  margin-bottom: 32px;
}

.final-title {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.final-subtitle {
  font-size: 15px;
  color: #64748B;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
  padding: 0 20px;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 20px;
  min-width: 100px;
}

.podium-1 {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-color: #F59E0B;
  order: 2;
  transform: scale(1.1);
}

.podium-2 {
  background: linear-gradient(135deg, #F1F5F9, #E2E8F0);
  border-color: #94A3B8;
  order: 1;
}

.podium-3 {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-color: #D97706;
  opacity: 0.9;
  order: 3;
}

.podium-rank {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}

.podium-1 .podium-rank { color: #D97706; }
.podium-2 .podium-rank { color: #64748B; }
.podium-3 .podium-rank { color: #B45309; }

.podium-team {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-bottom: 8px;
}

.podium-score {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
}

.final-scores {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  margin-bottom: 24px;
}

.final-score-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #F1F5F9;
}

.final-score-item:last-child {
  border-bottom: none;
}

.final-rank {
  width: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #94A3B8;
}

.final-name {
  flex: 1;
  font-size: 15px;
  color: #374151;
}

.final-points {
  font-size: 15px;
  font-weight: 600;
  color: #5B7A5E;
}

.new-session-btn {
  width: 100%;
  padding: 16px;
  background: #1E293B;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.new-session-btn:hover {
  background: #0F172A;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.new-session-btn span {
  font-size: 20px;
}
</style>
