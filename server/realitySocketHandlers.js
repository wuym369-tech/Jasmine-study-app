// ===========================
// 现实挑战 - Socket.IO 事件处理器（异步自动模式）
// ===========================

import { getRealityGameState, WeekDays } from './realityGameState.js'

export function setupRealitySocketHandlers(io) {
  const realityGame = getRealityGameState()

  io.on('connection', (socket) => {
    console.log('Reality Game: Client connected', socket.id)

    // 创建游戏（只需要场次号）
    socket.on('reality:create', (data) => {
      const { season, config } = data
      const sessionId = generateSessionId()
      const session = realityGame.createSession(sessionId, { season, ...config })
      
      socket.join(`reality:${sessionId}`)
      socket.join(`reality:screen:${sessionId}`)
      socket.sessionId = sessionId
      socket.role = 'teacher'
      
      // 发送给创建者
      socket.emit('reality:created', {
        sessionId,
        joinUrl: `/reality/join/${sessionId}`,
        season: session.season
      })
      
      // 广播给大屏幕（包括等待室和特定场次）
      const screenData = {
        session: {
          sessionId: session.sessionId,
          season: session.season,
          teams: []
        },
        leaderboard: []
      }
      io.to(`reality:screen:waiting`).emit('reality:screen:state', screenData)
      io.to(`reality:screen:${sessionId}`).emit('reality:screen:state', screenData)
    })

    // 教师重新加入
    socket.on('reality:teacher:rejoin', (data) => {
      const { sessionId } = data
      const session = realityGame.sessions.get(sessionId)
      
      if (!session) {
        socket.emit('reality:error', { message: '场次不存在或已过期' })
        return
      }
      
      socket.join(`reality:${sessionId}`)
      socket.join(`reality:screen:${sessionId}`)
      socket.sessionId = sessionId
      socket.role = 'teacher'
      
      socket.emit('reality:rejoined', {
        sessionId,
        session: {
          sessionId: session.sessionId,
          season: session.season,
          teams: Array.from(session.teams.values()).map(t => realityGame.getPublicTeamStatus(t))
        },
        leaderboard: realityGame.getLeaderboard(sessionId)
      })
    })

    // 队伍加入
    socket.on('reality:team:join', (data) => {
      const { sessionId, teamId, teamName } = data
      
      const result = realityGame.joinTeam(sessionId, teamId, teamName)
      if (result.error) {
        socket.emit('reality:error', { message: result.error })
        return
      }
      
      socket.join(`reality:${sessionId}`)
      socket.join(`reality:team:${sessionId}:${teamId}`)
      socket.sessionId = sessionId
      socket.teamId = teamId
      socket.role = 'team'
      
      // 自动开始游戏
      realityGame.startTeamGame(sessionId, teamId)
      
      socket.emit('reality:joined', {
        teamId,
        teamName,
        teamStatus: result.teamStatus,
        message: '游戏已开始！'
      })
      
      // 廣播給大屏幕（用 io.to 確保該房間內所有 socket 都收到）
      const leaderboard = realityGame.getLeaderboard(sessionId)
      io.to(`reality:screen:${sessionId}`).emit('reality:team_joined', {
        teamId,
        teamName,
        leaderboard
      })
    })

    // 队伍重新加入
    socket.on('reality:team:rejoin', (data) => {
      const { sessionId, teamId } = data
      const session = realityGame.sessions.get(sessionId)
      
      if (!session) {
        socket.emit('reality:error', { message: '场次不存在' })
        return
      }
      
      const team = session.teams.get(teamId)
      if (!team) {
        socket.emit('reality:error', { message: '队伍不存在' })
        return
      }
      
      socket.join(`reality:${sessionId}`)
      socket.join(`reality:team:${sessionId}:${teamId}`)
      socket.sessionId = sessionId
      socket.teamId = teamId
      socket.role = 'team'
      
      socket.emit('reality:rejoined', {
        teamId,
        teamName: team.teamName,
        teamStatus: realityGame.getPublicTeamStatus(team)
      })
    })

    // 提交决策
    socket.on('reality:team:submit', (data) => {
      const { eventInstanceId, decision } = data
      const sessionId = socket.sessionId
      const teamId = socket.teamId
      
      if (!sessionId || !teamId) {
        socket.emit('reality:error', { message: '未加入游戏' })
        return
      }
      
      let result
      try {
        result = realityGame.submitDecision(sessionId, teamId, eventInstanceId, decision)
      } catch (e) {
        console.error('[Reality] submitDecision threw:', e)
        socket.emit('reality:error', { message: '服务器内部错误：' + e.message })
        return
      }
      if (result.error) {
        socket.emit('reality:error', { message: result.error })
        return
      }
      
      console.log(`[Reality] submit result: finished=${result.finished}, dayChanged=${result.dayChanged}`)
      
      // 发送给该队伍（游戏结束时用 finalStats 作为 teamStatus）
      socket.emit('reality:decision_submitted', {
        teamStatus: result.finished ? (result.result?.finalStats ?? null) : result.teamStatus,
        eventInstanceId,
        dayChanged: result.dayChanged ?? result.finished ?? false,
        finished: result.finished ?? false
      })
      
      // 如果游戏结束
      if (result.finished) {
        socket.emit('reality:finished', { result: result.result })
      }
      
      // 广播排行榜更新（同时发给 session room 与 screen room 确保大屏幕必收到）
      const lb = realityGame.getLeaderboard(sessionId)
      io.to(`reality:${sessionId}`).emit('reality:leaderboard', { leaderboard: lb })
      io.to(`reality:screen:${sessionId}`).emit('reality:leaderboard', { leaderboard: lb })
    })

    // 获取当前状态
    socket.on('reality:get_state', () => {
      const sessionId = socket.sessionId
      if (!sessionId) {
        socket.emit('reality:error', { message: '未加入场次' })
        return
      }
      
      const session = realityGame.sessions.get(sessionId)
      if (!session) {
        socket.emit('reality:error', { message: '场次不存在' })
        return
      }
      
      // 如果是队伍，返回队伍状态
      if (socket.teamId) {
        const team = session.teams.get(socket.teamId)
        if (team) {
          socket.emit('reality:state', {
            teamStatus: realityGame.getPublicTeamStatus(team)
          })
        }
      }
      
      // 广播排行榜
      socket.emit('reality:leaderboard', {
        leaderboard: realityGame.getLeaderboard(sessionId)
      })
    })

    // 大屏幕等待室（没有sessionId时）
    socket.on('reality:screen:wait', () => {
      socket.join('reality:screen:waiting')
      socket.role = 'screen-waiting'
      socket.emit('reality:screen:state', {
        session: null,
        leaderboard: []
      })
    })

    // 大屏幕加入
    socket.on('reality:screen:join', (data) => {
      const { sessionId } = data
      const session = realityGame.sessions.get(sessionId)
      
      if (!session) {
        socket.emit('reality:error', { message: '场次不存在' })
        return
      }
      
      // 离开等待室（如果之前在里面）
      socket.leave('reality:screen:waiting')
      
      socket.join(`reality:${sessionId}`)
      socket.join(`reality:screen:${sessionId}`)
      socket.sessionId = sessionId
      socket.role = 'screen'
      
      socket.emit('reality:screen:state', {
        session: {
          sessionId: session.sessionId,
          season: session.season,
          teams: Array.from(session.teams.values()).map(t => realityGame.getPublicTeamStatus(t))
        },
        leaderboard: realityGame.getLeaderboard(sessionId)
      })
    })

    // 断开连接
    socket.on('disconnect', () => {
      console.log('Reality Game: Client disconnected', socket.id)
    })
  })
}

function generateSessionId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
