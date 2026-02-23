<template>
  <div class="min-h-screen p-8">
    <router-link to="/" class="text-green-600 hover:text-green-800 mb-6 inline-block">← 返回首頁</router-link>
    <h1 class="text-3xl font-bold text-orange-800 mb-2">🏆 農場模擬競賽</h1>
    <p class="text-orange-500 mb-8">各隊分工合作，共同應對農場挑戰</p>

    <!-- 角色說明 -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mb-8">
      <div v-for="role in roles" :key="role.name"
        class="bg-white rounded-xl p-4 border-2 text-center"
        :class="role.borderColor">
        <div class="text-3xl mb-2">{{ role.icon }}</div>
        <h3 class="font-bold text-sm" :class="role.textColor">{{ role.name }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ role.desc }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-orange-200 max-w-3xl">
      <p class="text-gray-600">競賽系統建置中...（第 5 階段開發）</p>
    </div>
  </div>
</template>

<script setup>
const roles = [
  { name: '氣象員', icon: '🌧️', desc: '監測天氣，發佈預警', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
  { name: '灌溉員', icon: '💧', desc: '水分管理，排水控制', borderColor: 'border-cyan-200', textColor: 'text-cyan-700' },
  { name: '土肥員', icon: '🌱', desc: '土壤健康，施肥計畫', borderColor: 'border-amber-200', textColor: 'text-amber-700' },
  { name: '植保員', icon: '🐛', desc: '病蟲害識別與防治', borderColor: 'border-red-200', textColor: 'text-red-700' },
  { name: '採收員', icon: '🌸', desc: '花期判斷，採摘品質', borderColor: 'border-pink-200', textColor: 'text-pink-700' },
  { name: '農場總管', icon: '👨‍💼', desc: '資源調配，整體協調', borderColor: 'border-green-200', textColor: 'text-green-700' },
]
</script>
