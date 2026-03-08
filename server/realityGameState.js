// ===========================
// 现实挑战 - 游戏状态管理（异步自动模式）
// 每个学生独立进行游戏，自动推进天数
// ===========================

// 危机类型定义
export const CrisisTypes = {
  WEATHER: 'weather',
  PEST: 'pest',
  DISEASE: 'disease',
  SOIL: 'soil',
  WATER: 'water',
  LABOR: 'labor',
  MARKET: 'market',
  EQUIPMENT: 'equipment'
}

// 危机严重程度
export const SeverityLevels = {
  SIMPLE: { level: 0, label: '简单', impact: 5, color: 'green', complexity: 'simple' },
  MINOR: { level: 1, label: '轻微', impact: 10, color: 'yellow', complexity: 'complex' },
  MODERATE: { level: 2, label: '中等', impact: 20, color: 'orange', complexity: 'complex' },
  SEVERE: { level: 3, label: '严重', impact: 35, color: 'red', complexity: 'complex' },
  EXTREME: { level: 4, label: '极危', impact: 50, color: 'purple', complexity: 'complex' }
}

// 星期名称
export const WeekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 扦插期特定事件（伺服器與前端共用，需在模組內定義避免 Node 端 ReferenceError）
export const cuttingEvents = [
  {
    id: 'CUT001',
    type: 'cutting',
    complexity: 'simple',
    title: '选择扦插枝条',
    icon: '✂️',
    description: '选择健康的茉莉花枝条进行扦插。选择半木质化的枝条成活率最高。',
    options: [
      { id: 'A', text: '选择半木质化、健康的枝条，斜切45度角', cost: { labor: 2 }, effects: { health: 10, growth: 15 }, score: 100 },
      { id: 'B', text: '随意剪取较嫩的枝条', cost: { labor: 1 }, effects: { health: 3, growth: 5 }, score: 60 },
      { id: 'C', text: '使用已木質化的老枝以節省材料', cost: { labor: 1 }, effects: { health: -5, growth: 2 }, score: 35 },
      { id: 'D', text: '過長枝條不修剪直接扦插', cost: { labor: 1 }, effects: { health: 0, growth: 3 }, score: 45 }
    ]
  },
  {
    id: 'CUT002',
    type: 'cutting',
    complexity: 'simple',
    title: '准备扦插基质',
    icon: '🪴',
    description: '准备疏松透气的扦插基质，可以使用河沙、蛭石或珍珠岩。',
    options: [
      { id: 'A', text: '使用河沙+珍珠岩混合基质，消毒处理', cost: { money: 200, labor: 2 }, effects: { health: 8, growth: 10 }, score: 100 },
      { id: 'B', text: '直接使用普通园土', cost: { labor: 1 }, effects: { health: 2, growth: 3 }, score: 55 },
      { id: 'C', text: '純蛭石、不消毒', cost: { money: 150, labor: 1 }, effects: { health: 4, growth: 5 }, score: 65 },
      { id: 'D', text: '黏重園土混少量沙', cost: { labor: 2 }, effects: { health: -3, growth: 1 }, score: 40 }
    ]
  },
  {
    id: 'CUT003',
    type: 'cutting',
    complexity: 'simple',
    title: '扦插后遮阴保湿',
    icon: '🌿',
    description: '扦插后需要遮阴保湿，保持环境湿度，促进生根。',
    options: [
      { id: 'A', text: '搭建遮阴棚，每天喷雾保湿2-3次', cost: { money: 300, labor: 3 }, effects: { health: 12, growth: 15 }, score: 100 },
      { id: 'B', text: '简单遮阴，偶尔浇水', cost: { labor: 1 }, effects: { health: 4, growth: 5 }, score: 60 },
      { id: 'C', text: '全日照促生根', cost: { labor: 1 }, effects: { health: -8, growth: -2 }, score: 25 },
      { id: 'D', text: '密閉塑膠袋保濕不開孔', cost: { money: 50, labor: 1 }, effects: { health: -5, growth: 2 }, score: 40 }
    ]
  },
  {
    id: 'CUT004',
    type: 'cutting',
    complexity: 'simple',
    title: '插穗消毒與生根劑',
    icon: '🧴',
    description: '扦插前插穗可用多菌靈等消毒 2–4 分鐘，基部蘸生根粉後再插入基質，可提高成活率。',
    options: [
      { id: 'A', text: '多菌靈消毒 2–4 分鐘、基部蘸生根粉後扦插', cost: { money: 80, labor: 2 }, effects: { health: 10, growth: 12 }, score: 100 },
      { id: 'B', text: '只蘸生根粉、不消毒', cost: { money: 50, labor: 1 }, effects: { health: 4, growth: 6 }, score: 65 },
      { id: 'C', text: '只消毒、不用生根劑', cost: { money: 30, labor: 2 }, effects: { health: 6, growth: 5 }, score: 60 },
      { id: 'D', text: '都不處理、直接扦插', cost: { labor: 1 }, effects: { health: 2, growth: 3 }, score: 45 }
    ]
  }
]

// 生根期特定事件
export const rootingEvents = [
  {
    id: 'RT001',
    type: 'rooting',
    complexity: 'simple',
    title: '检查生根情况',
    icon: '🔍',
    description: '轻轻拉动枝条，感受是否有阻力，判断是否生根。',
    options: [
      { id: 'A', text: '小心检查，及时移除未生根的枝条', cost: { labor: 2 }, effects: { health: 5, growth: 8 }, score: 100 },
      { id: 'B', text: '全部保留，等待观察', cost: { labor: 1 }, effects: { health: 0, growth: 3 }, score: 65 },
      { id: 'C', text: '用力拔起檢查根系', cost: { labor: 1 }, effects: { health: -10, growth: -5 }, score: 20 },
      { id: 'D', text: '只檢查部分樣本、其餘不動', cost: { labor: 2 }, effects: { health: 3, growth: 5 }, score: 75 }
    ]
  },
  {
    id: 'RT002',
    type: 'rooting',
    complexity: 'simple',
    title: '控制水分防止烂根',
    icon: '💧',
    description: '生根期最怕烂根，需要精准控制水分。',
    options: [
      { id: 'A', text: '见干见湿，基质表面干燥后再浇水', cost: { labor: 2 }, effects: { health: 10, growth: 8 }, score: 100 },
      { id: 'B', text: '保持基质持续湿润', cost: { labor: 1 }, effects: { health: -5, growth: 3 }, score: 50 },
      { id: 'C', text: '長期偏乾以利發根', cost: { labor: 1 }, effects: { health: -8, growth: 2 }, score: 40 },
      { id: 'D', text: '托盤長期積水', cost: { labor: 1 }, effects: { health: -12, growth: -3 }, score: 30 }
    ]
  },
  {
    id: 'RT003',
    type: 'rooting',
    complexity: 'simple',
    title: '移植前煉苗',
    icon: '🌤️',
    description: '扦插苗生根後、移植定植前，需要逐步適應外界環境，避免定植後日曬傷苗。',
    options: [
      { id: 'A', text: '逐步增加光照與通風，約一週後再移入大盆或田間', cost: { labor: 2 }, effects: { health: 10, growth: 12 }, score: 100 },
      { id: 'B', text: '直接移出溫棚、當日定植', cost: { labor: 1 }, effects: { health: -5, growth: 2 }, score: 45 },
      { id: 'C', text: '延長煉苗兩週、少澆水促老熟', cost: { labor: 2 }, effects: { health: 4, growth: 5 }, score: 65 },
      { id: 'D', text: '只開小窗通風、不增加光照', cost: { labor: 1 }, effects: { health: 2, growth: 4 }, score: 55 }
    ]
  }
];

// 幼苗期／定植期事件（移植後至營養生長前）
export const seedlingEvents = [
  {
    id: 'SD001',
    type: 'seedling',
    complexity: 'simple',
    title: '定植後遮陰與澆水',
    icon: '🪴',
    description: '剛移植到田間或大盆的茉莉苗，根系尚未穩固，前幾天需避免強光直射並保持土壤濕潤。',
    options: [
      { id: 'A', text: '搭遮陰網 3–5 天、見乾見濕澆水，不積水', cost: { money: 200, labor: 2 }, effects: { health: 10, growth: 10 }, score: 100 },
      { id: 'B', text: '全日照、每天大量澆水促生長', cost: { labor: 1 }, effects: { health: -8, growth: 2 }, score: 30 },
      { id: 'C', text: '完全不澆水等扎根', cost: { labor: 0 }, effects: { health: -10, growth: -5 }, score: 25 },
      { id: 'D', text: '只遮陰、土壤乾透才澆', cost: { labor: 1 }, effects: { health: 2, growth: 4 }, score: 55 }
    ]
  },
  {
    id: 'SD002',
    type: 'seedling',
    complexity: 'simple',
    title: '定植後第一次施肥',
    icon: '🧪',
    description: '幼苗成活、新葉展開後，可開始施稀薄肥，促進根系與枝葉生長。',
    options: [
      { id: 'A', text: '稀薄豆餅水或氮磷均衡液肥，一週一次、少量', cost: { money: 150, labor: 1 }, effects: { health: 6, growth: 12 }, score: 100 },
      { id: 'B', text: '高濃度複合肥一次施足', cost: { money: 300, labor: 1 }, effects: { health: -5, growth: 2 }, score: 35 },
      { id: 'C', text: '暫不施肥，只澆水', cost: { labor: 0 }, effects: { health: 2, growth: 4 }, score: 60 },
      { id: 'D', text: '只噴葉面肥、不灌根', cost: { money: 100, labor: 2 }, effects: { health: 4, growth: 6 }, score: 70 }
    ]
  }
];

// 營養生長期／打頭期事件（促分枝、控梢長）
export const vegetativeEvents = [
  {
    id: 'VG001',
    type: 'vegetative',
    complexity: 'simple',
    title: '新梢打頂促分枝',
    icon: '✂️',
    description: '新枝長出 2–3 節葉片時摘心打頂，可促側芽萌發、株型豐滿，產花量提高約 15–20%。',
    options: [
      { id: 'A', text: '留 2 對葉摘心，多枝分批進行、摘後略施薄肥', cost: { labor: 3 }, effects: { health: 5, growth: 15 }, score: 100 },
      { id: 'B', text: '不摘心，讓枝條自然長高開花', cost: { labor: 0 }, effects: { health: 0, growth: 5 }, score: 50 },
      { id: 'C', text: '重剪到只剩一節、強迫發側枝', cost: { labor: 2 }, effects: { health: -3, growth: 8 }, score: 60 },
      { id: 'D', text: '只摘花蕾不摘心', cost: { labor: 1 }, effects: { health: 2, growth: 6 }, score: 55 }
    ]
  },
  {
    id: 'VG002',
    type: 'vegetative',
    complexity: 'simple',
    title: '春梢適宜留長度',
    icon: '📏',
    description: '一次梢（春梢）建議留 30–40 cm，過長易倒、過短產量低；二、三次梢可留 8–16 cm。',
    options: [
      { id: 'A', text: '春梢 30–40 cm 摘心，二三次梢 8–16 cm', cost: { labor: 2 }, effects: { health: 6, growth: 12 }, score: 100 },
      { id: 'B', text: '全部留長不剪、多開花', cost: { labor: 0 }, effects: { health: -2, growth: 4 }, score: 45 },
      { id: 'C', text: '全部重剪到 10 cm 統一高度', cost: { labor: 3 }, effects: { health: 2, growth: 3 }, score: 50 },
      { id: 'D', text: '只剪病弱枝、其餘不剪', cost: { labor: 1 }, effects: { health: 4, growth: 7 }, score: 70 }
    ]
  }
];

// 開花期事件（第一批花打頭、花後修剪）
export const floweringEvents = [
  {
    id: 'FL001',
    type: 'flowering',
    complexity: 'simple',
    title: '第一批花（梅花）是否摘除',
    icon: '🌸',
    description: '6 月初頭批花蕾（梅花）量少、品質一般，許多農戶會選擇摘除以促進後期伏花、秋花產量與品質。',
    options: [
      { id: 'A', text: '摘除頭批花蕾，促植株養分集中給後續伏花、秋花', cost: { labor: 2 }, effects: { health: 2, quality: 15 }, score: 95 },
      { id: 'B', text: '照常採收頭批花，增加當季收入', cost: { labor: 2 }, effects: { health: 0, flowers: 5, quality: 0 }, score: 75 },
      { id: 'C', text: '全部不摘不採、任其開放', cost: { labor: 0 }, effects: { health: -2, quality: -5 }, score: 45 },
      { id: 'D', text: '只摘一半、留一半觀賞', cost: { labor: 1 }, effects: { health: 0, quality: 5 }, score: 65 }
    ]
  },
  {
    id: 'FL002',
    type: 'flowering',
    complexity: 'simple',
    title: '花後修剪時機與留節',
    icon: '✂️',
    description: '每批花謝後應盡快修剪，在花序下 1–2 節處剪斷，留 2–3 對葉，約 42 天可迎來下批花蕾。',
    options: [
      { id: 'A', text: '花謝後立即剪，留 2–3 對葉、促下批花', cost: { labor: 3 }, effects: { health: 4, quality: 10 }, score: 100 },
      { id: 'B', text: '等枝條完全枯黃再剪', cost: { labor: 1 }, effects: { health: -5, quality: -8 }, score: 35 },
      { id: 'C', text: '只摘殘花、不剪枝', cost: { labor: 1 }, effects: { health: 0, quality: 2 }, score: 55 },
      { id: 'D', text: '重剪到基部只留 1 節', cost: { labor: 2 }, effects: { health: -2, quality: 3 }, score: 50 }
    ]
  }
];

// 採收期事件（採收時機、分級、貯運）
export const harvestEvents = [
  {
    id: 'HV001',
    type: 'harvest',
    complexity: 'simple',
    title: '採收時段與品質',
    icon: '🕐',
    description: '茉莉花「當日開花前」採收，香氣與精油含量最佳；下午 2–4 點或清晨露水乾後是常見時段。',
    options: [
      { id: 'A', text: '清晨露水乾後或下午 2–4 點採摘、當日開花前交貨', cost: { labor: 4 }, effects: { flowers: 8, quality: 15 }, score: 100 },
      { id: 'B', text: '中午高溫時搶收、節省人力', cost: { labor: 2 }, effects: { flowers: 4, quality: -10 }, score: 45 },
      { id: 'C', text: '傍晚一次採收全天花蕾', cost: { labor: 3 }, effects: { flowers: 5, quality: -5 }, score: 55 },
      { id: 'D', text: '花開後再採、方便辨識', cost: { labor: 2 }, effects: { flowers: 2, quality: -20 }, score: 30 }
    ]
  },
  {
    id: 'HV002',
    type: 'harvest',
    complexity: 'simple',
    title: '採後暫存與分級',
    icon: '📦',
    description: '採下的花蕾應陰涼通風處暫存、避免擠壓與悶熱，並盡快分級過秤、入庫或交茶廠。',
    options: [
      { id: 'A', text: '陰涼處薄攤、當日分級過秤交貨或冷鏈暫存', cost: { labor: 3, money: 200 }, effects: { quality: 10, flowers: 5 }, score: 100 },
      { id: 'B', text: '塑膠袋密封保鮮', cost: { labor: 1 }, effects: { quality: -15, flowers: 0 }, score: 35 },
      { id: 'C', text: '堆積在田頭、傍晚一次運走', cost: { labor: 1 }, effects: { quality: -20, flowers: -5 }, score: 25 },
      { id: 'D', text: '不分級、混裝出貨', cost: { labor: 1 }, effects: { quality: -5, flowers: 2 }, score: 60 }
    ]
  }
];

// 简单事件（日常管理）- 已移除僅兩選項的題目，改由其他題型取代
export const simpleEvents = []

// 复杂事件（危机事件）
export const complexEvents = [
  {
    id: 'C001',
    type: CrisisTypes.WEATHER,
    complexity: 'complex',
    severity: SeverityLevels.EXTREME,
    title: '超强台风来袭',
    icon: '🌀',
    description: '气象局发布台风红色预警，风力14级，伴随暴雨。农场面临植株倒伏、花苞损失、设施损坏的三重威胁。',
    effects: { health: -25, flowers: -30, mood: -20 },
    validSeasons: ['summer', 'autumn'],
    options: [
      { id: 'A', text: '全员紧急抢收花苞 + 搭建防风支架 + 疏通排水沟', cost: { money: 3000, labor: 6 }, effects: { health: -5, flowers: -5, mood: -5 }, score: 95 },
      { id: 'B', text: '优先抢收高价值花苞 + 简易支架防护', cost: { money: 1500, labor: 4 }, effects: { health: -15, flowers: -15, mood: -10 }, score: 70 },
      { id: 'C', text: '相信植株抗风能力，只做好排水准备', cost: { money: 500, labor: 2 }, effects: { health: -30, flowers: -35, mood: -20 }, score: 30 }
    ]
  },
  {
    id: 'C003',
    type: CrisisTypes.PEST,
    complexity: 'complex',
    severity: SeverityLevels.EXTREME,
    title: '红蜘蛛大规模爆发',
    icon: '🕷️',
    description: '连续高温干旱导致红蜘蛛爆发，叶片出现大量黄斑，植株光合作用能力下降。',
    effects: { health: -30, flowers: -20, quality: -25 },
    validSeasons: ['summer'],
    options: [
      { id: 'A', text: '立即生物防治（释放捕食螨）+ 物理冲洗', cost: { money: 2000, labor: 4 }, effects: { health: -5, flowers: -3, quality: -5 }, isOrganic: true, score: 95 },
      { id: 'B', text: '化学农药紧急喷洒', cost: { money: 800, labor: 2 }, effects: { health: -10, flowers: -8, quality: -15 }, isOrganic: false, score: 70 },
      { id: 'C', text: '剪除严重受害枝条', cost: { money: 500, labor: 3 }, effects: { health: -20, flowers: -15, quality: -20 }, score: 50 }
    ]
  },
  {
    id: 'C007',
    type: CrisisTypes.MARKET,
    complexity: 'complex',
    severity: SeverityLevels.MODERATE,
    title: '鲜花价格暴跌',
    icon: '📉',
    description: '市场突遭冲击，茉莉花收购价下跌40%，已采收的花朵面临亏损，需要调整策略。',
    effects: { income: -40, mood: -20 },
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '与茶厂签订长期合同锁定价格 + 提高品质争取溢价', cost: { money: 1000, labor: 2 }, effects: { income: -10, mood: -5 }, score: 85 },
      { id: 'B', text: '转向直销/电商 + 开发花艺产品', cost: { money: 2000, labor: 3 }, effects: { income: -15, mood: -10 }, score: 75 },
      { id: 'C', text: '减少采收量 + 等待价格回升', cost: { labor: 1 }, effects: { income: -35, flowers: -30 }, score: 40 }
    ]
  },
]

// 多選題（questionType: 'multiple'，correctOptionIds 為正確選項 id 陣列）
export const multipleChoiceEvents = [
  {
    id: 'M001',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '茉莉花扦插成功的關鍵因素',
    icon: '📋',
    description: '下列哪些是提高茉莉花扦插成活率的正確做法？（可多選）',
    correctOptionIds: ['A', 'C', 'D'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '選用半木質化、無病蟲的健壯枝條', cost: { labor: 1 }, effects: { health: 5, growth: 5 }, score: 33 },
      { id: 'B', text: '扦插後立即強光直曬促進光合', cost: { labor: 1 }, effects: { health: -8 }, score: 0 },
      { id: 'C', text: '基質消毒、切口斜切並保留 2–3 節', cost: { labor: 2 }, effects: { health: 6, growth: 6 }, score: 33 },
      { id: 'D', text: '保持高濕度與遮陰直至生根', cost: { labor: 2 }, effects: { health: 5, growth: 8 }, score: 34 }
    ]
  },
  {
    id: 'M002',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '極端高溫下茉莉花園的正確應對',
    icon: '🌡️',
    description: '連續 38°C 以上高溫時，下列哪些措施能有效減輕熱害？（可多選）',
    correctOptionIds: ['A', 'B', 'D'],
    validSeasons: ['summer'],
    options: [
      { id: 'A', text: '午前或傍晚灌水降溫、避免正午澆水', cost: { money: 200, labor: 2 }, effects: { health: 6 }, score: 33 },
      { id: 'B', text: '加設遮陽網或噴霧降溫', cost: { money: 800, labor: 2 }, effects: { health: 8 }, score: 34 },
      { id: 'C', text: '大量施用氮肥促進生長', cost: { money: 300, labor: 1 }, effects: { health: -5 }, score: 0 },
      { id: 'D', text: '加強通風、清理枯葉減少蒸騰負擔', cost: { labor: 2 }, effects: { health: 4 }, score: 33 }
    ]
  },
  {
    id: 'M003',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '有機認證茉莉花田禁止的作法',
    icon: '🚫',
    description: '若要維持有機認證，下列哪些行為不可採用？（可多選）',
    correctOptionIds: ['B', 'C', 'D'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '使用經認證的有機肥與生物防治', cost: { money: 500, labor: 1 }, effects: { health: 5 }, score: 0 },
      { id: 'B', text: '噴灑化學合成殺蟲劑或除草劑', cost: { labor: 1 }, effects: { health: -10 }, score: 33, isOrganic: false },
      { id: 'C', text: '使用轉基因種苗或未認證化學肥料', cost: { money: 200 }, effects: { health: -8 }, score: 34, isOrganic: false },
      { id: 'D', text: '土壤消毒使用溴甲烷等熏蒸劑', cost: { money: 1000, labor: 2 }, effects: { health: -12 }, score: 33, isOrganic: false }
    ]
  },
  {
    id: 'M004',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '茉莉花全年施肥重點',
    icon: '🧪',
    description: '下列哪些是茉莉花栽培中正確的施肥觀念？（可多選）',
    correctOptionIds: ['A', 'C', 'D'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '生長期薄肥勤施，花蕾期增施磷鉀肥', cost: { labor: 1 }, effects: { health: 4, growth: 4 }, score: 34 },
      { id: 'B', text: '全年高氮肥促長、多開花', cost: { labor: 1 }, effects: { health: -5, quality: -5 }, score: 0 },
      { id: 'C', text: '9 月後停肥讓枝條充實、利越冬', cost: { labor: 0 }, effects: { health: 3 }, score: 33 },
      { id: 'D', text: '硫酸亞鐵維持土壤微酸性（pH 5.5–6.5）', cost: { money: 100, labor: 1 }, effects: { health: 4 }, score: 33 }
    ]
  },
  {
    id: 'M005',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '紅蜘蛛與蚜蟲防治正確做法',
    icon: '🐛',
    description: '高溫乾燥時紅蜘蛛、蚜蟲易爆發，下列哪些是較合理的防治方式？（可多選）',
    correctOptionIds: ['A', 'B', 'D'],
    validSeasons: ['spring', 'summer', 'autumn'],
    options: [
      { id: 'A', text: '增加葉面噴水、改善通風降溫', cost: { labor: 2 }, effects: { health: 5 }, score: 34 },
      { id: 'B', text: '釋放捕食蟎等生物防治', cost: { money: 800, labor: 1 }, effects: { health: 6 }, score: 33 },
      { id: 'C', text: '連續噴施高濃度化學殺蟲劑', cost: { money: 500, labor: 2 }, effects: { health: -5 }, score: 0, isOrganic: false },
      { id: 'D', text: '定期檢查嫩梢與葉背、早期發現早期處理', cost: { labor: 2 }, effects: { health: 4 }, score: 33 }
    ]
  },
  {
    id: 'M006',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '採收與交貨品質要點',
    icon: '🌸',
    description: '要讓茉莉花蕾到茶廠時仍保持最佳狀態，下列哪些做法正確？（可多選）',
    correctOptionIds: ['A', 'C', 'D'],
    validSeasons: ['spring', 'summer', 'autumn'],
    options: [
      { id: 'A', text: '當日開花前採收、陰涼處薄攤不擠壓', cost: { labor: 3 }, effects: { quality: 8 }, score: 34 },
      { id: 'B', text: '塑膠袋密封保鮮防失水', cost: { labor: 1 }, effects: { quality: -10 }, score: 0 },
      { id: 'C', text: '分級過秤、盡快交貨或低溫暫存', cost: { labor: 2 }, effects: { quality: 6 }, score: 33 },
      { id: 'D', text: '避免中午高溫時段採收', cost: { labor: 1 }, effects: { quality: 4 }, score: 33 }
    ]
  },
  {
    id: 'M007',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '春季重剪（清明前後）要點',
    icon: '✂️',
    description: '清明前後春季重剪是全年最重要的修剪，下列哪些是正確做法？（可多選）',
    correctOptionIds: ['A', 'B', 'D'],
    validSeasons: ['spring', 'all'],
    options: [
      { id: 'A', text: '保留 4–5 條健壯主枝、其餘剪除', cost: { labor: 3 }, effects: { health: 6, growth: 8 }, score: 34 },
      { id: 'B', text: '剪去枯枝、病枝、交叉枝，摘除舊葉', cost: { labor: 2 }, effects: { health: 5 }, score: 33 },
      { id: 'C', text: '重剪到地面、只留樁頭', cost: { labor: 2 }, effects: { health: -5 }, score: 0 },
      { id: 'D', text: '確認新芽已萌動後再剪、避免寒潮', cost: { labor: 1 }, effects: { health: 4 }, score: 33 }
    ]
  },
  {
    id: 'M008',
    type: 'knowledge',
    complexity: 'complex',
    questionType: 'multiple',
    title: '茉莉花越冬與低溫防護',
    icon: '❄️',
    description: '冬季低溫時下列哪些措施有助茉莉安全越冬？（可多選）',
    correctOptionIds: ['A', 'C', 'D'],
    validSeasons: ['winter', 'all'],
    options: [
      { id: 'A', text: '保持最低溫 5°C 以上、必要時移入室內或搭棚', cost: { money: 300, labor: 1 }, effects: { health: 6 }, score: 34 },
      { id: 'B', text: '冬季大量澆水與施肥促生長', cost: { labor: 1 }, effects: { health: -8 }, score: 0 },
      { id: 'C', text: '土表乾透再澆水、減少澆水頻率', cost: { labor: 0 }, effects: { health: 4 }, score: 33 },
      { id: 'D', text: '停肥、輕度修剪改善通風', cost: { labor: 2 }, effects: { health: 3 }, score: 33 }
    ]
  }
]

// 排序題（questionType: 'sort'，correctOrder 為正確順序的 option id 陣列）
export const sortEvents = [
  {
    id: 'SO001',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '茉莉花扦插操作順序',
    icon: '🔢',
    description: '請將下列扦插操作依正確執行順序排列（由先到後）。',
    correctOrder: ['B', 'A', 'D', 'C'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '將枝條基部浸入生根劑後插入基質', order: 2 },
      { id: 'B', text: '選枝、剪取 10–15 cm、切口斜切 45°', order: 1 },
      { id: 'C', text: '澆透水並遮陰保濕', order: 4 },
      { id: 'D', text: '壓實基質、留 1–2 芽露出土面', order: 3 }
    ]
  },
  {
    id: 'SO002',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '花蕾采收當日的工作順序',
    icon: '🌸',
    description: '茉莉花「當日開花前采收」時，正確的作業順序應為？（由早到晚）',
    correctOrder: ['C', 'A', 'D', 'B'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '巡園確認可采收量與品質', order: 2 },
      { id: 'B', text: '分級、過秤、入庫或交貨', order: 4 },
      { id: 'C', text: '清晨露水乾後開始採摘', order: 1 },
      { id: 'D', text: '集中陰涼處暫存、避免擠壓', order: 3 }
    ]
  },
  {
    id: 'SO003',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '遭遇暴雨後的田間處理順序',
    icon: '⛈️',
    description: '暴雨造成積水與倒伏後，合理的處理順序是？（由先到後）',
    correctOrder: ['A', 'D', 'B', 'C'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '先排除積水、疏通排水溝', order: 1 },
      { id: 'B', text: '噴藥預防病害大發生', order: 3 },
      { id: 'C', text: '評估損失並調整後續施肥', order: 4 },
      { id: 'D', text: '扶正植株、清理斷枝與爛葉', order: 2 }
    ]
  },
  {
    id: 'SO004',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '扦插苗定植到田間的順序',
    icon: '🪴',
    description: '將扦插成活的苗移入大田或大盆時，正確的作業順序是？（由先到後）',
    correctOrder: ['B', 'A', 'D', 'C'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '挖定植穴、施少許底肥與土壤混合', order: 2 },
      { id: 'B', text: '選陰天或傍晚、煉苗後再移', order: 1 },
      { id: 'C', text: '定植後立即澆透水、搭遮陰', order: 4 },
      { id: 'D', text: '放入苗坨、壓實土、根頸與土面齊', order: 3 }
    ]
  },
  {
    id: 'SO005',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '春季重剪當日的操作順序',
    icon: '🌱',
    description: '清明前後進行春季重剪時，合理的操作順序是？（由先到後）',
    correctOrder: ['A', 'D', 'B', 'C'],
    validSeasons: ['spring', 'all'],
    options: [
      { id: 'A', text: '確認新芽已萌動、避開寒潮', order: 1 },
      { id: 'B', text: '摘除所有舊葉', order: 3 },
      { id: 'C', text: '剪後澆一次透水、暫不施肥', order: 4 },
      { id: 'D', text: '選留 4–5 條主枝、剪除枯病交叉枝', order: 2 }
    ]
  },
  {
    id: 'SO006',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '一年三批花的農事節奏',
    icon: '📅',
    description: '茉莉花「梅花→伏花→秋花」三批花，對應的關鍵農事順序是？（由早到晚）',
    correctOrder: ['B', 'A', 'D', 'C'],
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '6 月初頭批花可摘除促伏花（打頭）', order: 2 },
      { id: 'B', text: '清明前後春季重剪', order: 1 },
      { id: 'C', text: '9 月停肥、秋花採收後輕剪', order: 4 },
      { id: 'D', text: '7–8 月伏花盛產、加強磷鉀與採收', order: 3 }
    ]
  },
  {
    id: 'SO007',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '發現紅蜘蛛後的處理順序',
    icon: '🐛',
    description: '葉背出現紅蜘蛛時，合理的綜合防治順序是？（由先到後）',
    correctOrder: ['A', 'D', 'B', 'C'],
    validSeasons: ['spring', 'summer', 'autumn'],
    options: [
      { id: 'A', text: '先葉背噴水、增加濕度抑制繁殖', order: 1 },
      { id: 'B', text: '評估是否需生物防治或低毒藥劑', order: 3 },
      { id: 'C', text: '採收後加強通風與清園', order: 4 },
      { id: 'D', text: '隔離嚴重受害株、避免擴散', order: 2 }
    ]
  },
  {
    id: 'SO008',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '採收日從早到晚的工作順序',
    icon: '🌸',
    description: '採收日當天從清晨到交貨，正確的流程順序是？（由早到晚）',
    correctOrder: ['C', 'A', 'D', 'B'],
    validSeasons: ['spring', 'summer', 'autumn'],
    options: [
      { id: 'A', text: '巡園確認可採量與開花程度', order: 2 },
      { id: 'B', text: '分級過秤、入庫或交茶廠', order: 4 },
      { id: 'C', text: '露水乾後開始採摘（或下午 2–4 點）', order: 1 },
      { id: 'D', text: '陰涼處薄攤暫存、不擠壓', order: 3 }
    ]
  },
  {
    id: 'SO009',
    type: 'procedure',
    complexity: 'complex',
    questionType: 'sort',
    title: '新梢打頂促分枝的操作順序',
    icon: '✂️',
    description: '對新梢進行摘心打頂以促側枝時，正確的步驟順序是？（由先到後）',
    correctOrder: ['B', 'A', 'D', 'C'],
    validSeasons: ['spring', 'summer', 'all'],
    options: [
      { id: 'A', text: '在留 2 對葉處剪斷頂芽', order: 2 },
      { id: 'B', text: '確認新枝已有 2–3 節葉片', order: 1 },
      { id: 'C', text: '摘心後薄施氮肥促側芽', order: 4 },
      { id: 'D', text: '切口可塗多菌靈防病菌', order: 3 }
    ]
  }
]

// 極端複合事件（多種災害同時出現，四選一難題）
export const extremeCombinedEvents = [
  {
    id: 'EX001',
    type: 'extreme',
    complexity: 'complex',
    title: '乾旱＋高溫＋蟲害三重打擊',
    icon: '🔥',
    description: '連續三週無雨、日溫 38°C 以上，紅蜘蛛與薊馬同時爆發，葉片黃化、花蕾受損，灌溉與人力皆吃緊。請選出綜合應對優先順序最合理的一項。',
    effects: { health: -30, flowers: -25, quality: -20, mood: -15 },
    validSeasons: ['summer'],
    options: [
      { id: 'A', text: '先全力灌溉降溫，再考慮生物防治與遮陰', cost: { money: 3500, labor: 6 }, effects: { health: -5, flowers: -8, quality: -5 }, score: 95 },
      { id: 'B', text: '先噴藥滅蟲，再補水與遮陰', cost: { money: 2000, labor: 4 }, effects: { health: -15, flowers: -12, quality: -10 }, isOrganic: false, score: 60 },
      { id: 'C', text: '只加強灌溉，暫不處理蟲害', cost: { money: 1500, labor: 3 }, effects: { health: -20, flowers: -20, quality: -18 }, score: 35 },
      { id: 'D', text: '放棄本批花、集中資源保植株渡過高溫', cost: { money: 800, labor: 2 }, effects: { health: -8, flowers: -40, quality: -5 }, score: 50 }
    ]
  },
  {
    id: 'EX002',
    type: 'extreme',
    complexity: 'complex',
    title: '颱風＋病害＋市場崩盤',
    icon: '🌀',
    description: '颱風過境造成倒伏與淹水，一週後白粉病大發生，同時收購價暴跌 40%。資金與人力都極度緊張。最合理的策略是？',
    effects: { health: -25, income: -50, mood: -25 },
    validSeasons: ['summer', 'autumn'],
    options: [
      { id: 'A', text: '先搶修設施與排水，再以低成本生物/物理方式控病，並與茶廠談長期合約鎖價', cost: { money: 4000, labor: 6 }, effects: { health: -5, income: -15, mood: -8 }, score: 92 },
      { id: 'B', text: '先噴藥撲滅病害，再處理設施', cost: { money: 2500, labor: 4 }, effects: { health: -12, income: -30 }, isOrganic: false, score: 55 },
      { id: 'C', text: '暫停投入，等價格回升再復工', cost: { labor: 1 }, effects: { health: -30, income: -55, mood: -25 }, score: 25 },
      { id: 'D', text: '借貸大量施肥與用藥以求快速恢復', cost: { money: 6000, labor: 5 }, effects: { health: -10, income: -20 }, isOrganic: false, score: 45 }
    ]
  },
  {
    id: 'EX003',
    type: 'extreme',
    complexity: 'complex',
    title: '寒流＋缺工＋物流中斷',
    icon: '❄️',
    description: '寒流預報 48 小時內最低 -2°C，採收工有兩人請假，同時通往批發市場的道路因事故中斷。需同時兼顧防寒、採收與出貨。最佳方案是？',
    effects: { health: -20, flowers: -35, income: -30 },
    validSeasons: ['winter', 'spring'],
    options: [
      { id: 'A', text: '連夜搭簡易棚＋熏煙防凍，動員家屬採收，聯繫替代路線或冷鏈暫存', cost: { money: 2800, labor: 4 }, effects: { health: -3, flowers: -8, income: -10 }, score: 90 },
      { id: 'B', text: '只做防寒，採收與出貨暫緩', cost: { money: 1000, labor: 2 }, effects: { health: -5, flowers: -35, income: -35 }, score: 45 },
      { id: 'C', text: '全力採收不防寒，搶在路通前出貨', cost: { money: 500, labor: 5 }, effects: { health: -25, flowers: -15, income: -15 }, score: 50 },
      { id: 'D', text: '放棄本批花、只保植株過冬', cost: { money: 800, labor: 1 }, effects: { health: -8, flowers: -40, income: -40 }, score: 40 }
    ]
  }
]

// 四選一單選難題（題目與選項較難）
export const hardSingleChoiceEvents = [
  {
    id: 'H001',
    type: 'crisis',
    complexity: 'complex',
    title: '土壤 EC 值異常升高',
    icon: '🧪',
    description: '土壤電導率（EC）檢測結果為 2.8 mS/cm，遠高於茉莉花適宜的 0.5–1.2。可能原因包括鹽漬化、肥害或灌溉水質問題。最有效的矯正順序應為？',
    validSeasons: ['all'],
    options: [
      { id: 'A', text: '先停肥並以大量低 EC 水淋洗，再送檢灌溉水與基質', cost: { money: 800, labor: 3 }, effects: { health: 5, growth: 3 }, score: 95 },
      { id: 'B', text: '立即增施有機肥以吸附鹽分', cost: { money: 1200, labor: 2 }, effects: { health: -5 }, score: 40 },
      { id: 'C', text: '只更換灌溉水源，不處理土壤', cost: { money: 300, labor: 1 }, effects: { health: -3, growth: -5 }, score: 50 },
      { id: 'D', text: '施用硫酸亞鐵降低 pH 兼補鐵', cost: { money: 500, labor: 2 }, effects: { health: -8 }, score: 30 }
    ]
  },
  {
    id: 'H002',
    type: 'crisis',
    complexity: 'complex',
    title: '花蕾「僵蕾」不開放',
    icon: '🌸',
    description: '大量花蕾達採收規格卻遲遲不開，觸感偏硬、色澤偏青。可能與養分、水分或激素平衡有關。下列何者最不應優先採用？',
    validSeasons: ['spring', 'summer', 'autumn'],
    options: [
      { id: 'A', text: '檢查磷鉀比例與鈣肥，適度控氮', cost: { money: 600, labor: 2 }, effects: { health: 4, flowerQuality: 6 }, score: 85 },
      { id: 'B', text: '大量施用氮肥催花', cost: { money: 400, labor: 1 }, effects: { health: -5, flowerQuality: -10 }, score: 25 },
      { id: 'C', text: '調整灌溉、避免過乾或過濕並增光', cost: { money: 200, labor: 2 }, effects: { health: 5, flowerQuality: 5 }, score: 80 },
      { id: 'D', text: '疏除部分過密枝條改善通風透光', cost: { labor: 3 }, effects: { health: 3, flowerQuality: 4 }, score: 75 }
    ]
  },
  {
    id: 'H003',
    type: 'crisis',
    complexity: 'complex',
    title: '採收期連續陰雨',
    icon: '🌧️',
    description: '預報未來一週多日降雨，濕度高、花蕾易霉爛，且採收窗口縮短。在不大幅增加成本的前提下，最合理的綜合策略是？',
    validSeasons: ['spring', 'summer', 'autumn'],
    options: [
      { id: 'A', text: '搶晴間歇採收、採後立即除濕乾燥與分級，延後施肥', cost: { money: 500, labor: 4 }, effects: { flowers: -5, flowerQuality: 2 }, score: 88 },
      { id: 'B', text: '照常大量澆水與施肥', cost: { money: 600, labor: 2 }, effects: { flowers: -20, flowerQuality: -15 }, score: 35 },
      { id: 'C', text: '全部延後採收等天晴', cost: { labor: 1 }, effects: { flowers: -25, flowerQuality: -20 }, score: 40 },
      { id: 'D', text: '只採收頂蕾、其餘放棄', cost: { labor: 3 }, effects: { flowers: -35, flowerQuality: 0 }, score: 50 }
    ]
  }
]

// 游戏配置
export const GameConfig = {
  TOTAL_DAYS: 14,           // 游戏总天数（2周）
  MAX_EVENTS_PER_DAY: 3,    // 每天最多事件数
  COMPLEX_EVENT_CHANCE: 0.4, // 40%概率出现复杂事件
  STARTING_MONEY: 3000,
  STARTING_LABOR: 8,
  GRADE_THRESHOLDS: { S: 95, A: 85, B: 70, C: 60, D: 50 },
  
  // 成长阶段配置
  GROWTH_STAGES: {
    cutting: { name: '扦插期', days: 2, healthReq: 50, next: 'rooting' },
    rooting: { name: '生根期', days: 3, healthReq: 60, next: 'seedling' },
    seedling: { name: '幼苗期', days: 2, healthReq: 65, next: 'vegetative' },
    vegetative: { name: '营养生长期', days: 3, healthReq: 70, next: 'flowering' },
    flowering: { name: '开花期', days: 2, healthReq: 75, next: 'harvest' },
    harvest: { name: '采收期', days: 2, healthReq: 80, next: 'harvest' }
  },
  
  // 分数倍率（让变动更大）
  SCORE_MULTIPLIER: 2
}

// 队伍状态模板
export const TeamStatusTemplate = {
  teamId: '',
  teamName: '',
  
  // 核心指标（从60开始，更有成长空间）
  plantHealth: 60,
  flowerQuality: 60,
  teamMood: 60,
  
  // 分数从0开始
  totalScore: 0,
  
  // 经济数据
  money: 3000,  // 起始资金
  labor: 8,     // 起始人力
  totalIncome: 0,
  totalCost: 0,
  netProfit: 0,
  
  // 生产数据
  flowersHarvested: 0,
  flowersLost: 0,
  
  // 成长阶段（从扦插开始）
  growthStage: 'cutting',  // cutting, rooting, seedling, vegetative, flowering, harvest
  stageProgress: 0,  // 阶段进度 0-100
  
  // 决策记录
  decisions: [],
  
  // 当前状态
  currentDay: 1,
  currentWeekDay: 0,  // 0 = 周一
  currentEvents: [],   // 当天的事件列表
  completedEvents: [], // 已完成的事件
  
  // 游戏状态
  status: 'playing',  // playing, finished
  
  // 成就系统
  achievements: [],
  streak: 0,  // 连续正确决策次数
  
  // 特效状态
  effects: {
    organic: true,
    certifications: [],
    buffs: [],  // 增益效果
    debuffs: []  // 减益效果
  }
}

// 为队伍生成当天的事件（根据成长阶段，含多選／排序／極端題型）
export function generateDayEvents(day, weekDay, season, growthStage, previousEvents = []) {
  const events = []
  const eventCount = Math.min(GameConfig.MAX_EVENTS_PER_DAY, 1 + Math.floor(day / 3))
  
  let stageSpecificEvents = []
  if (growthStage === 'cutting') stageSpecificEvents = cuttingEvents
  else if (growthStage === 'rooting') stageSpecificEvents = rootingEvents
  else if (growthStage === 'seedling') stageSpecificEvents = seedlingEvents
  else if (growthStage === 'vegetative') stageSpecificEvents = vegetativeEvents
  else if (growthStage === 'flowering') stageSpecificEvents = floweringEvents
  else if (growthStage === 'harvest') stageSpecificEvents = harvestEvents

  const bySeason = (arr) => {
    if (!arr.length) return arr
    const hasSeason = Array.isArray(arr[0].validSeasons)
    return hasSeason ? arr.filter(e => e.validSeasons.includes(season) || e.validSeasons.includes('all')) : arr
  }
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)]

  for (let i = 0; i < eventCount; i++) {
    const eventInstanceId = `${day}-${i}-${Date.now()}`
    const usedIds = events.map(e => e.id)

    if (stageSpecificEvents.length > 0 && Math.random() < 0.5) {
      const available = stageSpecificEvents.filter(e => !usedIds.includes(e.id))
      const pool = available.length ? available : stageSpecificEvents
      if (pool.length) events.push({ ...pickOne(pool), eventInstanceId, complexity: 'simple' })
      continue
    }

    const roll = Math.random()
    // 極端 18%、多選 25%、排序 22%、四選一+複雜 20%、原複雜 15%、簡單 fallback
    if (roll < 0.18) {
      const valid = extremeCombinedEvents.filter(e => (e.validSeasons || []).includes(season) || (e.validSeasons || []).includes('all'))
      const available = valid.filter(e => !usedIds.includes(e.id))
      const selected = available.length ? available[Math.floor(Math.random() * available.length)] : valid[0]
      if (selected) events.push({ ...selected, eventInstanceId, complexity: 'complex' })
      continue
    }
    if (roll < 0.43) {
      const valid = multipleChoiceEvents.filter(e => (e.validSeasons || []).includes(season) || (e.validSeasons || []).includes('all'))
      const available = valid.filter(e => !usedIds.includes(e.id))
      const selected = available.length ? available[Math.floor(Math.random() * available.length)] : valid[0]
      if (selected) events.push({ ...selected, eventInstanceId, complexity: 'complex' })
      continue
    }
    if (roll < 0.65) {
      const valid = sortEvents.filter(e => (e.validSeasons || []).includes(season) || (e.validSeasons || []).includes('all'))
      const available = valid.filter(e => !usedIds.includes(e.id))
      const selected = available.length ? available[Math.floor(Math.random() * available.length)] : valid[0]
      if (selected) events.push({ ...selected, eventInstanceId, complexity: 'complex' })
      continue
    }
    if (roll < 0.85) {
      const validComplex = bySeason(complexEvents)
      const validHard = bySeason(hardSingleChoiceEvents)
      const pool = [...validComplex, ...validHard].filter(e => !usedIds.includes(e.id))
      const fallback = pool.length ? pool : [...validComplex, ...validHard]
      if (fallback.length) events.push({ ...pickOne(fallback), eventInstanceId, complexity: 'complex' })
      continue
    }
    if (roll < 0.97) {
      const available = bySeason(complexEvents).filter(e => !usedIds.includes(e.id))
      const fallback = available.length ? available : bySeason(complexEvents)
      if (fallback.length) events.push({ ...pickOne(fallback), eventInstanceId, complexity: 'complex' })
      continue
    }
    const availableSimple = simpleEvents.filter(e => !usedIds.includes(e.id))
    const simplePool = availableSimple.length ? availableSimple : simpleEvents
    if (simplePool.length) {
      events.push({ ...pickOne(simplePool), eventInstanceId, complexity: 'simple' })
    } else {
      const validComplex = bySeason(complexEvents)
      const validHard = bySeason(hardSingleChoiceEvents)
      const pool = [...validComplex, ...validHard].filter(e => !usedIds.includes(e.id))
      const fallback = pool.length ? pool : [...validComplex, ...validHard]
      if (fallback.length) events.push({ ...pickOne(fallback), eventInstanceId, complexity: 'complex' })
    }
  }

  return events
}

// 计算最终得分
export function calculateFinalScore(teamStatus) {
  const scores = {
    health: Math.min(25, teamStatus.plantHealth / 4),
    quality: Math.min(30, teamStatus.flowerQuality / 3.33),
    income: Math.min(20, (teamStatus.netProfit / 10000) * 20),
    mood: Math.min(15, teamStatus.teamMood / 6.67),
    sustainability: teamStatus.effects.organic ? 10 : 5
  }
  
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  
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

export class RealityGameState {
  constructor() {
    this.sessions = new Map()
  }

  createSession(sessionId, config = {}) {
    const season = config.season || this.getCurrentSeason()
    
    const session = {
      sessionId,
      season,
      status: 'waiting',
      createdAt: Date.now(),
      config: {
        enableAnimations: true,
        ...config
      },
      teams: new Map()
    }
    
    this.sessions.set(sessionId, session)
    return session
  }

  getCurrentSeason() {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return 'spring'
    if (month >= 6 && month <= 8) return 'summer'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
  }

  joinTeam(sessionId, teamId, teamName) {
    const session = this.sessions.get(sessionId)
    if (!session) return { error: '场次不存在' }
    if (session.teams.has(teamId)) return { error: '队伍已存在' }
    if (session.teams.size >= 6) return { error: '队伍已满（最多6队）' }

    const teamStatus = {
      ...JSON.parse(JSON.stringify(TeamStatusTemplate)),
      teamId,
      teamName,
      money: GameConfig.STARTING_MONEY,
      labor: GameConfig.STARTING_LABOR,
      joinedAt: Date.now()
    }
    
    // 生成第1天的事件（从扦插期开始）
    teamStatus.currentEvents = generateDayEvents(1, 0, session.season, 'cutting')
    
    session.teams.set(teamId, teamStatus)
    return { success: true, teamStatus: this.getPublicTeamStatus(teamStatus) }
  }

  startTeamGame(sessionId, teamId) {
    const session = this.sessions.get(sessionId)
    if (!session) return { error: '场次不存在' }
    
    const team = session.teams.get(teamId)
    if (!team) return { error: '队伍不存在' }
    
    team.status = 'playing'
    team.startedAt = Date.now()
    
    return { success: true, teamStatus: this.getPublicTeamStatus(team) }
  }

  submitDecision(sessionId, teamId, eventInstanceId, decision) {
    const session = this.sessions.get(sessionId)
    if (!session) return { error: '场次不存在' }
    
    const team = session.teams.get(teamId)
    if (!team) return { error: '队伍不存在' }
    if (team.status !== 'playing') return { error: '游戏未开始' }
    
    const event = team.currentEvents.find(e => e.eventInstanceId === eventInstanceId)
    if (!event) return { error: '事件不存在' }
    
    // 检查是否已经提交过
    if (team.completedEvents.some(e => e.eventInstanceId === eventInstanceId)) {
      return { error: '该事件已处理' }
    }
    
    // 应用决策效果，取得 baseScore 供錯題復盤
    const { baseScore } = this.applyDecisionEffects(team, event, decision)
    const isWrong = baseScore < 80

    team.completedEvents.push({
      ...event,
      decision: decision.optionId != null ? { optionId: decision.optionId } : decision.optionIds ? { optionIds: decision.optionIds } : { order: decision.order },
      completedAt: Date.now(),
      baseScore,
      isWrong
    })
    
    // 检查是否完成当天所有事件
    const allEventsCompleted = team.currentEvents.every(e => 
      team.completedEvents.some(ce => ce.eventInstanceId === e.eventInstanceId)
    )
    
    if (allEventsCompleted) {
      // 进入下一天
      return this.advanceDay(sessionId, teamId)
    }
    
    return { 
      success: true, 
      teamStatus: this.getPublicTeamStatus(team),
      allEventsCompleted: false
    }
  }

  applyDecisionEffects(team, event, decision) {
    const questionType = event.questionType || 'single'
    let baseScore = 50
    let optionText = ''
    let optionId = decision.optionId

    if (questionType === 'multiple' && Array.isArray(decision.optionIds)) {
      const correct = event.correctOptionIds || []
      const selected = decision.optionIds
      const correctSet = new Set(correct)
      const selectedSet = new Set(selected)
      let correctCount = 0
      let wrongCount = 0
      selected.forEach(id => { if (correctSet.has(id)) correctCount++; else wrongCount++ })
      correct.forEach(id => { if (!selectedSet.has(id)) wrongCount++ })
      const fullScore = 100
      const partial = correct.length ? (correctCount / correct.length) * fullScore - wrongCount * 15 : 0
      baseScore = Math.max(0, Math.min(100, Math.round(partial)))
      optionText = selected.map(id => event.options?.find(o => o.id === id)?.text).filter(Boolean).join('；')
      event.options?.forEach(opt => {
        if (!selected.includes(opt.id)) return
        if (opt.cost) {
          team.money -= opt.cost.money || 0
          team.labor -= opt.cost.labor || 0
          team.totalCost += opt.cost.money || 0
        }
        if (opt.effects) this.applyOneOptionEffects(team, opt)
        if (opt.isOrganic === false) team.effects.organic = false
      })
    } else if (questionType === 'sort' && Array.isArray(decision.order)) {
      const correctOrder = event.correctOrder || []
      let matchCount = 0
      for (let i = 0; i < correctOrder.length && i < decision.order.length; i++) {
        if (correctOrder[i] === decision.order[i]) matchCount++
      }
      baseScore = correctOrder.length ? Math.round((matchCount / correctOrder.length) * 100) : 50
      optionText = decision.order.map(id => event.options?.find(o => o.id === id)?.text).filter(Boolean).join(' → ')
    } else {
      const option = event.options?.find(o => o.id === decision.optionId)
      if (!option) return
      optionId = decision.optionId
      optionText = option.text
      baseScore = option.score ?? 50
      if (option.cost) {
        team.money -= option.cost.money || 0
        team.labor -= option.cost.labor || 0
        team.totalCost += option.cost.money || 0
      }
      if (option.effects) this.applyOneOptionEffects(team, option)
      if (option.isOrganic === false) team.effects.organic = false
    }

    const multiplier = event.complexity === 'complex' ? 2 : 1
    const streakBonus = Math.min(team.streak * 5, 20)
    const finalScore = (baseScore + streakBonus) * multiplier
    team.totalScore += finalScore

    if (baseScore >= 80) {
      team.streak++
      if (team.streak === 3) this.addAchievement(team, '三连击！', '🎯')
      if (team.streak === 5) this.addAchievement(team, '五连击！', '🔥')
    } else {
      team.streak = 0
    }

    team.decisions.push({
      day: team.currentDay,
      weekDay: team.currentWeekDay,
      eventId: event.id,
      eventTitle: event.title,
      optionId: optionId,
      optionIds: decision.optionIds,
      order: decision.order,
      optionText,
      score: finalScore,
      baseScore,
      complexity: event.complexity,
      timestamp: Date.now()
    })

    return { baseScore }
  }

  applyOneOptionEffects(team, option) {
    if (!option.effects) return
    const healthChange = (option.effects.health || 0) * 1.5
    team.plantHealth = Math.max(0, Math.min(100, team.plantHealth + healthChange))
    const qualityChange = (option.effects.quality || 0) * 1.5
    team.flowerQuality = Math.max(0, Math.min(100, team.flowerQuality + qualityChange))
    const moodChange = (option.effects.mood || 0) * 1.2
    team.teamMood = Math.max(0, Math.min(100, team.teamMood + moodChange))
    if (option.effects.growth) {
      team.stageProgress += option.effects.growth
      this.checkStageProgress(team)
    }
    if (option.effects.flowers) {
      if (option.effects.flowers > 0) team.flowersHarvested += option.effects.flowers
      else team.flowersLost += Math.abs(option.effects.flowers)
    }
    if (option.effects.income) {
      const incomeChange = Math.floor(option.effects.income * 10)
      team.totalIncome += incomeChange
      team.netProfit = team.totalIncome - team.totalCost
    }
  }
  
  checkStageProgress(team) {
    const stages = GameConfig.GROWTH_STAGES
    const currentStage = stages[team.growthStage]
    
    if (currentStage && team.stageProgress >= 100) {
      // 升级到新阶段
      team.growthStage = currentStage.next
      team.stageProgress = 0
      
      // 阶段升级奖励
      this.addAchievement(team, `${currentStage.name}达成！`, '🌱')
      team.plantHealth = Math.min(100, team.plantHealth + 5)
      team.money += 200 // 阶段奖励
    }
  }
  
  addAchievement(team, title, icon) {
    team.achievements.push({
      title,
      icon,
      day: team.currentDay,
      timestamp: Date.now()
    })
  }

  advanceDay(sessionId, teamId) {
    const session = this.sessions.get(sessionId)
    const team = session.teams.get(teamId)
    
    // 增加天数
    team.currentDay++
    team.currentWeekDay = (team.currentWeekDay + 1) % 7
    
    // 恢复一些人力
    team.labor = Math.min(GameConfig.STARTING_LABOR, team.labor + 2)
    
    // 检查游戏结束
    if (team.currentDay > GameConfig.TOTAL_DAYS) {
      return this.endTeamGame(sessionId, teamId)
    }
    
    // 生成新事件（根据当前成长阶段）
    team.currentEvents = generateDayEvents(
      team.currentDay, 
      team.currentWeekDay, 
      session.season,
      team.growthStage,
      team.completedEvents
    )
    
    return {
      success: true,
      dayChanged: true,
      teamStatus: this.getPublicTeamStatus(team)
    }
  }

  endTeamGame(sessionId, teamId) {
    const session = this.sessions.get(sessionId)
    const team = session.teams.get(teamId)
    
    team.status = 'finished'
    team.endedAt = Date.now()
    
    const score = calculateFinalScore(team)
    
    return {
      success: true,
      finished: true,
      result: {
        teamId: team.teamId,
        teamName: team.teamName,
        ...score,
        finalStats: this.getPublicTeamStatus(team)
      }
    }
  }

  getPublicTeamStatus(team) {
    const stages = GameConfig.GROWTH_STAGES
    const currentStage = stages[team.growthStage]
    
    return {
      // 基本信息
      teamId: team.teamId,
      teamName: team.teamName,
      
      // 核心指标
      plantHealth: Math.round(team.plantHealth),
      flowerQuality: Math.round(team.flowerQuality),
      teamMood: Math.round(team.teamMood),
      totalScore: team.totalScore,
      
      // 资源
      money: team.money,
      labor: team.labor,
      
      // 经济数据
      totalIncome: team.totalIncome,
      totalCost: team.totalCost,
      netProfit: team.netProfit,
      
      // 生产数据
      flowersHarvested: team.flowersHarvested,
      flowersLost: team.flowersLost,
      
      // 成长阶段
      growthStage: team.growthStage,
      growthStageName: currentStage?.name || team.growthStage,
      stageProgress: Math.round(team.stageProgress),
      nextStage: currentStage?.next,
      
      // 时间
      currentDay: team.currentDay,
      currentWeekDay: team.currentWeekDay,
      weekDayName: WeekDays[team.currentWeekDay],
      
      // 状态
      status: team.status,
      organic: team.effects.organic,
      
      // 成就和连击
      achievements: team.achievements.slice(-3), // 最近3个成就
      streak: team.streak,
      
      // 事件
      currentEvents: team.currentEvents,
      completedEvents: team.completedEvents,
      remainingEvents: team.currentEvents.filter(e => 
        !team.completedEvents.some(ce => ce.eventInstanceId === e.eventInstanceId)
      ).length,
      
      // 增益/减益
      buffs: team.effects.buffs,
      debuffs: team.effects.debuffs
    }
  }

  getLeaderboard(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    
    const results = []
    session.teams.forEach(team => {
      if (team.status === 'finished') {
        const score = calculateFinalScore(team)
        results.push({
          teamId: team.teamId,
          teamName: team.teamName,
          ...score,
          finalStats: this.getPublicTeamStatus(team)
        })
      } else {
        // 实时分数
        const score = calculateFinalScore(team)
        results.push({
          teamId: team.teamId,
          teamName: team.teamName,
          ...score,
          preview: true,
          currentDay: team.currentDay,
          finalStats: this.getPublicTeamStatus(team)
        })
      }
    })
    
    results.sort((a, b) => b.totalScore - a.totalScore)
    return results
  }

  cleanup(maxAge = 24 * 60 * 60 * 1000) {
    const now = Date.now()
    let cleaned = 0
    
    this.sessions.forEach((session, sessionId) => {
      const age = now - (session.endedAt || session.createdAt)
      if (age > maxAge) {
        this.sessions.delete(sessionId)
        cleaned++
      }
    })
    
    return cleaned
  }
}

let realityGameState = null

export function getRealityGameState() {
  if (!realityGameState) {
    realityGameState = new RealityGameState()
  }
  return realityGameState
}
