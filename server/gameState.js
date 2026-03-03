// ===========================
// 内存游戏状态 + mutation helpers
// ===========================

export const sessions = {}   // sessionId -> session
export const roomCodes = {}  // roomCode -> sessionId

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
    currentAnswers: {},      // teamId -> answer key (reset each question)
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
}

export function submitAnswer(session, teamId, answer) {
  if (session.phase !== 'question') return false
  if (session.currentAnswers[teamId] !== undefined) return false // already answered
  session.currentAnswers[teamId] = answer
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

  // Score each team
  for (const [teamId, team] of Object.entries(session.teams)) {
    const ans = session.currentAnswers[teamId]
    let points = 0
    if (ans !== undefined) {
      const score = optionScores[ans] ?? 0
      points = score === 3 ? 3 : score === 1 ? 1 : 0
    }
    console.log(`[REVEAL] team=${team.teamName} ans=${ans} score=${optionScores[ans]} points=${points}`)
    team.totalScore += points
    team.answers[session.currentIndex] = { answer: ans, points }
  }

  return buildTeamScores(session)
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
