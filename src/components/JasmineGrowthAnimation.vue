<template>
  <div class="jasmine-growth-container" :class="size">
    <!-- SVG 茉莉花生长动画 -->
    <svg viewBox="0 0 200 200" class="jasmine-svg" :class="animationState">
      <!-- 定义渐变 -->
      <defs>
        <!-- 健康叶子渐变 -->
        <linearGradient id="leafHealthy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7A9F46;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#5B7A5E;stop-opacity:1" />
        </linearGradient>
        <!-- 受损叶子渐变 -->
        <linearGradient id="leafDamaged" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#D4A574;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8956D;stop-opacity:1" />
        </linearGradient>
        <!-- 枯萎叶子渐变 -->
        <linearGradient id="leafWithered" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B7355;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6B5344;stop-opacity:1" />
        </linearGradient>
        <!-- 花朵渐变 -->
        <radialGradient id="flowerGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#FFFEF0;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#FFF8DC;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F5E6D3;stop-opacity:1" />
        </radialGradient>
        <!-- 花苞渐变 -->
        <radialGradient id="budGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" style="stop-color:#E8F4E8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7A9F46;stop-opacity:1" />
        </radialGradient>
        <!-- 阴影 -->
        <filter id="softShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
        </filter>
      </defs>

      <!-- 土壤 -->
      <ellipse cx="100" cy="185" rx="60" ry="12" fill="#C4A77D" opacity="0.3" />

      <!-- 扦插期：一根简单的枝条插在土里 -->
      <g v-if="stage === 'cutting'">
        <path 
          d="M100 180 L100 120" 
          stroke="url(#leafHealthy)" 
          stroke-width="5" 
          stroke-linecap="round"
        />
        <!-- 扦插的芽点 -->
        <circle cx="100" cy="140" r="3" fill="#7A9F46" />
        <circle cx="100" cy="160" r="3" fill="#7A9F46" />
        <!-- 顶端的切口 -->
        <ellipse cx="100" cy="118" rx="6" ry="3" fill="#8FA855" />
      </g>

      <!-- 生根期：有少量根须 -->
      <g v-else-if="stage === 'rooting'">
        <path 
          d="M100 180 L100 100" 
          stroke="url(#leafHealthy)" 
          stroke-width="5" 
          stroke-linecap="round"
        />
        <!-- 细小的根须 -->
        <path d="M98 180 Q90 190 85 195" stroke="#D4A574" stroke-width="1.5" fill="none" opacity="0.7"/>
        <path d="M102 180 Q110 190 115 195" stroke="#D4A574" stroke-width="1.5" fill="none" opacity="0.7"/>
        <path d="M100 175 Q100 188 100 198" stroke="#D4A574" stroke-width="1.5" fill="none" opacity="0.7"/>
        <!-- 顶端的嫩芽 -->
        <ellipse cx="100" cy="98" rx="4" ry="6" fill="#8FA855" />
      </g>

      <!-- 幼苗期：有2-3片小叶子 -->
      <g v-else-if="stage === 'seedling'">
        <path 
          d="M100 180 Q100 140 100 110" 
          stroke="url(#leafHealthy)" 
          stroke-width="4" 
          stroke-linecap="round"
        />
        <!-- 小叶子 -->
        <ellipse cx="85" cy="140" rx="8" ry="4" transform="rotate(-40 85 140)" fill="url(#leafHealthy)" />
        <ellipse cx="115" cy="135" rx="8" ry="4" transform="rotate(40 115 135)" fill="url(#leafHealthy)" />
        <ellipse cx="100" cy="108" rx="6" ry="8" fill="url(#leafHealthy)" />
      </g>

      <!-- 完整的植物（生长/开花期） -->
      <g v-else>
        <!-- 主茎 -->
        <path 
          class="main-stem"
          d="M100 180 Q100 150 100 130" 
          stroke="url(#leafHealthy)" 
          stroke-width="4" 
          fill="none"
          stroke-linecap="round"
          :class="{ damaged: health < 50, withered: health < 30 }"
        />

        <!-- 左侧茎 -->
        <path 
          class="branch branch-left"
          d="M100 150 Q80 140 70 120" 
          stroke="url(#leafHealthy)" 
          stroke-width="3" 
          fill="none"
          stroke-linecap="round"
          :class="{ damaged: health < 50, withered: health < 30 }"
        />

        <!-- 右侧茎 -->
        <path 
          class="branch branch-right"
          d="M100 140 Q120 130 130 115" 
          stroke="url(#leafHealthy)" 
          stroke-width="3" 
          fill="none"
          stroke-linecap="round"
          :class="{ damaged: health < 50, withered: health < 30 }"
        />

        <!-- 叶子 - 左下 -->
        <g class="leaf leaf-1" :class="{ damaged: health < 60, withered: health < 40 }">
          <ellipse cx="75" cy="145" rx="15" ry="8" transform="rotate(-30 75 145)" fill="url(#leafHealthy)" />
        </g>

        <!-- 叶子 - 左上 -->
        <g class="leaf leaf-2" :class="{ damaged: health < 55, withered: health < 35 }">
          <ellipse cx="65" cy="118" rx="12" ry="6" transform="rotate(-45 65 118)" fill="url(#leafHealthy)" />
        </g>

        <!-- 叶子 - 右上 -->
        <g class="leaf leaf-3" :class="{ damaged: health < 65, withered: health < 45 }">
          <ellipse cx="128" cy="112" rx="12" ry="6" transform="rotate(30 128 112)" fill="url(#leafHealthy)" />
        </g>

        <!-- 叶子 - 右下 -->
        <g class="leaf leaf-4" :class="{ damaged: health < 50, withered: health < 30 }">
          <ellipse cx="85" cy="155" rx="14" ry="7" transform="rotate(-15 85 155)" fill="url(#leafHealthy)" />
        </g>
      </g>

      <!-- 茉莉花朵 - 主花 -->
      <g v-if="hasFlower" class="main-flower" :class="{ blooming: isBlooming, damaged: health < 70 }">
        <!-- 花瓣层1 - 外圈 -->
        <g class="petals-outer">
          <ellipse cx="100" cy="100" rx="8" ry="20" transform="rotate(0 100 100)" fill="url(#flowerGradient)" filter="url(#softShadow)" />
          <ellipse cx="100" cy="100" rx="8" ry="20" transform="rotate(72 100 100)" fill="url(#flowerGradient)" filter="url(#softShadow)" />
          <ellipse cx="100" cy="100" rx="8" ry="20" transform="rotate(144 100 100)" fill="url(#flowerGradient)" filter="url(#softShadow)" />
          <ellipse cx="100" cy="100" rx="8" ry="20" transform="rotate(216 100 100)" fill="url(#flowerGradient)" filter="url(#softShadow)" />
          <ellipse cx="100" cy="100" rx="8" ry="20" transform="rotate(288 100 100)" fill="url(#flowerGradient)" filter="url(#softShadow)" />
        </g>
        <!-- 花瓣层2 - 内圈 -->
        <g class="petals-inner">
          <ellipse cx="100" cy="100" rx="5" ry="12" transform="rotate(36 100 100)" fill="#FFFEF0" />
          <ellipse cx="100" cy="100" rx="5" ry="12" transform="rotate(108 100 100)" fill="#FFFEF0" />
          <ellipse cx="100" cy="100" rx="5" ry="12" transform="rotate(180 100 100)" fill="#FFFEF0" />
          <ellipse cx="100" cy="100" rx="5" ry="12" transform="rotate(252 100 100)" fill="#FFFEF0"" />
          <ellipse cx="100" cy="100" rx="5" ry="12" transform="rotate(324 100 100)" fill="#FFFEF0" />
        </g>
        <!-- 花心 -->
        <circle cx="100" cy="100" r="4" fill="#D4A574" />
      </g>

      <!-- 花苞 - 左侧 -->
      <g v-if="hasBudLeft" class="bud bud-left" :class="{ blooming: isBlooming }">
        <ellipse cx="58" cy="115" rx="6" ry="10" fill="url(#budGradient)" />
        <path d="M52 110 Q58 108 64 110" stroke="#7A9F46" stroke-width="1.5" fill="none" />
      </g>

      <!-- 花苞 - 右侧 -->
      <g v-if="hasBudRight" class="bud bud-right" :class="{ blooming: isBlooming }">
        <ellipse cx="138" cy="110" rx="6" ry="10" fill="url(#budGradient)" />
        <path d="M132 105 Q138 103 144 105" stroke="#7A9F46" stroke-width="1.5" fill="none" />
      </g>

      <!-- 飘落的花瓣动画 -->
      <g v-if="health < 50 && hasFlower" class="falling-petals">
        <circle cx="90" cy="110" r="3" fill="#FFF8DC" opacity="0.6">
          <animate attributeName="cy" from="110" to="180" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="115" cy="105" r="2.5" fill="#FFF8DC" opacity="0.5">
          <animate attributeName="cy" from="105" to="180" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
        </circle>
      </g>

      <!-- 悲伤/受损指示器 -->
      <g v-if="health < 30" class="sad-indicator">
        <circle cx="100" cy="70" r="15" fill="none" stroke="#EF4444" stroke-width="2" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="100" y="76" text-anchor="middle" font-size="16" fill="#EF4444">💔</text>
      </g>

      <!-- 健康指示器 -->
      <g v-if="health >= 80 && hasFlower" class="happy-indicator">
        <circle cx="100" cy="70" r="12" fill="none" stroke="#22C55E" stroke-width="2" opacity="0.3">
          <animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>

    <!-- 状态文字 -->
    <div class="status-text" :class="statusClass">
      {{ statusText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 健康度 0-100
  health: {
    type: Number,
    default: 60
  },
  // 生长阶段: cutting, rooting, seedling, vegetative, flowering, blooming, harvest
  stage: {
    type: String,
    default: 'cutting'
  },
  // 尺寸: small, medium, large
  size: {
    type: String,
    default: 'medium'
  },
  // 是否有花朵
  hasFlower: {
    type: Boolean,
    default: false
  },
  // 是否正在开花动画
  isBlooming: {
    type: Boolean,
    default: false
  },
  // 是否有左侧花苞
  hasBudLeft: {
    type: Boolean,
    default: false
  },
  // 是否有右侧花苞
  hasBudRight: {
    type: Boolean,
    default: false
  }
})

const animationState = computed(() => {
  if (props.health < 30) return 'withered'
  if (props.health < 60) return 'damaged'
  if (props.isBlooming) return 'blooming'
  return 'healthy'
})

const statusText = computed(() => {
  if (props.health >= 90) return '生机勃勃'
  if (props.health >= 70) return '健康成长'
  if (props.health >= 50) return '需要关注'
  if (props.health >= 30) return '状况不佳'
  return '急需救治'
})

const statusClass = computed(() => {
  if (props.health >= 70) return 'status-good'
  if (props.health >= 40) return 'status-warning'
  return 'status-danger'
})
</script>

<style scoped>
.jasmine-growth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.jasmine-growth-container.small {
  width: 80px;
  height: 100px;
}

.jasmine-growth-container.medium {
  width: 160px;
  height: 200px;
}

.jasmine-growth-container.large {
  width: 240px;
  height: 300px;
}

.jasmine-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 健康状态下的动画 */
.jasmine-svg.healthy .main-flower {
  animation: gentleSway 4s ease-in-out infinite;
  transform-origin: center bottom;
}

.jasmine-svg.healthy .leaf {
  animation: leafSway 3s ease-in-out infinite;
}

.jasmine-svg.healthy .leaf-1 { animation-delay: 0s; }
.jasmine-svg.healthy .leaf-2 { animation-delay: 0.3s; }
.jasmine-svg.healthy .leaf-3 { animation-delay: 0.6s; }
.jasmine-svg.healthy .leaf-4 { animation-delay: 0.9s; }

/* 开花动画 */
.jasmine-svg.blooming .petals-outer {
  animation: bloom 1.5s ease-out forwards;
}

.jasmine-svg.blooming .petals-inner {
  animation: bloomInner 1.5s ease-out 0.3s forwards;
}

.jasmine-svg.blooming .bud {
  animation: budOpen 1s ease-out forwards;
}

/* 受损状态 */
.jasmine-svg.damaged .main-stem,
.jasmine-svg.damaged .branch {
  stroke: url(#leafDamaged);
}

.jasmine-svg.damaged .leaf ellipse {
  fill: url(#leafDamaged);
}

.jasmine-svg.damaged .main-flower {
  opacity: 0.7;
  transform: rotate(-5deg);
}

/* 枯萎状态 */
.jasmine-svg.withered .main-stem,
.jasmine-svg.withered .branch {
  stroke: url(#leafWithered);
}

.jasmine-svg.withered .leaf ellipse {
  fill: url(#leafWithered);
}

.jasmine-svg.withered .leaf {
  transform: rotate(-10deg) translateY(5px);
}

.jasmine-svg.withered .main-flower {
  opacity: 0.4;
  transform: rotate(-15deg) scale(0.8);
}

/* 关键帧动画 */
@keyframes gentleSway {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

@keyframes leafSway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes bloom {
  0% { transform: scale(0.3); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bloomInner {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes budOpen {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(0); opacity: 0; }
}

/* 状态文字样式 */
.status-text {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
}

.status-good {
  color: #16A34A;
  background: rgba(34, 197, 94, 0.1);
}

.status-warning {
  color: #B45309;
  background: rgba(234, 179, 8, 0.1);
}

.status-danger {
  color: #DC2626;
  background: rgba(239, 68, 68, 0.1);
}
</style>
