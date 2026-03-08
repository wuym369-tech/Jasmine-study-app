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
          <button @click="toggleChat" class="text-white/80 hover:text-white">
            <span class="text-xl">✕</span>
          </button>
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
import { agricultureKnowledge, keywordMap } from '../data/agricultureKnowledge.js'

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

// API 金鑰請在專案根目錄建立 .env 並設定 VITE_MINIMAX_API_KEY=你的金鑰（見 .env.example）
const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || ''

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
    // 先尝试本地知識庫匹配
    const localAnswer = findLocalAnswer(userMessage)
    
    if (localAnswer && localAnswer.confidence > 0.8) {
      // 高信心本地回答
      await new Promise(r => setTimeout(r, 500)) // 模擬思考延遲
      messages.value.push({ 
        role: 'assistant', 
        content: localAnswer.answer 
      })
    } else {
      // 調用 Minimax API
      const aiResponse = await callMinimaxAPI(userMessage, localAnswer)
      messages.value.push({ 
        role: 'assistant', 
        content: aiResponse 
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

  // FAQ 精確匹配
  for (const [question, answer] of Object.entries(agricultureKnowledge.faq)) {
    if (lowerQuery.includes(question.toLowerCase().replace(/[？?]/g, ''))) {
      return {
        answer: answer,
        confidence: 0.95
      }
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

async function callMinimaxAPI(userMessage, localContext) {
  // 構建系統提示詞
  const systemPrompt = agricultureKnowledge.aiSystemPrompt + 
    '\n\n本地知識庫參考（優先使用）：\n' + 
    (localContext?.answer || '')

  try {
    const response = await fetch('https://api.minimaxi.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'abab6.5-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.value.filter(m => m.role !== 'system').map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error(`API錯誤: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '抱歉，我無法理解你的問題，請尝试換個方式問。'
  } catch (error) {
    console.error('Minimax API錯誤:', error)
    // API 失敗時退回本地回答
    if (localContext?.answer) {
      return localContext.answer + '\n\n（注：AI服务暫時不可用，以上為知識庫標準答案）'
    }
    return '抱歉，AI服务暫時不可用，請稍後再试。建議提問具體問題如「茉莉花怎麼修剪」。'
  }
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
