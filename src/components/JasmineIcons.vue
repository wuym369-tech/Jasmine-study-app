<template>
  <!-- 茉莉花 - 用於 Logo -->
  <svg v-if="name === 'jasmine'" viewBox="0 0 64 64" :width="size" :height="size" class="jasmine-icon">
    <defs>
      <linearGradient id="jasmineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="100%" stop-color="#f0fdf4"/>
      </linearGradient>
    </defs>
    <!-- 5片花瓣 -->
    <g fill="url(#jasmineGrad)" stroke="#86efac" stroke-width="1.5">
      <ellipse cx="32" cy="14" rx="8" ry="12" />
      <ellipse cx="50" cy="24" rx="8" ry="12" transform="rotate(72 50 24)" />
      <ellipse cx="44" cy="46" rx="8" ry="12" transform="rotate(144 44 46)" />
      <ellipse cx="20" cy="46" rx="8" ry="12" transform="rotate(216 20 46)" />
      <ellipse cx="14" cy="24" rx="8" ry="12" transform="rotate(288 14 24)" />
    </g>
    <!-- 花蕊 -->
    <circle cx="32" cy="32" r="4" fill="#fde047"/>
  </svg>

  <!-- 書本/教學 -->
  <svg v-else-if="name === 'learn'" viewBox="0 0 48 48" :width="size" :height="size" class="icon-learn">
    <defs>
      <linearGradient id="learnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#86efac"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>
    </defs>
    <rect x="8" y="6" width="32" height="36" rx="3" fill="none" stroke="url(#learnGrad)" stroke-width="2.5"/>
    <path d="M16 6v36M24 18h12M24 26h12M24 34h8" stroke="url(#learnGrad)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>

  <!-- 對話/討論 -->
  <svg v-else-if="name === 'discuss'" viewBox="0 0 48 48" :width="size" :height="size" class="icon-discuss">
    <defs>
      <linearGradient id="discussGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
    </defs>
    <path d="M12 18c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v12c0 4.4-3.6 8-8 8h-6l-8 6v-6h-2c-4.4 0-8-3.6-8-8V18z" 
          fill="none" stroke="url(#discussGrad)" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="24" cy="24" r="2" fill="#f59e0b"/>
    <circle cx="32" cy="24" r="2" fill="#f59e0b"/>
    <circle cx="16" cy="24" r="2" fill="#f59e0b"/>
  </svg>

  <!-- 獎盃/競賽 -->
  <svg v-else-if="name === 'game'" viewBox="0 0 48 48" :width="size" :height="size" class="icon-game">
    <defs>
      <linearGradient id="gameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fb923c"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
      <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fde047"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <!-- 獎盃 -->
    <path d="M12 8h24v4c0 8-6 14-12 14S12 20 12 12V8z" fill="none" stroke="url(#gameGrad)" stroke-width="2.5"/>
    <path d="M12 8h-4c0 6 3 10 7 11M36 8h4c0 6-3 10-7 11" fill="none" stroke="url(#gameGrad)" stroke-width="2.5"/>
    <rect x="18" y="26" width="12" height="4" rx="1" fill="none" stroke="url(#trophyGold)" stroke-width="2"/>
    <path d="M14 38h20M18 30v8M30 30v8" stroke="url(#trophyGold)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- 星星 -->
    <path d="M24 2l1.5 3h3.5l-2.5 2 1 3.5-3-2-3 2 1-3.5-2.5-2h3.5z" fill="url(#trophyGold)"/>
  </svg>

  <!-- 控制台/設定 -->
  <svg v-else-if="name === 'admin'" viewBox="0 0 48 48" :width="size" :height="size" class="icon-admin">
    <defs>
      <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#94a3b8"/>
        <stop offset="100%" stop-color="#475569"/>
      </linearGradient>
    </defs>
    <!-- 齒輪 -->
    <circle cx="24" cy="24" r="10" fill="none" stroke="url(#adminGrad)" stroke-width="2.5"/>
    <circle cx="24" cy="24" r="4" fill="none" stroke="url(#adminGrad)" stroke-width="2.5"/>
    <!-- 齒輪齒 -->
    <path d="M24 6v6M24 36v6M6 24h6M36 24h6M10.5 10.5l4 4M33.5 33.5l4 4M10.5 37.5l4-4M33.5 14.5l4-4" 
          stroke="url(#adminGrad)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>

  <!-- 花瓣單個 -->
  <svg v-else-if="name === 'petal'" viewBox="0 0 24 24" :width="size" :height="size" class="petal-icon">
    <ellipse cx="12" cy="12" rx="6" ry="10" fill="currentColor" opacity="0.8"/>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => ['jasmine', 'learn', 'discuss', 'game', 'admin', 'petal'].includes(value)
  },
  size: {
    type: [Number, String],
    default: 48
  }
})
</script>

<style scoped>
.jasmine-icon {
  filter: drop-shadow(0 4px 6px rgba(134, 239, 172, 0.4));
}

.icon-learn {
  filter: drop-shadow(0 4px 6px rgba(34, 197, 94, 0.3));
}

.icon-discuss {
  filter: drop-shadow(0 4px 6px rgba(245, 158, 11, 0.3));
}

.icon-game {
  filter: drop-shadow(0 4px 6px rgba(234, 88, 12, 0.3));
}

.icon-admin {
  filter: drop-shadow(0 4px 6px rgba(71, 85, 105, 0.3));
}

.petal-icon {
  color: rgba(255, 255, 255, 0.6);
}
</style>
