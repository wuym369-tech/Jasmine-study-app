<template>
  <span class="animated-number">{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1000
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
})

const displayValue = ref(props.prefix + '0' + props.suffix)

function animate(targetValue) {
  const startTime = performance.now()
  const startValue = 0
  
  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // Easing function (easeOutQuart)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart)
    
    displayValue.value = props.prefix + currentValue + props.suffix
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}

onMounted(() => {
  animate(props.value)
})

watch(() => props.value, (newValue) => {
  animate(newValue)
})
</script>

<style scoped>
.animated-number {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
</style>
