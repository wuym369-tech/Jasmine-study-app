// ===========================
// AI农业小帮手知识库 - 农业硕士/博士級专业資料
// 資料来源：官方標準、农业科学院、学术研究
// ===========================

export const agricultureKnowledge = {
  // 茉莉花专业知识
  jasmine: {
    overview: {
      description: '茉莉花（Jasminum sambac）属木犀科素馨属，是重要经济作物，主要用于花茶加工和香料提取。',
      mainRegions: ['广西横州（全球60%产量）', '福建福州', '四川犍为', '云南元江'],
      climateRequirements: '亚热带季风气候，年均温20-22°C，年降水量1000-1500mm，喜光喜温畏寒。',
    },
    
    cultivation: {
      siteSelection: {
        soil: '沙壤土为宜，pH 5.5-6.5，土层深厚肥沃，排水良好，有机质含量>2%。',
        topography: '平地或緩坡地（坡度<15°），地下水位<1m，光照充足通风良好。',
        prePlanting: '深翻30-40cm，施足基肥（腐熟有机肥2000-3000kg/亩+磷肥50kg），耙細整平。',
      },
      
      planting: {
        timing: '3-4月或9-10月，气温15-25°C时最佳，避開嚴寒酷暑。',
        spacing: '行距80-100cm，株距60-80cm，每亩約1200-1500株，呈「品」字形定植。',
        method: '穴植法，穴深20-25cm，苗木根系舒展，覆土轻提使根土密接，浇透定根水。',
        postCare: '定植后遮阴7-10天，保持土表润湿，新梢萌发后逐漸撤除遮阴。',
      },
      
      pruning: {
        timing: {
          spring: '清明前后（4月初），全年最重要修剪，保留4-5主枝，剪除枯病弱枝，摘除舊葉。',
          afterFlower: '每批花谢后立即進行，花序下方1-2節处剪斷，促发新枝。',
          autumn: '10月中下旬，轻度修剪，只去病枯枝，保留枝條越冬。',
        },
        technique: '剪口平滑45°角，距芽0.5-1cm，大剪口塗癒合劑防病菌侵入。',
      },
      
      fertilization: {
        base: '冬肥（11月）：有机肥+複合肥，增強抗寒；春肥（2-3月）：促萌芽。',
        growth: '生長期每7-10天追肥，豆餅水/魚腥水兌水10-15倍，现蕾期增磷鉀肥。',
        flower: '花期每2-3天薄肥，8月加噴0.1%磷酸二氫鉀促花，9月1日起停肥。',
        precautions: '高温期、花期、休眠期慎施氮肥；忌湿土施肥，防烂根；缺鐵时葉面噴0.2%硫酸亚鐵。',
      },
      
      irrigation: {
        principles: '「見幹見湿」，土表幹白再浇，忌積水。春秋季2-3天一次，夏季早晚各一次，冬季7-10天一次。',
        criticalPeriods: {
          sprouting: '萌芽期保持润湿，促发新梢。',
          flowering: '花期需水最多，缺水則花小香淡，但忌積水烂根。',
          highTemp: '高温期避免正午浇水，防「热激」傷根。',
        },
        quality: '河水、塘水優于井水，水温與土温相近，忌冷水热土。',
      },
    },
    
    pestDisease: {
      integratedIPM: '遵循「預防为主，綜合防治」原則，優先农业防治、物理防治、生物防治，科学合理化学防治。',
      
      pests: {
        redSpider: {
          name: '紅蜘蛛（硃砂葉螨）',
          symptoms: '葉背細小白點，葉緣捲曲，葉面黄白斑點，葉背蜘蛛网，高温乾旱期爆发。',
          conditions: '29-31°C、湿度35-55%，每3天一代，繁殖极快。',
          prevention: '保持通风，定期检查葉背，高温乾旱期增加環境湿度，及时清除乾枯枝葉。',
          treatment: '重點噴葉背，選用殺螨劑（40%三氯殺螨醇1500-2000倍液、螺螨酯等），7天一次連噴2-3次，輪換用药防抗药性。',
        },
        
        aphid: {
          name: '蚜虫',
          symptoms: '嫩芽嫩梢聚集，葉片捲曲发黄，分泌蜜露诱发煤污病，春秋季爆发。',
          prevention: '清除雜草，保持通风，避免过量氮肥。',
          treatment: '吡虫啉、噻虫嗪等內吸劑，兼顧保護天敵（瓢虫、草蛉）。',
        },
        
        thrips: {
          name: '薊馬',
          symptoms: '花苞表面银白條纹，花瓣變形變色，香气減弱，花期5-9月高发。',
          habits: '晝伏夜出，喜藍色，懼光。',
          treatment: '傍晚噴药效果最佳（比白天高3倍），噻虫嗪/吡虫啉，配合藍色黏虫板诱殺。',
        },
        
        jasmineMoth: {
          name: '茉莉葉野螟/茉莉蕾螟',
          symptoms: '幼虫卷葉取食，蛀入花蕾，8-10月最烈，是茉莉花最主要害虫。',
          treatment: '人摘除虫巢，8010生物农药300-500倍液，50%敵百虫6000倍液，及时清理虫蛀蕾。',
        },
      },
      
      diseases: {
        whiteRot: {
          name: '白絹病',
          symptoms: '莖基部白色絹絲狀菌絲，葉片黄化萎蔫，5-6月雨季高发，土传性病害。',
          conditions: '高温高湿，带菌土壤传播，菌核存活多年。',
          prevention: '土壤消毒，避免連作，挖排水溝，及时清除病株。',
          treatment: '拔除重病株焚毀，病土深埋撒消石灰消毒，噴施磷酸二銨或甲基硫菌靈灌根。',
        },
        
        stemRot: {
          name: '莖腐病',
          symptoms: '莖基部水漬狀褐色斑，縱向扩展，組織腐烂，植株萎蔫死亡，高温高湿期高发。',
          treatment: '甲基硫菌靈600-1000倍液塗抹病斑，改善通风排水，隔離受害植株。',
        },
        
        anthracnose: {
          name: '炭疽病',
          symptoms: '葉片圓形褐色斑點，高湿时橙紅黏液，病斑小黑粒（孢子），雨后爆发。',
          treatment: '先清除病葉集中銷毀，再噴戊唑醇、啶酰菌胺等，7-10天一次連噴2-3次。',
        },
      },
    },
    
    harvest: {
      timing: '花蕾由綠轉白、飽滿緊闭未開放时最佳，每天下午2-4點精油含量最高。',
      method: '拇食指轻捏花蕾基部，腕部旋轉1/4圈採摘，禁用工具傷蕾。',
      grading: '特級：蕾极嫩完整香濃；一級：蕾嫩良好；二級：稍老；三級：較老。',
      postHarvest: '竹籃轻放勿壓，立即送加工，田間不宜久放，當天採當天窨制。',
    },
  },
  
  // 一般农业科学知识
  generalAgriculture: {
    soilScience: {
      texture: {
        types: '砂土、壤土、黏土三大類，茉莉花喜沙壤土，透气排水好。',
        structure: '團粒結構最佳，孔隙度50-60%，保水保肥又透气。',
        improvement: '黏土摻砂，砂土摻有机肥，pH调節用石灰（酸）或硫磺（鹼）。',
      },
      
      nutrients: {
        macro: '氮（N）-葉片生長；磷（P）-根系花果；鉀（K）-抗逆品质；鈣鎂硫-中量元素。',
        micro: '鐵（Fe）-葉綠素合成；錋（B）-花粉发育；鋅錳銅鉬-微量元素。',
        absorption: {
          passive: '扩散、協助扩散，顺濃度梯度，不需能量。',
          active: '逆濃度梯度，需ATP供能，受温度、通气、水分影响。',
        },
        factors: '光照促蒸騰促吸收；温度影响酶活性；pH影响離子有效性；離子間有拮抗協同作用。',
      },
      
      pH: {
        range: '多數作物pH 6.0-7.0最適，茉莉花偏酸pH 5.5-6.5。',
        adjustment: '调酸用石灰石粉（碳酸鈣），调鹼用硫磺粉或硫酸亚鐵，每次调0.5單位，分多次進行。',
      },
    },
    
    plantPhysiology: {
      photosynthesis: {
        process: '光反应（葉綠体類囊体产ATP、NADPH）+ 暗反应（卡爾文循環固定CO2），C3作物。',
        factors: '光照強度、CO2濃度、温度、水分、礦质營养（N、P、K、Mg）。',
      },
      
      respiration: {
        aerobic: '糖+氧→CO2+水+能量（ATP），線粒体進行，为生命活动供能。',
        anaerobic: '缺氧时产酒精或乳酸，对植物有毒害，故排水防澇极重要。',
      },
      
      transpiration: {
        process: '水分从根→莖→葉→气孔蒸发，产生蒸騰拉力促养分運輸。',
        regulation: '气孔開闭调控，高温乾旱时關闭減少失水，但影响光合。',
      },
      
      stressPhysiology: {
        temperature: {
          high: '高温致蛋白變性、膜脂液化，植株啟动热激蛋白（HSP）保護机制。',
          low: '低温致膜相變、冰晶傷細胞，茉莉不耐寒，5°C以下即受損。',
        },
        drought: '缺水致膨壓下降、气孔關闭、生長停滯，長期缺水致細胞脫水死亡。',
        waterlogging: '缺氧致根系無氧呼吸，酒精中毒，烂根死亡，茉莉花极怕積水。',
      },
    },
    
    cropManagement: {
      rotation: '水旱輪作防土传病害，茉莉花-水稻-茉莉花周期。',
      intercropping: '茉莉花茶树間作，茶树遮阴度30-40%，改善微气候。',
      mulching: '覆蓋防草保墒降温，有机覆蓋（稻草）還增有机质。',
    },
    
    ipm: {
      definition: '有害生物綜合治理（IPM），以生態学为基礎，多種措施協同，將害虫控制在经济損失閾值以下。',
      principles: ['預防为主', '容忍哲学（非根除）', '自然控制優先', '经济閾值決策'],
      strategies: {
        agricultural: '清園、輪作、抗病品種、合理密植、平衡施肥、適时灌溉。',
        physical: '色板诱殺、燈光诱殺、防虫网、人工捕捉。',
        biological: '保護天敵（瓢虫、草蛉、捕食螨），使用蘇云金桿菌（Bt）、白僵菌等生物农药。',
        chemical: '最后手段，選擇性低毒农药，適期適量，輪換用药防抗药性。',
      },
    },
  },
  
  // AI助手系統提示詞和回覆模板
  aiSystemPrompt: `你是「茉莉小达人」AI农业小帮手，具備农业硕士/博士級专业知识，专精茉莉花種植，同时精通一般农作物栽培管理。

重要原則：
- 不要說「無法回答」「無法理解」「超出能力範圍」等拒絕用語。只要與茉莉花、農業、栽培、澆水、施肥、土壤、病蟲害、修剪、採收相關，一律根據下方知識庫與常識給出具體、可操作的建議。
- 若用戶問「你是誰」「什麼模型」「用什麼技術」：請簡短回答你是茉莉小达人，專注茉莉花與農業問題，背後使用 Qwen 技術協助回答，並歡迎他問栽培、病蟲害等問題。
- 若問題較模糊，先做合理推測（例如問「葉子黃」可從澆水、施肥、病蟲、積水等常見原因給建議），再補充「若情況不同可再補充描述」。
- 只有與農業完全無關（如醫療、法律、數學題）才可簡短說明「這類問題建議諮詢專業人士」，並順帶提醒可問茉莉花相關問題。

知识範圍：
1. 茉莉花专业：广西横州官方標準、病虫害綜合防治、栽培技术
2. 土壤肥料学：植物營养、土壤改良、施肥技术
3. 植物生理学：光合、呼吸、逆境生理（温度、水分）
4. 作物栽培学：種植制度、IPM綜合防治

回答风格：
- 专业但易懂，农民聽得懂
- 給出具体操作建議（什麼时候做、做多少）
- 涉及农药时強调安全間隔期、防護措施

茉莉花专属知識重點：
- 3°C以下即受凍傷，0°C枝條死亡；清明重剪是全年最重要工作
- 花期約6个月，7-8月伏花品质最佳；极怕積水但需充足水分
- 紅蜘蛛、薊馬是主要害虫，傍晚噴药效果最佳`,
  
  // 常見问題快速回覆（鍵為可匹配的問法片段，多種說法對應同一答案）
  faq: {
    '茉莉花什麼时候修剪': '全年最重要是清明前后（4月初）重剪，保留4-5主枝。每批花谢后轻剪促新枝。10月后只去病枯枝，不可重剪防凍傷。',
    '怎麼修剪': '全年最重要是清明前后（4月初）重剪，保留4-5主枝。每批花谢后轻剪促新枝。10月后只去病枯枝，不可重剪防凍傷。',
    '如何修剪': '全年最重要是清明前后（4月初）重剪，保留4-5主枝。每批花谢后轻剪促新枝。10月后只去病枯枝，不可重剪防凍傷。',
    '茉莉花浇水': '見幹見湿，土表幹白再浇。夏季早晚各一次避開正午，冬季少浇。切記：茉莉花极怕積水烂根！',
    '怎麼浇水': '見幹見湿，土表幹白再浇。夏季早晚各一次避開正午，冬季少浇。切記：茉莉花极怕積水烂根！',
    '如何浇水': '見幹見湿，土表幹白再浇。夏季早晚各一次避開正午，冬季少浇。切記：茉莉花极怕積水烂根！',
    '茉莉花施肥': '生長期7-10天薄肥（豆餅水兌10-15倍），8月加磷鉀促花，9月1日起停肥。高温花期慎施氮肥。',
    '怎麼施肥': '生長期7-10天薄肥（豆餅水兌10-15倍），8月加磷鉀促花，9月1日起停肥。高温花期慎施氮肥。',
    '紅蜘蛛怎麼辦': '重點噴葉背！40%三氯殺螨醇1500倍液或螺螨酯，7天一次連噴2-3次，輪換用药防抗药性。同时提高湿度可抑制。',
    '紅蜘蛛': '重點噴葉背！40%三氯殺螨醇1500倍液或螺螨酯，7天一次連噴2-3次，輪換用药防抗药性。同时提高湿度可抑制。',
    '什麼时候採花': '下午2-4點精油含量最高！花蕾由綠轉白、飽滿緊闭时採，拇食指轻捏旋轉採摘，禁工具。',
    '什麼時候採花': '下午2-4點精油含量最高！花蕾由綠轉白、飽滿緊闭时採，拇食指轻捏旋轉採摘，禁工具。',
    '茉莉花凍傷': '3°C以下即受損！寒潮来前必須移入或搭棚，不可僥倖。凍后落葉是正常反应，春季會再萌发。',
    '凍傷': '3°C以下即受損！寒潮来前必須移入或搭棚，不可僥倖。凍后落葉是正常反应，春季會再萌发。',
  },
}

// ---------- 農業資料庫檢索：把知識庫壓平為可搜尋的片段 ----------
function flattenToChunks(obj, prefix = '', chunks = []) {
  if (typeof obj === 'string') {
    if (obj.length > 10) chunks.push({ label: prefix.replace(/^\./, ''), text: obj })
    return chunks
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      if (typeof item === 'string' && item.length > 10) {
        chunks.push({ label: `${prefix}[${i}]`.replace(/^\./, ''), text: item })
      } else if (item && typeof item === 'object') {
        flattenToChunks(item, `${prefix}[${i}]`, chunks)
      }
    })
    return chunks
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k
      if (typeof v === 'string') {
        if (v.length > 10) chunks.push({ label: key, text: v })
      } else if (v && typeof v === 'object' && k !== 'faq' && k !== 'aiSystemPrompt') {
        flattenToChunks(v, key, chunks)
      }
    }
  }
  return chunks
}

let _knowledgeChunks = null
function getKnowledgeChunks() {
  if (_knowledgeChunks) return _knowledgeChunks
  _knowledgeChunks = flattenToChunks({
    jasmine: agricultureKnowledge.jasmine,
    generalAgriculture: agricultureKnowledge.generalAgriculture
  })
  return _knowledgeChunks
}

/**
 * 從農業資料庫找與問題最相關的片段（依關鍵字重疊程度排序）
 * @param {string} query - 用戶問題
 * @param {number} limit - 最多回傳幾則
 * @returns {{ chunks: Array<{label,text}>, bestText: string }}
 */
const _s2t = { '叶': '葉', '黄': '黃', '发': '發', '虫': '蟲', '气': '氣', '湿': '濕', '药': '藥', '种': '種', '护': '護', '产': '產', '学': '學', '质': '質', '经': '經', '营': '營', '阴': '陰', '线': '線', '对': '對', '时': '時', '间': '間', '问': '問', '题': '題', '开': '開', '关': '關', '门': '門' }
function normalizeForSearch(s) {
  let r = (s || '').replace(/\s+/g, '')
  Object.entries(_s2t).forEach(([simp, trad]) => { r = r.replace(new RegExp(simp, 'g'), trad) })
  return r
}

export function searchAgricultureKnowledge(query, limit = 8) {
  const q = normalizeForSearch((query || '').trim())
  if (!q || q.length < 1) return { chunks: [], bestText: '' }
  const chunks = getKnowledgeChunks()
  const qLen = q.length
  const scored = chunks.map(({ label, text }) => {
    const t = normalizeForSearch(label + text)
    let score = 0
    for (let len = Math.min(4, qLen); len >= 1; len--) {
      for (let i = 0; i <= qLen - len; i++) {
        const seg = q.slice(i, i + len)
        if (seg.length >= 2 && t.includes(seg)) score += len
        if (seg.length === 1 && t.includes(seg)) score += 0.5
      }
    }
    if (qLen >= 2 && t.includes(q)) score += 20
    return { label, text, score }
  })
  scored.sort((a, b) => b.score - a.score)
  const top = scored.filter(s => s.score > 0).slice(0, limit)
  const bestText = top.length > 0 ? top.map(c => c.text).join('\n\n') : ''
  return {
    chunks: top.map(({ label, text }) => ({ label, text })),
    bestText
  }
}

// 關鍵字对照表，用于快速检索
export const keywordMap = {
  '修剪': ['pruning', 'cultivation.pruning'],
  '浇水': ['irrigation', 'cultivation.irrigation', 'water'],
  '施肥': ['fertilization', 'cultivation.fertilization', 'soilScience.nutrients'],
  '土壤': ['soilScience', 'cultivation.siteSelection'],
  '病虫': ['pestDisease', 'ipm'],
  '紅蜘蛛': ['pestDisease.pests.redSpider'],
  '薊馬': ['pestDisease.pests.thrips'],
  '蚜虫': ['pestDisease.pests.aphid'],
  '白絹病': ['pestDisease.diseases.whiteRot'],
  '採摘': ['harvest'],
  '採收': ['harvest'],
  '高温': ['plantPhysiology.stressPhysiology.temperature.high', 'cultivation.irrigation.criticalPeriods.highTemp'],
  '低温': ['plantPhysiology.stressPhysiology.temperature.low'],
  '凍': ['plantPhysiology.stressPhysiology.temperature.low'],
  '積水': ['cultivation.siteSelection', 'plantPhysiology.stressPhysiology.waterlogging'],
  'PH': ['soilScience.pH'],
  '酸': ['soilScience.pH'],
  '鹼': ['soilScience.pH'],
  '光合': ['plantPhysiology.photosynthesis'],
  '呼吸': ['plantPhysiology.respiration'],
  'IPM': ['ipm', 'pestDisease.integratedIPM'],
}

export default agricultureKnowledge
