<template>
  <div class="min-h-screen bg-slate-50 p-6">

    <!-- Phase: setup -->
    <div v-if="phase === 'setup'" class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-1">⚙️ 老师控制台</h1>
      <p class="text-slate-500 mb-8">创建竞赛场次</p>

      <div class="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">

        <!-- 题数 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">题目数量</label>
          <div class="flex gap-3 flex-wrap">
            <button v-for="n in [4, 6, 8, 10, 12]" :key="n"
              @click="questionCount = n"
              class="px-4 py-2 rounded-xl border-2 font-semibold transition-colors"
              :class="questionCount === n
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-slate-200 text-slate-600 hover:border-green-300'">
              {{ n }} 题
            </button>
          </div>
        </div>

        <!-- 类别 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">题目类别（不选 = 全部）</label>
          <div class="flex gap-3 flex-wrap">
            <button v-for="cat in categories" :key="cat.key"
              @click="toggleCat(cat.key)"
              class="px-4 py-2 rounded-xl border-2 font-semibold transition-colors"
              :class="selectedCats.includes(cat.key)
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-slate-200 text-slate-600 hover:border-green-300'">
              {{ cat.label }}
            </button>
          </div>
        </div>

        <button @click="createSession"
          class="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-lg">
          创建竞赛场次 →
        </button>
      </div>
    </div>

    <!-- Phase: lobby -->
    <div v-else-if="phase === 'lobby'" class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button @click="cancelSession"
            class="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 transition-colors">
            ← 返回设置
          </button>
          <h1 class="text-2xl font-bold text-slate-800">🎮 等待队伍加入</h1>
        </div>
        <span class="text-sm text-slate-400">场次 {{ sessionId?.slice(-6) }}</span>
      </div>

      <!-- 房间代码大展示 -->
      <div class="bg-white rounded-2xl p-8 border-2 border-green-200 text-center mb-6">
        <p class="text-slate-500 mb-2 text-sm font-medium">房间代码（学生输入此代码加入）</p>
        <div class="text-6xl font-black text-green-600 tracking-widest mb-4">{{ roomCode }}</div>
        <p class="text-slate-400 text-sm">队伍页面：<span class="font-mono bg-slate-100 px-2 py-1 rounded">{{ gameUrl }}</span></p>
      </div>

      <!-- 已加入队伍 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <h2 class="font-bold text-slate-700 mb-4">已加入队伍（{{ teams.length }}/6）</h2>
        <div v-if="teams.length === 0" class="text-slate-400 text-center py-4">等待队伍加入...</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="team in teams" :key="team.teamId"
            class="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <div class="font-bold text-green-800">{{ team.teamName }}</div>
          </div>
        </div>
      </div>

      <button @click="startQuestion" :disabled="teams.length === 0"
        class="w-full py-3 font-bold rounded-xl text-lg transition-colors"
        :class="teams.length > 0
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
        开始第 1 题 →
      </button>
    </div>

    <!-- Phase: question -->
    <div v-else-if="phase === 'question'" class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button @click="backToLobby"
            class="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 transition-colors">
            ← 返回大厅
          </button>
          <span class="text-slate-500 text-sm">第 {{ currentIndex + 1 }} / {{ questionTotal }} 题</span>
        </div>
        <span class="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
          已作答 {{ answeredCount }} / {{ teams.length }} 队
        </span>
      </div>

      <!-- 题目预览 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">{{ currentQuestion?.icon }}</span>
          <span class="text-sm px-2 py-0.5 rounded-full font-medium" :class="currentQuestion?.categoryColor">
            {{ currentQuestion?.categoryLabel }}
          </span>
          <span class="text-sm text-slate-400">{{ currentQuestion?.difficulty }}难度</span>
        </div>
        <h2 class="font-bold text-lg text-slate-800 mb-2">{{ currentQuestion?.title }}</h2>
        <p class="text-slate-600 text-sm">{{ currentQuestion?.scenario }}</p>
      </div>

      <!-- 作答状态 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <h3 class="font-semibold text-slate-700 mb-4">各队作答状态</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="team in teams" :key="team.teamId"
            class="rounded-xl p-3 text-center border transition-colors"
            :class="answeredTeams.has(team.teamId)
              ? 'bg-green-50 border-green-200'
              : 'bg-slate-50 border-slate-200'">
            <div class="text-xl mb-1">{{ answeredTeams.has(team.teamId) ? '✅' : '⏳' }}</div>
            <div class="font-medium text-sm" :class="answeredTeams.has(team.teamId) ? 'text-green-800' : 'text-slate-500'">
              {{ team.teamName }}
            </div>
          </div>
        </div>
      </div>

      <button @click="revealAnswer"
        class="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors text-lg">
        揭晓答案 →
      </button>
    </div>

    <!-- Phase: revealed -->
    <div v-else-if="phase === 'revealed'" class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <span class="text-slate-500 text-sm">第 {{ currentIndex + 1 }} / {{ questionTotal }} 题 — 揭晓</span>
      </div>

      <!-- 正确答案 + 解说 -->
      <div class="bg-green-50 rounded-2xl p-6 border border-green-200 mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-green-700 font-bold text-lg">✅ 正确答案：{{ correctAnswer }}</span>
        </div>
        <p class="text-slate-700 text-sm leading-relaxed">{{ explanation }}</p>
      </div>

      <!-- 次佳答案说明 -->
      <div v-if="partialAnswer && partialExplanation" class="bg-amber-50 rounded-2xl p-5 border border-amber-200 mb-6">
        <div class="font-bold text-amber-700 mb-1">⚡ 次佳答案（1分）：{{ partialAnswer }}. {{ partialText }}</div>
        <p class="text-amber-800 text-sm leading-relaxed mt-2">{{ partialExplanation }}</p>
      </div>

      <!-- 当前积分榜 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <h3 class="font-semibold text-slate-700 mb-4">当前积分</h3>
        <div class="space-y-3">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="flex items-center gap-3">
            <span class="text-xl font-black w-8 text-center"
              :class="i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-slate-300'">
              {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 }}
            </span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="font-semibold text-slate-800">{{ team.teamName }}</span>
                <span class="font-bold text-green-700">{{ team.totalScore }} 分</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 rounded-full transition-all duration-700"
                  :style="{ width: maxScore > 0 ? (team.totalScore / maxScore * 100) + '%' : '0%' }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button v-if="currentIndex + 1 < questionTotal" @click="nextQuestion"
          class="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
          下一题 →
        </button>
        <button @click="endSession"
          class="flex-1 py-3 font-bold rounded-xl transition-colors"
          :class="currentIndex + 1 < questionTotal
            ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            : 'bg-green-600 text-white hover:bg-green-700'">
          {{ currentIndex + 1 < questionTotal ? '提前结束' : '公布最终结果 🏆' }}
        </button>
      </div>
    </div>

    <!-- Phase: ended -->
    <div v-else-if="phase === 'ended'" class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-6 text-center">🏆 最终结果</h1>
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <div class="space-y-4">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="flex items-center gap-4 p-4 rounded-xl"
            :class="i === 0 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-slate-50'">
            <span class="text-3xl">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '　' }}</span>
            <div class="flex-1">
              <div class="font-bold text-xl text-slate-800">{{ team.teamName }}</div>
            </div>
            <div class="text-2xl font-black text-green-700">{{ team.totalScore }} 分</div>
          </div>
        </div>
      </div>
      <button @click="resetToSetup"
        class="w-full py-3 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
        新建场次
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocket } from '../composables/useSocket.js'

const { socket } = useSocket()

// State
const phase = ref('setup')
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

const categories = [
  { key: 'weather', label: '🌧️ 天气' },
  { key: 'pest', label: '🐛 虫害' },
  { key: 'disease', label: '🦠 病害' },
  { key: 'management', label: '👷 管理' },
]

const gameUrl = computed(() => {
  return window.location.origin + '/game'
})

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
  // immediately trigger next question start
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
    // Update name in case of rejoin
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
  currentIndex.value = data.questionIndex
  questionTotal.value = data.total
  currentQuestion.value = data.question
  answeredTeams.value = new Set()
  answeredCount.value = 0
})

socket.on('game:answer_revealed', (data) => {
  phase.value = 'revealed'
  correctAnswer.value = data.correctAnswer
  explanation.value = data.explanation
  partialAnswer.value = data.partialAnswer
  partialText.value = data.partialText
  partialExplanation.value = data.partialExplanation
  teamScores.value = data.teamScores
  // Update local teams scores
  data.teamScores.forEach(ts => {
    const t = teams.value.find(t => t.teamId === ts.teamId)
    if (t) t.totalScore = ts.totalScore
  })
})

socket.on('game:session_ended', (data) => {
  phase.value = 'ended'
  teamScores.value = data.finalScores
})

// Rejoin on load
onMounted(() => {
  const savedId = localStorage.getItem('admin_sessionId')
  if (savedId) {
    socket.emit('teacher:rejoin', { sessionId: savedId })
  }
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
