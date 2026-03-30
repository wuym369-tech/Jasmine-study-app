<template>
  <div class="reality-page min-h-screen">
    <div class="reality-page-bg" aria-hidden="true" />

    <!-- ===== 游戏结算全屏覆盖层 ===== -->
    <div v-if="gameStatus === 'finished'" style="position:fixed;inset:0;z-index:200;overflow-y:auto;background:#fafaf9;">
      <div style="min-height:100%;padding:2rem 1rem;display:flex;align-items:flex-start;justify-content:center;">
        <div style="width:100%;max-width:640px;">

          <!-- 标题区 -->
          <div style="background:#fff;border-radius:1.25rem;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:2rem;text-align:center;margin-bottom:1.5rem;">
            <div style="font-size:4rem;margin-bottom:0.75rem;">🌸</div>
            <h2 style="font-size:1.75rem;font-weight:700;color:#1c1917;margin-bottom:0.5rem;">挑战完成！</h2>
            <p style="color:#78716c;font-size:0.95rem;line-height:1.6;max-width:400px;margin:0 auto 1.5rem;">
              {{ finalResult?.evaluation || '辛苦了！茉莉花挑战圆满结束。' }}
            </p>

            <!-- 最终得分 -->
            <div style="background:linear-gradient(135deg,#5a7a30,#7a9f46);border-radius:1rem;padding:1.25rem;color:#fff;margin-bottom:1rem;">
              <div style="font-size:0.8rem;opacity:0.85;margin-bottom:0.25rem;">最终得分</div>
              <div style="font-size:3rem;font-weight:800;line-height:1;">{{ finalResult?.totalScore ?? teamStatus?.totalScore ?? '—' }}</div>
              <div style="font-size:1.25rem;font-weight:600;margin-top:0.35rem;">等级 {{ finalResult?.grade ?? '—' }}</div>
            </div>

            <!-- 详细得分 -->
            <div v-if="finalResult?.details" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
              <div style="background:#f5f5f4;border-radius:0.75rem;padding:0.75rem;text-align:left;">
                <div style="font-size:0.7rem;color:#78716c;font-weight:500;">植株健康</div>
                <div style="font-size:1.25rem;font-weight:700;color:#5a7a30;">{{ finalResult.details.health?.toFixed(1) }}</div>
              </div>
              <div style="background:#f5f5f4;border-radius:0.75rem;padding:0.75rem;text-align:left;">
                <div style="font-size:0.7rem;color:#78716c;font-weight:500;">花朵品质</div>
                <div style="font-size:1.25rem;font-weight:700;color:#5a7a30;">{{ finalResult.details.quality?.toFixed(1) }}</div>
              </div>
              <div style="background:#f5f5f4;border-radius:0.75rem;padding:0.75rem;text-align:left;">
                <div style="font-size:0.7rem;color:#78716c;font-weight:500;">经济效益</div>
                <div style="font-size:1.25rem;font-weight:700;color:#5a7a30;">{{ finalResult.details.income?.toFixed(1) }}</div>
              </div>
              <div style="background:#f5f5f4;border-radius:0.75rem;padding:0.75rem;text-align:left;">
                <div style="font-size:0.7rem;color:#78716c;font-weight:500;">团队士气</div>
                <div style="font-size:1.25rem;font-weight:700;color:#5a7a30;">{{ finalResult.details.mood?.toFixed(1) }}</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button
                type="button"
                @click="restartGame"
                style="flex:1;min-width:120px;background:#5a7a30;color:#fff;border:none;border-radius:0.75rem;padding:0.875rem 1.5rem;font-size:1rem;font-weight:600;cursor:pointer;"
              >🔄 重新挑战</button>
              <button
                type="button"
                @click="resetGame"
                style="flex:1;min-width:120px;background:#f5f5f4;color:#44403c;border:none;border-radius:0.75rem;padding:0.875rem 1.5rem;font-size:1rem;font-weight:600;cursor:pointer;"
              >返回首页</button>
            </div>
          </div>

          <!-- 题目回顾 -->
          <div style="background:#fff;border-radius:1.25rem;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:1.5rem;margin-bottom:1.5rem;">
            <h3 style="font-size:1rem;font-weight:700;color:#1c1917;margin-bottom:1rem;">
              📋 整场回顾（共 {{ allReviewList.length }} 题）
              <span v-if="wrongReviewList.length > 0" style="font-size:0.75rem;background:#fee2e2;color:#dc2626;padding:0.2rem 0.6rem;border-radius:9999px;margin-left:0.5rem;">
                ✗ 做错 {{ wrongReviewList.length }} 题
              </span>
              <span v-else-if="allReviewList.length > 0" style="font-size:0.75rem;background:#dcfce7;color:#16a34a;padding:0.2rem 0.6rem;border-radius:9999px;margin-left:0.5rem;">
                ✓ 全部答对
              </span>
            </h3>
            <div v-if="allReviewList.length === 0" style="text-align:center;color:#a8a29e;padding:1rem 0;font-size:0.875rem;">
              暂无已完成的题目
            </div>
            <div v-else style="display:flex;flex-direction:column;gap:0.75rem;">
              <div
                v-for="(item, idx) in allReviewList"
                :key="idx"
                :style="item.isWrong
                  ? 'background:#fff7f7;border:1.5px solid #fecaca;border-radius:0.875rem;padding:1rem;'
                  : 'background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:0.875rem;padding:1rem;'"
              >
                <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.5rem;">
                  <span style="font-size:1.25rem;flex-shrink:0;">{{ item.icon || '❓' }}</span>
                  <span style="font-weight:600;color:#1c1917;flex:1;font-size:0.9rem;line-height:1.4;">{{ item.title }}</span>
                  <span
                    :style="item.isWrong
                      ? 'flex-shrink:0;font-size:0.7rem;font-weight:700;background:#fee2e2;color:#dc2626;padding:0.15rem 0.5rem;border-radius:9999px;'
                      : 'flex-shrink:0;font-size:0.7rem;font-weight:700;background:#dcfce7;color:#16a34a;padding:0.15rem 0.5rem;border-radius:9999px;'"
                  >{{ item.isWrong ? '✗ 做错' : '✓ 做对' }}</span>
                </div>
                <div style="font-size:0.8rem;display:flex;flex-direction:column;gap:0.3rem;">
                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;">
                    <span style="color:#78716c;font-weight:500;flex-shrink:0;">你的选择</span>
                    <span
                      :style="item.isWrong
                        ? 'background:#fee2e2;color:#b91c1c;padding:0.2rem 0.5rem;border-radius:0.4rem;font-size:0.78rem;'
                        : 'background:#dcfce7;color:#15803d;padding:0.2rem 0.5rem;border-radius:0.4rem;font-size:0.78rem;'"
                    >{{ item.yourAnswerText }}</span>
                  </div>
                  <div v-if="item.isWrong" style="display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;">
                    <span style="color:#78716c;font-weight:500;flex-shrink:0;">参考正确</span>
                    <span style="background:#dcfce7;color:#15803d;padding:0.2rem 0.5rem;border-radius:0.4rem;font-size:0.78rem;">{{ item.correctAnswerText }}</span>
                  </div>
                  <div v-if="item.baseScore != null" style="color:#a8a29e;font-size:0.75rem;">本题得分 {{ item.baseScore }}</div>
                  <div v-if="item.isWrong && item.explanation" style="background:#fefce8;border:1px solid #fde68a;border-radius:0.5rem;padding:0.6rem;margin-top:0.35rem;">
                    <p style="font-size:0.75rem;font-weight:600;color:#92400e;margin-bottom:0.25rem;">📖 知识解析</p>
                    <p style="font-size:0.75rem;color:#78350f;line-height:1.55;">{{ item.explanation }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 农场数据 -->
          <div style="background:#fff;border-radius:1.25rem;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:1.5rem;">
            <h3 style="font-size:1rem;font-weight:700;color:#1c1917;margin-bottom:1rem;">🌾 农场数据汇总</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;text-align:center;">
              <div>
                <div style="font-size:1.75rem;font-weight:700;color:#5a7a30;">{{ (finalResult?.finalStats ?? teamStatus)?.flowersHarvested || 0 }}</div>
                <div style="font-size:0.7rem;color:#78716c;">采收花朵</div>
              </div>
              <div>
                <div style="font-size:1.75rem;font-weight:700;color:#dc2626;">{{ (finalResult?.finalStats ?? teamStatus)?.flowersLost || 0 }}</div>
                <div style="font-size:0.7rem;color:#78716c;">损失花朵</div>
              </div>
              <div>
                <div style="font-size:1.75rem;font-weight:700;color:#5a7a30;">¥{{ (finalResult?.finalStats ?? teamStatus)?.netProfit || 0 }}</div>
                <div style="font-size:0.7rem;color:#78716c;">净利润</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ===== 世界观教学覆盖层 ===== -->
    <Transition name="tutorial-fade">
      <div v-if="showTutorial" class="reality-tutorial-overlay" role="dialog" aria-modal="true">
        <div class="reality-tutorial-card">
          <!-- 进度点 -->
          <div class="flex justify-center gap-2 mb-6">
            <span v-for="i in TUTORIAL_STEPS" :key="i" class="w-2 h-2 rounded-full transition-all" :class="tutorialStep === i - 1 ? 'bg-bamboo-500 w-6' : 'bg-stone-300'" />
          </div>

          <!-- Step 0：世界观背景 -->
          <div v-if="tutorialStep === 0">
            <div class="text-center mb-6">
              <div class="text-5xl mb-3">🌸</div>
              <h2 class="text-2xl font-bold text-stone-800 mb-2">欢迎来到茉莉花农场</h2>
              <p class="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">一场关于农业经营与科学决策的14天生存挑战</p>
            </div>
            <div class="tutorial-story-card mb-5">
              <p class="text-stone-700 text-sm leading-relaxed mb-3">
                <strong>背景：</strong>你是一位刚刚继承家业的年轻花农，手上有 <strong class="text-bamboo-600">¥15,000</strong> 启动资金与 <strong class="text-bamboo-600">8 名</strong>忠实工人。
              </p>
              <p class="text-stone-700 text-sm leading-relaxed mb-3">
                接下来 <strong>14 天</strong>，你将从一根插穗开始，完成茉莉花从扦插 → 生根 → 幼苗 → 成长 → 开花 → 采收的完整旅程。
              </p>
              <p class="text-stone-700 text-sm leading-relaxed">
                每个决策都<strong>牵一发而动全身</strong>——今天省了一笔钱，可能让三天后的植株出问题；把所有人力投入采收，修剪就会拖欠，下批花的品质就会下降。
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 text-center text-xs">
              <div class="tutorial-tip-box">
                <span class="text-2xl">⚡</span>
                <p class="text-stone-600 mt-1">每个决定<br>影响后续事件</p>
              </div>
              <div class="tutorial-tip-box">
                <span class="text-2xl">⚖️</span>
                <p class="text-stone-600 mt-1">资源有限<br>必须做出取舍</p>
              </div>
              <div class="tutorial-tip-box">
                <span class="text-2xl">📈</span>
                <p class="text-stone-600 mt-1">短期收入<br>vs 长期产量</p>
              </div>
              <div class="tutorial-tip-box">
                <span class="text-2xl">🏆</span>
                <p class="text-stone-600 mt-1">最终评分<br>看综合表现</p>
              </div>
            </div>
          </div>

          <!-- Step 1：数值说明 -->
          <div v-else-if="tutorialStep === 1">
            <h2 class="text-xl font-bold text-stone-800 mb-5 text-center">📊 各项数值说明</h2>
            <div class="space-y-3">
              <div class="tutorial-stat-row">
                <span class="tutorial-stat-icon bg-amber-100 text-amber-700">💰</span>
                <div>
                  <p class="font-semibold text-stone-800 text-sm">资金（¥）</p>
                  <p class="text-xs text-stone-500">购买物资、雇用临时工、应对突发。<strong class="text-red-500">归零则无法选择需要花钱的方案</strong>，陷入被动。</p>
                </div>
              </div>
              <div class="tutorial-stat-row">
                <span class="tutorial-stat-icon bg-sky-100 text-sky-700">👷</span>
                <div>
                  <p class="font-semibold text-stone-800 text-sm">人力（每天重置）</p>
                  <p class="text-xs text-stone-500">每天早晨重置为 8 人。劳力密集的方案会消耗人力，<strong class="text-sky-600">一天内用完就无法选择需要人力的方案</strong>。</p>
                </div>
              </div>
              <div class="tutorial-stat-row">
                <span class="tutorial-stat-icon bg-green-100 text-green-700">🌱</span>
                <div>
                  <p class="font-semibold text-stone-800 text-sm">植株健康（0–100%）</p>
                  <p class="text-xs text-stone-500">直接影响花朵品质与产量。<strong class="text-green-600">低于30%</strong>会触发危机事件，病虫害概率大增。</p>
                </div>
              </div>
              <div class="tutorial-stat-row">
                <span class="tutorial-stat-icon bg-rose-100 text-rose-600">🌸</span>
                <div>
                  <p class="font-semibold text-stone-800 text-sm">花朵品质（0–100%）</p>
                  <p class="text-xs text-stone-500">决定茶厂收购单价。品质80%时售价比60%<strong class="text-rose-600">高约20%</strong>，是利润的关键指标。</p>
                </div>
              </div>
              <div class="tutorial-stat-row">
                <span class="tutorial-stat-icon bg-amber-100 text-amber-600">😊</span>
                <div>
                  <p class="font-semibold text-stone-800 text-sm">团队士气（0–100%）</p>
                  <p class="text-xs text-stone-500">士气过低会让工人效率下降。<strong class="text-amber-600">极低时次日可用人力会减少</strong>，形成恶性循环。</p>
                </div>
              </div>
              <div class="tutorial-stat-row">
                <span class="tutorial-stat-icon bg-bamboo-100 text-bamboo-700">📈</span>
                <div>
                  <p class="font-semibold text-stone-800 text-sm">成长阶段进度</p>
                  <p class="text-xs text-stone-500">扦插 → 生根 → 幼苗 → 营养生长 → 开花 → 采收。<strong class="text-bamboo-600">升阶有奖励</strong>，且解锁更多收入机会。</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2：关键取舍 -->
          <div v-else-if="tutorialStep === 2">
            <h2 class="text-xl font-bold text-stone-800 mb-2 text-center">⚖️ 关键取舍与连锁效应</h2>
            <p class="text-xs text-stone-400 text-center mb-5">以下是本游戏中最核心的几个决策矛盾</p>
            <div class="space-y-3">
              <div class="tutorial-tradeoff-card">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-base">💸</span>
                  <span class="font-bold text-stone-800 text-sm">省钱 vs 植株健康</span>
                </div>
                <p class="text-xs text-stone-500">选便宜基质省 ¥200，但健康 -10 → 三天后病虫害风险增加 → 被迫花更多钱防治</p>
              </div>
              <div class="tutorial-tradeoff-card">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-base">👷</span>
                  <span class="font-bold text-stone-800 text-sm">人力 vs 品质管理</span>
                </div>
                <p class="text-xs text-stone-500">把全部人力投入采收，就没人修剪和施肥 → 下批花品质下降 → 茶厂压价 → 利润减少</p>
              </div>
              <div class="tutorial-tradeoff-card">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-base">🌸</span>
                  <span class="font-bold text-stone-800 text-sm">立即采收 vs 蓄力后期</span>
                </div>
                <p class="text-xs text-stone-500">采收头批花立刻有收入；但摘除头批花、让植株蓄力，后期伏花产量可提高 30%</p>
              </div>
              <div class="tutorial-tradeoff-card">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-base">🤝</span>
                  <span class="font-bold text-stone-800 text-sm">快速成交 vs 谈判溢价</span>
                </div>
                <p class="text-xs text-stone-500">茶厂来收购，快速成交省时间（省人力）；花时间谈判可提价 15%，但当天其他事情就少了</p>
              </div>
              <div class="tutorial-tradeoff-card tutorial-tradeoff-card--warn">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-base">⚠️</span>
                  <span class="font-bold text-red-700 text-sm">无法负担选项时可以跳过</span>
                </div>
                <p class="text-xs text-red-500">当资金与人力都不足，所有方案无法选择时，可以「放弃应对」跳过这题，但代价是植株健康 -8、士气 -12。<strong>尽量维持资金流转！</strong></p>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="flex gap-3 mt-6">
            <button
              v-if="tutorialStep > 0"
              type="button"
              @click="tutorialStep--"
              class="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-stone-200 text-stone-600 hover:border-stone-300 transition-colors"
            >
              上一步
            </button>
            <button
              v-if="tutorialStep < TUTORIAL_STEPS - 1"
              type="button"
              @click="tutorialStep++"
              class="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all"
              style="background: linear-gradient(135deg, #6B8F4E 0%, #8AB561 100%);"
            >
              下一步 →
            </button>
            <button
              v-else
              type="button"
              @click="showTutorial = false"
              class="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all"
              style="background: linear-gradient(135deg, #E8734A 0%, #F5944A 100%);"
            >
              🌸 开始挑战！
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <nav class="reality-nav sticky top-0 z-50">
      <div class="reality-nav-inner">
        <router-link to="/" class="reality-nav-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>返回</span>
        </router-link>

        <div class="reality-nav-brand">
          <img src="/images/jasmine-logo.png" alt="" class="reality-nav-logo" width="36" height="36" />
          <div class="reality-nav-titles">
            <span class="reality-nav-title">现实挑战</span>
            <span class="reality-nav-sub">香香花园研学 · 经营模拟</span>
          </div>
          <JasmineIcons name="game" :size="26" class="reality-nav-icon hidden sm:block opacity-90" />
        </div>
      </div>
    </nav>

    <!-- 主内容区：置中、單一欄 -->
    <div class="reality-page-body px-4 pb-14 pt-6 sm:pt-8 flex justify-center">
      <div class="reality-main w-full max-w-4xl mx-auto">
        <!-- 资源卡片：只在游戏进行中显示，游戏结束后隐藏 -->
        <div v-if="isConnected && gameStatus === 'playing'" class="reality-surface reality-surface--pad mb-6">
              <div class="reality-section-head">
                <h3 class="reality-section-title">
                  <span class="reality-emoji" aria-hidden="true">💰</span> 资源状况
                </h3>
                <p class="reality-section-desc">资金、人力与阶段进度一览</p>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="reality-stat-tile">
                  <div class="reality-stat-icon" aria-hidden="true">¥</div>
                  <div class="text-xs font-medium text-stone-500 mb-0.5 tracking-wide">资金</div>
                  <div class="text-lg sm:text-xl font-bold text-bamboo-600 tabular-nums">¥{{ teamStatus?.money || 0 }}</div>
                </div>
                <div class="reality-stat-tile">
                  <div class="reality-stat-icon" aria-hidden="true">👷</div>
                  <div class="text-xs font-medium text-stone-500 mb-0.5 tracking-wide">人力（每天重置）</div>
                  <div class="text-lg sm:text-xl font-bold text-bamboo-600 tabular-nums">
                    {{ teamStatus?.labor || 0 }}<span class="text-sm font-normal text-stone-400">/{{ teamStatus?.baseLabor || 8 }}</span>
                  </div>
                </div>
                <div class="reality-stat-tile">
                  <div class="reality-stat-icon" aria-hidden="true">📊</div>
                  <div class="text-xs font-medium text-stone-500 mb-0.5 tracking-wide">净利润</div>
                  <div class="text-base sm:text-lg font-bold tabular-nums" :class="(teamStatus?.netProfit || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'">
                    ¥{{ teamStatus?.netProfit || 0 }}
                  </div>
                </div>
                <div v-if="teamStatus?.streak > 0" class="reality-stat-tile reality-stat-tile--streak">
                  <div class="reality-stat-icon" aria-hidden="true">🔥</div>
                  <div class="text-xs font-medium text-amber-800/80 mb-0.5 tracking-wide">连击</div>
                  <div class="text-lg sm:text-xl font-bold text-amber-800 tabular-nums">{{ teamStatus?.streak }}</div>
                </div>
              </div>
              <div class="mt-5 pt-5 border-t border-stone-200/80 flex items-center justify-between gap-4 flex-wrap">
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
              <div v-if="teamStatus?.achievements?.length > 0" class="mt-5 pt-5 border-t border-stone-200/80">
                <div class="text-xs font-medium text-stone-500 mb-2 tracking-wide">最新成就</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="achievement in teamStatus.achievements" :key="achievement.timestamp" class="reality-chip">
                    <span>{{ achievement.icon }}</span>
                    <span>{{ achievement.title }}</span>
                  </span>
                </div>
              </div>
            </div>

        <!-- 新的一天提示（游戏进行中才显示） -->
        <Transition name="day-banner">
          <div v-if="dayJustChanged && gameStatus === 'playing'" class="reality-day-banner mb-2" role="status" aria-live="polite">
            <span class="text-lg">🌅</span>
            <span class="font-bold">第 {{ currentDay }} 天开始！</span>
            <span class="text-sm opacity-80">人力已恢复 {{ teamStatus?.baseLabor || 8 }} 人</span>
          </div>
        </Transition>

        <!-- 游戏内容：置中 -->
        <div class="space-y-6">
            <!-- 未连接状态 - 恢复进度 -->
            <div v-if="!isConnected && restoringSession" class="flex justify-center">
              <div class="w-full max-w-md reality-surface reality-surface--hero text-center">
                <div class="reality-spinner mx-auto mb-4" aria-hidden="true" />
                <p class="text-stone-700 font-semibold">正在恢复场次进度…</p>
                <p v-if="!socketConnected" class="text-sm text-stone-500 mt-2">正在连接服务器…</p>
              </div>
            </div>

            <!-- 未连接状态 - 加入游戏 -->
            <div v-else-if="!isConnected" class="flex justify-center">
              <div class="w-full max-w-md reality-surface reality-surface--hero">
                <div class="text-center mb-8">
                  <div class="reality-join-illustration mx-auto mb-4">
                    <JasmineGrowthAnimation :health="60" size="large" :hasFlower="false" :isBlooming="false" stage="cutting" />
                  </div>
                  <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 mb-2 tracking-tight">加入现实挑战</h1>
                  <p class="text-stone-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">从扦插开始，体验完整的茉莉花生长与经营之旅</p>
                </div>

                <div class="space-y-4 mb-6">
                  <div>
                    <label class="reality-label">场次号</label>
                    <input 
                      v-model="inputSessionId" 
                      type="text" 
                      placeholder="输入 6 位场次号"
                      class="reality-input reality-input--code"
                      maxlength="6"
                    />
                  </div>
                  <div>
                    <label class="reality-label">队伍名称</label>
                    <input 
                      v-model="teamName" 
                      type="text" 
                      placeholder="给你的农场起个名字"
                      class="reality-input"
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
                  type="button"
                  class="reality-btn-primary w-full"
                  :class="{ 'reality-btn-primary--disabled': !canJoin }"
                >
                  {{ socketConnected ? '开始挑战' : '请稍候…' }}
                </button>
              </div>
            </div>

            <!-- 游戏进行中 -->
            <div v-else-if="gameStatus === 'playing'" class="space-y-6">
              <!-- 斷線提示：已加入遊戲但 socket 斷開時不跳回加入表單，只顯示重連中 -->
              <div v-if="isConnected && !socketConnected" class="reality-banner reality-banner--warn">
                连接断开，正在重连…
              </div>
              <!-- 顶部状态栏 -->
              <div class="reality-surface reality-surface--pad-sm">
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
              <div class="reality-surface reality-surface--lg">
                <div class="text-center mb-6">
                  <p class="text-xs font-medium text-stone-400 tracking-widest uppercase mb-1">我的农场</p>
                  <h3 class="text-xl sm:text-2xl font-bold text-stone-800 mb-1">{{ teamName }}的茉莉花</h3>
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
              <div v-if="teamStatus?.currentEvents" class="reality-surface reality-surface--pad-sm">
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
              <div v-if="currentEvent" class="reality-surface reality-surface--lg">
                <div class="flex items-start gap-4 mb-6">
                  <div class="reality-event-icon">{{ currentEvent.icon }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 class="text-lg sm:text-xl font-bold text-stone-800 leading-snug">{{ currentEvent.title }}</h3>
                      <span 
                        v-if="currentEvent.complexity === 'complex'"
                        class="reality-tag reality-tag--complex"
                      >
                        复杂
                      </span>
                      <span 
                        v-else
                        class="reality-tag reality-tag--simple"
                      >
                        简单
                      </span>
                      <span v-if="currentEvent.questionType === 'multiple'" class="reality-tag reality-tag--multi">多选</span>
                      <span v-if="currentEvent.questionType === 'sort'" class="reality-tag reality-tag--sort">排序</span>
                    </div>
                    <p class="text-stone-600 text-sm sm:text-base leading-relaxed">{{ currentEvent.description }}</p>
                  </div>
                </div>

                <!-- 單選 -->
                <div v-if="!currentEvent.questionType || currentEvent.questionType === 'single'" class="space-y-3">
                  <button
                    v-for="option in currentEvent.options"
                    :key="option.id"
                    type="button"
                    @click="canAffordOption(option) && submitDecision(option.id)"
                    class="reality-option"
                    :class="{
                      'reality-option--selected': selectedOption === option.id,
                      'reality-option--disabled': !canAffordOption(option)
                    }"
                  >
                    <div class="flex items-start gap-3">
                      <div class="reality-option-id">{{ option.id }}</div>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium leading-snug mb-2" :class="canAffordOption(option) ? 'text-stone-800' : 'text-stone-400'">{{ option.text }}</p>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                          <span v-if="option.cost?.money" :class="(teamStatus?.money || 0) >= option.cost.money ? 'text-red-600 font-medium' : 'text-red-300 font-medium'">💰 -{{ option.cost.money }}</span>
                          <span v-if="option.cost?.labor" :class="(teamStatus?.labor || 0) >= option.cost.labor ? 'text-sky-700 font-medium' : 'text-sky-300 font-medium'">👷 -{{ option.cost.labor }}</span>
                          <span v-if="!canAffordOption(option)" class="text-stone-400 text-xs">🚫 资源不足</span>
                          <span v-if="option.isOrganic === false" class="text-amber-700 font-medium">⚠️ 影响有机认证</span>
                          <span v-if="option.effects?.money > 0" class="text-emerald-600 font-medium">+¥{{ option.effects.money }}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <!-- 多選 -->
                <div v-else-if="currentEvent.questionType === 'multiple'" class="space-y-3">
                  <p class="text-sm text-stone-500 mb-2">可多选，选完后点「确认」</p>
                  <button
                    v-for="option in currentEvent.options"
                    :key="option.id"
                    type="button"
                    @click="canAffordOption(option) && toggleMultiOption(option.id)"
                    class="reality-option"
                    :class="{
                      'reality-option--selected': selectedOptionIds.includes(option.id),
                      'reality-option--disabled': !canAffordOption(option)
                    }"
                  >
                    <div class="flex items-start gap-3">
                      <div class="reality-option-check" :class="{ 'reality-option-check--on': selectedOptionIds.includes(option.id) }">
                        <span v-if="selectedOptionIds.includes(option.id)">✓</span>
                        <span v-else class="text-stone-400">{{ option.id }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium leading-snug mb-2" :class="canAffordOption(option) ? 'text-stone-800' : 'text-stone-400'">{{ option.text }}</p>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                          <span v-if="option.cost?.money" :class="(teamStatus?.money || 0) >= option.cost.money ? 'text-red-600 font-medium' : 'text-red-300 font-medium'">💰 -{{ option.cost.money }}</span>
                          <span v-if="option.cost?.labor" :class="(teamStatus?.labor || 0) >= option.cost.labor ? 'text-sky-700 font-medium' : 'text-sky-300 font-medium'">👷 -{{ option.cost.labor }}</span>
                          <span v-if="!canAffordOption(option)" class="text-stone-400 text-xs">🚫 资源不足</span>
                          <span v-if="option.isOrganic === false" class="text-amber-700 font-medium">⚠️ 影响有机认证</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <p class="text-sm text-stone-500">已选 {{ selectedOptionIds.length }} 项</p>
                </div>

                <!-- 排序 -->
                <div v-else-if="currentEvent.questionType === 'sort'" class="space-y-3">
                  <p class="text-sm text-stone-500 mb-2">按正确顺序排列（由上到下为 1→2→3→4），用箭头调整后点「确认」</p>
                  <div 
                    v-for="(optId, index) in sortOrder" 
                    :key="optId"
                    class="reality-sort-row"
                  >
                    <span class="reality-sort-num">{{ index + 1 }}</span>
                    <p class="flex-1 min-w-0 font-medium text-stone-800 text-sm sm:text-base leading-snug">{{ currentEvent.options?.find(o => o.id === optId)?.text }}</p>
                    <div class="flex flex-col gap-1 shrink-0">
                      <button type="button" @click="moveSortItem(index, -1)" class="reality-sort-btn" :disabled="index === 0" aria-label="上移">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                      </button>
                      <button type="button" @click="moveSortItem(index, 1)" class="reality-sort-btn" :disabled="index === sortOrder.length - 1" aria-label="下移">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  v-if="canConfirmEvent()"
                  type="button"
                  @click="confirmDecision"
                  class="reality-btn-primary w-full mt-6"
                >
                  {{ isLastEvent ? '完成今天，进入下一天 →' : '确认并继续 →' }}
                </button>

                <!-- 跳过机制：所有选项都买不起时出现 -->
                <div v-if="allOptionsUnaffordable" class="mt-5 p-4 rounded-xl border-2 border-dashed border-red-200 bg-red-50/50">
                  <p class="text-sm font-semibold text-red-700 mb-1">⚠️ 资金与人力均不足，无法选择任何方案</p>
                  <p class="text-xs text-red-500 mb-3">跳过此题代价：植株健康 <strong>-8</strong>，团队士气 <strong>-12</strong>，连击归零</p>
                  <button
                    type="button"
                    @click="skipEvent"
                    class="w-full py-2.5 px-4 rounded-lg font-semibold text-sm border-2 border-red-300 text-red-600 bg-white hover:bg-red-50 transition-colors"
                  >
                    放弃应对，硬撑度过此题
                  </button>
                </div>
              </div>

              <!-- 当天全部完成（游戏未结束时才显示） -->
              <div v-else-if="allEventsCompleted && gameStatus !== 'finished'" class="reality-surface reality-surface--hero text-center">
                <div class="mb-4">
                  <JasmineGrowthAnimation 
                    :health="teamStatus?.plantHealth || 60"
                    size="large"
                    :hasFlower="hasFlower"
                    :isBlooming="true"
                  />
                </div>
                <div class="text-5xl mb-4" aria-hidden="true">🌟</div>
                <h3 class="text-xl font-bold text-stone-800 mb-2">{{ weekDayName }}的所有挑战已完成！</h3>
                <p class="text-stone-500 mb-6">获得分数 <span class="font-bold text-coral-600 tabular-nums">+{{ dayScore }}</span></p>
                <button
                  type="button"
                  @click="startNextDay"
                  class="reality-btn-primary inline-flex min-w-[240px] justify-center"
                >
                  进入第 {{ currentDay + 1 }} 天 →
                </button>
              </div>
            </div>

          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSocket } from '../composables/useSocket.js'
import JasmineGrowthAnimation from '../components/JasmineGrowthAnimation.vue'
import JasmineIcons from '../components/JasmineIcons.vue'

const route = useRoute()
const router = useRouter()
const { socket, connected: socketConnected } = useSocket()

const STORAGE_KEY = 'reality_team_sess_v1'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 状态
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
const dayJustChanged = ref(false)
const restoringSession = ref(false)

// 教学引导
const showTutorial = ref(false)
const tutorialStep = ref(0)
const TUTORIAL_STEPS = 3

function saveSessionToStorage () {
  if (!sessionId.value || !teamId.value) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessionId: sessionId.value,
      teamId: teamId.value,
      teamName: teamName.value
    }))
  } catch (_) {}
}

function clearPersistedSession () {
  try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
}

function loadPersistedSession () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// 计算属性
const canJoin = computed(() => {
  return (
    socketConnected.value &&
    inputSessionId.value.length === 6 &&
    teamName.value.trim().length > 0
  )
})

// 判断某选项是否负担得起（资金+人力都够）
function canAffordOption(option) {
  const money = teamStatus.value?.money ?? 0
  const labor = teamStatus.value?.labor ?? 0
  return (option.cost?.money || 0) <= money && (option.cost?.labor || 0) <= labor
}

// 当前事件的所有选项是否都负担不起
const allOptionsUnaffordable = computed(() => {
  const opts = currentEvent.value?.options
  if (!opts?.length) return false
  const qt = currentEvent.value?.questionType || 'single'
  if (qt === 'sort') return false // 排序题不消耗资源，不需要跳过
  return opts.every(opt => !canAffordOption(opt))
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

// 把 completedEvents 轉成回顧項目的共用邏輯
function buildReviewItem(ce) {
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
  const bestOpt = opt.slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
  const explanation = bestOpt?.explanation || ev.explanation || ev.description || ''
  return {
    eventInstanceId: ce.eventInstanceId,
    title: ev.title,
    description: ev.description,
    explanation,
    icon: ev.icon,
    yourAnswerText: yourAnswerText || '—',
    correctAnswerText: correctAnswerText || '—',
    baseScore: ce.baseScore,
    isWrong: ce.isWrong
  }
}

// 錯題復盤（只含做錯的）
const wrongReviewList = computed(() => {
  const list =
    (finalResult.value?.finalStats?.completedEvents?.length
      ? finalResult.value.finalStats.completedEvents
      : completedEvents.value) || []
  return list.filter(ce => ce.isWrong && !ce.skipped).map(buildReviewItem)
})

// 整場回顧（所有已作答題目，含對/錯，方便複習）
const allReviewList = computed(() => {
  const fromFinal = finalResult.value?.finalStats?.completedEvents
  const list = (fromFinal?.length ? fromFinal : completedEvents.value) || []
  console.log('[allReviewList] fromFinal:', fromFinal?.length, '| completedEvents:', completedEvents.value.length, '| using list len:', list.length)
  return list.filter(ce => !ce.skipped).map(buildReviewItem)
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

function attachRealityListeners () {
  const onConnect = () => {
    if (sessionId.value && teamId.value && (isConnected.value || restoringSession.value)) {
      socket.emit('reality:team:rejoin', {
        sessionId: sessionId.value,
        teamId: teamId.value
      })
    }
  }

  const onJoined = (data) => {
    teamId.value = data.teamId
    teamStatus.value = data.teamStatus
    currentDay.value = data.teamStatus.currentDay
    weekDay.value = data.teamStatus.currentWeekDay
    gameStatus.value = 'playing'
    isConnected.value = true
    restoringSession.value = false
    saveSessionToStorage()
    // 第一次加入游戏时显示世界观教学
    showTutorial.value = true
    tutorialStep.value = 0
    updateCurrentEvent()
  }

  const onRejoined = (data) => {
    teamId.value = data.teamId
    teamName.value = data.teamName
    teamStatus.value = data.teamStatus
    currentDay.value = data.teamStatus.currentDay
    weekDay.value = data.teamStatus.currentWeekDay
    gameStatus.value = data.teamStatus.status
    isConnected.value = true
    restoringSession.value = false
    completedEvents.value = data.teamStatus.completedEvents || []
    saveSessionToStorage()
    updateCurrentEvent()
  }

  const onDecisionSubmitted = (data) => {
    console.log('[Reality] decision_submitted', { finished: data.finished, dayChanged: data.dayChanged, hasTeamStatus: !!data.teamStatus })
    if (data.finished) {
      console.log('[Reality] FINISHED → data.teamStatus:', data.teamStatus)
      console.log('[Reality] FINISHED → completedEvents from teamStatus:', data.teamStatus?.completedEvents?.length, data.teamStatus?.completedEvents)
    }
    const prevTotal = teamStatus.value?.totalScore
    if (data.teamStatus) {
      teamStatus.value = data.teamStatus
      currentDay.value = data.teamStatus.currentDay ?? currentDay.value
      weekDay.value = data.teamStatus.currentWeekDay ?? weekDay.value
      completedEvents.value = data.teamStatus.completedEvents || []
    }
    if (data.dayChanged && data.teamStatus) {
      dayScore.value = (data.teamStatus.totalScore ?? 0) - (prevTotal || 0)
      dayJustChanged.value = true
      setTimeout(() => { dayJustChanged.value = false }, 3000)
    }
    if (data.finished) {
      console.log('[Reality] game finished → setting gameStatus=finished, clearing currentEvent')
      currentEvent.value = null   // 清掉事件卡，確保不阻擋結算畫面
      gameStatus.value = 'finished'
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    } else {
      updateCurrentEvent()
    }
  }

  const onFinished = (data) => {
    console.log('[Reality] reality:finished received', { hasResult: !!data.result })
    currentEvent.value = null
    gameStatus.value = 'finished'
    finalResult.value = data.result
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onState = (data) => {
    if (data.teamStatus) {
      teamStatus.value = data.teamStatus
      currentDay.value = data.teamStatus.currentDay
      weekDay.value = data.teamStatus.currentWeekDay
      gameStatus.value = data.teamStatus.status
      completedEvents.value = data.teamStatus.completedEvents || []
      updateCurrentEvent()
    }
  }

  const onError = (data) => {
    if (restoringSession.value) {
      clearPersistedSession()
      restoringSession.value = false
      sessionId.value = ''
      teamId.value = ''
      teamName.value = ''
    }
    alert(data.message)
  }

  socket.on('connect', onConnect)
  socket.on('reality:joined', onJoined)
  socket.on('reality:rejoined', onRejoined)
  socket.on('reality:decision_submitted', onDecisionSubmitted)
  socket.on('reality:finished', onFinished)
  socket.on('reality:state', onState)
  socket.on('reality:error', onError)

  return () => {
    socket.off('connect', onConnect)
    socket.off('reality:joined', onJoined)
    socket.off('reality:rejoined', onRejoined)
    socket.off('reality:decision_submitted', onDecisionSubmitted)
    socket.off('reality:finished', onFinished)
    socket.off('reality:state', onState)
    socket.off('reality:error', onError)
  }
}

function joinGame() {
  if (!canJoin.value) return

  const sid = inputSessionId.value.toUpperCase()
  const tid = 'team_' + Date.now()
  const tname = teamName.value.trim()

  teamId.value = tid
  sessionId.value = sid
  teamName.value = tname

  socket.emit('reality:team:join', {
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
  socket.emit('reality:team:submit', {
    eventInstanceId: ev.eventInstanceId,
    decision
  })
}

function startNextDay() {
  socket.emit('reality:get_state')
}

function skipEvent() {
  const ev = currentEvent.value
  if (!ev || !sessionId.value || !teamId.value) return
  socket.emit('reality:team:submit', {
    eventInstanceId: ev.eventInstanceId,
    decision: { skip: true }
  })
}

function resetGame() {
  clearPersistedSession()
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
  sessionId.value = ''
  teamId.value = ''

  router.push('/')
}

function restartGame() {
  clearPersistedSession()
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
  sessionId.value = ''
  teamId.value = ''
  dayScore.value = 0
  dayJustChanged.value = false
}

let removeRealityListeners = () => {}

onMounted(() => {
  const saved = loadPersistedSession()
  if (saved?.sessionId && saved?.teamId) {
    sessionId.value = saved.sessionId
    teamId.value = saved.teamId
    teamName.value = saved.teamName || ''
    inputSessionId.value = saved.sessionId
    restoringSession.value = true
  }

  removeRealityListeners = attachRealityListeners()

  if (socket.connected && sessionId.value && teamId.value && restoringSession.value) {
    socket.emit('reality:team:rejoin', { sessionId: sessionId.value, teamId: teamId.value })
  }

  if (route.params.sessionId && !restoringSession.value) {
    inputSessionId.value = route.params.sessionId.toUpperCase()
  }
})

onUnmounted(() => {
  removeRealityListeners()
})
</script>

<style scoped>
@reference "tailwindcss";

.reality-page {
  position: relative;
  min-height: 100vh;
  background: #fdfbf7;
}

.reality-page-bg {
  pointer-events: none;
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 112, 74, 0.08), transparent),
    radial-gradient(ellipse 60% 40% at 100% 50%, rgba(122, 159, 70, 0.06), transparent),
    radial-gradient(ellipse 50% 30% at 0% 80%, rgba(253, 224, 71, 0.06), transparent);
}

.reality-page-body {
  position: relative;
  z-index: 1;
}

/* ========== 导航（对齐学习页） ========== */
.reality-nav {
  background: rgba(253, 251, 247, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.reality-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.reality-nav-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #78716c;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}

.reality-nav-back:hover {
  color: #7a9f46;
  background: rgba(122, 159, 70, 0.08);
}

.reality-nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.reality-nav-logo {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(90, 74, 58, 0.08);
}

.reality-nav-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.reality-nav-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #7a9f46;
  letter-spacing: -0.02em;
}

.reality-nav-sub {
  font-size: 12px;
  color: #78716c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 卡片与表面 ========== */
.reality-surface {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(139, 115, 85, 0.12);
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px rgba(90, 74, 58, 0.07);
}

.reality-surface--pad {
  padding: 1.25rem 1.25rem;
}

@media (min-width: 640px) {
  .reality-surface--pad {
    padding: 1.5rem 1.75rem;
  }
}

.reality-surface--pad-sm {
  padding: 1rem 1.25rem;
}

.reality-surface--lg {
  padding: 1.5rem 1.25rem;
  border-radius: 1.5rem;
}

@media (min-width: 640px) {
  .reality-surface--lg {
    padding: 1.75rem 2rem;
  }
}

.reality-surface--hero {
  position: relative;
  padding: 2rem 1.5rem;
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(139, 115, 85, 0.14);
  box-shadow: 0 8px 40px rgba(90, 74, 58, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 252, 248, 0.96) 100%);
}

.reality-surface--hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #d4704a, #f59e0b, #7a9f46);
  border-radius: 1.5rem 1.5rem 0 0;
}

.reality-section-head {
  margin-bottom: 1rem;
}

/* ===== 世界观教学覆盖层 ===== */
.reality-tutorial-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(30, 20, 10, 0.55);
  backdrop-filter: blur(6px);
}

.reality-tutorial-card {
  width: 100%;
  max-width: 480px;
  max-height: 90dvh;
  overflow-y: auto;
  background: #fff;
  border-radius: 1.5rem;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 20px 60px rgba(40, 25, 10, 0.25);
}

.tutorial-story-card {
  background: linear-gradient(135deg, rgba(180, 213, 140, 0.12), rgba(255, 223, 150, 0.10));
  border: 1px solid rgba(130, 175, 80, 0.20);
  border-radius: 1rem;
  padding: 1rem 1.125rem;
}

.tutorial-tip-box {
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 0.75rem;
  padding: 0.75rem 0.5rem;
}

.tutorial-stat-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 0.75rem;
}

.tutorial-stat-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.tutorial-tradeoff-card {
  padding: 0.75rem 1rem;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 0.75rem;
}

.tutorial-tradeoff-card--warn {
  background: #fff5f5;
  border-color: #fecaca;
}

/* 教学层进入/离开动画 */
.tutorial-fade-enter-active { transition: opacity 0.3s ease; }
.tutorial-fade-leave-active { transition: opacity 0.25s ease; }
.tutorial-fade-enter-from,
.tutorial-fade-leave-to { opacity: 0; }

/* ===== 禁用选项（负担不起）===== */
.reality-option--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
  border-color: #e7e5e4 !important;
  background: #fafaf9 !important;
  box-shadow: none !important;
}

/* 新的一天提示横幅 */
.reality-day-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, rgba(180, 213, 140, 0.25) 0%, rgba(255, 223, 150, 0.20) 100%);
  border: 1px solid rgba(130, 175, 80, 0.25);
  border-radius: 1rem;
  color: #4a7c3f;
  font-size: 0.95rem;
}

/* 新的一天进入动画 */
.day-banner-enter-active { transition: all 0.4s ease; }
.day-banner-leave-active { transition: all 0.5s ease; }
.day-banner-enter-from { opacity: 0; transform: translateY(-10px); }
.day-banner-leave-to { opacity: 0; transform: translateY(-10px); }

.reality-section-kicker {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a8a29e;
}

.reality-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #44403c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reality-section-desc {
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: #78716c;
}

.reality-emoji {
  font-size: 1.25rem;
}

.reality-stat-tile {
  position: relative;
  padding: 0.875rem 1rem;
  border-radius: 0.875rem;
  background: linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid rgba(251, 191, 36, 0.25);
}

.reality-stat-tile--streak {
  background: linear-gradient(145deg, #fff7ed 0%, #ffedd5 100%);
  border-color: rgba(251, 146, 60, 0.35);
}

.reality-stat-icon {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  opacity: 0.85;
}

.reality-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(254, 243, 199, 0.9);
  color: #92400e;
  border: 1px solid rgba(251, 191, 36, 0.35);
}

.reality-banner {
  border-radius: 0.875rem;
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.reality-banner--warn {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border: 1px solid rgba(251, 191, 36, 0.5);
  color: #92400e;
}

.reality-event-icon {
  font-size: 2.25rem;
  line-height: 1;
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: linear-gradient(145deg, #f5f5f4, #fff);
  border: 1px solid rgba(139, 115, 85, 0.12);
  flex-shrink: 0;
}

.reality-tag {
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.reality-tag--complex {
  background: #ffedd5;
  color: #c2410c;
}

.reality-tag--simple {
  background: #dcfce7;
  color: #15803d;
}

.reality-tag--multi {
  background: #f3e8ff;
  color: #7e22ce;
}

.reality-tag--sort {
  background: #e0e7ff;
  color: #4338ca;
}

/* ========== 表单 ========== */
.reality-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #57534e;
  margin-bottom: 0.5rem;
}

.reality-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  border: 2px solid #e7e5e4;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.reality-input:focus {
  border-color: #d4704a;
  box-shadow: 0 0 0 3px rgba(212, 112, 74, 0.15);
}

.reality-input--code {
  text-align: center;
  font-size: 1.25rem;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.reality-join-illustration {
  filter: drop-shadow(0 8px 24px rgba(122, 159, 70, 0.12));
}

/* ========== 按钮 ========== */
.reality-btn-primary {
  padding: 0.9rem 1.25rem;
  border-radius: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #d4704a 0%, #c45c3e 100%);
  box-shadow: 0 4px 14px rgba(212, 112, 74, 0.35);
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s, filter 0.2s;
}

.reality-btn-primary:hover:not(:disabled) {
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(212, 112, 74, 0.4);
  transform: translateY(-1px);
}

.reality-btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.reality-btn-primary--disabled,
.reality-btn-primary:disabled {
  background: #d6d3d1;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
  filter: none;
}

.reality-btn-secondary {
  padding: 0.9rem 1.25rem;
  border-radius: 0.875rem;
  font-weight: 600;
  color: #7a9f46;
  background: transparent;
  border: 2px solid #7a9f46;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.reality-btn-secondary:hover {
  background: rgba(122, 159, 70, 0.08);
}

/* ========== 选项卡片 ========== */
.reality-option {
  width: 100%;
  padding: 1rem 1.1rem;
  border-radius: 0.875rem;
  border: 2px solid #e7e5e4;
  background: rgba(255, 255, 255, 0.85);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.reality-option:hover {
  border-color: rgba(212, 112, 74, 0.45);
  box-shadow: 0 4px 16px rgba(90, 74, 58, 0.06);
}

.reality-option--selected {
  border-color: #d4704a;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  box-shadow: 0 4px 16px rgba(212, 112, 74, 0.12);
}

.reality-option-id {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #d4704a, #c45c3e);
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reality-option-check {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 2px solid #d6d3d1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.reality-option-check--on {
  border-color: #d4704a;
  background: #d4704a;
  color: #fff;
}

/* ========== 排序行 ========== */
.reality-sort-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.875rem;
  border: 2px solid #e7e5e4;
  background: rgba(255, 255, 255, 0.9);
}

.reality-sort-num {
  width: 1.75rem;
  font-size: 1.125rem;
  font-weight: 800;
  color: #d4704a;
  text-align: center;
  flex-shrink: 0;
}

.reality-sort-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #e7e5e4;
  background: #fafaf9;
  color: #57534e;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.reality-sort-btn:hover:not(:disabled) {
  background: #fff7ed;
  border-color: #fdba74;
  color: #c2410c;
}

.reality-sort-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ========== 结算 ========== */
.reality-score-hero {
  border-radius: 1rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #7a9f46 0%, #5f7d38 50%, #4a6329 100%);
  color: #fff;
  box-shadow: 0 8px 28px rgba(90, 122, 52, 0.35);
}

.reality-mini-stat {
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(145deg, #fffbeb, #fef9c3);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.reality-review-card {
  padding: 1rem 1.1rem;
  border-radius: 0.875rem;
  background: #fafaf9;
  border: 1px solid rgba(139, 115, 85, 0.12);
}

.reality-review-card--correct {
  background: #f0fdf4;
  border-color: rgba(34, 197, 94, 0.2);
}

.reality-review-tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.reality-review-tag--wrong {
  background: #fee2e2;
  color: #991b1b;
}

.reality-review-tag--ok {
  background: #d9f99d;
  color: #3f6212;
}

/* ========== 加载 ========== */
.reality-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 3px solid #e7e5e4;
  border-top-color: #d4704a;
  animation: reality-spin 0.8s linear infinite;
}

@keyframes reality-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}
</style>
