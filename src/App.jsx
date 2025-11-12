import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children }) {
  return (
    <div className="bg-white/80 backdrop-blur p-4 md:p-6 rounded-2xl shadow-md border border-white/40">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Badge({ children, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.blue}`}>
      {children}
    </span>
  )
}

export default function App() {
  const [role, setRole] = useState('child')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // auth fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [parentId, setParentId] = useState('')

  // chat
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [riskScore, setRiskScore] = useState(0)
  const [alertLevel, setAlertLevel] = useState(null)

  // content card
  const [content, setContent] = useState(null)

  // timers
  const [dailyLimit, setDailyLimit] = useState(60)
  const [sessionLimit, setSessionLimit] = useState(20)
  const [timerChildId, setTimerChildId] = useState('')

  const greeting = useMemo(() => (role === 'parent' ? 'Parent' : 'Child'), [role])

  useEffect(() => {
    fetch(`${apiBase}/content/daily`).then(r => r.json()).then(setContent).catch(()=>{})
  }, [])

  const register = async () => {
    try {
      setLoading(true); setError('')
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name, email: role==='parent'?email:undefined, parentId: role==='child'?parentId||undefined:undefined, pin: role==='child'?pin:undefined }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setUser({ userId: data.userId, role: data.role, name })
      if (data.role === 'child') setTimerChildId(data.userId)
    } catch (e) {
      setError(String(e.message||e))
    } finally { setLoading(false) }
  }

  const login = async () => {
    try {
      setLoading(true); setError('')
      const body = role === 'parent' ? { role, email } : { role, pin, userId: undefined }
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setUser(data)
      if (data.role === 'child') setTimerChildId(data.userId)
    } catch (e) {
      setError(String(e.message||e))
    } finally { setLoading(false) }
  }

  const sendChat = async () => {
    if (!user?.userId || !chatInput.trim()) return
    const input = chatInput
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setChatInput('')
    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.userId, text: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply, analysis: data.analysis }])
      setRiskScore(data.riskScore || 0)
      setAlertLevel(data.alertLevel || null)
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Oops, there was a problem. Please try again.' }])
    }
  }

  const loadTimer = async () => {
    const id = timerChildId || user?.userId
    if (!id) return
    const r = await fetch(`${apiBase}/timers/${id}`)
    const data = await r.json()
    setDailyLimit(data.dailyLimit)
    setSessionLimit(data.sessionLimit)
  }

  const saveTimer = async () => {
    const id = timerChildId || user?.userId
    if (!id) return
    await fetch(`${apiBase}/timers/set`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ childId: id, dailyLimit: Number(dailyLimit), sessionLimit: Number(sessionLimit) }) })
  }

  const RiskPill = () => {
    let color = 'green', label = 'Low'
    if (riskScore >= 80) { color = 'red'; label = 'Critical' }
    else if (riskScore >= 60) { color = 'yellow'; label = 'Concern' }
    else if (riskScore >= 30) { color = 'blue'; label = 'Watch' }
    return (
      <div className="flex items-center gap-2">
        <Badge color={color}>{label}</Badge>
        <span className="text-sm text-gray-600">Score: {Math.round(riskScore)}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 text-gray-800">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center animate-bounce">🌟</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Wellbeing Assistant (MVP)</h1>
              <p className="text-sm text-gray-600">AI chat, emotion analysis, timers, and happy vibes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setRole('child')} className={`px-3 py-2 rounded-full text-sm ${role==='child'?'bg-purple-600 text-white':'bg-white/80'}`}>Child</button>
            <button onClick={()=>setRole('parent')} className={`px-3 py-2 rounded-full text-sm ${role==='parent'?'bg-purple-600 text-white':'bg-white/80'}`}>Parent</button>
            {user && (
              <div className="ml-2 flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
                <Badge color="gray">{user.role}</Badge>
                <span className="text-sm">{user.name || 'User'}</span>
                <button onClick={()=>{setUser(null); setMessages([])}} className="text-xs text-blue-600 underline">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Auth */}
        {!user && (
          <Section title={`${greeting} Login / Register`}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
                {role==='parent' && (
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="Email (parent)" value={email} onChange={e=>setEmail(e.target.value)} />
                )}
                {role==='child' && (
                  <>
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="Parent ID (optional)" value={parentId} onChange={e=>setParentId(e.target.value)} />
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="PIN (4 digits)" value={pin} onChange={e=>setPin(e.target.value)} />
                  </>
                )}
                <div className="flex gap-2">
                  <button onClick={register} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Register</button>
                  <button onClick={login} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Login</button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">How to try it quickly</h3>
                <ul className="list-disc text-sm ml-5 space-y-1">
                  <li>Choose Child or Parent on top.</li>
                  <li>Register a child with a PIN to chat and test risk score.</li>
                  <li>Parents can set time limits for a child (needs child ID).</li>
                </ul>
              </div>
            </div>
          </Section>
        )}

        {/* Daily content */}
        <Section title="Daily Positivity">
          {content ? (
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border"><p className="text-xs text-gray-500">Affirmation</p><p className="font-semibold">{content.affirmation}</p></div>
              <div className="p-3 rounded-lg bg-white border"><p className="text-xs text-gray-500">Quote</p><p className="font-semibold">{content.quote}</p></div>
              <div className="p-3 rounded-lg bg-white border"><p className="text-xs text-gray-500">Joke</p><p className="font-semibold">{content.joke}</p></div>
            </div>
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </Section>

        {/* Chat */}
        {user && (
          <Section title="AI Assistant Chat">
            <div className="flex items-center justify-between mb-3">
              <RiskPill />
              {alertLevel && <Badge color={alertLevel==='critical'?'red':alertLevel==='concern'?'yellow':'blue'}>Alert: {alertLevel}</Badge>}
            </div>
            <div className="h-64 overflow-y-auto bg-white rounded-lg border p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm">Say hello and tell me how you feel today 💬</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[80%] rounded-xl px-3 py-2 ${m.role==='user'?'bg-blue-100 ml-auto':'bg-gray-100'}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  {m.analysis && (
                    <div className="mt-1 flex gap-2">
                      <Badge color="gray">{m.analysis.sentiment}</Badge>
                      {m.analysis.emotions?.map((e, idx)=>(<Badge key={idx} color="blue">{e}</Badge>))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') sendChat()}} className="flex-1 border rounded-lg px-3 py-2" placeholder="Type a message" />
              <button onClick={sendChat} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Send</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">If you are in immediate danger, call your local emergency number.</p>
          </Section>
        )}

        {/* Timers */}
        <Section title="Chllidet Timers (App-level)">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Child ID</label>
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Child userId" value={timerChildId} onChange={e=>setTimerChildId(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600">Daily Limit (min)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2" value={dailyLimit} onChange={e=>setDailyLimit(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Session Limit (min)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2" value={sessionLimit} onChange={e=>setSessionLimit(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={loadTimer} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Load</button>
                <button onClick={saveTimer} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Save</button>
              </div>
              <p className="text-xs text-gray-500">Note: This MVP controls limits inside the app only.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">How it works</h3>
              <ul className="list-disc ml-5 text-sm space-y-1">
                <li>Parents set daily and session time for a child account.</li>
                <li>Future native app can enforce device-level controls.</li>
                <li>Celebrate healthy usage with rewards and stars ⭐</li>
              </ul>
            </div>
          </div>
        </Section>

        <footer className="text-center text-xs text-gray-500 py-6">Built for wellbeing. Be kind to yourself 💚</footer>
      </div>
    </div>
  )
}
