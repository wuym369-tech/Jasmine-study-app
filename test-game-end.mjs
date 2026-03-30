/**
 * 自動測試遊戲結束流程
 * 用法：node test-game-end.mjs
 */
import { io } from 'socket.io-client'

const BASE = 'http://localhost:3001'
const sleep = ms => new Promise(r => setTimeout(r, ms))

function connect(label) {
  const s = io(BASE, { path: '/socket.io', transports: ['websocket'] })
  s.on('connect', () => console.log(`[${label}] connected ${s.id}`))
  s.on('connect_error', e => console.error(`[${label}] connect error`, e.message))
  s.on('reality:error', d => console.error(`[${label} ERROR]`, d.message))
  return s
}

async function waitFor(socket, event, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Timeout waiting for ${event}`)), timeout)
    socket.once(event, d => { clearTimeout(t); resolve(d) })
  })
}

// ─── 1. 老師建立場次 ───────────────────────────────────────
const teacher = connect('teacher')
await sleep(600)

teacher.emit('reality:create', { season: 'spring', config: {} })
let created
try { created = await waitFor(teacher, 'reality:created') }
catch (e) { console.error('❌', e.message); process.exit(1) }

const sessionId = created.sessionId
console.log(`✅ Session created: ${sessionId}`)

// ─── 2. 學生加入 ───────────────────────────────────────────
const player = connect('player')
await sleep(600)

const teamId = 'test_team_' + Date.now()
player.emit('reality:team:join', { sessionId, teamId, teamName: '自動測試隊' })
let joined
try { joined = await waitFor(player, 'reality:joined') }
catch (e) { console.error('❌', e.message); process.exit(1) }

console.log(`✅ Joined team ${joined.teamId}, day ${joined.teamStatus?.currentDay}`)
let teamStatus = joined.teamStatus

// ─── 3. 提交所有事件直到遊戲結束 ────────────────────────────
let attempts = 0
let gameFinished = false

player.on('reality:finished', d => {
  console.log('')
  console.log('🎉🎉🎉 收到 reality:finished！score =', d.result?.totalScore, 'grade =', d.result?.grade)
  console.log('✅ 伺服器端遊戲結束流程完全正常！')
  gameFinished = true
})

while (!gameFinished && attempts < 30) {
  attempts++
  
  // 取得最新狀態
  player.emit('reality:get_state')
  let state
  try { state = await waitFor(player, 'reality:state') }
  catch { await sleep(300); continue }

  teamStatus = state.teamStatus
  if (!teamStatus) continue

  if (teamStatus.status === 'finished') {
    console.log('✅ teamStatus.status = finished (via get_state)')
    gameFinished = true
    break
  }

  const allEvents = teamStatus.currentEvents || []
  const completed = teamStatus.completedEvents || []
  const pending = allEvents.filter(e => !completed.some(c => c.eventInstanceId === e.eventInstanceId))

  console.log(`Day ${teamStatus.currentDay}: ${pending.length}/${allEvents.length} pending events`)

  if (pending.length === 0) {
    console.log('  All events done, waiting...')
    await sleep(300)
    continue
  }

  for (const ev of pending) {
    const opts = ev.options || []
    const best = opts.reduce((a, b) => ((b.score ?? 0) > (a.score ?? 0) ? b : a), opts[0])
    if (!best) continue

    console.log(`  → Submit event "${ev.id}" option ${best.id} (score ${best.score})`)
    
    player.emit('reality:team:submit', {
      eventInstanceId: ev.eventInstanceId,
      decision: { optionId: best.id }
    })

    let result
    try { result = await waitFor(player, 'reality:decision_submitted', 3000) }
    catch (e) { console.error('  ❌ No response:', e.message); continue }

    console.log(`    finished=${result.finished} dayChanged=${result.dayChanged} day=${result.teamStatus?.currentDay}`)

    if (result.finished) {
      console.log('  ✅ finished=true received in decision_submitted!')
      gameFinished = true
      break
    }
    await sleep(200)
  }
}

await sleep(1000)
if (!gameFinished) console.log('❌ 遊戲未正常結束（超過嘗試次數）')

teacher.close()
player.close()
process.exit(gameFinished ? 0 : 1)
