// ===========================
// Socket.io 事件处理器
// ===========================
import { scenarios } from '../src/data/discussScenarios.js'
import {
  sessions,
  createSession,
  getSessionByCode,
  joinTeam,
  startQuestion,
  submitAnswer,
  revealAnswer,
  buildTeamScores,
  endSession,
} from './gameState.js'

export function registerHandlers(io, socket) {

  // ---- 老师：重新加入（刷新页面）----
  socket.on('teacher:rejoin', ({ sessionId }) => {
    const session = sessions[sessionId]
    if (!session) return socket.emit('error', { message: '场次不存在或已结束' })
    session.teacherSocketId = socket.id
    socket.join(sessionId)
    socket.emit('teacher:rejoined', {
      sessionId: session.sessionId,
      roomCode: session.roomCode,
      phase: session.phase,
      teams: Object.values(session.teams).map(t => ({
        teamId: t.teamId, teamName: t.teamName, totalScore: t.totalScore,
      })),
      currentIndex: session.currentIndex,
      questionTotal: session.questionIds.length,
      currentAnswers: session.currentAnswers,
      questionStartedAt: session.questionStartedAt,
      questionEndsAt: session.questionEndsAt,
    })
  })

  // ---- 老师：创建场次 ----
  socket.on('teacher:create_session', ({ questionCount, categories }) => {
    // 筛选题目
    let pool = scenarios
    if (categories && categories.length > 0) {
      pool = scenarios.filter(s => categories.includes(s.category))
    }
    // 随机选题
    const shuffled = pool.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount || 8, shuffled.length))
    const questionIds = selected.map(q => q.id)

    const session = createSession({ questionIds, teacherSocketId: socket.id })
    socket.join(session.sessionId)
    socket.emit('teacher:session_created', {
      sessionId: session.sessionId,
      roomCode: session.roomCode,
      questionTotal: questionIds.length,
    })
  })

  // ---- 老师：开始当前题目 ----
  socket.on('teacher:start_question', ({ sessionId }) => {
    const session = sessions[sessionId]
    if (!session) return socket.emit('error', { message: '场次不存在' })

    startQuestion(session)
    const qId = session.questionIds[session.currentIndex]
    const q = scenarios.find(s => s.id === qId)

    // 打乱选项顺序，重新分配 A/B/C/D
    const keys = ['A', 'B', 'C', 'D']
    const shuffled = [...q.options].sort(() => Math.random() - 0.5)
    const remapped = shuffled.map((opt, i) => ({ ...opt, key: keys[i] }))
    const newAnswer = remapped.find(o => o.score === 3)?.key || 'A'

    // 存入 session，供 reveal 时评分用
    const partialOpt = remapped.find(o => o.score === 1)
    session.currentShuffled = {
      answer: newAnswer,
      optionScores: Object.fromEntries(remapped.map(o => [o.key, o.score])),
      partialAnswer: partialOpt?.key || null,
      partialText: partialOpt?.text || null,
    }

    session.currentQuestionPayload = {
      questionIndex: session.currentIndex,
      total: session.questionIds.length,
      questionStartedAt: session.questionStartedAt,
      questionEndsAt: session.questionEndsAt,
      question: {
        id: q.id,
        title: q.title,
        scenario: q.scenario,
        options: remapped.map(o => ({ key: o.key, text: o.text })), // hide score
        categoryLabel: q.categoryLabel,
        categoryColor: q.categoryColor,
        icon: q.icon,
        difficulty: q.difficulty,
        roles: q.roles || [],
        hint15s: q.hint15s || '',
      },
    }

    io.to(sessionId).emit('game:question_started', session.currentQuestionPayload)
  })

  // ---- 老师：揭晓答案 ----
  socket.on('teacher:reveal_answer', ({ sessionId }) => {
    const session = sessions[sessionId]
    if (!session) return socket.emit('error', { message: '场次不存在' })

    const qId = session.questionIds[session.currentIndex]
    const q = scenarios.find(s => s.id === qId)
    const revealed = revealAnswer(session)

    session.currentRevealPayload = {
      correctAnswer: session.currentShuffled?.answer || q.answer,
      explanation: q.explanation,
      partialAnswer: session.currentShuffled?.partialAnswer || null,
      partialText: session.currentShuffled?.partialText || null,
      partialExplanation: q.partialExplanation || null,
      teamScores: revealed.teamScores,
      roundResults: revealed.roundResults,
      currentAnswers: session.currentAnswers,
    }

    io.to(sessionId).emit('game:answer_revealed', session.currentRevealPayload)
  })

  // ---- 老师：下一题 ----
  socket.on('teacher:next_question', ({ sessionId }) => {
    const session = sessions[sessionId]
    if (!session) return socket.emit('error', { message: '场次不存在' })
    // Just signal ready for next (client calls start_question)
    io.to(sessionId).emit('game:waiting_next')
  })

  // ---- 老师：取消场次（返回设置）----
  socket.on('teacher:cancel_session', ({ sessionId }) => {
    const session = sessions[sessionId]
    if (!session) return
    delete roomCodes[session.roomCode]
    delete sessions[sessionId]
  })

  // ---- 老师：结束场次 ----
  socket.on('teacher:end_session', ({ sessionId }) => {
    const session = sessions[sessionId]
    if (!session) return socket.emit('error', { message: '场次不存在' })
    const result = endSession(session, { scenarios })
    io.to(sessionId).emit('game:session_ended', {
      finalScores: result.teamScores,
      teamReviews: result.teamReviews,
    })
  })

  // ---- 队伍：加入 ----
  socket.on('team:join', ({ roomCode, teamName }) => {
    if (!teamName || !teamName.trim()) {
      return socket.emit('team:join_error', { message: '请输入队名' })
    }
    const session = getSessionByCode(roomCode)
    if (!session) {
      return socket.emit('team:join_error', { message: '房间代码无效，请检查后重试' })
    }
    if (session.phase === 'ended') {
      return socket.emit('team:join_error', { message: '该场次已结束' })
    }

    // Prevent new teams from joining mid-game; allow rejoin by same teamName
    const normalizedName = teamName.trim()
    const existing = Object.values(session.teams).find(t => t.teamName === normalizedName)
    if (session.phase !== 'lobby' && !existing) {
      return socket.emit('team:join_error', { message: '本场已开始，无法加入新队伍（可等待下一场）' })
    }

    const result = joinTeam(session, { teamName: teamName.trim(), socketId: socket.id })
    if (result.error) {
      return socket.emit('team:join_error', { message: result.error })
    }

    socket.join(session.sessionId)
    socket.emit('team:joined', {
      teamId: result.teamId,
      teamName: teamName.trim(),
      sessionId: session.sessionId,
      phase: session.phase,
      teamCount: Object.keys(session.teams).length,
      // If rejoining mid-game, send current state
      ...(session.phase === 'question' ? {
        currentIndex: session.currentIndex,
        total: session.questionIds.length,
      } : {}),
    })

    // If team rejoined mid-game, push current payload so UI isn't blank
    if (result.alreadyExisted) {
      if (session.phase === 'question' && session.currentQuestionPayload) {
        socket.emit('game:question_started', session.currentQuestionPayload)
      }
      if (session.phase === 'revealed' && session.currentRevealPayload) {
        socket.emit('game:answer_revealed', session.currentRevealPayload)
      }
    }

    // Notify admin
    const adminSocket = io.sockets.sockets.get(session.teacherSocketId)
    if (adminSocket) {
      adminSocket.emit('admin:team_joined', {
        teamId: result.teamId,
        teamName: teamName.trim(),
        teamCount: Object.keys(session.teams).length,
        alreadyExisted: result.alreadyExisted,
      })
    }

    // Broadcast updated team list to big screen
    io.to(session.sessionId).emit('screen:teams_updated', {
      teams: Object.values(session.teams).map(t => ({
        teamId: t.teamId, teamName: t.teamName,
      })),
    })
  })

  // ---- 队伍：提交答案 ----
  socket.on('team:submit_answer', ({ sessionId, teamId, answer }) => {
    const session = sessions[sessionId]
    if (!session) return

    const ok = submitAnswer(session, teamId, answer)
    if (!ok) {
      // Helpful feedback (timeout / duplicate / wrong phase)
      if (session.phase !== 'question') {
        return socket.emit('team:submit_error', { message: '目前不是作答階段' })
      }
      if (session.questionEndsAt && Date.now() > session.questionEndsAt) {
        return socket.emit('team:submit_error', { message: '本題已超時，無法提交答案' })
      }
      return
    }

    // Confirm to team
    socket.emit('team:answer_confirmed', { answer })

    // Notify admin about answer status
    const adminSocket = io.sockets.sockets.get(session.teacherSocketId)
    if (adminSocket) {
      const team = session.teams[teamId]
      adminSocket.emit('admin:answer_status', {
        teamId,
        teamName: team?.teamName,
        hasAnswered: true,
        answeredCount: Object.keys(session.currentAnswers).length,
        totalTeams: Object.keys(session.teams).length,
      })
    }

    // Update big screen progress
    io.to(sessionId).emit('screen:answer_progress', {
      answeredCount: Object.keys(session.currentAnswers).length,
      totalTeams: Object.keys(session.teams).length,
    })
  })

  // ---- 大屏：请求当前状态 ----
  socket.on('screen:get_state', ({ roomCode }) => {
    const session = getSessionByCode(roomCode)
    if (!session) return socket.emit('screen:no_session')
    socket.join(session.sessionId)
    socket.emit('screen:state', {
      phase: session.phase,
      roomCode: session.roomCode,
      teams: Object.values(session.teams).map(t => ({
        teamId: t.teamId, teamName: t.teamName, totalScore: t.totalScore,
      })),
      currentIndex: session.currentIndex,
      total: session.questionIds.length,
      answeredCount: Object.keys(session.currentAnswers).length,
      questionStartedAt: session.questionStartedAt,
      questionEndsAt: session.questionEndsAt,
    })
  })
}
