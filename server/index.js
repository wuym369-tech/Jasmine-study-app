// ===========================
// Express + Socket.io 服务器
// ===========================
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import os from 'os'
import { registerHandlers } from './socketHandlers.js'
import { setupRealitySocketHandlers } from './realitySocketHandlers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})
app.use(express.json({ limit: '1mb' }))

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '../.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const index = trimmed.indexOf('=')
      const key = trimmed.slice(0, index).trim()
      const value = trimmed.slice(index + 1).trim()
      if (!(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch (_) {
    // ignore missing .env
  }
}

loadEnvFile()

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

// Serve compiled Vue app
const distPath = join(__dirname, '../dist')
app.use(express.static(distPath))

// Basic info for LAN access hints (used by /admin in dev/prod)
app.get('/api/lan', (req, res) => {
  res.json({
    ips: getLanIPs(),
  })
})

// Google Gemini proxy - 避免瀏覽器直連導致的 CORS / referrer 問題
app.post('/api/gemini', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Missing Gemini API key' })
    }

    const { messages = [], systemPrompt = '', model = GEMINI_MODEL } = req.body || {}
    const contents = Array.isArray(messages)
      ? messages
          .filter(m => m && m.role !== 'system')
          .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.content || '') }],
          }))
      : []

    if (systemPrompt && contents.length > 0) {
      contents[0] = {
        ...contents[0],
        parts: [{ text: `${String(systemPrompt)}\n\n請根據以上規則回答。${contents[0].parts?.[0]?.text ? `\n\n${contents[0].parts[0].text}` : ''}` }],
      }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || `Gemini error ${response.status}`,
        details: data,
      })
    }

    const text = (data.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || '')
      .join('')
      .trim()

    return res.json({ text, raw: data })
  } catch (error) {
    console.error('Gemini proxy error:', error)
    return res.status(500).json({ error: error?.message || 'Gemini proxy error' })
  }
})

// All non-socket routes → index.html (Vue Router history mode)
// 不快取 index.html，確保每次都拿到最新版本
app.get('/{*path}', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.sendFile(join(distPath, 'index.html'))
})

// Socket.io - 注册所有处理器
io.on('connection', (socket) => {
  registerHandlers(io, socket)
})

// 注册现实挑战处理器
setupRealitySocketHandlers(io)

// Print LAN IPs（取得失敗時回傳空陣列，避免伺服器崩潰）
function getLanIPs() {
  try {
    const interfaces = os.networkInterfaces()
    const ips = []
    for (const iface of Object.values(interfaces)) {
      for (const info of iface) {
        if (info.family === 'IPv4' && !info.internal) {
          ips.push(info.address)
        }
      }
    }
    return ips
  } catch (_) {
    return []
  }
}

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`
🌸 茉莉花研学App 服务器已启动`)
  console.log(`   本机访问: http://localhost:${PORT}`)
  const ips = getLanIPs()
  if (ips.length > 0) {
    console.log(`\n   局域网访问（学生设备请输入以下地址）:`)
    ips.forEach(ip => console.log(`   → http://${ip}:${PORT}`))
  }
  console.log(`\n   老师控制台: /admin`)
  console.log(`   大屏幕:     /screen`)
  console.log(`   队伍答题:   /game`)
  console.log(`   现实挑战:   /reality\n`)
})
