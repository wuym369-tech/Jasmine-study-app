// ===========================
// 内存游戏状态 + mutation helpers
// ===========================

export const sessions = {}   // sessionId -> session
export const roomCodes = {}  // roomCode -> sessionId

const QUESTION_DURATION_MS = 60_000

function randomCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += letters[Math.floor(Math.random() * letters.length)]
  for (let i = 0; i < 2; i++) code += digits[Math.floor(Math.random() * digits.length)]
  return code
}

export function createSession({ questionIds, teacherSocketId }) {
  const sessionId = 'sess_' + Date.now()
  let roomCode
  do { roomCode = randomCode() } while (roomCodes[roomCode])

  sessions[sessionId] = {
    sessionId,
    roomCode,
    teacherSocketId,
    phase: 'lobby',          // lobby | question | revealed | ended
    questionIds,
    currentIndex: -1,
    teams: {},               // teamId -> { teamName, socketId, totalScore, answers }
    currentAnswers: {},      // teamId -> { answer, answeredAt } (reset each question)
    questionStartedAt: null,
    questionEndsAt: null,
  }
  roomCodes[roomCode] = sessionId
  return sessions[sessionId]
}

export function getSessionByCode(roomCode) {
  const id = roomCodes[roomCode.toUpperCase()]
  return id ? sessions[id] : null
}

export function joinTeam(session, { teamName, socketId }) {
  // Find existing team with same name (handle page refresh)
  const existing = Object.values(session.teams).find(t => t.teamName === teamName)
  if (existing) {
    existing.socketId = socketId
    return { teamId: existing.teamId, alreadyExisted: true }
  }

  if (Object.keys(session.teams).length >= 6) {
    return { error: '已达到最多6支队伍限制' }
  }

  const teamId = 'team_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
  session.teams[teamId] = {
    teamId,
    teamName,
    socketId,
    totalScore: 0,
    answers: {},
  }
  return { teamId, alreadyExisted: false }
}

export function startQuestion(session) {
  session.currentIndex++
  session.phase = 'question'
  session.currentAnswers = {}
  session.questionStartedAt = Date.now()
  session.questionEndsAt = session.questionStartedAt + QUESTION_DURATION_MS
}

export function submitAnswer(session, teamId, answer) {
  if (session.phase !== 'question') return false
  if (session.currentAnswers[teamId] !== undefined) return false // already answered
  const now = Date.now()
  if (session.questionEndsAt && now > session.questionEndsAt) return false
  session.currentAnswers[teamId] = { answer, answeredAt: now }
  return true
}

export function revealAnswer(session) {
  session.phase = 'revealed'
  const shuffled = session.currentShuffled || {}
  const optionScores = shuffled.optionScores || {}
  const correctAnswer = shuffled.answer

  console.log(`\n[REVEAL] Q index=${session.currentIndex}`)
  console.log(`[REVEAL] currentShuffled:`, JSON.stringify(session.currentShuffled))
  console.log(`[REVEAL] currentAnswers:`, JSON.stringify(session.currentAnswers))

  const roundResults = []

  // Score each team
  for (const [teamId, team] of Object.entries(session.teams)) {
    const entry = session.currentAnswers[teamId]
    const ans = entry?.answer
    const answeredAt = entry?.answeredAt ?? null

    let basePoints = 0
    if (ans !== undefined) {
      const score = optionScores[ans] ?? 0
      basePoints = score === 3 ? 3 : score === 1 ? 1 : 0
    }

    // Time bonus:
    // 0-14s remaining => 0
    // 15-29s remaining => 1
    // 30-44s remaining => 2
    // 45-60s remaining => 3
    const remainingMs = (answeredAt && session.questionEndsAt) ? (session.questionEndsAt - answeredAt) : 0
    const timeBonus = basePoints > 0 ? Math.max(0, Math.min(3, Math.floor(remainingMs / 15_000))) : 0
    const points = basePoints + timeBonus

    console.log(`[REVEAL] team=${team.teamName} ans=${ans} base=${basePoints} bonus=${timeBonus} points=${points}`)
    team.totalScore += points
    team.answers[session.currentIndex] = { answer: ans, basePoints, timeBonus, points, answeredAt }
    roundResults.push({ teamId, answer: ans, basePoints, timeBonus, points })
  }

  return { teamScores: buildTeamScores(session), roundResults, correctAnswer }
}

export function buildTeamScores(session) {
  return Object.values(session.teams)
    .map(t => ({ teamId: t.teamId, teamName: t.teamName, totalScore: t.totalScore }))
    .sort((a, b) => b.totalScore - a.totalScore)
}

export function endSession(session) {
  session.phase = 'ended'
  const sessionId = session.sessionId
  const roomCode = session.roomCode
  // Clean up room code mapping after a delay
  setTimeout(() => {
    delete roomCodes[roomCode]
    delete sessions[sessionId]
  }, 60 * 60 * 1000) // keep for 1 hour then cleanup
  return buildTeamScores(session)
}
