<template>
  <div class="min-h-screen bg-orange-50 p-6">

    <!-- Phase: join -->
    <div v-if="phase === 'join'" class="max-w-md mx-auto pt-12">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🌸</div>
        <h1 class="text-2xl font-bold text-orange-800">茉莉花农场竞赛</h1>
        <p class="text-orange-600 text-sm mt-1">输入房间代码加入你们的队伍</p>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-orange-200 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">房间代码</label>
          <input v-model="roomCodeInput"
            @input="roomCodeInput = roomCodeInput.toUpperCase()"
            maxlength="6"
            placeholder="如：ROSE42"
            class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-400 outline-none font-mono text-xl text-center tracking-widest uppercase" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">队伍名称</label>
          <input v-model="teamNameInput"
            maxlength="20"
            placeholder="如：第一组"
            class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-400 outline-none" />
        </div>
        <div v-if="joinError" class="text-red-600 text-sm text-center bg-red-50 rounded-lg py-2">{{ joinError }}</div>
        <button @click="joinGame"
          :disabled="!roomCodeInput || !teamNameInput"
          class="w-full py-3 font-bold rounded-xl text-lg transition-colors"
          :class="roomCodeInput && teamNameInput
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
          加入竞赛 →
        </button>
      </div>
    </div>

    <!-- Phase: waiting -->
    <div v-else-if="phase === 'waiting'" class="max-w-md mx-auto pt-12 text-center">
      <div class="text-5xl mb-4 animate-pulse">🌸</div>
      <h1 class="text-2xl font-bold text-orange-800 mb-2">已加入！等待开始</h1>
      <div class="bg-white rounded-2xl p-6 border border-orange-200 mb-4">
        <p class="text-slate-500 text-sm mb-1">你的队伍</p>
        <p class="text-2xl font-bold text-orange-700">{{ teamName }}</p>
      </div>
      <p class="text-slate-500 text-sm">目前已有 {{ teamCount }} 支队伍加入，等待老师开始...</p>

      <!-- 各队列表实时更新 -->
      <div v-if="waitingTeams.length > 0" class="mt-4 bg-white rounded-2xl p-4 border border-orange-100">
        <div class="grid grid-cols-2 gap-2">
          <div v-for="t in waitingTeams" :key="t.teamId"
            class="bg-orange-50 rounded-lg py-2 px-3 text-sm font-medium text-orange-800">
            {{ t.teamName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Phase: question -->
    <div v-else-if="phase === 'question'" class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-slate-500">第 {{ questionIndex + 1 }} / {{ questionTotal }} 题</span>
        <span class="font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm">
          {{ teamName }} · {{ myScore }} 分
        </span>
      </div>

      <!-- 题目 -->
      <div class="bg-white rounded-2xl p-6 border border-orange-200 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">{{ currentQuestion?.icon }}</span>
          <span class="text-sm px-2 py-0.5 rounded-full font-medium" :class="currentQuestion?.categoryColor">
            {{ currentQuestion?.categoryLabel }}
          </span>
        </div>
        <h2 class="font-bold text-lg text-slate-800 mb-3">{{ currentQuestion?.title }}</h2>
        <p class="text-slate-600 text-sm leading-relaxed">{{ currentQuestion?.scenario }}</p>
      </div>

      <!-- 选项 -->
      <div class="space-y-3 mb-4">
        <button v-for="opt in currentQuestion?.options" :key="opt.key"
          @click="submitAnswer(opt.key)"
          :disabled="myAnswer !== null"
          class="w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all"
          :class="getOptionClass(opt.key)">
          <span class="font-bold mr-2">{{ opt.key }}.</span>{{ opt.text }}
        </button>
      </div>

      <div v-if="myAnswer" class="text-center text-sm text-slate-500 bg-white rounded-xl py-3 border">
        ✅ 已作答，等待老师揭晓答案...
      </div>
    </div>

    <!-- Phase: revealed -->
    <div v-else-if="phase === 'revealed'" class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-slate-500">第 {{ questionIndex + 1 }} / {{ questionTotal }} 题 — 揭晓</span>
      </div>

      <!-- 结果 -->
      <div class="rounded-2xl p-6 border-2 mb-4 text-center"
        :class="roundResult === 'correct' ? 'bg-green-50 border-green-300'
          : roundResult === 'partial' ? 'bg-yellow-50 border-yellow-300'
          : roundResult === 'wrong' ? 'bg-red-50 border-red-300'
          : 'bg-slate-50 border-slate-200'">
        <div class="text-4xl mb-2">{{ roundResultIcon }}</div>
        <div class="font-bold text-xl mb-1" :class="roundResultColor">{{ roundResultText }}</div>
        <div class="text-sm text-slate-500">本题得 {{ roundPoints }} 分 · 总分 {{ myScore }} 分</div>
      </div>

      <!-- 正确答案 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 mb-4">
        <div class="font-bold text-green-700 mb-2">✅ 正确答案：{{ correctAnswer }}</div>
        <p class="text-slate-600 text-sm leading-relaxed">{{ explanation }}</p>
      </div>

      <!-- 次佳答案说明 -->
      <div v-if="partialAnswer && partialExplanation" class="bg-amber-50 rounded-2xl p-5 border border-amber-200 mb-4">
        <div class="font-bold text-amber-700 mb-1">⚡ 次佳答案（1分）：{{ partialAnswer }}. {{ partialText }}</div>
        <p class="text-amber-800 text-sm leading-relaxed mt-2">{{ partialExplanation }}</p>
      </div>

      <!-- 积分榜 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200">
        <h3 class="font-semibold text-slate-700 mb-3">当前排名</h3>
        <div class="space-y-2">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="flex items-center gap-3 py-2 rounded-lg px-3"
            :class="team.teamId === teamId ? 'bg-orange-50' : ''">
            <span class="font-bold w-6 text-center text-slate-400">{{ i + 1 }}</span>
            <span class="flex-1 font-medium" :class="team.teamId === teamId ? 'text-orange-800 font-bold' : 'text-slate-700'">
              {{ team.teamName }} {{ team.teamId === teamId ? '👈' : '' }}
            </span>
            <span class="font-bold text-green-700">{{ team.totalScore }} 分</span>
          </div>
        </div>
      </div>

      <div class="mt-4 text-center text-sm text-slate-400">等待老师进入下一题...</div>
    </div>

    <!-- Phase: ended -->
    <div v-else-if="phase === 'ended'" class="max-w-md mx-auto pt-8 text-center">
      <div class="text-5xl mb-4">🏆</div>
      <h1 class="text-2xl font-bold text-slate-800 mb-6">竞赛结束！</h1>
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <div class="space-y-3">
          <div v-for="(team, i) in teamScores" :key="team.teamId"
            class="flex items-center gap-3 p-3 rounded-xl"
            :class="team.teamId === teamId ? 'bg-orange-100 border-2 border-orange-300' : 'bg-slate-50'">
            <span class="text-2xl">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }}</span>
            <span class="flex-1 font-semibold" :class="team.teamId === teamId ? 'text-orange-800' : 'text-slate-700'">
              {{ team.teamName }}
            </span>
            <span class="font-black text-green-700">{{ team.totalScore }} 分</span>
          </div>
        </div>
      </div>
      <div class="text-slate-500 text-sm mb-6">感谢参与茉莉花研学活动！</div>
      <button @click="joinNextGame"
        class="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-lg">
        参加下一场 →
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useSocket } from '../composables/useSocket.js'

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
}

function submitAnswer(key) {
  if (myAnswer.value !== null) return
  myAnswer.value = key
  socket.emit('team:submit_answer', {
    sessionId: sessionId.value,
    teamId: teamId.value,
    answer: key,
  })
}

function getOptionClass(key) {
  if (myAnswer.value === null) {
    return 'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50 text-slate-700'
  }
  if (myAnswer.value === key) {
    return 'border-orange-400 bg-orange-50 text-orange-800'
  }
  return 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'
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

const roundResultColor = computed(() => {
  const map = { correct: 'text-green-700', partial: 'text-yellow-700', wrong: 'text-red-700', skipped: 'text-slate-500' }
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
})

socket.on('team:answer_confirmed', () => {
  // answer is already set in myAnswer
})

socket.on('game:answer_revealed', (data) => {
  phase.value = 'revealed'
  correctAnswer.value = data.correctAnswer
  explanation.value = data.explanation
  partialAnswer.value = data.partialAnswer
  partialText.value = data.partialText
  partialExplanation.value = data.partialExplanation
  teamScores.value = data.teamScores

  // Calculate my round points
  const me = data.teamScores.find(t => t.teamId === teamId.value)
  if (me) myScore.value = me.totalScore
  const prevScore = myScore.value
  // roundPoints = totalScore change (rough estimate)
  // We'll compute from myAnswer vs correctAnswer
  if (!myAnswer.value) {
    roundPoints.value = 0
  } else if (myAnswer.value === data.correctAnswer) {
    roundPoints.value = 3
  } else {
    // Check if partial (score=1 option)
    // We don't have option scores client-side, approximate
    roundPoints.value = 0
  }
})

socket.on('game:waiting_next', () => {
  // Server tells us next question is coming
})

socket.on('game:session_ended', (data) => {
  phase.value = 'ended'
  teamScores.value = data.finalScores
})

onUnmounted(() => {
  socket.off('team:join_error')
  socket.off('team:joined')
  socket.off('screen:teams_updated')
  socket.off('game:question_started')
  socket.off('team:answer_confirmed')
  socket.off('game:answer_revealed')
  socket.off('game:waiting_next')
  socket.off('game:session_ended')
})
</script>
