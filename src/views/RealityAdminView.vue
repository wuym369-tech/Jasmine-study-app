<template>
  <div class="reality-admin min-h-screen bg-cream-50">
    <!-- 顶部导航 -->
    <nav class="reality-admin-nav sticky top-0 left-0 right-0 z-50 border-b border-stone-200">
      <div class="reality-admin-nav-inner max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/images/jasmine-logo.png" alt="香香花园" class="h-10 w-auto object-contain" />
          <span class="text-lg font-bold text-bamboo-600">现实挑战 - 教师控制台</span>
        </div>
        <div class="flex items-center gap-4">
          <button 
            v-if="!sessionId"
            @click="createSession" 
            :disabled="!canCreate"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="canCreate ? 'bg-coral-500 text-white hover:bg-coral-600' : 'bg-stone-200 text-stone-400 cursor-not-allowed'"
          >
            {{ creating ? '创建中…' : socketConnected ? '创建游戏' : '连接中…' }}
          </button>
          <button @click="$router.push('/admin')" class="text-stone-500 hover:text-bamboo-600 transition-colors">
            返回控制台
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <div class="pt-20 px-4 pb-12 flex justify-center">
      <!-- 创建游戏界面 -->
      <div v-if="!sessionId" class="w-full max-w-2xl">
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-stone-200">
          <div class="text-center mb-8">
            <JasmineGrowthAnimation :health="60" size="large" :hasFlower="false" :isBlooming="false" stage="cutting" />
            <h1 class="text-3xl font-bold text-stone-700 mb-2">创建现实挑战</h1>
            <p class="text-stone-500">创建一个新的14天农场生存挑战游戏</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-stone-600 mb-3">选择季节</label>
              <div class="grid grid-cols-4 gap-3">
                <button
                  v-for="season in seasons"
                  :key="season.id"
                  @click="selectedSeason = season.id"
                  class="p-4 rounded-xl border-2 text-center transition-all"
                  :class="selectedSeason === season.id 
                    ? 'border-coral-500 bg-amber-100' 
                    : 'border-stone-200 hover:border-coral-500/50'"
                >
                  <div class="text-3xl mb-2">{{ season.icon }}</div>
                  <div class="font-medium">{{ season.name }}</div>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200/60">
              <input 
                v-model="showAnimations" 
                type="checkbox" 
                id="animations"
                class="w-5 h-5 rounded accent-coral-500"
              />
              <label for="animations" class="text-stone-600">启用茉莉花生长动画</label>
            </div>

            <p v-if="!socketConnected" class="text-center text-sm text-stone-500">
              正在连接服务器…
            </p>
            <button 
              @click="createSession"
              :disabled="!canCreate"
              class="w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              :class="canCreate ? 'bg-coral-500 hover:bg-coral-600' : 'bg-stone-200'"
            >
              {{ creating ? '创建中…' : socketConnected ? '创建游戏' : '请稍候…' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 游戏进行监控 -->
      <div v-else class="w-full max-w-5xl">
        <!-- 场次信息卡片 -->
        <div class="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-stone-200">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-6">
              <div>
                <div class="text-sm text-stone-500">场次号</div>
                <div class="text-3xl font-mono font-bold text-coral-500">{{ sessionId }}</div>
              </div>
              <a
                :href="screenUrl"
                target="_blank"
                rel="noopener"
                class="px-4 py-2 rounded-lg font-medium bg-bamboo-500 text-white hover:bg-bamboo-400 transition-colors"
              >
                打开大屏幕（新分页）
              </a>
              <div class="h-10 w-px bg-stone-200"></div>
              <div>
                <div class="text-sm text-stone-500">当前季节</div>
                <div class="text-xl font-bold text-stone-700">{{ currentSeasonName }}</div>
              </div>
              <div class="h-10 w-px bg-stone-200"></div>
              <div>
                <div class="text-sm text-stone-500">参与队伍</div>
                <div class="text-xl font-bold text-stone-700">{{ teams.length }}</div>
              </div>
              <div class="h-10 w-px bg-stone-200"></div>
              <div>
                <div class="text-sm text-stone-500">已完成</div>
                <div class="text-xl font-bold text-stone-700">
                  {{ teams.filter(t => t.status === 'finished').length }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-sm text-stone-500">平均进度</div>
                <div class="text-xl font-bold text-bamboo-500">
                  第 {{ averageProgress }} 天
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 队伍详细状态 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            v-for="(team, index) in leaderboard" 
            :key="team.teamId"
            class="bg-white rounded-2xl p-5 shadow-lg border border-stone-200"
          >
            <div class="flex items-center gap-3 mb-4">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                :class="index < 3 ? 'bg-coral-500' : 'bg-stone-400'"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="font-bold text-stone-700">{{ team.teamName }}</div>
                <div class="text-sm text-stone-500">
                  {{ team.preview ? '进行中' : '已完成' }} · 
                  第{{ team.currentDay || team.finalStats?.currentDay }}天
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-coral-500">{{ team.totalScore }}</div>
                <div class="text-xs text-stone-500">{{ team.grade }}级</div>
              </div>
            </div>

            <!-- 详细状态 -->
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2">
                <div class="bg-amber-50 rounded-lg p-2 text-center">
                  <div class="text-xs text-stone-500">健康</div>
                  <div class="font-bold text-bamboo-600">{{ Math.round(team.finalStats?.plantHealth || 0) }}%</div>
                </div>
                <div class="bg-amber-50 rounded-lg p-2 text-center">
                  <div class="text-xs text-stone-500">品质</div>
                  <div class="font-bold text-bamboo-600">{{ Math.round(team.finalStats?.flowerQuality || 0) }}%</div>
                </div>
                <div class="bg-amber-50 rounded-lg p-2 text-center">
                  <div class="text-xs text-stone-500">士气</div>
                  <div class="font-bold text-bamboo-600">{{ Math.round(team.finalStats?.teamMood || 0) }}%</div>
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="bg-amber-50 rounded-lg p-2 text-center">
                  <div class="text-xs text-stone-500">资金</div>
                  <div class="font-bold text-bamboo-600">¥{{ team.finalStats?.money || 0 }}</div>
                </div>
                <div class="bg-amber-50 rounded-lg p-2 text-center">
                  <div class="text-xs text-stone-500">人力</div>
                  <div class="font-bold text-bamboo-600">{{ team.finalStats?.labor || 0 }}人</div>
                </div>
                <div class="bg-amber-50 rounded-lg p-2 text-center">
                  <div class="text-xs text-stone-500">利润</div>
                  <div class="font-bold" :class="(team.finalStats?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-500'">
                    ¥{{ team.finalStats?.netProfit || 0 }}
                  </div>
                </div>
              </div>
              
              <!-- 成长阶段 -->
              <div class="flex items-center gap-2 mt-2">
                <span class="text-sm text-stone-500">阶段:</span>
                <span class="px-2 py-1 bg-bamboo-500 text-white rounded text-xs">
                  {{ team.finalStats?.growthStageName || '扦插期' }}
                </span>
                <span class="text-xs text-stone-500">
                  ({{ team.finalStats?.stageProgress || 0 }}%)
                </span>
              </div>
              
              <!-- 连击 -->
              <div v-if="team.finalStats?.streak > 0" class="flex items-center gap-2">
                <span class="text-sm text-stone-500">连击:</span>
                <span class="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs flex items-center gap-1">
                  <span>🔥</span>
                  <span>{{ team.finalStats?.streak }}</span>
                </span>
              </div>
              
              <!-- 最新成就 -->
              <div v-if="team.finalStats?.achievements?.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span 
                  v-for="achievement in team.finalStats.achievements.slice(-2)" 
                  :key="achievement.timestamp"
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs"
                >
                  <span>{{ achievement.icon }}</span>
                  <span>{{ achievement.title }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="mt-8 flex gap-4">
          <button 
            @click="resetGame"
            class="px-6 py-3 rounded-xl font-semibold bg-white border-2 border-stone-200 text-stone-500 hover:border-coral-500 hover:text-coral-500 transition-colors"
          >
            🔄 重新开始新场次
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import JasmineGrowthAnimation from '../components/JasmineGrowthAnimation.vue'

const router = useRouter()
const route = useRoute()

// 季节选项
const seasons = [
  { id: 'spring', name: '春季', icon: '🌸' },
  { id: 'summer', name: '夏季', icon: '☀️' },
  { id: 'autumn', name: '秋季', icon: '🍂' },
  { id: 'winter', name: '冬季', icon: '❄️' }
]

// 状态
const socket = ref(null)
const sessionId = ref('')
const teams = ref([])
const leaderboard = ref([])
const finalResults = ref(null)

// 配置
const selectedSeason = ref('spring')
const showAnimations = ref(true)
const socketConnected = ref(false)
const creating = ref(false)

// 计算属性
const currentSeasonName = computed(() => {
  return seasons.find(s => s.id === selectedSeason.value)?.name || '春季'
})

const activeTeams = computed(() => {
  return teams.value.filter(t => t.status === 'playing').length
})

const gameStatus = computed(() => {
  if (finalResults.value) return 'finished'
  if (teams.value.length > 0) return 'playing'
  return 'waiting'
})

const averageProgress = computed(() => {
  if (leaderboard.value.length === 0) return 0
  const total = leaderboard.value.reduce((sum, t) => {
    return sum + (t.currentDay || t.finalStats?.currentDay || 1)
  }, 0)
  return Math.round(total / leaderboard.value.length)
})

const canCreate = computed(() => socketConnected.value && !creating.value)

const screenUrl = computed(() => {
  if (!sessionId.value) return '#'
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/reality/screen/${sessionId.value}`
})

// 方法
function initSocket() {
  socket.value = io(window.location.origin, {
    path: '/socket.io',
    transports: ['websocket', 'polling']
  })

  socket.value.on('connect', () => {
    console.log('Admin connected to reality game server')
    socketConnected.value = true
  })

  socket.value.on('disconnect', () => {
    socketConnected.value = false
  })

  socket.value.on('reality:created', (data) => {
    creating.value = false
    sessionId.value = data.sessionId
    teams.value = []
    finalResults.value = null
    // 留在教師控制台，不跳轉；大屏幕請另開分頁 /reality/screen/場次號
  })

  socket.value.on('reality:rejoined', (data) => {
    sessionId.value = data.sessionId
    teams.value = data.session?.teams || []
    leaderboard.value = data.leaderboard || []
  })

  socket.value.on('reality:team_joined', (data) => {
    teams.value = data.teams || []
    leaderboard.value = data.leaderboard || []
  })

  socket.value.on('reality:leaderboard', (data) => {
    leaderboard.value = data.leaderboard || []
    // 更新队伍列表
    if (data.leaderboard) {
      teams.value = data.leaderboard.map(t => ({
        teamId: t.teamId,
        teamName: t.teamName,
        status: t.preview ? 'playing' : 'finished',
        currentDay: t.currentDay,
        ...t.finalStats
      }))
    }
  })

  socket.value.on('reality:error', (data) => {
    creating.value = false
    alert(data.message)
  })
}

function createSession() {
  if (!socketConnected.value || creating.value) return
  creating.value = true
  socket.value.emit('reality:create', {
    season: selectedSeason.value,
    config: {
      enableAnimations: showAnimations.value
    }
  })
}

function resetGame() {
  sessionId.value = ''
  teams.value = []
  leaderboard.value = []
  finalResults.value = null
}

// 生命周期
onMounted(() => {
  initSocket()
  
  // 检查URL参数中是否有sessionId（页面刷新后恢复状态）
  const urlSessionId = route.query.session
  if (urlSessionId) {
    sessionId.value = urlSessionId
    // 重新加入场次获取最新状态
    socket.value.emit('reality:teacher:rejoin', { sessionId: urlSessionId })
  }
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

<style scoped>
@reference "tailwindcss";

.reality-admin {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.reality-admin-nav {
  background: rgba(253, 251, 247, 0.95);
  backdrop-filter: blur(20px);
}

.reality-admin-nav-inner {
  padding: 0 24px;
}
</style>
