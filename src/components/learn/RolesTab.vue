<template>
  <div class="space-y-6">
    <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
      👥 本章節內容由活動主辦單位填寫，說明各職責角色的詳細職責與重要性。
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="role in roles" :key="role.name"
        class="bg-white rounded-2xl border-2 p-6" :class="role.borderColor">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-4xl">{{ role.icon }}</span>
          <div>
            <h3 class="font-bold text-lg" :class="role.textColor">{{ role.name }}</h3>
            <span class="text-xs text-gray-500">{{ role.subtitle }}</span>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-3">{{ role.desc }}</p>
        <div class="text-xs text-gray-500">
          <div class="font-medium mb-1">主要職責：</div>
          <ul class="space-y-1">
            <li v-for="duty in role.duties" :key="duty">• {{ duty }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const roles = [
  {
    name: '氣象員',
    subtitle: 'Meteorologist',
    icon: '🌧️',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    desc: '負責監測天氣變化，提前發出預警，讓整個農場團隊有足夠時間準備應對各種氣候挑戰。',
    duties: [
      '監測每日天氣預報',
      '判讀寒潮、颱風、暴雨等預警訊號',
      '向農場總管建議防災應對措施',
      '記錄氣候對農場的影響',
    ],
  },
  {
    name: '灌溉員',
    subtitle: 'Irrigation Manager',
    icon: '💧',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    desc: '負責農場的水分管理，確保茉莉花在不同天氣和生長階段獲得適當的水分供給。',
    duties: [
      '制定每日澆水計畫',
      '管理排水系統，防止積水',
      '根據天氣調整灌溉頻率',
      '應對乾旱或暴雨的水分管理',
    ],
  },
  {
    name: '土肥員',
    subtitle: 'Soil & Fertilization Manager',
    icon: '🌱',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    desc: '負責監測土壤健康狀況並制定施肥計畫，確保茉莉花獲得均衡的養分供給。',
    duties: [
      '定期檢測土壤pH值和養分',
      '制定全年施肥計畫',
      '應對土壤酸化、養分不足等問題',
      '選用適合的有機/化學肥料',
    ],
  },
  {
    name: '植保員',
    subtitle: 'Plant Protection Officer',
    icon: '🐛',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    desc: '負責識別和防治各種病蟲害，是農場的「健康守護者」，防止病蟲害蔓延擴大。',
    duties: [
      '定期巡田檢查病蟲害',
      '識別蟲害和病害的種類',
      '選擇適當的防治方法和農藥',
      '記錄病蟲害發生規律',
    ],
  },
  {
    name: '採收員',
    subtitle: 'Harvest Quality Officer',
    icon: '🌸',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    desc: '負責判斷最佳採收時機、管理採收品質，確保每一批茉莉花都以最好的狀態交付。',
    duties: [
      '判斷花苞成熟度和採收時機',
      '安排每天的採收計畫',
      '控制採收品質和分級',
      '管理採後處理和保鮮',
    ],
  },
  {
    name: '農場總管',
    subtitle: 'Farm Captain',
    icon: '👨‍💼',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    desc: '負責整合各職責人員的工作，合理調配資源，在關鍵時刻做出最優的整體決策。',
    duties: [
      '協調各職責人員的工作分工',
      '資源分配和優先順序判斷',
      '面對複雜情況時的最終決策',
      '評估農場整體健康和生產狀況',
    ],
  },
]
</script>
