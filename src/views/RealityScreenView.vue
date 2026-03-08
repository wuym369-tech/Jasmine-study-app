<template>
  <div class="reality-screen min-h-screen bg-cream-50 overflow-hidden">
    <!-- 顶部状态栏 -->
    <div class="reality-screen-nav fixed top-0 left-0 right-0 z-50 border-b border-stone-200">
      <div class="reality-screen-nav-inner max-w-6xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <img src="/images/jasmine-logo.png" alt="香香花园" class="h-12 w-auto object-contain" />
            <div>
              <div class="text-xl font-bold text-bamboo-600">现实挑战</div>
              <div class="text-sm text-stone-500">大屏幕实时监控</div>
            </div>
          </div>
          <div class="h-10 w-px bg-stone-200"></div>
          <div v-if="sessionId">
            <div class="text-sm text-stone-500">场次号</div>
            <div class="text-3xl font-mono font-bold tracking-widest text-coral-500">{{ sessionId }}</div>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div v-if="leaderboard.length > 0" class="text-center">
            <div class="text-sm text-stone-500">参与队伍</div>
            <div class="text-2xl font-bold text-stone-700">{{ leaderboard.length }}</div>
          </div>
          <div v-if="finishedCount > 0" class="text-center">
            <div class="text-sm text-stone-500">已完成</div>
            <div class="text-2xl font-bold text-bamboo-500">{{ finishedCount }}</div>
          </div>
          <div v-if="averageDay > 0" class="text-center">
            <div class="text-sm text-stone-500">平均进度</div>
            <div class="text-2xl font-bold text-bamboo-600">第{{ averageDay }}天</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="pt-28 px-4 md:px-8 pb-8 h-screen overflow-hidden flex justify-center">
      <!-- 等待加入 -->
      <div v-if="!sessionId || leaderboard.length === 0" class="h-full flex items-center justify-center w-full max-w-4xl">
        <div class="text-center">
          <div class="mb-6">
            <JasmineGrowthAnimation :health="60" size="large" :hasFlower="false" :isBlooming="false" stage="cutting" />
          </div>
          <h1 class="text-5xl font-bold text-stone-700 mb-4">现实挑战</h1>
          <p class="text-2xl text-stone-500 mb-8">
            {{ sessionId ? '等待队伍加入...' : '大屏幕已就绪，等待场次创建...' }}
          </p>
          <div v-if="sessionId" class="bg-white rounded-3xl p-8 shadow-xl border border-stone-200">
            <div class="text-lg text-stone-500 mb-2">场次号</div>
            <div class="text-7xl font-mono font-bold tracking-widest text-coral-500">{{ sessionId }}</div>
          </div>
          <div v-else class="text-stone-400">
            教师创建游戏后，场次号将自动显示
          </div>
        </div>
      </div>

      <!-- 遊戲進行中：各隊大卡片填滿畫面，即時進度 + 動畫 -->
      <div v-else class="h-full flex flex-col gap-4 overflow-hidden w-full max-w-6xl mx-auto">
        <div
          class="screen-teams-grid flex-1 min-h-0 grid gap-4"
          :class="screenGridCols"
        >
          <div
            v-for="(team, index) in leaderboard"
            :key="team.teamId"
            class="screen-team-card min-h-0 flex flex-col rounded-3xl border-2 overflow-hidden transition-all duration-500"
            :class="[
              index === 0 ? 'screen-team-card--first border-coral-500 bg-amber-100/50' : '',
              index === 1 ? 'border-amber-400 bg-amber-50/50' : '',
              index === 2 ? 'border-orange-300 bg-orange-50/50' : '',
              index > 2 ? 'border-stone-200 bg-white' : ''
            ]"
          >
            <div class="flex items-center justify-between px-6 py-3 shrink-0 border-b border-stone-200/60">
              <div class="flex items-center gap-4">
                <div
                  class="screen-rank-badge w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
                  :class="[
                    index === 0 ? 'bg-coral-500 rank-glow' : '',
                    index === 1 ? 'bg-amber-500' : '',
                    index === 2 ? 'bg-orange-500' : '',
                    index > 2 ? 'bg-stone-500' : ''
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <div class="text-xl md:text-2xl font-bold text-stone-700 truncate max-w-[12rem]">{{ team.teamName }}</div>
                  <div class="text-sm text-stone-500">
                    第 {{ team.currentDay ?? team.finalStats?.currentDay ?? 1 }} 天
                    <span class="ml-2">{{ team.preview ? '进行中' : '已完成' }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl md:text-4xl font-black transition-all duration-500" :class="[
                  index === 0 ? 'text-coral-500' : '',
                  index === 1 ? 'text-amber-500' : '',
                  index === 2 ? 'text-orange-500' : 'text-bamboo-600'
                ]">{{ team.totalScore }}</div>
                <div class="text-xs text-stone-500">{{ team.grade }}级</div>
              </div>
            </div>

            <div class="flex-1 min-h-0 flex flex-col md:flex-row items-center gap-4 p-6">
              <div class="screen-animation-wrap shrink-0">
                <JasmineGrowthAnimation
                  :health="team.finalStats?.plantHealth ?? 60"
                  size="large"
                  :hasFlower="(team.finalStats?.plantHealth ?? 0) > 60"
                  :isBlooming="(team.finalStats?.plantHealth ?? 0) > 75"
                  :stage="teamStage(team)"
                />
              </div>
              <div class="flex-1 min-w-0 w-full space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-stone-500">植株健康</span>
                    <span class="font-bold text-stone-700">{{ Math.round(team.finalStats?.plantHealth ?? 0) }}%</span>
                  </div>
                  <div class="h-4 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      class="screen-progress-bar h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700"
                      :style="{ width: `${Math.min(100, team.finalStats?.plantHealth ?? 0)}%` }"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-stone-500">花朵品质</span>
                    <span class="font-bold text-stone-700">{{ Math.round(team.finalStats?.flowerQuality ?? 0) }}%</span>
                  </div>
                  <div class="h-4 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      class="screen-progress-bar h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                      :style="{ width: `${Math.min(100, team.finalStats?.flowerQuality ?? 0)}%` }"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-stone-500">团队士气</span>
                    <span class="font-bold text-stone-700">{{ Math.round(team.finalStats?.teamMood ?? 0) }}%</span>
                  </div>
                  <div class="h-4 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      class="screen-progress-bar h-full bg-gradient-to-r from-bamboo-500 to-bamboo-400 rounded-full transition-all duration-700"
                      :style="{ width: `${Math.min(100, team.finalStats?.teamMood ?? 0)}%` }"
                    ></div>
                  </div>
                </div>
                <div class="flex gap-3 text-sm">
                  <span class="px-3 py-1.5 bg-amber-50 rounded-lg">¥{{ team.finalStats?.money ?? 0 }}</span>
                  <span class="px-3 py-1.5 bg-amber-50 rounded-lg">{{ team.finalStats?.labor ?? 0 }} 人</span>
                  <span class="px-3 py-1.5 rounded-lg font-medium" :class="(team.finalStats?.netProfit ?? 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">
                    ¥{{ team.finalStats?.netProfit ?? 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import JasmineGrowthAnimation from '../components/JasmineGrowthAnimation.vue'

const route = useRoute()

// 状态
const socket = ref(null)
const sessionId = ref(route.params.sessionId || '')
const leaderboard = ref([])
const finalResults = ref(null)

// 计算属性
const averageHealth = computed(() => {
  if (leaderboard.value.length === 0) return 0
  const total = leaderboard.value.reduce((sum, t) => sum + (t.finalStats?.plantHealth || 0), 0)
  return Math.round(total / leaderboard.value.length)
})

const averageQuality = computed(() => {
  if (leaderboard.value.length === 0) return 0
  const total = leaderboard.value.reduce((sum, t) => sum + (t.finalStats?.flowerQuality || 0), 0)
  return Math.round(total / leaderboard.value.length)
})

const totalFlowers = computed(() => {
  return leaderboard.value.reduce((sum, t) => sum + (t.finalStats?.flowersHarvested || 0), 0)
})

const totalProfit = computed(() => {
  return leaderboard.value.reduce((sum, t) => sum + (t.finalStats?.netProfit || 0), 0)
})

const finishedCount = computed(() => {
  return leaderboard.value.filter(t => !t.preview).length
})

const averageDay = computed(() => {
  if (leaderboard.value.length === 0) return 0
  const total = leaderboard.value.reduce((sum, t) => sum + (t.currentDay || t.finalStats?.currentDay || 1), 0)
  return Math.round(total / leaderboard.value.length)
})

// 各隊佔滿畫面：1 隊 1 欄、2–4 隊 2 欄、5–6 隊 3 欄
const screenGridCols = computed(() => {
  const n = leaderboard.value.length
  if (n <= 1) return 'grid-cols-1'
  if (n <= 4) return 'grid-cols-2'
  return 'grid-cols-3'
})

function teamStage(team) {
  const stage = team.finalStats?.growthStage || team.growthStage || 'cutting'
  return stage
}

// 方法
function initSocket() {
  socket.value = io(window.location.origin, {
    path: '/socket.io',
    transports: ['websocket', 'polling']
  })

  socket.value.on('connect', () => {
    console.log('Screen connected to reality game server')
    
    if (sessionId.value) {
      // 已有sessionId，直接加入
      socket.value.emit('reality:screen:join', { sessionId: sessionId.value })
    } else {
      // 没有sessionId，加入等待室，接收新创建的场次
      socket.value.emit('reality:screen:wait')
    }
  })

  socket.value.on('reality:screen:state', (data) => {
    if (data.session?.sessionId) {
      const sid = data.session.sessionId
      const wasWaiting = !sessionId.value
      sessionId.value = sid
      if (window.history.replaceState) {
        window.history.replaceState({}, '', `/reality/screen/${sid}`)
      }
      // 從等待室收到 state 時尚未在該場次房間，需主動 join 才能收到後續 team_joined
      if (wasWaiting) {
        socket.value.emit('reality:screen:join', { sessionId: sid })
      }
    }
    leaderboard.value = data.leaderboard || []
  })

  socket.value.on('reality:team_joined', (data) => {
    if (data.leaderboard) leaderboard.value = data.leaderboard
  })

  socket.value.on('reality:finished', (data) => {
    finalResults.value = data.results || data.leaderboard
  })

  socket.value.on('reality:leaderboard', (data) => {
    leaderboard.value = data.leaderboard || []
  })

  socket.value.on('reality:error', (data) => {
    console.error(data.message)
  })
}

onMounted(() => {
  initSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

<style scoped>
@reference "tailwindcss";

.reality-screen {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.reality-screen-nav {
  background: rgba(253, 251, 247, 0.95);
  backdrop-filter: blur(20px);
}

.reality-screen-nav-inner {
  padding: 0 24px;
}

.screen-teams-grid {
  grid-auto-rows: minmax(0, 1fr);
}

.screen-team-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
.screen-team-card--first {
  box-shadow: 0 8px 32px rgba(212, 112, 74, 0.25);
  animation: screen-card-pulse 2.5s ease-in-out infinite;
}

.screen-rank-badge.rank-glow {
  box-shadow: 0 0 20px rgba(212, 112, 74, 0.5);
  animation: rank-glow-pulse 1.5s ease-in-out infinite;
}

.screen-progress-bar {
  min-width: 4%;
  will-change: width;
}

.screen-animation-wrap :deep(.jasmine-svg) {
  filter: drop-shadow(0 4px 12px rgba(122, 159, 70, 0.2));
}

@keyframes screen-card-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(212, 112, 74, 0.25); }
  50% { box-shadow: 0 12px 40px rgba(212, 112, 74, 0.35); }
}

@keyframes rank-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 112, 74, 0.5); transform: scale(1); }
  50% { box-shadow: 0 0 28px rgba(212, 112, 74, 0.7); transform: scale(1.05); }
}
</style>
