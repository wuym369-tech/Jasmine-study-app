<template>
  <div class="space-y-6">
    <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
      👥 本章节内容由活动主办单位填写，说明各职责角色的详细职责与重要性。
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
          <div class="font-medium mb-1">主要职责：</div>
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
    name: '气象员',
    subtitle: 'Meteorologist',
    icon: '🌧️',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    desc: '负责监测天气变化，提前发出预警，让整个农场团队有足够时间准备应对各种气候挑战。',
    duties: [
      '监测每日天气预报',
      '判读寒潮、台风、暴雨等预警信号',
      '向农场总管建议防灾应对措施',
      '记录气候对农场的影响',
    ],
  },
  {
    name: '灌溉员',
    subtitle: 'Irrigation Manager',
    icon: '💧',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    desc: '负责农场的水分管理，确保茉莉花在不同天气和生长阶段获得适当的水分供给。',
    duties: [
      '制定每日浇水计划',
      '管理排水系统，防止积水',
      '根据天气调整灌溉频率',
      '应对干旱或暴雨的水分管理',
    ],
  },
  {
    name: '土肥员',
    subtitle: 'Soil & Fertilization Manager',
    icon: '🌱',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    desc: '负责监测土壤健康状况并制定施肥计划，确保茉莉花获得均衡的养分供给。',
    duties: [
      '定期检测土壤pH值和养分',
      '制定全年施肥计划',
      '应对土壤酸化、养分不足等问题',
      '选用适合的有机/化学肥料',
    ],
  },
  {
    name: '植保员',
    subtitle: 'Plant Protection Officer',
    icon: '🐛',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    desc: '负责识别和防治各种病虫害，是农场的"健康守护者"，防止病虫害蔓延扩大。',
    duties: [
      '定期巡田检查病虫害',
      '识别虫害和病害的种类',
      '选择适当的防治方法和农药',
      '记录病虫害发生规律',
    ],
  },
  {
    name: '采收员',
    subtitle: 'Harvest Quality Officer',
    icon: '🌸',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    desc: '负责判断最佳采收时机、管理采收品质，确保每一批茉莉花都以最好的状态交付。',
    duties: [
      '判断花蕾成熟度和采收时机',
      '安排每天的采收计划',
      '控制采收品质和分级',
      '管理采后处理和保鲜',
    ],
  },
  {
    name: '农场总管',
    subtitle: 'Farm Captain',
    icon: '👨‍💼',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    desc: '负责整合各职责人员的工作，合理调配资源，在关键时刻做出最优的整体决策。',
    duties: [
      '协调各职责人员的工作分工',
      '资源分配和优先顺序判断',
      '面对复杂情况时的最终决策',
      '评估农场整体健康和生产状况',
    ],
  },
]
</script>
