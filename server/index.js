// ===========================
// Express + Socket.io 服务器
// ===========================
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import os from 'os'
import { registerHandlers } from './socketHandlers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

// Serve compiled Vue app
const distPath = join(__dirname, '../dist')
app.use(express.static(distPath))

// Basic info for LAN access hints (used by /admin in dev/prod)
app.get('/api/lan', (req, res) => {
  res.json({
    ips: getLanIPs(),
  })
})

// All non-socket routes → index.html (Vue Router history mode)
app.get('/{*path}', (req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

// Socket.io
io.on('connection', (socket) => {
  registerHandlers(io, socket)
})

// Print LAN IPs
function getLanIPs() {
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
}

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌸 茉莉花研学App 服务器已启动`)
  console.log(`   本机访问: http://localhost:${PORT}`)
  const ips = getLanIPs()
  if (ips.length > 0) {
    console.log(`\n   局域网访问（学生设备请输入以下地址）:`)
    ips.forEach(ip => console.log(`   → http://${ip}:${PORT}`))
  }
  console.log(`\n   老师控制台: /admin`)
  console.log(`   大屏幕:     /screen`)
  console.log(`   队伍答题:   /game\n`)
})
