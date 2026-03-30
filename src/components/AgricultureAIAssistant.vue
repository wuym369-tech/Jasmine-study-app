<template>
  <div 
    class="ai-assistant-wrapper"
    :style="wrapperStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <!-- 浮动按鈕 -->
    <button
      @mousedown="handleBtnMouseDown"
      @mouseup="handleBtnMouseUp"
      @touchstart="handleBtnMouseDown"
      @touchend="handleBtnMouseUp"
      class="ai-floating-btn"
      :class="{ 'is-active': isOpen }"
      title="茉莉小达人（可拖动）"
    >
      <img 
        v-if="!isOpen" 
        src="/images/moli-avatar.png" 
        alt="茉莉小达人"
        class="w-12 h-12 rounded-full object-cover border-2 border-white object-top"
      />
      <span v-else class="text-xl">✕</span>
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
    </button>

    <!-- 聊天視窗 -->
    <transition name="slide-up">
      <div v-if="isOpen" class="ai-chat-window">
        <!-- 標題欄 -->
        <div class="chat-header">
          <div class="flex items-center gap-2">
            <img 
              src="/images/moli-avatar.png" 
              alt="茉莉小达人"
              class="w-10 h-10 rounded-full object-cover border-2 border-white/50 object-top"
            />
            <div>
              <h3 class="font-bold text-white">茉莉小达人</h3>
              <p class="text-xs text-green-200">茉莉花博士级专业知识</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              v-if="messages.length > 0"
              @click="clearContext"
              class="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 text-xs"
              title="清除對話"
            >
              清除
            </button>
            <button @click="toggleChat" class="p-1.5 rounded text-white/80 hover:text-white">
              <span class="text-xl">✕</span>
            </button>
          </div>
        </div>

        <!-- 消息区 -->
        <div ref="messagesContainer" class="chat-messages">
          <!-- 欢迎消息 -->
          <div class="message system-message">
            <div class="message-bubble bg-green-50 border-green-200">
              <div class="flex items-center gap-2 mb-2">
                <img 
                  src="/images/moli-avatar.png" 
                  alt="茉莉小达人"
                  class="w-8 h-8 rounded-full object-cover object-top"
                />
                <span class="font-bold text-green-800">茉莉小达人</span>
              </div>
              <p class="text-sm text-slate-700">
                嗨～我是茉莉小达人 🌸✨<br><br>
                我是你种茉莉花路上的好伙伴！<br>
                不管是浇水施肥、修剪枝条，<br>
                还是病虫害防治的小困扰，<br>
                都可以随时来找我聊聊～<br><br>
                让我们一起把茉莉花养得香香甜甜、漂漂亮亮吧！💚
              </p>
              <div class="mt-3 text-xs text-slate-500 bg-white/50 rounded-lg p-2">
                💡 你可以这样问我：<br>
                「清明节要怎么修剪？」<br>
                「红蜘蛛好可怕怎么办！」<br>
                「为什么我的茉莉花不开花？」
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="msg.role === 'user' ? 'user-message' : 'assistant-message'"
          >
            <div
              class="message-bubble"
              :class="msg.role === 'user' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white border-slate-200'"
            >
              <div v-if="msg.role === 'assistant'" class="flex items-center gap-1 mb-1">
                <img src="/images/moli-avatar.png" class="w-4 h-4 rounded-full object-cover" />
                <span class="text-xs text-green-600 font-bold">茉莉小达人</span>
              </div>
              <p class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>

          <!-- 加載中 -->
          <div v-if="isLoading" class="message assistant-message">
            <div class="message-bubble bg-white border-slate-200">
              <div class="flex items-center gap-2 text-slate-500">
                <img src="/images/moli-avatar.png" class="w-5 h-5 rounded-full object-cover animate-pulse" />
                <span class="text-sm">茉莉小达人思考中...</span>
              </div>
            </div>
          </div>

          <!-- 快速問題 -->
          <div v-if="messages.length === 0" class="quick-questions">
            <p class="text-xs text-slate-500 mb-2 px-3">快速提問：</p>
            <div class="flex flex-wrap gap-2 px-3">
              <button
                v-for="question in quickQuestions"
                :key="question"
                @click="sendQuickQuestion(question)"
                class="quick-btn"
              >
                {{ question }}
              </button>
            </div>
          </div>
        </div>

        <!-- 輸入區 -->
        <div class="chat-input-area">
          <div class="input-wrapper">
            <input
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              placeholder="請輸入你的農業問題..."
              class="chat-input"
              :disabled="isLoading"
            />
            <button
              @click="sendMessage"
              :disabled="!inputMessage.trim() || isLoading"
              class="send-btn"
              :class="{ 'is-disabled': !inputMessage.trim() || isLoading }"
            >
              <span v-if="!isLoading">➤</span>
              <span v-else class="animate-spin">⟳</span>
            </button>
          </div>
          <p class="text-xs text-slate-400 mt-2 px-1">
            由 MOLI AI 生成 | 仅供参考，重要决策请咨询专业农技人员
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { agricultureKnowledge, keywordMap, searchAgricultureKnowledge } from '../data/agricultureKnowledge.js'

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref([])
const isLoading = ref(false)
const unreadCount = ref(0)
const messagesContainer = ref(null)

// 拖拽相关状态
const position = ref({ x: 20, y: 20 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 计算位置样式
const wrapperStyle = computed(() => {
  return {
    position: 'fixed',
    right: position.value.x + 'px',
    bottom: position.value.y + 'px',
    zIndex: 9999,
    cursor: isDragging.value ? 'grabbing' : 'grab'
  }
})

// 开始拖拽
function startDrag(e) {
  // 只有在关闭状态（!isOpen）时才允许拖拽
  if (isOpen.value) {
    return
  }
  
  // 如果点击的是聊天窗口内部，不启动拖拽
  if (e.target.closest('.ai-chat-window')) {
    return
  }
  
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  // 计算偏移量
  const rect = e.currentTarget.getBoundingClientRect()
  dragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
  
  // 添加全局事件监听
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

// 拖拽中
function onDrag(e) {
  if (!isDragging.value) return
  
  e.preventDefault()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  // 计算新位置（相对于视口）
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const buttonSize = 56
  
  let newX = windowWidth - clientX - (buttonSize - dragOffset.value.x)
  let newY = windowHeight - clientY - (buttonSize - dragOffset.value.y)
  
  // 边界限制
  newX = Math.max(10, Math.min(newX, windowWidth - buttonSize - 10))
  newY = Math.max(10, Math.min(newY, windowHeight - buttonSize - 10))
  
  position.value = { x: newX, y: newY }
}

// 停止拖拽
function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
  
  // 保存位置到本地存储
  localStorage.setItem('moli_position', JSON.stringify(position.value))
}

// 恢复保存的位置
onMounted(() => {
  const savedPosition = localStorage.getItem('moli_position')
  if (savedPosition) {
    try {
      const parsed = JSON.parse(savedPosition)
      position.value = parsed
    } catch (e) {
      console.log('位置恢复失败')
    }
  }
})

const quickQuestions = [
  '茉莉花怎麼修剪？',
  '紅蜘蛛怎麼防治？',
  '什麼時候採花最好？',
  '茉莉花凍傷怎麼辦？',
  '土壤pH怎麼調節？',
]

// Google Gemini（優先）：.env 設定 VITE_GEMINI_API_KEY
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
const GEMINI_MODEL = (import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash').trim()
// 本地 Qwen（Ollama）：.env 設定 VITE_QWEN_LOCAL_URL=http://localhost:11434，模型預設 qwen2.5:14b
const QWEN_LOCAL_URL = (import.meta.env.VITE_QWEN_LOCAL_URL || '').trim()
const QWEN_LOCAL_MODEL = (import.meta.env.VITE_QWEN_LOCAL_MODEL || 'qwen2.5:14b').trim()
// 雲端 Qwen（備用）：設定 VITE_QWEN_API_KEY 時使用
const QWEN_API_KEY = (import.meta.env.VITE_QWEN_API_KEY || '').trim()
const useLocalQwen = QWEN_LOCAL_URL.length > 0
const hasGeminiKey = GEMINI_API_KEY.length > 0
const hasCloudQwenKey = QWEN_API_KEY.length > 0
const hasAnyAI = hasGeminiKey || useLocalQwen || hasCloudQwenKey

// 用于区分点击和拖拽
let dragStartTime = 0
let dragStartPosition = { x: 0, y: 0 }

function handleBtnMouseDown(e) {
  dragStartTime = Date.now()
  dragStartPosition = { x: e.clientX, y: e.clientY }
}

function handleBtnMouseUp(e) {
  const dragDuration = Date.now() - dragStartTime
  const dragDistance = Math.sqrt(
    Math.pow(e.clientX - dragStartPosition.x, 2) + 
    Math.pow(e.clientY - dragStartPosition.y, 2)
  )
  
  // 如果拖拽时间小于200ms且距离小于5px，认为是点击
  if (dragDuration < 200 && dragDistance < 5) {
    toggleChat()
  }
}

function clearContext() {
  messages.value = []
  unreadCount.value = 0
}

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    nextTick(() => scrollToBottom())
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function sendQuickQuestion(question) {
  inputMessage.value = question
  sendMessage()
}

async function sendMessage() {
  const userMessage = inputMessage.value.trim()
  if (!userMessage || isLoading.value) return

  // 添加用户消息
  messages.value.push({ role: 'user', content: userMessage })
  inputMessage.value = ''
  isLoading.value = true
  
  nextTick(() => scrollToBottom())

  try {
    // 自我介紹／模型類問題直接回覆，不交給模型（避免回「無法理解」）
    const identityAnswer = getIdentityAnswer(userMessage)
    if (identityAnswer) {
      await new Promise(r => setTimeout(r, 300))
      messages.value.push({ role: 'assistant', content: identityAnswer })
      return
    }

    // 先嘗試本地知識庫精確匹配（FAQ / 關鍵字）
    const localAnswer = findLocalAnswer(userMessage)
    // 再從農業資料庫做「類似問題」檢索，找出相關片段（不論有無精確匹配都搜一次，給 AI 當依據）
    const searchResult = searchAgricultureKnowledge(userMessage, 8)

    if (localAnswer && (localAnswer.confidence > 0.65 || !hasAnyAI)) {
      // 有本地答案且信心夠高，或沒有 API 時優先使用本地
      await new Promise(r => setTimeout(r, 500))
      let content = localAnswer.answer
      if (!hasAnyAI && localAnswer.confidence <= 0.65) {
        content += '\n\n💡 目前僅使用知識庫回答。若需更智能回覆，請在 .env 設定 VITE_GEMINI_API_KEY，或啟動本機 Ollama（如 qwen2.5:14b）並設定 VITE_QWEN_LOCAL_URL=http://localhost:11434。'
      }
      messages.value.push({ role: 'assistant', content })
    } else if (searchResult.chunks.length > 0 && !hasAnyAI) {
      // 無 API 但有檢索到相關資料：直接組一段「根據資料庫」的回答
      await new Promise(r => setTimeout(r, 400))
      const content = formatRetrievedAnswer(searchResult.chunks, userMessage)
      messages.value.push({ role: 'assistant', content })
    } else if (hasAnyAI) {
      // 有 AI：把「檢索到的農業資料庫內容」塞進系統提示，讓模型優先依資料庫回答
      const knowledgeContext = [localAnswer?.answer, searchResult.bestText].filter(Boolean).join('\n\n---\n\n')
      const aiResponse = await callQwenAPI(userMessage, localAnswer, knowledgeContext)
      const fallbackFromDb = searchResult.chunks.length > 0 ? formatRetrievedAnswer(searchResult.chunks, userMessage) : ''
      const contextForFallback = { answer: localAnswer?.answer || fallbackFromDb }
      const finalContent = normalizeAIResponse(aiResponse, contextForFallback)
      messages.value.push({ role: 'assistant', content: finalContent })
    } else {
      // 無 API 且無本地匹配：給出引導
      messages.value.push({
        role: 'assistant',
        content: '你可以試試問：「茉莉花怎麼修剪？」「紅蜘蛛怎麼防治？」「什麼時候採花最好？」若需更智能回覆，請在 .env 設定 VITE_GEMINI_API_KEY，或啟動本機 Ollama（qwen2.5:14b）並設定 VITE_QWEN_LOCAL_URL=http://localhost:11434。'
      })
    }
  } catch (error) {
    console.error('AI助手錯誤:', error)
    messages.value.push({ 
      role: 'assistant', 
      content: '抱歉，我現在遇到了一些問題，請稍後再试。你也可以尝试問問更具體的問題，比如「茉莉花怎麼修剪」或「紅蜘蛛怎麼防治」。' 
    })
  } finally {
    isLoading.value = false
    nextTick(() => scrollToBottom())
  }
}

// 用戶問「你是什麼模型」「你是誰」等時，直接回覆，不呼叫模型
function getIdentityAnswer(query) {
  const q = (query || '').trim().toLowerCase().replace(/[？?！!]/g, '')
  if (!q) return ''
  const identityKeywords = ['什麼模型', '你是誰', '你是什麼', '你叫什麼', '哪個模型', '用什麼模型', '什麼技術', '你是ai', '你是機器人']
  if (!identityKeywords.some(k => q.includes(k))) return ''
  const modelDesc = hasGeminiKey
    ? '我背後優先使用 Google Gemini 來協助回答；如果它暫時不可用，會改走本機 Qwen 或知識庫。'
    : useLocalQwen
      ? '我背後使用本機的 Qwen 14B（Ollama）來協助回答。'
      : '我背後使用 Qwen 技術來協助回答。'
  return `我是茉莉小达人～專注茉莉花與農業問題的 AI 小幫手。${modelDesc}\n\n歡迎問我修剪、澆水、施肥、病蟲害防治、採收等問題，例如：「清明怎麼修剪？」「紅蜘蛛怎麼辦？」`
}

function findLocalAnswer(query) {
  const lowerQuery = query.toLowerCase()
  let bestMatch = null
  let highestConfidence = 0

  // 關鍵字匹配
  for (const [keyword, paths] of Object.entries(keywordMap)) {
    if (lowerQuery.includes(keyword.toLowerCase())) {
      const confidence = 0.9
      if (confidence > highestConfidence) {
        highestConfidence = confidence
        bestMatch = { paths, keyword, confidence }
      }
    }
  }

  // FAQ 匹配（依鍵長由長到短，優先匹配較具體的問法）
  const faqEntries = Object.entries(agricultureKnowledge.faq)
    .map(([q, a]) => [q.toLowerCase().replace(/[？?]/g, ''), a])
    .sort((a, b) => b[0].length - a[0].length)
  for (const [question, answer] of faqEntries) {
    if (lowerQuery.includes(question)) {
      return { answer, confidence: 0.95 }
    }
  }

  if (bestMatch) {
    // 從知識庫中提取相關內容
    const answer = extractKnowledge(bestMatch.paths)
    return {
      answer: answer || '这个问题我还在学习中，建议咨询当地农技站。',
      confidence: bestMatch.confidence
    }
  }

  return null
}

function extractKnowledge(paths) {
  // 簡化版：從知識庫提取內容
  let result = []
  
  // 茉莉花概述
  if (paths.some(p => p.includes('jasmine'))) {
    result.push(agricultureKnowledge.jasmine.overview.description)
  }
  
  // 栽培技術
  if (paths.some(p => p.includes('cultivation') || p.includes('pruning'))) {
    const pruning = agricultureKnowledge.jasmine.cultivation.pruning
    result.push(`修剪要點：${pruning.timing.spring} ${pruning.technique}`)
  }
  
  if (paths.some(p => p.includes('irrigation'))) {
    result.push(`浇水原则：${agricultureKnowledge.jasmine.cultivation.irrigation.principles}`)
  }
  
  if (paths.some(p => p.includes('fertilization'))) {
    result.push(`施肥建議：${agricultureKnowledge.jasmine.cultivation.fertilization.growth}`)
  }
  
  // 病蟲害
  if (paths.some(p => p.includes('pest'))) {
    const redSpider = agricultureKnowledge.jasmine.pestDisease.pests.redSpider
    result.push(`紅蜘蛛防治：${redSpider.treatment}`)
  }
  
  if (paths.some(p => p.includes('thrips'))) {
    const thrips = agricultureKnowledge.jasmine.pestDisease.pests.thrips
    result.push(`薊馬防治：${thrips.treatment}`)
  }
  
  // 土壤肥料
  if (paths.some(p => p.includes('soilScience'))) {
    result.push(`土壤知識：${agricultureKnowledge.generalAgriculture.soilScience.texture.types}`)
  }
  
  // IPM
  if (paths.some(p => p.includes('ipm'))) {
    result.push(`IPM原則：${agricultureKnowledge.generalAgriculture.ipm.definition}`)
  }
  
  return result.length > 0 ? result.join('\n\n') : null
}

// 無 API 時，用檢索到的資料庫片段組成一段回答
function formatRetrievedAnswer(chunks, query) {
  const parts = chunks.slice(0, 5).map(c => c.text)
  const combined = parts.join('\n\n')
  return `根據農業資料庫裡與「${query}」相關的內容，整理如下：\n\n${combined}\n\n若想更精準對應你的情況，可以再描述一下（例如季節、症狀），或問更具體的問題如「清明怎麼修剪？」「紅蜘蛛怎麼防治？」`
}

function buildConversationMessages(systemPrompt) {
  return [
    { role: 'system', content: systemPrompt },
    ...messages.value.map(m => ({
      role: m.role,
      content: m.content
    }))
  ]
}

async function callQwenAPI(userMessage, localContext, knowledgeContext) {
  const dbBlock = (knowledgeContext || localContext?.answer || '').trim()
  const systemPrompt = agricultureKnowledge.aiSystemPrompt +
    (dbBlock
      ? '\n\n【以下為從農業資料庫檢索到的相關內容，請務必優先根據這些內容回答，不要說無法理解或無法回答】\n\n' + dbBlock
      : '')

  const conversationMessages = buildConversationMessages(systemPrompt)

  if (hasGeminiKey) {
    return callGoogleGeminiAPI(conversationMessages, localContext)
  }
  if (useLocalQwen) {
    return callLocalOllama(conversationMessages, localContext)
  }
  return callCloudQwen(conversationMessages, localContext)
}

// Google Gemini（AI Studio / Generative Language API）
async function callGoogleGeminiAPI(chatMessages, localContext) {
  try {
    const systemPrompt = chatMessages.find(m => m.role === 'system')?.content || ''
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt,
        messages: chatMessages,
        model: GEMINI_MODEL
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Gemini Proxy 錯誤 ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const text = (data.text || '').trim()
    return text || (localContext?.answer ?? '')
  } catch (error) {
    console.error('Gemini API 錯誤:', error)
    if (localContext?.answer) {
      return localContext.answer + '\n\n（注：Google 服務暫時不可用，以上為知識庫答案）'
    }
    return 'Google Gemini 暫時無法連線，請稍後再試。'
  }
}

// 本機 Ollama（Qwen 14B 等）
async function callLocalOllama(chatMessages, localContext) {
  const base = QWEN_LOCAL_URL.replace(/\/$/, '')
  const url = `${base}/v1/chat/completions`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: QWEN_LOCAL_MODEL,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    })
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Ollama 錯誤 ${response.status}: ${errText}`)
    }
    const data = await response.json()
    const content = (data.choices?.[0]?.message?.content || data.message?.content || '').trim()
    return content || (localContext?.answer ?? '')
  } catch (error) {
    console.error('本機 Ollama 錯誤:', error)
    if (localContext?.answer) {
      return localContext.answer + '\n\n（注：本機模型暫時不可用，以上為知識庫答案）'
    }
    return '本機 Qwen 暫時無法連線，請確認 Ollama 已啟動且已拉取模型（例如：ollama run qwen2.5:14b）。你也可以問茉莉花修剪、紅蜘蛛防治等，我會用知識庫回答。'
  }
}

// 雲端 Qwen（DashScope）
async function callCloudQwen(chatMessages, localContext) {
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    })
    if (!response.ok) {
      throw new Error(`API錯誤: ${response.status}`)
    }
    const data = await response.json()
    const content = (data.choices?.[0]?.message?.content || '').trim()
    return content || (localContext?.answer ?? '')
  } catch (error) {
    console.error('Qwen 雲端 API 錯誤:', error)
    if (localContext?.answer) {
      return localContext.answer + '\n\n（注：AI 服務暫時不可用，以上為知識庫答案）'
    }
    return '抱歉，AI 服務暫時不可用，請稍後再試。建議提問具體問題如「茉莉花怎麼修剪」。'
  }
}

// 若 API 回傳空或像「無法回答／無法理解」的拒絕用語，改回本地答案或友善說明
function normalizeAIResponse(aiResponse, localContext) {
  const t = (aiResponse || '').trim()
  if (!t) {
    if (localContext?.answer) return localContext.answer
    return '我根據目前知識庫暫時沒有對應答案，建議你試試更具體的問題，例如：「茉莉花怎麼修剪？」「紅蜘蛛怎麼防治？」'
  }
  const refusalPhrases = ['無法回答', '無法理解', '超出能力', '超出範圍', '不能回答', '不好意思，我']
  const looksLikeRefusal = refusalPhrases.some(p => t.includes(p)) && t.length < 150
  if (looksLikeRefusal) {
    if (localContext?.answer) return localContext.answer
    return '這題我暫時沒把握答得準～你可以改問茉莉花相關的，例如：「怎麼修剪？」「紅蜘蛛怎麼防治？」「什麼時候採花？」我都會盡量根據知識庫給你建議。'
  }
  return aiResponse
}

onMounted(() => {
  // 可以在此处加载历史对话
})
</script>

<style scoped>
.ai-assistant-wrapper {
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.ai-floating-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7A9B7D 0%, #9BB89E 100%);
  color: white;
  border: 3px solid #FDFBF7;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(91, 122, 94, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.ai-floating-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(91, 122, 94, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ai-floating-btn img {
  object-position: center top;
  transform: scale(1.2);
}

.ai-floating-btn.is-active {
  background: linear-gradient(135deg, #D4A88C 0%, #E0B89E 100%);
  border-color: #FDFBF7;
  box-shadow: 0 4px 16px rgba(212, 168, 140, 0.4);
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #D4704A 0%, #E88B65 100%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FDFBF7;
  box-shadow: 0 2px 8px rgba(212, 112, 74, 0.3);
}

.ai-chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 360px;
  max-height: 520px;
  background: #FDFBF7;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(91, 122, 94, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(139, 115, 85, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #7A9B7D 0%, #9BB89E 100%);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header img {
  object-position: center top;
  transform: scale(1.15);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  background: #F8F5F0;
}

.message {
  margin-bottom: 12px;
  padding: 0 12px;
}

.user-message {
  display: flex;
  justify-content: flex-end;
}

.assistant-message {
  display: flex;
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
}

.system-message .message-bubble {
  max-width: 100%;
  border: 1px solid #bbf7d0;
}

.message-bubble img {
  object-position: center 20%;
}

.quick-questions {
  margin-top: 8px;
}

.quick-btn {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: linear-gradient(135deg, #7A9B7D 0%, #9BB89E 100%);
  color: white;
  border-color: #7A9B7D;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 122, 94, 0.2);
}

.chat-input-area {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid rgba(139, 115, 85, 0.1);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid rgba(139, 115, 85, 0.15);
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  background: #FDFBF7;
  transition: all 0.2s ease;
}

.chat-input:focus {
  border-color: #7A9B7D;
  background: white;
  box-shadow: 0 0 0 4px rgba(122, 155, 125, 0.1);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7A9B7D 0%, #9BB89E 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(91, 122, 94, 0.25);
}

.send-btn:hover:not(.is-disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(91, 122, 94, 0.35);
}

.send-btn.is-disabled {
  background: linear-gradient(135deg, #D4C4A8 0%, #E0D6C4 100%);
  cursor: not-allowed;
  box-shadow: none;
}

/* 动畫 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* RWD */
@media (max-width: 480px) {
  .ai-chat-window {
    width: calc(100vw - 40px);
    max-width: 360px;
    border-radius: 20px;
  }
}
</style>
