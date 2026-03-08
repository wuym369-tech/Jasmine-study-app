<template>
  <div class="game-container">
    <div class="game-bg"></div>
    
    <!-- ========== Join Phase ========== -->
    <div v-if="phase === 'join'" class="game-content">
      <div class="join-header">
        <div class="join-icon">
          <JasmineIcons name="jasmine" :size="64" />
        </div>
        <h1 class="join-title">茉莉花农场竞赛</h1>
        <p class="join-subtitle">输入房间代码加入你们的队伍</p>
      </div>

      <div class="join-card">
        <div class="input-group">
          <label class="input-label">房间代码</label>
          <input v-model="roomCodeInput"
            @input="roomCodeInput = roomCodeInput.toUpperCase()"
            maxlength="6"
            placeholder="如：ROSE42"
            class="input-field input-code" />
        </div>
        
        <div class="input-group">
          <label class="input-label">队伍名称</label>
          <input v-model="teamNameInput"
            maxlength="20"
            placeholder="如：第一组"
            class="input-field" />
        </div>

        <div v-if="joinError" class="error-message">{{ joinError }}</div>
        
        <button @click="joinGame"
          :disabled="!roomCodeInput || !teamNameInput"
          class="join-btn"
          :class="{ 'join-btn-disabled': !roomCodeInput || !teamNameInput }">
          加入竞赛 →
        </button>
      </div>
    </div>

    <!-- ========== Waiting Phase ========== -->
    <div v-else-if="phase === 'waiting'" class="game-content center">
      <div class="waiting-icon">
        <JasmineIcons name="jasmine" :size="80" class="pulse-animation" />
      </div>
      <h2 class="waiting-title">已加入！等待开始</h2>
      
      <div class="team-badge">
        <span class="badge-label">你的队伍</span>
        <span class="badge-name">{{ teamName }}</span>
      </div>
      
      <p class="waiting-text">目前已有 {{ teamCount }} 支队伍加入</p>

      <div v-if="waitingTeams.length > 0" class="teams-preview">
        <div v-for="t in waitingTeams" :key="t.teamId" class="preview-item">
          {{ t.teamName }}
        </div>
      </div>
    </div>

    <!-- ========== Question Phase ========== -->
    <div v-else-if="phase === 'question'" class="game-content">
      <!-- Header -->
      <div class="game-header">
        <div class="progress-info">
          <span>第 {{ questionIndex + 1 }} / {{ questionTotal }} 题</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (questionIndex / questionTotal * 100) + '%' }"></div>
          </div>
        </div>
        <div class="score-badge">
          <span class="score-team">{{ teamName }}</span>
          <AnimatedNumber :value="myScore" suffix=" 分" />
        </div>
      </div>

      <!-- Timer -->
      <div class="timer-display" :class="{ 'timer-warning': timeLeftSec <= 15 && timeLeftSec > 0, 'timer-ended': timeLeftSec === 0 }">
        <div class="timer-circle">
          <svg class="timer-svg" viewBox="0 0 36 36">
            <path class="timer-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="timer-progress" :stroke-dasharray="(timeLeftSec / 60 * 100) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span class="timer-value">{{ timeLeftSec }}</span>
        </div>
        <span class="timer-label">{{ timeLeftSec === 0 ? '时间到' : timeLeftSec <= 15 ? '剩余15秒' : '倒数计时' }}</span>
      </div>

      <!-- Question -->
      <div class="question-panel">
        <div class="question-meta">
          <span class="question-category">{{ currentQuestion?.categoryLabel }}</span>
        </div>
        <h2 class="question-title">{{ currentQuestion?.title }}</h2>
        <p class="question-scenario">{{ currentQuestion?.scenario }}</p>
      </div>

      <!-- Options -->
      <div class="options-list">
        <button v-for="opt in currentQuestion?.options" :key="opt.key"
          @click="submitAnswer(opt.key)"
          :disabled="myAnswer !== null || timeLeftSec === 0"
          class="option-btn"
          :class="getOptionClass(opt.key)">
          <span class="option-key">{{ opt.key }}</span>
          <span class="option-text">{{ opt.text }}</span>
        </button>
      </div>

      <!-- Status -->
      <div v-if="myAnswer" class="status-message success">
        ✓ 已作答，等待老师揭晓答案...
      </div>
      <div v-else-if="submitError" class="status-message error">
        {{ submitError }}
      </div>
      <div v-else-if="timeLeftSec === 0" class="status-message error">
        ⏱️ 本题时间到，无法再提交答案。
      </div>
    </div>

    <!-- ========== Revealed Phase ========== -->
    <div v-else-if="phase === 'revealed'" class="game-content">
      <div class="phase-indicator">
        <span>第 {{ questionIndex + 1 }} / {{ questionTotal }} 题 — 揭晓</span>
      </div>

      <!-- Result -->
      <div class="result-panel" :class="`result-${roundResult}`">
        <div class="result-icon">{{ roundResultIcon }}</div>
        <div class="result-text">{{ roundResultText }}</div>
        <div class="result-score">本题得 {{ roundPoints }} 分 · 总分 {{ myScore }} 分</div>
      </div>

      <!-- Answer -->
      <div class="answer-panel">
        <div class="answer-label">正确答案</div>
        <div class="answer-value">{{ correctAnswer }}</div>
        <p class="answer-explanation">{{ explanation }}</p>
      </div>

      <!-- Partial Answer -->
      <div v-if="partialAnswer" class="partial-panel">
        <div class="partial-label">次佳答案（1分）</div>
        <div class="partial-value">{{ partialAnswer }}. {{ partialText }}</div>
        <p class="partial-explanation">{{ partialExplanation }}</p>
      </div>

      <!-- Leaderboard -->
      <div class="leaderboard-panel">
        <h3 class="leaderboard-title">当前排名</h3>
        <div class="leaderboard-list">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="leaderboard-item"
            :class="{ 'is-me': team.teamId === teamId, 'top-three': i < 3 }">
            <span class="item-rank">{{ i + 1 }}</span>
            <span class="item-name">{{ team.teamName }} {{ team.teamId === teamId ? '👈' : '' }}</span>
            <AnimatedNumber :value="team.totalScore" suffix=" 分" class="item-score" />
          </div>
        </div>
      </div>

      <div class="waiting-hint">等待老师进入下一题...</div>
    </div>

    <!-- ========== Ended Phase ========== -->
    <div v-else-if="phase === 'ended'" class="game-content center">
      <div class="ended-icon">🏆</div>
      <h2 class="ended-title">竞赛结束！</h2>
      
      <!-- Final Rankings -->
      <div class="final-leaderboard">
        <div v-for="(team, i) in teamScores" :key="team.teamId"
          class="final-item"
          :class="{ 'is-me': team.teamId === teamId, 'champion': i === 0 }">
          <span class="final-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 }}</span>
          <span class="final-name">{{ team.teamName }} {{ team.teamId === teamId ? '👈' : '' }}</span>
          <span class="final-score">{{ team.totalScore }} 分</span>
        </div>
      </div>

      <!-- Review -->
      <div v-if="myReview && myReview.length > 0" class="review-section">
        <h3 class="review-title">
          <span>📝</span> 错题回顾
          <span class="review-count">{{ myReview.length }} 题</span>
        </h3>
        <div class="review-list-compact">
          <div v-for="(item, idx) in myReview" :key="idx" class="review-card">
            <div class="review-header">
              <span class="review-cat">{{ item.categoryLabel }}</span>
              <span class="review-idx">第 {{ item.questionIndex }} 题</span>
            </div>
            <div class="review-body">
              <h4 class="review-q">{{ item.title }}</h4>
              <div class="review-answers">
                <div class="your-ans" :class="{ partial: item.isPartial }">
                  你的答案：{{ item.yourAnswer }}. {{ item.yourAnswerText }}
                  <span v-if="item.isPartial" class="partial-badge">次佳答案</span>
                  <span v-else class="wrong-badge">错误</span>
                </div>
                <div class="correct-ans">
                  正确答案：{{ item.correctAnswer }}. {{ item.correctAnswerText }}
                </div>
              </div>
              <p class="review-tip">{{ item.isPartial ? item.partialExplanation : item.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- All Correct -->
      <div v-else class="all-correct">
        <div class="correct-icon">🎉</div>
        <h3>太棒了！全部答对！</h3>
        <p>所有题目都选择了最佳答案</p>
      </div>

      <div class="ended-footer">
        <p class="thanks">感谢参与茉莉花研学活动！</p>
        <button @click="joinNextGame" class="next-game-btn">
          参加下一场 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useSocket } from '../composables/useSocket.js'
import JasmineIcons from '../components/JasmineIcons.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'

const { socket } = useSocket()

// State
const phase = ref('join')
const roomCodeInput = ref('')
const teamNameInput = ref('')
const joinError = ref('')
const teamId = ref(null)
const teamName = ref('')
const sessionId = ref(null)
const teamCount = ref(0)
const waitingTeams = ref([])
const myScore = ref(0)
const myAnswer = ref(null)
const submitError = ref('')
const questionIndex = ref(0)
const questionTotal = ref(0)
const currentQuestion = ref(null)
const correctAnswer = ref('')
const explanation = ref('')
const partialAnswer = ref(null)
const partialText = ref(null)
const partialExplanation = ref(null)
const teamScores = ref([])
const roundPoints = ref(0)
const questionEndsAt = ref(null)
const myReview = ref([])
const nowMs = ref(Date.now())
let timerInterval = null

const timeLeftSec = computed(() => {
  if (!questionEndsAt.value) return 60
  const left = Math.ceil((questionEndsAt.value - nowMs.value) / 1000)
  return Math.max(0, left)
})

function startTimer() {
  if (timerInterval) return
  timerInterval = setInterval(() => {
    nowMs.value = Date.now()
  }, 250)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function joinGame() {
  joinError.value = ''
  socket.emit('team:join', {
    roomCode: roomCodeInput.value.trim().toUpperCase(),
    teamName: teamNameInput.value.trim(),
  })
}

function joinNextGame() {
  phase.value = 'join'
  roomCodeInput.value = ''
  teamNameInput.value = ''
  joinError.value = ''
  submitError.value = ''
  teamId.value = null
  teamName.value = ''
  sessionId.value = null
  teamCount.value = 0
  waitingTeams.value = []
  myScore.value = 0
  myAnswer.value = null
  questionIndex.value = 0
  questionTotal.value = 0
  currentQuestion.value = null
  correctAnswer.value = ''
  explanation.value = ''
  teamScores.value = []
  roundPoints.value = 0
  myReview.value = []
}

function submitAnswer(key) {
  if (myAnswer.value !== null) return
  submitError.value = ''
  myAnswer.value = key
  socket.emit('team:submit_answer', {
    sessionId: sessionId.value,
    teamId: teamId.value,
    answer: key,
  })
}

function getOptionClass(key) {
  if (myAnswer.value === null) {
    return 'option-default'
  }
  if (myAnswer.value === key) {
    return 'option-selected'
  }
  return 'option-disabled'
}

const roundResult = computed(() => {
  if (!myAnswer.value) return 'skipped'
  if (myAnswer.value === correctAnswer.value) return 'correct'
  if (roundPoints.value === 1) return 'partial'
  return 'wrong'
})

const roundResultIcon = computed(() => {
  const map = { correct: '🎉', partial: '👍', wrong: '❌', skipped: '⏭️' }
  return map[roundResult.value] || '—'
})

const roundResultText = computed(() => {
  const map = { correct: '回答正确！', partial: '部分正确', wrong: '回答错误', skipped: '未作答' }
  return map[roundResult.value] || ''
})

// Socket listeners
socket.on('team:join_error', (data) => {
  joinError.value = data.message
})

socket.on('team:joined', (data) => {
  teamId.value = data.teamId
  teamName.value = data.teamName
  sessionId.value = data.sessionId
  teamCount.value = data.teamCount
  phase.value = data.phase === 'lobby' ? 'waiting' : data.phase
})

socket.on('screen:teams_updated', (data) => {
  waitingTeams.value = data.teams
  teamCount.value = data.teams.length
})

socket.on('game:question_started', (data) => {
  phase.value = 'question'
  questionIndex.value = data.questionIndex
  questionTotal.value = data.total
  currentQuestion.value = data.question
  myAnswer.value = null
  correctAnswer.value = ''
  explanation.value = ''
  roundPoints.value = 0
  questionEndsAt.value = data.questionEndsAt || null
  nowMs.value = Date.now()
  startTimer()
})

socket.on('team:answer_confirmed', () => {
  // answer is already set in myAnswer
})

socket.on('team:submit_error', (data) => {
  submitError.value = data.message
  myAnswer.value = null
})

socket.on('game:answer_revealed', (data) => {
  phase.value = 'revealed'
  correctAnswer.value = data.correctAnswer
  explanation.value = data.explanation
  partialAnswer.value = data.partialAnswer
  partialText.value = data.partialText
  partialExplanation.value = data.partialExplanation
  teamScores.value = data.teamScores
  stopTimer()

  const me = data.teamScores.find(t => t.teamId === teamId.value)
  if (me) myScore.value = me.totalScore
  const rr = data.roundResults?.find(r => r.teamId === teamId.value)
  roundPoints.value = rr?.points ?? 0
})

socket.on('game:session_ended', (data) => {
  phase.value = 'ended'
  teamScores.value = data.finalScores
  myReview.value = data.teamReviews?.[teamId.value] || []
  stopTimer()
})

onUnmounted(() => {
  stopTimer()
  socket.off('team:join_error')
  socket.off('team:joined')
  socket.off('screen:teams_updated')
  socket.off('game:question_started')
  socket.off('team:answer_confirmed')
  socket.off('team:submit_error')
  socket.off('game:answer_revealed')
  socket.off('game:session_ended')
})
</script>

<style scoped>
@reference "tailwindcss";

.game-container {
  min-height: 100vh;
  background: #FDFBF7;
  position: relative;
}

.game-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse 100% 50% at 50% 0%, rgba(122, 155, 125, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 50% 100%, rgba(212, 168, 140, 0.04) 0%, transparent 50%),
    #FDFBF7;
  pointer-events: none;
}

.game-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 24px;
}

.game-content.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}

/* ========== Join Phase ========== */
.join-header {
  text-align: center;
  margin-bottom: 32px;
}

.join-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.join-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.join-subtitle {
  font-size: 15px;
  color: #64748B;
}

.join-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  padding: 28px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #E2E8F0;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;
}

.input-field:focus {
  border-color: #D4704A;
}

.input-code {
  font-family: 'SF Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  font-size: 18px;
}

.error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.08);
  border-radius: 10px;
  color: #EF4444;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
}

.join-btn {
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
}

.join-btn:hover:not(:disabled) {
  background: #C05A3A;
  box-shadow: 0 4px 12px rgba(212, 112, 74, 0.3);
}

.join-btn-disabled {
  background: #E2E8F0;
  color: #94A3B8;
  cursor: not-allowed;
}

/* ========== Waiting Phase ========== */
.waiting-icon {
  margin-bottom: 24px;
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.waiting-title {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 20px;
}

.team-badge {
  background: white;
  border-radius: 16px;
  border: 2px solid #D4704A;
  padding: 20px 32px;
  margin-bottom: 16px;
}

.badge-label {
  display: block;
  font-size: 13px;
  color: #64748B;
  margin-bottom: 4px;
}

.badge-name {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #D4704A;
}

.waiting-text {
  font-size: 15px;
  color: #64748B;
  margin-bottom: 20px;
}

.teams-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.preview-item {
  padding: 8px 14px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* ========== Question Phase ========== */
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}

.progress-info {
  flex: 1;
}

.progress-info span {
  font-size: 13px;
  color: #64748B;
  display: block;
  margin-bottom: 6px;
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

.score-badge {
  padding: 10px 16px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  text-align: center;
}

.score-team {
  display: block;
  font-size: 12px;
  color: #64748B;
  margin-bottom: 2px;
}

/* Timer */
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.timer-circle {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 8px;
}

.timer-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.timer-bg {
  fill: none;
  stroke: #F1F5F9;
  stroke-width: 3;
}

.timer-progress {
  fill: none;
  stroke: #D4704A;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.25s linear;
}

.timer-warning .timer-progress {
  stroke: #EF4444;
}

.timer-ended .timer-progress {
  stroke: #94A3B8;
}

.timer-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 700;
  color: #1E293B;
  font-family: 'SF Mono', monospace;
}

.timer-label {
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
}

.timer-warning .timer-label {
  color: #EF4444;
}

/* Question Panel */
.question-panel {
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  margin-bottom: 20px;
}

.question-meta {
  margin-bottom: 12px;
}

.question-category {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(212, 112, 74, 0.1);
  color: #D4704A;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
}

.question-title {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 12px;
  line-height: 1.4;
}

.question-scenario {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
}

/* Options */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 2px solid #E2E8F0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.option-btn:hover:not(:disabled).option-default {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.option-btn:disabled {
  cursor: not-allowed;
}

.option-default {
  border-color: #E2E8F0;
}

.option-selected {
  border-color: #D4704A;
  background: rgba(212, 112, 74, 0.05);
}

.option-disabled {
  border-color: #F1F5F9;
  background: #F8FAFC;
  opacity: 0.6;
}

.option-key {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #64748B;
  flex-shrink: 0;
}

.option-selected .option-key {
  background: #D4704A;
  color: white;
}

.option-text {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
}

/* Status Message */
.status-message {
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.status-message.success {
  background: rgba(34, 197, 94, 0.08);
  color: #16A34A;
}

.status-message.error {
  background: rgba(239, 68, 68, 0.08);
  color: #DC2626;
}

/* ========== Revealed Phase ========== */
.phase-indicator {
  text-align: center;
  font-size: 13px;
  color: #94A3B8;
  margin-bottom: 20px;
}

.result-panel {
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.result-correct {
  background: rgba(34, 197, 94, 0.08);
  border: 2px solid #22C55E;
}

.result-partial {
  background: rgba(234, 179, 8, 0.08);
  border: 2px solid #EAB308;
}

.result-wrong {
  background: rgba(239, 68, 68, 0.08);
  border: 2px solid #EF4444;
}

.result-skipped {
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.result-text {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
}

.result-score {
  font-size: 14px;
  color: #64748B;
}

/* Answer Panel */
.answer-panel {
  background: white;
  border-radius: 16px;
  border: 1px solid #22C55E;
  padding: 20px;
  margin-bottom: 16px;
}

.answer-label {
  font-size: 12px;
  font-weight: 600;
  color: #22C55E;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.answer-value {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 12px;
}

.answer-explanation {
  font-size: 14px;
  color: #64748B;
  line-height: 1.6;
}

/* Partial Panel */
.partial-panel {
  background: rgba(234, 179, 8, 0.05);
  border-radius: 16px;
  border: 1px solid #EAB308;
  padding: 20px;
  margin-bottom: 16px;
}

.partial-label {
  font-size: 12px;
  font-weight: 600;
  color: #B45309;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.partial-value {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 12px;
}

.partial-explanation {
  font-size: 14px;
  color: #92400E;
  line-height: 1.6;
}

/* Leaderboard */
.leaderboard-panel {
  background: white;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  padding: 20px;
  margin-bottom: 16px;
}

.leaderboard-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #F8FAFC;
}

.leaderboard-item.is-me {
  background: rgba(212, 112, 74, 0.08);
  border: 1px solid rgba(212, 112, 74, 0.2);
}

.leaderboard-item.top-three {
  background: rgba(251, 191, 36, 0.1);
}

.item-rank {
  width: 28px;
  font-size: 14px;
  font-weight: 700;
  color: #94A3B8;
  text-align: center;
}

.item-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.item-score {
  font-size: 15px;
  font-weight: 700;
  color: #5B7A5E;
}

.waiting-hint {
  text-align: center;
  font-size: 13px;
  color: #94A3B8;
}

/* ========== Ended Phase ========== */
.ended-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.ended-title {
  font-size: 24px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 24px;
}

.final-leaderboard {
  width: 100%;
  max-width: 400px;
  margin-bottom: 24px;
}

.final-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  margin-bottom: 8px;
}

.final-item.champion {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-color: #F59E0B;
  transform: scale(1.02);
}

.final-item.is-me {
  border-color: #D4704A;
  background: rgba(212, 112, 74, 0.05);
}

.final-rank {
  font-size: 20px;
}

.final-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.final-score {
  font-size: 16px;
  font-weight: 700;
  color: #5B7A5E;
}

/* Review Section */
.review-section {
  width: 100%;
  max-width: 500px;
  margin-bottom: 24px;
}

.review-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 16px;
}

.review-count {
  font-size: 13px;
  font-weight: 500;
  color: #94A3B8;
  background: #F1F5F9;
  padding: 4px 10px;
  border-radius: 20px;
}

.review-list-compact {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
}

.review-cat {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
}

.review-idx {
  font-size: 12px;
  color: #94A3B8;
}

.review-body {
  padding: 14px;
}

.review-q {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  line-height: 1.4;
}

.review-answers {
  margin-bottom: 10px;
}

.your-ans {
  font-size: 13px;
  color: #EF4444;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.your-ans.partial {
  color: #B45309;
}

.partial-badge,
.wrong-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.partial-badge {
  background: rgba(234, 179, 8, 0.15);
  color: #B45309;
}

.wrong-badge {
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
}

.correct-ans {
  font-size: 13px;
  color: #16A34A;
}

.review-tip {
  font-size: 12px;
  color: #64748B;
  background: #F8FAFC;
  padding: 10px;
  border-radius: 8px;
  line-height: 1.5;
}

/* All Correct */
.all-correct {
  padding: 32px;
  background: rgba(34, 197, 94, 0.08);
  border-radius: 20px;
  border: 2px solid #22C55E;
  margin-bottom: 24px;
}

.correct-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.all-correct h3 {
  font-size: 18px;
  font-weight: 700;
  color: #15803D;
  margin-bottom: 8px;
}

.all-correct p {
  font-size: 14px;
  color: #16A34A;
}

/* Ended Footer */
.ended-footer {
  text-align: center;
}

.thanks {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 16px;
}

.next-game-btn {
  padding: 14px 32px;
  background: #D4704A;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-game-btn:hover {
  background: #C05A3A;
  box-shadow: 0 4px 12px rgba(212, 112, 74, 0.3);
}
</style>
