<template>
  <div class="min-h-screen bg-gradient-to-br from-green-900 to-slate-900 text-white p-8 flex flex-col">

    <!-- No session -->
    <div v-if="!connected" class="flex-1 flex flex-col items-center justify-center text-center">
      <div class="text-6xl mb-4 animate-pulse">🌸</div>
      <h1 class="text-4xl font-bold mb-2">茉莉花农场竞赛</h1>
      <p class="text-green-300">连接中...</p>
    </div>

    <!-- Waiting for session / lobby -->
    <div v-else-if="phase === 'lobby' || phase === 'no_session'" class="flex-1 flex flex-col items-center justify-center text-center">
      <div class="text-7xl mb-6">🌸</div>
      <h1 class="text-5xl font-black mb-4">茉莉花农场竞赛</h1>

      <div v-if="roomCode && phase === 'lobby'" class="mb-8">
        <p class="text-green-300 text-lg mb-2">房间代码</p>
        <div class="text-8xl font-black tracking-widest text-yellow-300 mb-4">{{ roomCode }}</div>
        <p class="text-green-200 text-xl">打开浏览器访问 <span class="font-mono bg-white/10 px-3 py-1 rounded-lg">{{ gameUrl }}</span></p>
      </div>
      <div v-else class="mb-8">
        <p class="text-green-300 text-xl mb-4">等待老师创建场次...</p>
        <!-- Manual room code input if no URL param -->
        <div v-if="!roomCode" class="flex gap-3 justify-center">
          <input v-model="roomCodeInput"
            @input="roomCodeInput = roomCodeInput.toUpperCase()"
            maxlength="6"
            placeholder="输入房间代码"
            class="px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white text-2xl font-mono tracking-widest text-center outline-none focus:border-yellow-300 w-52" />
          <button @click="connectWithCode(roomCodeInput)"
            :disabled="roomCodeInput.length < 6"
            class="px-6 py-3 rounded-xl font-bold text-lg transition-colors"
            :class="roomCodeInput.length >= 6 ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300' : 'bg-white/10 text-white/40 cursor-not-allowed'">
            连接
          </button>
        </div>
        <p v-else class="text-yellow-300 text-lg mt-2">正在连接 {{ roomCode }}...</p>
      </div>

      <!-- Teams joined -->
      <div v-if="teams.length > 0" class="grid grid-cols-3 gap-4 mt-4">
        <div v-for="team in teams" :key="team.teamId"
          class="bg-white/10 rounded-2xl px-6 py-4 text-xl font-bold">
          {{ team.teamName }}
        </div>
      </div>
    </div>

    <!-- Question phase -->
    <div v-else-if="phase === 'question'" class="flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <span class="text-green-300 text-xl">第 {{ currentIndex + 1 }} / {{ total }} 题</span>
        <span class="text-green-300">房间：{{ roomCode }}</span>
      </div>

      <!-- Question -->
      <div class="bg-white/10 rounded-3xl p-8 mb-8 flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">{{ currentQuestion?.icon }}</span>
          <span class="text-lg font-medium text-green-200">{{ currentQuestion?.categoryLabel }}</span>
          <span class="text-slate-400">· {{ currentQuestion?.difficulty }}难度</span>
        </div>
        <h2 class="text-3xl font-bold mb-4">{{ currentQuestion?.title }}</h2>
        <p class="text-green-100 text-xl leading-relaxed">{{ currentQuestion?.scenario }}</p>
      </div>

      <!-- Team answer progress -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div v-for="team in teams" :key="team.teamId"
          class="bg-white/10 rounded-2xl p-4 text-center transition-all"
          :class="answeredCount >= teams.indexOf(team) + 1 ? 'bg-green-700/40' : ''">
          <div class="text-2xl mb-1">{{ '' }}</div>
          <div class="font-bold text-lg">{{ team.teamName }}</div>
        </div>
      </div>
      <div class="text-center text-green-300 text-lg">
        已作答 {{ answeredCount }} / {{ teams.length }} 队
      </div>
    </div>

    <!-- Revealed phase -->
    <div v-else-if="phase === 'revealed'" class="flex-1 flex flex-col">
      <div class="text-center mb-6">
        <p class="text-green-300 text-lg mb-2">第 {{ currentIndex + 1 }} / {{ total }} 题</p>
        <h2 class="text-3xl font-bold mb-2">{{ currentQuestion?.title }}</h2>
        <div class="bg-green-500/20 rounded-2xl p-4 inline-block mb-3">
          <span class="text-2xl font-bold text-yellow-300">✅ 正确答案：{{ correctAnswer }}</span>
        </div>
        <p class="text-green-200 text-lg max-w-4xl mx-auto leading-relaxed">{{ explanation }}</p>
      </div>

      <!-- 次佳答案说明 -->
      <div v-if="partialAnswer && partialExplanation" class="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-5 max-w-4xl mx-auto mb-6">
        <div class="font-bold text-amber-300 text-lg mb-2">⚡ 次佳答案（1分）：{{ partialAnswer }}. {{ partialText }}</div>
        <p class="text-amber-100 leading-relaxed">{{ partialExplanation }}</p>
      </div>

      <!-- Scoreboard -->
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-green-300 mb-4 text-center">当前积分榜</h3>
        <div class="max-w-2xl mx-auto space-y-3">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-4">
            <span class="text-3xl w-10">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-2">
                <span class="text-xl font-bold">{{ team.teamName }}</span>
                <span class="text-2xl font-black text-yellow-300">{{ team.totalScore }} 分</span>
              </div>
              <div class="h-3 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                  :style="{ width: maxScore > 0 ? (team.totalScore / maxScore * 100) + '%' : '0%' }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ended phase -->
    <div v-else-if="phase === 'ended'" class="flex-1 flex flex-col items-center justify-center">
      <div class="text-6xl mb-6">🏆</div>
      <h1 class="text-5xl font-black mb-8">最终排名</h1>
      <div class="w-full max-w-2xl space-y-4">
        <div v-for="(team, i) in teamScores" :key="team.teamId"
          class="flex items-center gap-4 rounded-2xl px-8 py-5"
          :class="i === 0 ? 'bg-yellow-500/30 border-2 border-yellow-400' : 'bg-white/10'">
          <span class="text-5xl">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }}</span>
          <span class="text-2xl font-bold flex-1">{{ team.teamName }}</span>
          <span class="text-4xl font-black text-yellow-300">{{ team.totalScore }} 分</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocket } from '../composables/useSocket.js'

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

const gameUrl = computed(() => window.location.origin + '/game')
const maxScore = computed(() => Math.max(...teamScores.value.map(t => t.totalScore), 1))

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

// Screen listens to all game events (joined session room via teacher:create or by polling)
socket.on('screen:state', (data) => {
  stopRetry()
  phase.value = data.phase === 'lobby' ? 'lobby' : data.phase
  roomCode.value = data.roomCode
  teams.value = data.teams || []
  teamScores.value = data.teams?.sort((a, b) => b.totalScore - a.totalScore) || []
  currentIndex.value = data.currentIndex
  total.value = data.total
  answeredCount.value = data.answeredCount || 0
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
})

socket.on('game:session_ended', (data) => {
  phase.value = 'ended'
  teamScores.value = data.finalScores
})

// Poll for room code from URL query param
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const rc = params.get('room')
  if (rc) {
    connectWithCode(rc)
  }
})

onUnmounted(() => {
  stopRetry()
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
