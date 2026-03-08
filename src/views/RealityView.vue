<template>
  <div class="reality-view min-h-screen bg-cream-50">
    <!-- 导航栏：與其他頁面一致 -->
    <nav class="reality-nav fixed top-0 left-0 right-0 z-50">
      <div class="reality-nav-inner">
        <div class="flex items-center gap-3">
          <img src="/images/jasmine-logo.png" alt="香香花园" class="h-10 w-auto object-contain" />
          <span class="text-lg font-bold text-bamboo-600">现实挑战</span>
        </div>
        <button @click="$router.push('/')" class="text-stone-500 hover:text-bamboo-600 transition-colors p-2 rounded-lg hover:bg-stone-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- 主内容区：置中、單一欄 -->
    <div class="pt-20 px-4 pb-12 flex justify-center">
      <div class="reality-main w-full max-w-4xl mx-auto">
        <!-- 资源卡片：置中、在遊戲內容上方 -->
        <div v-if="isConnected" class="bg-white rounded-2xl p-4 shadow-lg border border-stone-200 mb-6">
              <h3 class="font-bold text-stone-700 mb-4 flex items-center gap-2">
                <span>💰</span> 资源状况
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-200/60">
                  <div class="text-sm text-stone-500 mb-1">资金</div>
                  <div class="text-xl font-bold text-bamboo-600">¥{{ teamStatus?.money || 0 }}</div>
                </div>
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-200/60">
                  <div class="text-sm text-stone-500 mb-1">人力</div>
                  <div class="text-xl font-bold text-bamboo-600">{{ teamStatus?.labor || 0 }} 人</div>
                </div>
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-200/60">
                  <div class="text-sm text-stone-500 mb-1">净利润</div>
                  <div class="text-lg font-bold" :class="(teamStatus?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-500'">
                    ¥{{ teamStatus?.netProfit || 0 }}
                  </div>
                </div>
                <div v-if="teamStatus?.streak > 0" class="bg-amber-100 rounded-xl p-3 border border-amber-300">
                  <div class="text-sm text-amber-700 mb-1 flex items-center gap-1"><span>🔥</span> 连击</div>
                  <div class="text-xl font-bold text-amber-700">{{ teamStatus?.streak }}</div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">{{ growthStageIcon }}</span>
                  <span class="font-bold text-stone-700">{{ teamStatus?.growthStageName }}</span>
                </div>
                <div class="flex-1 min-w-[120px]">
                  <div class="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div class="h-full bg-bamboo-400 rounded-full transition-all" :style="{ width: `${teamStatus?.stageProgress || 0}%` }"></div>
                  </div>
                  <div class="text-xs text-stone-500 mt-1 text-right">{{ teamStatus?.stageProgress || 0 }}%</div>
                </div>
              </div>
              <div v-if="teamStatus?.achievements?.length > 0" class="mt-4 pt-4 border-t border-stone-200">
                <div class="text-sm text-stone-500 mb-2">最新成就</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="achievement in teamStatus.achievements" :key="achievement.timestamp" class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs">
                    <span>{{ achievement.icon }}</span>
                    <span>{{ achievement.title }}</span>
                  </span>
                </div>
              </div>
            </div>

        <!-- 游戏内容：置中 -->
        <div class="space-y-6">
            <!-- 未连接状态 - 加入游戏 -->
            <div v-if="!isConnected" class="flex justify-center">
              <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-stone-200">
                <div class="text-center mb-8">
                  <JasmineGrowthAnimation :health="60" size="large" :hasFlower="false" :isBlooming="false" stage="cutting" />
                  <h1 class="text-2xl font-bold text-stone-700 mb-2">加入现实挑战</h1>
                  <p class="text-stone-500">从扦插开始，体验完整的茉莉花生長之旅</p>
                </div>

                <div class="space-y-4 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-[#374151] mb-2">场次号</label>
                    <input 
                      v-model="inputSessionId" 
                      type="text" 
                      placeholder="输入6位场次号"
                      class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-center text-xl font-mono tracking-widest uppercase focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                      maxlength="6"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-[#374151] mb-2">队伍名称</label>
                    <input 
                      v-model="teamName" 
                      type="text" 
                      placeholder="给你的农场起个名字"
                      class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                      maxlength="20"
                    />
                  </div>
                </div>

                <p v-if="!socketConnected" class="text-center text-sm text-stone-500 mb-4">
                  正在连接服务器…
                </p>
                <button 
                  @click="joinGame"
                  :disabled="!canJoin"
                  class="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  :class="canJoin ? 'bg-coral-500 shadow-lg hover:bg-coral-600 hover:shadow-xl' : 'bg-stone-200 cursor-not-allowed'"
                >
                  {{ socketConnected ? '开始挑战' : '请稍候…' }}
                </button>
              </div>
            </div>

            <!-- 游戏进行中 -->
            <div v-else-if="gameStatus === 'playing'" class="space-y-6">
              <!-- 斷線提示：已加入遊戲但 socket 斷開時不跳回加入表單，只顯示重連中 -->
              <div v-if="isConnected && !socketConnected" class="rounded-xl bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 text-center">
                连接断开，正在重连…
              </div>
              <!-- 顶部状态栏 -->
              <div class="bg-white rounded-2xl p-4 shadow-lg border border-stone-200">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="text-center">
                      <div class="text-sm text-stone-500">第 {{ currentDay }} 天</div>
                      <div class="text-xl font-bold text-bamboo-600">{{ weekDayName }}</div>
                    </div>
                    <div class="h-10 w-px bg-stone-200"></div>
                    <div class="text-sm text-stone-500">
                      进度: {{ currentDay }} / {{ totalDays }} 天
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-center">
                      <div class="text-sm text-stone-500">当前得分</div>
                      <div class="text-2xl font-bold text-coral-500">{{ teamStatus?.totalScore || 0 }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 茉莉花生长可视化 -->
              <div class="bg-white rounded-3xl p-6 shadow-xl border border-stone-200">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-stone-700 mb-1">{{ teamName }}的茉莉花</h3>
                  <p class="text-sm text-stone-500">{{ growthStageName }}</p>
                </div>

                <div class="flex justify-center mb-6">
                  <JasmineGrowthAnimation 
                    :health="teamStatus?.plantHealth || 60"
                    size="large"
                    :hasFlower="hasFlower"
                    :isBlooming="teamStatus?.plantHealth > 75"
                    :stage="currentStage"
                  />
                </div>

                <!-- 状态条 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="text-stone-500">植株健康</span>
                      <span class="font-semibold" :class="healthColorClass">{{ Math.round(teamStatus?.plantHealth || 60) }}%</span>
                    </div>
                    <div class="h-3 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-700"
                        :class="healthBarClass"
                        :style="{ width: `${teamStatus?.plantHealth || 60}%` }"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="text-stone-500">花朵品质</span>
                      <span class="font-semibold" :class="qualityColorClass">{{ Math.round(teamStatus?.flowerQuality || 60) }}%</span>
                    </div>
                    <div class="h-3 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-700"
                        :class="qualityBarClass"
                        :style="{ width: `${teamStatus?.flowerQuality || 60}%` }"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="text-stone-500">团队士气</span>
                      <span class="font-semibold" :class="moodColorClass">{{ Math.round(teamStatus?.teamMood || 60) }}%</span>
                    </div>
                    <div class="h-3 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-700"
                        :class="moodBarClass"
                        :style="{ width: `${teamStatus?.teamMood || 60}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 当天进度 -->
              <div v-if="teamStatus?.currentEvents" class="bg-white rounded-2xl p-4 shadow-lg border border-stone-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm text-stone-500">今天的事件</span>
                  <span class="text-sm font-medium text-bamboo-500">
                    {{ completedEventsCount }} / {{ teamStatus.currentEvents.length }} 已完成
                  </span>
                </div>
                <div class="flex gap-2">
                  <div 
                    v-for="(event, index) in teamStatus.currentEvents" 
                    :key="index"
                    class="flex-1 h-3 rounded-full transition-all"
                    :class="isEventCompleted(event.eventInstanceId) ? 'bg-bamboo-500' : 'bg-stone-200'"
                  ></div>
                </div>
              </div>

              <!-- 当前事件卡片 -->
              <div v-if="currentEvent" class="bg-white rounded-3xl p-6 shadow-xl border border-stone-200">
                <div class="flex items-start gap-4 mb-6">
                  <div class="text-4xl">{{ currentEvent.icon }}</div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 class="text-xl font-bold text-stone-700">{{ currentEvent.title }}</h3>
                      <span 
                        v-if="currentEvent.complexity === 'complex'"
                        class="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold"
                      >
                        复杂
                      </span>
                      <span 
                        v-else
                        class="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-bold"
                      >
                        简单
                      </span>
                      <span v-if="currentEvent.questionType === 'multiple'" class="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">多選</span>
                      <span v-if="currentEvent.questionType === 'sort'" class="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">排序</span>
                    </div>
                    <p class="text-stone-500">{{ currentEvent.description }}</p>
                  </div>
                </div>

                <!-- 單選 -->
                <div v-if="!currentEvent.questionType || currentEvent.questionType === 'single'" class="space-y-3">
                  <button
                    v-for="option in currentEvent.options"
                    :key="option.id"
                    @click="submitDecision(option.id)"
                    class="w-full p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.01]"
                    :class="selectedOption === option.id 
                      ? 'border-coral-500 bg-amber-100' 
                      : 'border-stone-200 bg-white hover:border-coral-500/50'"
                  >
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                        {{ option.id }}
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-[#374151] mb-2">{{ option.text }}</p>
                        <div class="flex items-center gap-4 text-sm">
                          <span v-if="option.cost?.money" class="text-red-500">💰 -{{ option.cost.money }}</span>
                          <span v-if="option.cost?.labor" class="text-blue-500">👷 -{{ option.cost.labor }}</span>
                          <span v-if="option.isOrganic === false" class="text-orange-500">⚠️ 影响有机认证</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <!-- 多選 -->
                <div v-else-if="currentEvent.questionType === 'multiple'" class="space-y-3">
                  <p class="text-sm text-stone-500 mb-2">可多選，選完後點「確認」</p>
                  <button
                    v-for="option in currentEvent.options"
                    :key="option.id"
                    @click="toggleMultiOption(option.id)"
                    class="w-full p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.01]"
                    :class="selectedOptionIds.includes(option.id) 
                      ? 'border-coral-500 bg-amber-100' 
                      : 'border-stone-200 bg-white hover:border-coral-500/50'"
                  >
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded border-2 flex items-center justify-center flex-shrink-0" :class="selectedOptionIds.includes(option.id) ? 'border-coral-500 bg-coral-500 text-white' : 'border-stone-200'">
                        <span v-if="selectedOptionIds.includes(option.id)">✓</span>
                        <span v-else class="text-[#94A3B8]">{{ option.id }}</span>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-[#374151] mb-2">{{ option.text }}</p>
                        <div class="flex items-center gap-4 text-sm">
                          <span v-if="option.cost?.money" class="text-red-500">💰 -{{ option.cost.money }}</span>
                          <span v-if="option.cost?.labor" class="text-blue-500">👷 -{{ option.cost.labor }}</span>
                          <span v-if="option.isOrganic === false" class="text-orange-500">⚠️ 影响有机认证</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <p class="text-sm text-stone-500">已选 {{ selectedOptionIds.length }} 项</p>
                </div>

                <!-- 排序 -->
                <div v-else-if="currentEvent.questionType === 'sort'" class="space-y-3">
                  <p class="text-sm text-stone-500 mb-2">依正確順序排列（由上到下為 1→2→3→4），用箭頭調整順序後點「確認」</p>
                  <div 
                    v-for="(optId, index) in sortOrder" 
                    :key="optId"
                    class="flex items-center gap-3 p-4 rounded-xl border-2 border-stone-200 bg-white"
                  >
                    <span class="text-lg font-bold text-coral-500 w-8">{{ index + 1 }}</span>
                    <p class="flex-1 font-medium text-[#374151]">{{ currentEvent.options?.find(o => o.id === optId)?.text }}</p>
                    <div class="flex flex-col gap-0.5">
                      <button type="button" @click="moveSortItem(index, -1)" class="p-1 rounded text-stone-500 hover:bg-stone-200" :disabled="index === 0">↑</button>
                      <button type="button" @click="moveSortItem(index, 1)" class="p-1 rounded text-stone-500 hover:bg-stone-200" :disabled="index === sortOrder.length - 1">↓</button>
                    </div>
                  </div>
                </div>

                <button
                  v-if="canConfirmEvent()"
                  @click="confirmDecision"
                  class="w-full mt-6 py-4 rounded-xl font-semibold text-white bg-coral-500 shadow-lg hover:bg-coral-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {{ isLastEvent ? '完成今天，进入下一天 →' : '确认并继续 →' }}
                </button>
              </div>

              <!-- 当天全部完成 -->
              <div v-else-if="allEventsCompleted" class="bg-white rounded-3xl p-8 shadow-xl border border-stone-200 text-center">
                <div class="mb-4">
                  <JasmineGrowthAnimation 
                    :health="teamStatus?.plantHealth || 60"
                    size="large"
                    :hasFlower="hasFlower"
                    :isBlooming="true"
                  />
                </div>
                <div class="text-5xl mb-4">🌟</div>
                <h3 class="text-xl font-bold text-stone-700 mb-2">{{ weekDayName }}的所有挑战已完成！</h3>
                <p class="text-stone-500 mb-4">获得分数: <span class="font-bold text-coral-500">+{{ dayScore }}</span></p>
                <button
                  @click="startNextDay"
                  class="px-8 py-4 rounded-xl font-semibold text-white bg-coral-500 shadow-lg hover:bg-coral-600 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  进入第 {{ currentDay + 1 }} 天 →
                </button>
              </div>
            </div>

            <!-- 游戏结束 -->
            <div v-else-if="gameStatus === 'finished' && finalResult" class="max-w-2xl mx-auto">
              <div class="bg-white rounded-3xl p-8 shadow-xl border border-stone-200 text-center">
                <div class="mb-6">
                  <JasmineGrowthAnimation 
                    :health="finalResult.finalStats?.plantHealth || 60"
                    size="large"
                    :hasFlower="true"
                    :isBlooming="finalResult.totalScore >= 80"
                  />
                </div>
                <h2 class="text-3xl font-bold text-stone-700 mb-2">14天挑战完成！</h2>
                <p class="text-stone-500 mb-6">{{ finalResult.evaluation }}</p>

                <!-- 最终得分 -->
                <div class="bg-gradient-to-br from-bamboo-500 to-bamboo-400 rounded-2xl p-6 mb-6 text-white">
                  <div class="text-sm opacity-80 mb-1">最终得分</div>
                  <div class="text-5xl font-bold">{{ finalResult.totalScore }}</div>
                  <div class="text-2xl font-bold mt-2">等级 {{ finalResult.grade }}</div>
                </div>

                <!-- 详细得分 -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-amber-50 rounded-xl p-4">
                    <div class="text-sm text-stone-500 mb-1">植株健康</div>
                    <div class="text-xl font-bold text-bamboo-600">{{ finalResult.details?.health?.toFixed(1) }}</div>
                  </div>
                  <div class="bg-amber-50 rounded-xl p-4">
                    <div class="text-sm text-stone-500 mb-1">花朵品质</div>
                    <div class="text-xl font-bold text-bamboo-600">{{ finalResult.details?.quality?.toFixed(1) }}</div>
                  </div>
                  <div class="bg-amber-50 rounded-xl p-4">
                    <div class="text-sm text-stone-500 mb-1">经济效益</div>
                    <div class="text-xl font-bold text-bamboo-600">{{ finalResult.details?.income?.toFixed(1) }}</div>
                  </div>
                  <div class="bg-amber-50 rounded-xl p-4">
                    <div class="text-sm text-stone-500 mb-1">团队士气</div>
                    <div class="text-xl font-bold text-bamboo-600">{{ finalResult.details?.mood?.toFixed(1) }}</div>
                  </div>
                </div>

                <!-- 统计数据 -->
                <div class="border-t border-stone-200 pt-6">
                  <h3 class="font-bold text-stone-700 mb-4">14天农场数据</h3>
                  <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div class="text-2xl font-bold text-bamboo-500">{{ finalResult.finalStats?.flowersHarvested || 0 }}</div>
                      <div class="text-xs text-stone-500">采收花朵</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-red-500">{{ finalResult.finalStats?.flowersLost || 0 }}</div>
                      <div class="text-xs text-stone-500">损失花朵</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-bamboo-500">¥{{ finalResult.finalStats?.netProfit || 0 }}</div>
                      <div class="text-xs text-stone-500">净利润</div>
                    </div>
                  </div>
                </div>

                <!-- 错题复盘 -->
                <div v-if="wrongReviewList.length > 0" class="border-t border-stone-200 pt-6 mt-6 text-left">
                  <h3 class="font-bold text-stone-700 mb-2 flex items-center gap-2">
                    <span>📋</span> 错题复盘（共 {{ wrongReviewList.length }} 题）
                  </h3>
                  <p class="text-sm text-stone-500 mb-4">以下是本次答錯的題目與參考正確做法，方便複習。</p>
                  <div class="space-y-6">
                    <div
                      v-for="(item, index) in wrongReviewList"
                      :key="item.eventInstanceId || index"
                      class="bg-stone-50 rounded-xl p-4 border border-stone-200"
                    >
                      <div class="flex items-start gap-2 mb-2">
                        <span class="text-xl">{{ item.icon || '❓' }}</span>
                        <div>
                          <h4 class="font-semibold text-stone-800">{{ item.title }}</h4>
                          <p class="text-sm text-stone-500 mt-0.5">{{ item.description }}</p>
                        </div>
                      </div>
                      <div class="mt-3 space-y-2 text-sm">
                        <div class="flex flex-wrap gap-2 items-start">
                          <span class="text-stone-500 shrink-0">你的選擇：</span>
                          <span class="px-2 py-1 rounded bg-red-100 text-red-800">{{ item.yourAnswerText }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 items-start">
                          <span class="text-stone-500 shrink-0">參考正確：</span>
                          <span class="px-2 py-1 rounded bg-bamboo-100 text-bamboo-700">{{ item.correctAnswerText }}</span>
                        </div>
                        <div v-if="item.baseScore != null" class="text-stone-400 text-xs">本題得分 {{ item.baseScore }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  @click="resetGame"
                  class="mt-8 w-full py-4 rounded-xl font-semibold text-bamboo-600 border-2 border-bamboo-500 hover:bg-amber-50 transition-all"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from 'socket.io-client'
import JasmineGrowthAnimation from '../components/JasmineGrowthAnimation.vue'

const route = useRoute()
const router = useRouter()

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 状态
const socket = ref(null)
const isConnected = ref(false)
const inputSessionId = ref('')
const teamName = ref('')
const gameStatus = ref('waiting')
const currentDay = ref(1)
const totalDays = ref(14)
const weekDay = ref(0)
const sessionId = ref('')
const teamId = ref('')
const teamStatus = ref(null)
const currentEvent = ref(null)
const selectedOption = ref(null)
const selectedOptionIds = ref([])
const sortOrder = ref([])
const finalResult = ref(null)
const completedEvents = ref([])
const dayScore = ref(0)
const socketConnected = ref(false)

// 计算属性
const canJoin = computed(() => {
  return (
    socketConnected.value &&
    inputSessionId.value.length === 6 &&
    teamName.value.trim().length > 0
  )
})

const weekDayName = computed(() => {
  return weekDays[weekDay.value] || '周一'
})

const growthStageName = computed(() => {
  const health = teamStatus.value?.plantHealth || 60
  const stage = teamStatus.value?.growthStage
  
  if (stage === 'cutting') return '✂️ 扦插期'
  if (stage === 'rooting') return '🌱 生根期'
  if (stage === 'seedling') return '🌿 幼苗期'
  if (health >= 80) return '🌸 花开满枝'
  if (health >= 65) return '🌿 茁壮成长'
  if (health >= 50) return '🍃 需要关注'
  return '🥀 急需救治'
})

const growthStageIcon = computed(() => {
  const stage = teamStatus.value?.growthStage
  if (stage === 'cutting') return '✂️'
  if (stage === 'rooting') return '🌱'
  if (stage === 'seedling') return '🌿'
  if (stage === 'vegetative') return '🌳'
  if (stage === 'flowering') return '🌸'
  return '🏆'
})

const currentStage = computed(() => {
  const stage = teamStatus.value?.growthStage
  if (!stage || stage === 'cutting') return 'cutting'
  if (stage === 'rooting') return 'rooting'
  if (stage === 'seedling') return 'seedling'
  if (stage === 'vegetative') return 'vegetative'
  if (stage === 'flowering' || stage === 'harvest') return 'blooming'
  return 'cutting'
})

const hasFlower = computed(() => {
  const stage = teamStatus.value?.growthStage
  return stage === 'flowering' || stage === 'harvest' || teamStatus.value?.flowersHarvested > 0
})

const completedEventsCount = computed(() => {
  return completedEvents.value.length
})

// 錯題復盤：從結束後的 completedEvents 篩出答錯的題目並組出「你的選擇」與「參考正確」文案
const wrongReviewList = computed(() => {
  const list = finalResult.value?.finalStats?.completedEvents || []
  return list
    .filter(ce => ce.isWrong)
    .map(ce => {
      const ev = ce
      const opt = ev.options || []
      const decision = ce.decision || {}
      let yourAnswerText = ''
      let correctAnswerText = ''
      const qt = ev.questionType || 'single'
      if (qt === 'multiple' && Array.isArray(decision.optionIds)) {
        yourAnswerText = decision.optionIds.map(id => opt.find(o => o.id === id)?.text).filter(Boolean).join('；') || '—'
        const correctIds = ev.correctOptionIds || []
        correctAnswerText = correctIds.map(id => opt.find(o => o.id === id)?.text).filter(Boolean).join('；') || '—'
      } else if (qt === 'sort' && Array.isArray(decision.order)) {
        yourAnswerText = decision.order.map(id => opt.find(o => o.id === id)?.text).filter(Boolean).join(' → ') || '—'
        const correctOrder = ev.correctOrder || []
        correctAnswerText = correctOrder.map(id => opt.find(o => o.id === id)?.text).filter(Boolean).join(' → ') || '—'
      } else {
        const chosenId = decision.optionId
        const chosen = opt.find(o => o.id === chosenId)
        yourAnswerText = chosen?.text || '—'
        const best = opt.slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
        correctAnswerText = best?.text || '—'
      }
      return {
        eventInstanceId: ce.eventInstanceId,
        title: ev.title,
        description: ev.description,
        icon: ev.icon,
        yourAnswerText: yourAnswerText || '—',
        correctAnswerText: correctAnswerText || '—',
        baseScore: ce.baseScore
      }
    })
})

const allEventsCompleted = computed(() => {
  if (!teamStatus.value?.currentEvents) return false
  return teamStatus.value.currentEvents.every(e => 
    completedEvents.value.some(ce => ce.eventInstanceId === e.eventInstanceId)
  )
})

const isLastEvent = computed(() => {
  if (!teamStatus.value?.currentEvents) return false
  const remaining = teamStatus.value.currentEvents.filter(e => 
    !completedEvents.value.some(ce => ce.eventInstanceId === e.eventInstanceId)
  )
  return remaining.length === 1 && currentEvent.value && remaining[0].eventInstanceId === currentEvent.value.eventInstanceId
})

const healthColorClass = computed(() => {
  const health = teamStatus.value?.plantHealth || 60
  if (health >= 75) return 'text-green-600'
  if (health >= 50) return 'text-yellow-600'
  return 'text-red-600'
})

const healthBarClass = computed(() => {
  const health = teamStatus.value?.plantHealth || 60
  if (health >= 75) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (health >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})

const qualityColorClass = computed(() => {
  const quality = teamStatus.value?.flowerQuality || 60
  if (quality >= 75) return 'text-green-600'
  if (quality >= 50) return 'text-yellow-600'
  return 'text-red-600'
})

const qualityBarClass = computed(() => {
  const quality = teamStatus.value?.flowerQuality || 60
  if (quality >= 75) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (quality >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})

const moodColorClass = computed(() => {
  const mood = teamStatus.value?.teamMood || 60
  if (mood >= 75) return 'text-green-600'
  if (mood >= 50) return 'text-yellow-600'
  return 'text-red-600'
})

const moodBarClass = computed(() => {
  const mood = teamStatus.value?.teamMood || 60
  if (mood >= 75) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (mood >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})

// 方法
function isEventCompleted(eventInstanceId) {
  return completedEvents.value.some(ce => ce.eventInstanceId === eventInstanceId)
}

function updateCurrentEvent() {
  if (!teamStatus.value?.currentEvents) return
  
  completedEvents.value = teamStatus.value.completedEvents || []
  
  const pendingEvent = teamStatus.value.currentEvents.find(e => 
    !completedEvents.value.some(ce => ce.eventInstanceId === e.eventInstanceId)
  )
  
  currentEvent.value = pendingEvent || null
  selectedOption.value = null
  selectedOptionIds.value = []
  if (pendingEvent?.questionType === 'sort' && pendingEvent.options?.length) {
    sortOrder.value = [...pendingEvent.options].map(o => o.id).sort(() => Math.random() - 0.5)
  } else {
    sortOrder.value = []
  }
}

function initSocket() {
  socket.value = io(window.location.origin, {
    path: '/socket.io',
    transports: ['websocket', 'polling']
  })

  socket.value.on('connect', () => {
    console.log('Connected to reality game server')
    socketConnected.value = true
    // 若已加入過遊戲（有 sessionId + teamId），重連後自動向伺服器要狀態，避免畫面回到「正在连接服务器」
    if (sessionId.value && teamId.value && isConnected.value) {
      socket.value.emit('reality:team:rejoin', {
        sessionId: sessionId.value,
        teamId: teamId.value
      })
    }
  })

  socket.value.on('disconnect', () => {
    socketConnected.value = false
    // 不斷線時不把 isConnected 設為 false，避免已加入的學生畫面跳回加入表單
  })

  socket.value.on('reality:joined', (data) => {
    teamId.value = data.teamId
    teamStatus.value = data.teamStatus
    currentDay.value = data.teamStatus.currentDay
    weekDay.value = data.teamStatus.currentWeekDay
    gameStatus.value = 'playing'
    isConnected.value = true
    updateCurrentEvent()
  })

  socket.value.on('reality:rejoined', (data) => {
    teamId.value = data.teamId
    teamName.value = data.teamName
    teamStatus.value = data.teamStatus
    currentDay.value = data.teamStatus.currentDay
    weekDay.value = data.teamStatus.currentWeekDay
    gameStatus.value = data.teamStatus.status
    isConnected.value = true
    completedEvents.value = data.teamStatus.completedEvents || []
    updateCurrentEvent()
  })

  socket.value.on('reality:decision_submitted', (data) => {
    teamStatus.value = data.teamStatus
    currentDay.value = data.teamStatus.currentDay
    weekDay.value = data.teamStatus.currentWeekDay
    completedEvents.value = data.teamStatus.completedEvents || []
    
    if (data.dayChanged) {
      dayScore.value = data.teamStatus.totalScore - (teamStatus.value?.totalScore || 0)
      updateCurrentEvent()
    } else {
      updateCurrentEvent()
    }
  })

  socket.value.on('reality:finished', (data) => {
    gameStatus.value = 'finished'
    finalResult.value = data.result
  })

  socket.value.on('reality:state', (data) => {
    if (data.teamStatus) {
      teamStatus.value = data.teamStatus
      currentDay.value = data.teamStatus.currentDay
      weekDay.value = data.teamStatus.currentWeekDay
      gameStatus.value = data.teamStatus.status
      completedEvents.value = data.teamStatus.completedEvents || []
      updateCurrentEvent()
    }
  })

  socket.value.on('reality:error', (data) => {
    alert(data.message)
  })
}

function joinGame() {
  if (!canJoin.value) return

  const sid = inputSessionId.value.toUpperCase()
  const tid = 'team_' + Date.now()
  const tname = teamName.value.trim()

  teamId.value = tid
  sessionId.value = sid
  teamName.value = tname

  socket.value.emit('reality:team:join', {
    sessionId: sid,
    teamId: tid,
    teamName: tname
  })
}

function submitDecision(optionId) {
  if (currentEvent.value?.questionType === 'multiple') {
    const id = selectedOptionIds.value.indexOf(optionId)
    if (id === -1) selectedOptionIds.value = [...selectedOptionIds.value, optionId]
    else selectedOptionIds.value = selectedOptionIds.value.filter((_, i) => i !== id)
    return
  }
  selectedOption.value = optionId
}

function toggleMultiOption(optionId) {
  const id = selectedOptionIds.value.indexOf(optionId)
  if (id === -1) selectedOptionIds.value = [...selectedOptionIds.value, optionId]
  else selectedOptionIds.value = selectedOptionIds.value.filter((_, i) => i !== id)
}

function moveSortItem(index, dir) {
  const o = [...sortOrder.value]
  const ni = index + dir
  if (ni < 0 || ni >= o.length) return
  ;[o[index], o[ni]] = [o[ni], o[index]]
  sortOrder.value = o
}

function canConfirmEvent() {
  const ev = currentEvent.value
  if (!ev || !sessionId.value || !teamId.value) return false
  if (ev.questionType === 'multiple') return selectedOptionIds.value.length > 0
  if (ev.questionType === 'sort') return sortOrder.value.length === (ev.options?.length || 0)
  return !!selectedOption.value
}

function confirmDecision() {
  const ev = currentEvent.value
  if (!ev || !sessionId.value || !teamId.value) return
  let decision
  if (ev.questionType === 'multiple') {
    if (!selectedOptionIds.value.length) return
    decision = { optionIds: [...selectedOptionIds.value] }
  } else if (ev.questionType === 'sort') {
    if (sortOrder.value.length !== (ev.options?.length || 0)) return
    decision = { order: [...sortOrder.value] }
  } else {
    if (!selectedOption.value) return
    decision = { optionId: selectedOption.value }
  }
  socket.value.emit('reality:team:submit', {
    eventInstanceId: ev.eventInstanceId,
    decision
  })
}

function startNextDay() {
  socket.value.emit('reality:get_state')
}

function resetGame() {
  isConnected.value = false
  gameStatus.value = 'waiting'
  currentDay.value = 1
  weekDay.value = 0
  teamStatus.value = null
  currentEvent.value = null
  selectedOption.value = null
  finalResult.value = null
  completedEvents.value = []
  inputSessionId.value = ''
  teamName.value = ''
  
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
  }
  
  router.push('/')
}

onMounted(() => {
  initSocket()

  if (route.params.sessionId) {
    inputSessionId.value = route.params.sessionId.toUpperCase()
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

.reality-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(253, 251, 247, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.reality-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}
</style>
