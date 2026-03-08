<template>
  <div class="petals-container">
    <!-- SVG 茉莉花瓣 -->
    <svg
      v-for="petal in petals"
      :key="petal.id"
      class="petal-svg"
      :style="petal.style"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="5"
        ry="9"
        :fill="petal.color"
        opacity="0.7"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const petals = ref([])
let intervalId = null

// 高级配色花瓣
const petalColors = [
  '#F5F0E8', // 米白
  '#E8E4DE', // 淡灰
  '#D4E0D4', // 淡竹青
  '#EDE8E0', // 暖白
  '#F0EDE8', // 象牙
]

function createPetal() {
  const id = Date.now() + Math.random()
  const startX = Math.random() * 100 // 0-100%
  const duration = 10 + Math.random() * 8 // 10-18 seconds (slower for elegance)
  const delay = Math.random() * 3
  const scale = 0.4 + Math.random() * 0.6
  const rotate = Math.random() * 360
  const color = petalColors[Math.floor(Math.random() * petalColors.length)]
  
  return {
    id,
    color,
    style: {
      left: `${startX}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      opacity: 0.5 + Math.random() * 0.3,
    }
  }
}

onMounted(() => {
  // 初始化花瓣 - 更少更精致
  for (let i = 0; i < 12; i++) {
    petals.value.push(createPetal())
  }
  
  // 持續添加新花瓣
  intervalId = setInterval(() => {
    if (petals.value.length > 20) {
      petals.value.shift()
    }
    petals.value.push(createPetal())
  }, 2000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.petals-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.petal-svg {
  position: absolute;
  top: -40px;
  animation: elegant-fall linear forwards;
  filter: blur(1px);
}

@keyframes elegant-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--petal-opacity, 0.6);
  }
  25% {
    transform: translateY(25vh) translateX(15px) rotate(45deg);
  }
  50% {
    transform: translateY(50vh) translateX(-8px) rotate(90deg);
  }
  75% {
    transform: translateY(75vh) translateX(12px) rotate(135deg);
    opacity: var(--petal-opacity, 0.6);
  }
  100% {
    transform: translateY(calc(100vh + 40px)) translateX(0) rotate(180deg);
    opacity: 0;
  }
}
</style>
