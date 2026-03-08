<template>
  <div class="roles-container">
    <div class="roles-intro">
      👥 本章节内容由活动主办单位填写，说明各职责角色的详细职责与重要性。
    </div>

    <div class="roles-grid">
      <div v-for="role in roles" :key="role.name" class="role-card" :class="role.borderColor">
        <div class="role-header">
          <span class="role-icon">{{ role.icon }}</span>
          <div class="role-titles">
            <h3 class="role-name" :class="role.textColor">{{ role.name }}</h3>
            <span class="role-subtitle">{{ role.subtitle }}</span>
          </div>
        </div>
        <p class="role-desc">{{ role.desc }}</p>
        <div class="role-duties">
          <div class="duties-title">主要职责：</div>
          <ul class="duties-list">
            <li v-for="duty in role.duties" :key="duty" class="duty-item">• {{ duty }}</li>
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
    borderColor: 'border-blue',
    textColor: 'text-blue',
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
    borderColor: 'border-cyan',
    textColor: 'text-cyan',
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
    borderColor: 'border-amber',
    textColor: 'text-amber',
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
    borderColor: 'border-red',
    textColor: 'text-red',
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
    borderColor: 'border-pink',
    textColor: 'text-pink',
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
    subtitle: 'Farm Manager',
    icon: '👨‍🌾',
    borderColor: 'border-green',
    textColor: 'text-green',
    desc: '农场的最高决策者，协调各职责岗位，统筹资源分配，应对重大突发情况。',
    duties: [
      '统筹各部门协调配合',
      '做出重大管理决策',
      '应对重大突发事件',
      '制定农场长期规划',
    ],
  },
]
</script>

<style scoped>
@reference "tailwindcss";

.roles-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 8px 0 32px;
}

.roles-intro {
  background: rgba(91, 122, 94, 0.08);
  border: 1px solid rgba(91, 122, 94, 0.2);
  border-radius: 16px;
  padding: 20px 24px;
  font-size: 16px;
  color: #5B7A5E;
  line-height: 1.7;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .roles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.role-card {
  background: white;
  border-radius: 24px;
  border: 2px solid;
  padding: 32px 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.role-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.role-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.role-titles {
  flex: 1;
}

.role-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}

.role-subtitle {
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
}

.role-desc {
  font-size: 16px;
  color: #64748B;
  line-height: 1.7;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(139, 115, 85, 0.15);
}

.role-duties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.duties-title {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
}

.duties-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.duty-item {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
}

/* 顏色類 */
.border-blue { border-color: rgba(59, 130, 246, 0.3); }
.border-cyan { border-color: rgba(6, 182, 212, 0.3); }
.border-amber { border-color: rgba(245, 158, 11, 0.3); }
.border-red { border-color: rgba(239, 68, 68, 0.3); }
.border-pink { border-color: rgba(236, 72, 153, 0.3); }
.border-green { border-color: rgba(34, 197, 94, 0.3); }

.text-blue { color: #2563EB; }
.text-cyan { color: #0891B2; }
.text-amber { color: #D97706; }
.text-red { color: #DC2626; }
.text-pink { color: #DB2777; }
.text-green { color: #16A34A; }
</style>
