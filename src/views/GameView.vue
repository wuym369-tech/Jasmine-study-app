<template>
  <div class="min-h-screen p-8">
    <router-link to="/" class="text-green-600 hover:text-green-800 mb-6 inline-block">← 返回首页</router-link>
    <h1 class="text-3xl font-bold text-orange-800 mb-2">🏆 农场模拟竞赛</h1>
    <p class="text-orange-500 mb-8">各队分工合作，共同应对农场挑战</p>

    <!-- 角色说明 -->
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
      <p class="text-gray-600">竞赛系统开发中...（第 5 阶段）</p>
    </div>
  </div>
</template>

<script setup>
const roles = [
  { name: '气象员', icon: '🌧️', desc: '监测天气，发布预警', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
  { name: '灌溉员', icon: '💧', desc: '水分管理，排水控制', borderColor: 'border-cyan-200', textColor: 'text-cyan-700' },
  { name: '土肥员', icon: '🌱', desc: '土壤健康，施肥计划', borderColor: 'border-amber-200', textColor: 'text-amber-700' },
  { name: '植保员', icon: '🐛', desc: '病虫害识别与防治', borderColor: 'border-red-200', textColor: 'text-red-700' },
  { name: '采收员', icon: '🌸', desc: '花期判断，采摘品质', borderColor: 'border-pink-200', textColor: 'text-pink-700' },
  { name: '农场总管', icon: '👨‍💼', desc: '资源调配，整体协调', borderColor: 'border-green-200', textColor: 'text-green-700' },
]
</script>
