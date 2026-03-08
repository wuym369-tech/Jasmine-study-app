// ===========================
// 现实挑战 - 极端危机事件库
// 基于真实茉莉花农场的多重危机情境
// ===========================

// 危机类型定义
export const CrisisTypes = {
  WEATHER: 'weather',      // 天气灾害
  PEST: 'pest',           // 虫害爆发
  DISEASE: 'disease',     // 病害蔓延
  SOIL: 'soil',           // 土壤问题
  WATER: 'water',         // 水源/灌溉
  LABOR: 'labor',         // 人力短缺
  MARKET: 'market',       // 市场波动
  EQUIPMENT: 'equipment'  // 设备故障
}

// 危机严重程度
export const SeverityLevels = {
  MINOR: { level: 1, label: '轻微', impact: 5, color: 'yellow' },
  MODERATE: { level: 2, label: '中等', impact: 15, color: 'orange' },
  SEVERE: { level: 3, label: '严重', impact: 30, color: 'red' },
  EXTREME: { level: 4, label: '极危', impact: 50, color: 'purple' }
}

// 极端危机事件库
export const extremeEvents = [
  // ====== 天气灾害 ======
  {
    id: 'E001',
    type: CrisisTypes.WEATHER,
    severity: SeverityLevels.EXTREME,
    title: '超强台风来袭',
    icon: '🌀',
    description: '气象局发布台风红色预警，风力14级，伴随暴雨。农场面临植株倒伏、花苞损失、设施损坏的三重威胁。',
    effects: {
      health: -25,      // 植株健康
      flowers: -30,     // 花苞损失
      mood: -20,        // 团队士气
      facility: -15     // 设施损坏
    },
    validSeasons: ['summer', 'autumn'], // 7-10月
    emergencyTime: 24, // 应急时间（小时）
    options: [
      {
        id: 'A',
        text: '全员紧急抢收花苞 + 搭建防风支架 + 疏通排水沟',
        cost: { money: 3000, labor: 6, time: 20 },
        effects: { health: -5, flowers: -5, mood: -5 },
        score: 95
      },
      {
        id: 'B',
        text: '优先抢收高价值花苞 + 简易支架防护',
        cost: { money: 1500, labor: 4, time: 15 },
        effects: { health: -15, flowers: -15, mood: -10 },
        score: 70
      },
      {
        id: 'C',
        text: '相信植株抗风能力，只做好排水准备',
        cost: { money: 500, labor: 2, time: 8 },
        effects: { health: -30, flowers: -35, mood: -20 },
        score: 30
      }
    ]
  },
  
  {
    id: 'E002',
    type: CrisisTypes.WEATHER,
    severity: SeverityLevels.SEVERE,
    title: '突发霜冻预警',
    icon: '❄️',
    description: '气温骤降预报：今夜凌晨降至0°C，茉莉花植株面临冻害风险，未采收花苞将全部报废。',
    effects: {
      health: -20,
      flowers: -40,
      mood: -10
    },
    validSeasons: ['winter', 'spring'],
    emergencyTime: 12,
    options: [
      {
        id: 'A',
        text: '紧急抢收 + 搭建临时暖棚 + 熏烟防冻',
        cost: { money: 2500, labor: 5, time: 10 },
        effects: { health: -3, flowers: -5, mood: -3 },
        score: 90
      },
      {
        id: 'B',
        text: '只抢收成熟花苞 + 覆盖防寒布',
        cost: { money: 1000, labor: 3, time: 8 },
        effects: { health: -12, flowers: -25, mood: -8 },
        score: 65
      }
    ]
  },
  
  // ====== 虫害爆发 ======
  {
    id: 'E003',
    type: CrisisTypes.PEST,
    severity: SeverityLevels.EXTREME,
    title: '红蜘蛛大规模爆发',
    icon: '🕷️',
    description: '连续高温干旱导致红蜘蛛爆发，叶片出现大量黄斑，植株光合作用能力下降，花苞发育受阻。',
    effects: {
      health: -30,
      flowers: -20,
      quality: -25  // 品质下降
    },
    validSeasons: ['summer'],
    emergencyTime: 48,
    options: [
      {
        id: 'A',
        text: '立即生物防治（释放捕食螨）+ 物理冲洗 + 调整灌溉',
        cost: { money: 2000, labor: 4, time: 16 },
        effects: { health: -5, flowers: -3, quality: -5 },
        isOrganic: true,
        score: 95
      },
      {
        id: 'B',
        text: '化学农药紧急喷洒 + 增加灌溉',
        cost: { money: 800, labor: 2, time: 8 },
        effects: { health: -10, flowers: -8, quality: -15, certification: -10 },
        isOrganic: false,
        score: 70
      },
      {
        id: 'C',
        text: '剪除严重受害枝条 + 强化水肥管理',
        cost: { money: 500, labor: 3, time: 12 },
        effects: { health: -20, flowers: -15, quality: -20 },
        score: 50
      }
    ]
  },
  
  {
    id: 'E004',
    type: CrisisTypes.PEST,
    severity: SeverityLevels.SEVERE,
    title: '蓟马爆发危害花蕾',
    icon: '🦟',
    description: '夜间检查发现大量蓟马聚集，花蕾出现银灰色斑痕，即将开放的花朵品质严重受损。',
    effects: {
      flowers: -35,
      quality: -30,
      income: -25   // 收入损失
    },
    validSeasons: ['spring', 'summer', 'autumn'],
    emergencyTime: 24,
    options: [
      {
        id: 'A',
        text: '夜间灯光诱捕 + 释放天敌（小花蝽）+ 黄板监测',
        cost: { money: 1500, labor: 3, time: 12 },
        effects: { flowers: -5, quality: -5 },
        isOrganic: true,
        score: 90
      },
      {
        id: 'B',
        text: '农药喷洒 + 调整采收时间避开高峰期',
        cost: { money: 600, labor: 2, time: 6 },
        effects: { flowers: -15, quality: -15, certification: -5 },
        score: 65
      }
    ]
  },
  
  // ====== 土壤与水源 ======
  {
    id: 'E005',
    type: CrisisTypes.SOIL,
    severity: SeverityLevels.SEVERE,
    title: '土壤严重酸化',
    icon: '🧪',
    description: '检测发现土壤pH降至4.2，远低于茉莉花适宜范围（5.5-6.5），根系吸收能力急剧下降，叶片发黄。',
    effects: {
      health: -25,
      growth: -30,  // 生长速度
      flowers: -20
    },
    validSeasons: ['all'],
    emergencyTime: 72,
    options: [
      {
        id: 'A',
        text: '施用生石灰调节 + 增施有机肥 + 种植绿肥',
        cost: { money: 3000, labor: 5, time: 20 },
        effects: { health: -3, growth: -5 },
        longTermBenefit: true,
        score: 92
      },
      {
        id: 'B',
        text: '快速施用石膏 + 叶面喷施微量元素',
        cost: { money: 1200, labor: 3, time: 10 },
        effects: { health: -10, growth: -15 },
        score: 60
      }
    ]
  },
  
  {
    id: 'E006',
    type: CrisisTypes.WATER,
    severity: SeverityLevels.MODERATE,
    title: '灌溉系统故障',
    icon: '💧',
    description: '主灌溉管道破裂，正值盛花期，连续3天无法自动灌溉，茉莉花面临干旱胁迫。',
    effects: {
      health: -15,
      flowers: -15,
      quality: -10
    },
    validSeasons: ['all'],
    emergencyTime: 24,
    options: [
      {
        id: 'A',
        text: '紧急抢修管道 + 人工补灌 + 覆盖保墒',
        cost: { money: 2000, labor: 6, time: 18 },
        effects: { health: -2, flowers: -2 },
        score: 88
      },
      {
        id: 'B',
        text: '临时引水灌溉 + 延迟修复',
        cost: { money: 800, labor: 4, time: 12 },
        effects: { health: -10, flowers: -12 },
        score: 55
      }
    ]
  },
  
  // ====== 人力与市场 ======
  {
    id: 'E007',
    type: CrisisTypes.LABOR,
    severity: SeverityLevels.SEVERE,
    title: '采收季人手短缺',
    icon: '👷',
    description: '正值盛花期，3名采收工同时病假，大量成熟花苞面临过熟开放，错过最佳采收时机。',
    effects: {
      flowers: -40,
      income: -30,
      mood: -15
    },
    validSeasons: ['summer', 'autumn'],
    emergencyTime: 12,
    options: [
      {
        id: 'A',
        text: '紧急雇佣临时工 + 延长采收时间 + 动员家属支援',
        cost: { money: 2500, labor: 2, time: 10 },
        effects: { flowers: -5, mood: -5 },
        score: 90
      },
      {
        id: 'B',
        text: '优先采收高价值花苞 + 降低采收标准',
        cost: { money: 500, labor: 2, time: 8 },
        effects: { flowers: -25, income: -20 },
        score: 55
      }
    ]
  },
  
  {
    id: 'E008',
    type: CrisisTypes.MARKET,
    severity: SeverityLevels.MODERATE,
    title: '鲜花价格暴跌',
    icon: '📉',
    description: '市场突遭冲击，茉莉花收购价下跌40%，已采收的花朵面临亏损，需要调整策略。',
    effects: {
      income: -40,
      mood: -20
    },
    validSeasons: ['all'],
    emergencyTime: 48,
    options: [
      {
        id: 'A',
        text: '与茶厂签订长期合同锁定价格 + 提高品质争取溢价',
        cost: { money: 1000, labor: 2, time: 10 },
        effects: { income: -10, mood: -5 },
        longTermBenefit: true,
        score: 85
      },
      {
        id: 'B',
        text: '转向直销/电商 + 开发花艺产品',
        cost: { money: 2000, labor: 3, time: 20 },
        effects: { income: -15, mood: -10 },
        score: 75
      },
      {
        id: 'C',
        text: '减少采收量 + 等待价格回升',
        cost: { money: 0, labor: 1, time: 5 },
        effects: { income: -35, flowers: -30 },
        score: 40
      }
    ]
  }
]

// 日常管理事件（非危机）
export const dailyEvents = [
  {
    id: 'D001',
    type: 'routine',
    title: '日常浇水',
    icon: '💧',
    description: '天气晴朗，土壤湿度适中，进行常规浇水维护。',
    requiredRole: 'irrigation',
    effects: { health: +2, growth: +3 },
    cost: { labor: 1, time: 4 }
  },
  {
    id: 'D002',
    type: 'routine',
    title: '施肥养护',
    icon: '🌱',
    description: '植株生长旺盛期，补充有机肥促进花芽分化。',
    requiredRole: 'fertilization',
    effects: { health: +3, growth: +5, flowers: +5 },
    cost: { money: 300, labor: 2, time: 6 }
  },
  {
    id: 'D003',
    type: 'routine',
    title: '常规采收',
    icon: '🌸',
    description: '花蕾达到采收标准，进行日常采收作业。',
    requiredRole: 'harvest',
    effects: { income: +500, mood: +5 },
    cost: { labor: 3, time: 8 }
  },
  {
    id: 'D004',
    type: 'routine',
    title: '修剪整形',
    icon: '✂️',
    description: '对徒长枝进行修剪，改善通风透光条件。',
    requiredRole: 'pruning',
    effects: { health: +2, growth: +4 },
    cost: { labor: 2, time: 6 }
  },
  {
    id: 'D005',
    type: 'routine',
    title: '病虫害巡检',
    icon: '🔍',
    description: '定期检查叶片正反面，预防病虫害。',
    requiredRole: 'protection',
    effects: { health: +1, prevention: true },
    cost: { labor: 1, time: 3 }
  }
]

// 茉莉花生长阶段
export const GrowthStages = {
  SEEDLING: {
    id: 'seedling',
    name: '幼苗期',
    icon: '🌱',
    days: 1, // 游戏内天数
    description: '刚扦插成活的幼苗，根系尚未发达',
    healthFactor: 0.8,  // 健康系数
    riskFactor: 1.2     // 风险系数（更易受伤害）
  },
  VEGETATIVE: {
    id: 'vegetative',
    name: '营养生长期',
    icon: '🌿',
    days: 2,
    description: '快速长叶长枝，建立健壮植株',
    healthFactor: 1.0,
    riskFactor: 1.0
  },
  FLOWERING: {
    id: 'flowering',
    name: '开花期',
    icon: '🌸',
    days: 3,
    description: '花芽分化，大量花苞形成',
    healthFactor: 1.0,
    riskFactor: 1.1,
    flowerOutput: 1.5  // 花朵产出系数
  },
  HARVEST: {
    id: 'harvest',
    name: '采收盛期',
    icon: '🏆',
    days: 2,
    description: '持续采收，管理重点转向品质',
    healthFactor: 0.9,
    riskFactor: 1.0,
    flowerOutput: 2.0
  },
  DORMANT: {
    id: 'dormant',
    name: '休眠期',
    icon: '🍂',
    days: 1,
    description: '冬季修剪，准备来年',
    healthFactor: 0.7,
    riskFactor: 1.3
  }
}

// 评分标准
export const ScoringCriteria = {
  PLANT_HEALTH: { weight: 25, maxScore: 25, label: '植株健康' },
  FLOWER_QUALITY: { weight: 30, maxScore: 30, label: '花朵品质' },
  INCOME: { weight: 20, maxScore: 20, label: '经济效益' },
  TEAM_MOOD: { weight: 15, maxScore: 15, label: '团队士气' },
  SUSTAINABILITY: { weight: 10, maxScore: 10, label: '可持续发展' }
}

// 队伍状态模板
export const TeamStatusTemplate = {
  teamId: '',
  teamName: '',
  
  // 核心指标（满分100分）
  plantHealth: 100,      // 植株健康度
  flowerQuality: 100,   // 花朵品质
  teamMood: 100,        // 团队士气
  
  // 经济数据
  totalIncome: 0,       // 总收入
  totalCost: 0,         // 总支出
  netProfit: 0,         // 净利润
  
  // 生产数据
  flowersHarvested: 0,  // 采收花朵数
  flowersLost: 0,        // 损失花朵数
  
  // 决策记录
  decisions: [],         // 所有决策历史
  
  // 当前状态
  currentStage: 'seedling', // 当前生长阶段
  day: 1,                 // 当前天数
  
  // 特效状态
  effects: {
    organic: true,        // 是否保持有机认证
    certifications: [],   // 获得的认证
    achievements: []     // 解锁的成就
  }
}

// 游戏配置
export const GameConfig = {
  TOTAL_DAYS: 10,           // 游戏总天数
  EVENTS_PER_DAY: 2,        // 每天事件数（1日常+1随机）
  EXTREME_EVENT_CHANCE: 0.3, // 30%概率出现极端事件
  
  // 资源初始值
  STARTING_MONEY: 5000,
  STARTING_LABOR: 6,
  
  // 评分阈值
  GRADE_THRESHOLDS: {
    S: 95,  // 完美
    A: 85,  // 优秀
    B: 70,  // 良好
    C: 60,  // 及格
    D: 50   // 需改进
  }
}

// 随机事件生成器
export function generateDailyEvents(day, season, previousEvents = []) {
  const events = []
  
  // 第1个事件：日常管理（必出）
  const routineEvent = dailyEvents[Math.floor(Math.random() * dailyEvents.length)]
  events.push({ ...routineEvent, isExtreme: false })
  
  // 第2个事件：随机事件
  const isExtreme = Math.random() < GameConfig.EXTREME_EVENT_CHANCE
  
  if (isExtreme) {
    // 筛选当前季节有效的极端事件
    const validExtremes = extremeEvents.filter(e => 
      e.validSeasons.includes(season) || e.validSeasons.includes('all')
    )
    
    // 避免连续出现同类型事件
    const availableExtremes = validExtremes.filter(e => {
      const recentSameType = previousEvents
        .slice(-3)
        .some(prev => prev.type === e.type)
      return !recentSameType
    })
    
    const selectedEvent = availableExtremes.length > 0 
      ? availableExtremes[Math.floor(Math.random() * availableExtremes.length)]
      : validExtremes[Math.floor(Math.random() * validExtremes.length)]
    
    events.push({ ...selectedEvent, isExtreme: true })
  } else {
    // 普通日常事件（不同类型）
    const otherRoutines = dailyEvents.filter(e => e.id !== routineEvent.id)
    const selectedRoutine = otherRoutines[Math.floor(Math.random() * otherRoutines.length)]
    events.push({ ...selectedRoutine, isExtreme: false })
  }
  
  return events
}

// 计算团队最终得分
export function calculateFinalScore(teamStatus) {
  const scores = {
    health: Math.min(ScoringCriteria.PLANT_HEALTH.maxScore, teamStatus.plantHealth / 4),
    quality: Math.min(ScoringCriteria.FLOWER_QUALITY.maxScore, teamStatus.flowerQuality / 3.33),
    income: Math.min(ScoringCriteria.INCOME.maxScore, (teamStatus.netProfit / 10000) * 20),
    mood: Math.min(ScoringCriteria.TEAM_MOOD.maxScore, teamStatus.teamMood / 6.67),
    sustainability: teamStatus.effects.organic ? 10 : 5
  }
  
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  
  // 确定等级
  let grade = 'F'
  if (totalScore >= GameConfig.GRADE_THRESHOLDS.S) grade = 'S'
  else if (totalScore >= GameConfig.GRADE_THRESHOLDS.A) grade = 'A'
  else if (totalScore >= GameConfig.GRADE_THRESHOLDS.B) grade = 'B'
  else if (totalScore >= GameConfig.GRADE_THRESHOLDS.C) grade = 'C'
  else if (totalScore >= GameConfig.GRADE_THRESHOLDS.D) grade = 'D'
  
  return {
    totalScore: Math.round(totalScore),
    details: scores,
    grade,
    evaluation: generateEvaluation(totalScore, scores)
  }
}

function generateEvaluation(totalScore, scores) {
  if (totalScore >= 95) return '完美！你是真正的茉莉大师！'
  if (totalScore >= 85) return '优秀！农场经营得非常出色！'
  if (totalScore >= 70) return '良好！有一些改进空间。'
  if (totalScore >= 60) return '及格！需要更精心地管理。'
  return '需要加油！农场遇到了一些困难。'
}
