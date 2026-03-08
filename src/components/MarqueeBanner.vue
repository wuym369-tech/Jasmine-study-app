<template>
  <div class="marquee-container">
    <div class="marquee-track">
      <div v-for="(item, index) in doubledItems" :key="index" class="marquee-item">
        <span class="marquee-text">{{ item }}</span>
        <JasmineIcons name="petal" :size="12" class="marquee-separator" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import JasmineIcons from './JasmineIcons.vue'

const items = [
  '横州茉莉花 · 世界茉莉花都',
  '窨得茉莉无上味，列作人间第一香',
  '中国茉莉之乡 · 广西横州',
  '好一朵美丽的茉莉花',
  '全球10朵茉莉花，6朵来自横州',
  '农耕智慧 · 传承百年',
]

const doubledItems = computed(() => [...items, ...items])
</script>

<style scoped>
.marquee-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(90deg, 
    rgba(91, 122, 94, 0.95) 0%, 
    rgba(123, 163, 126, 0.95) 50%,
    rgba(91, 122, 94, 0.95) 100%
  );
  backdrop-filter: blur(10px);
  z-index: 100;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.marquee-track {
  display: flex;
  animation: marquee-scroll 30s linear infinite;
  white-space: nowrap;
}

.marquee-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  flex-shrink: 0;
}

.marquee-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.08em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.marquee-separator {
  color: rgba(255, 255, 255, 0.6);
  opacity: 0.8;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 悬停暂停 */
.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
</style>
