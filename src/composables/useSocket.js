// ===========================
// 共享 Socket.io 客户端连接
// ===========================
import { io } from 'socket.io-client'
import { ref } from 'vue'

// 单例连接，所有视图共享
let socket = null

export function useSocket() {
  if (!socket) {
    // 生产环境连到同一服务器；开发模式通过 vite proxy 转发
    socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })
  }

  const connected = ref(socket.connected)
  socket.on('connect', () => { connected.value = true })
  socket.on('disconnect', () => { connected.value = false })

  return { socket, connected }
}
