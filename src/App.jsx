import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, subtitle, children, tint = 'white' }) {
  const tintMap = {
    white: 'bg-white/80 border-white/40',
    pink: 'bg-pink-50/80 border-pink-200/60',
    blue: 'bg-sky-50/80 border-sky-200/60',
    green: 'bg-emerald-50/80 border-emerald-200/60',
    purple: 'bg-purple-50/80 border-purple-200/60',
  }
  return (
    <div className={`backdrop-blur p-4 md:p-6 rounded-2xl shadow-md border ${tintMap[tint] || tintMap.white}`}>
      <div className="mb-3">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          {title}
          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
        </h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
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
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
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

  // timers (parent only)
  const [dailyLimit, setDailyLimit] = useState(60)
  const [sessionLimit, setSessionLimit] = useState(20)
  const [timerChildId, setTimerChildId] = useState('')

  // social tracking (parent only)
  const [socialChildId, setSocialChildId] = useState('')
  const [socialProvider, setSocialProvider] = useState('tiktok')
  const [socialHandle, setSocialHandle] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [socialActivity, setSocialActivity] = useState([])

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
      if (data.role === 'child') { setTimerChildId(data.userId); setSocialChildId(data.userId) }
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
      if (data.role === 'child') { setTimerChildId(data.userId); setSocialChildId(data.userId) }
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

  // Timers (parent only)
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

  // Social (parent only)
  const refreshLinks = async () => {
    const id = socialChildId || timerChildId || user?.userId
    if (!id) return
    const r = await fetch(`${apiBase}/social/${id}/links`)
    const data = await r.json()
    setSocialLinks(data)
  }

  const linkSocial = async () => {
    const id = socialChildId || timerChildId || user?.userId
    if (!id || !socialHandle) return
    await fetch(`${apiBase}/social/link`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ childId: id, provider: socialProvider, handle: socialHandle }) })
    setSocialHandle('')
    refreshLinks()
  }

  const scanSocial = async () => {
    const id = socialChildId || timerChildId || user?.userId
    if (!id) return
    await fetch(`${apiBase}/social/${id}/scan`, { method: 'POST' })
    loadActivity()
  }

  const loadActivity = async () => {
    const id = socialChildId || timerChildId || user?.userId
    if (!id) return
    const r = await fetch(`${apiBase}/social/${id}/activity`)
    const data = await r.json()
    setSocialActivity(data)
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

  const bubble = (size, delay, pos) => (
    <span
      key={pos}
      className={`absolute rounded-full bg-white/40 blur-sm animate-[float_6s_ease-in-out_infinite]`}
      style={{ width: size, height: size, left: pos, animationDelay: `${delay}s` }}
    />
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 text-gray-800">
      <div className="pointer-events-none absolute inset-0">
        {bubble(18, 0, '10%')}
        {bubble(26, 1, '30%')}
        {bubble(22, 2, '55%')}
        {bubble(14, 3, '75%')}
      </div>
      <div className="relative max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center animate-bounce">🌟</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Wellbeing Assistant (MVP)</h1>
              <p className="text-sm text-gray-600">AI chat, analyzer, and parent tools</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setRole('child')} className={`px-3 py-2 rounded-full text-sm transition ${role==='child'?'bg-purple-600 text-white':'bg-white/80 hover:bg-white'}`}>Child</button>
            <button onClick={()=>setRole('parent')} className={`px-3 py-2 rounded-full text-sm transition ${role==='parent'?'bg-purple-600 text-white':'bg-white/80 hover:bg-white'}`}>Parent</button>
            {user && (
              <div className="ml-2 flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full shadow-sm">
                <Badge color="gray">{user.role}</Badge>
                <span className="text-sm">{user.name || 'User'}</span>
                <button onClick={()=>{setUser(null); setMessages([])}} className="text-xs text-blue-600 underline">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Auth */}
        {!user && (
          <Section title={`${greeting} Login`} subtitle={role==='child' ? 'Enter your name and PIN to chat.' : 'Parents can manage timers and social links.'} tint={role==='child'?'blue':'purple'}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
                {role==='parent' && (
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="Email (parent)" value={email} onChange={e=>setEmail(e.target.value)} />
                )}
                {role==='child' && (
                  <>
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="PIN (4 digits)" value={pin} onChange={e=>setPin(e.target.value)} />
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="Parent ID (optional)" value={parentId} onChange={e=>setParentId(e.target.value)} />
                  </>
                )}
                <div className="flex gap-2">
                  <button onClick={register} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Register</button>
                  <button onClick={login} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Login</button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-xl p-4 animate-[pop_0.5s_ease]">
                <h3 className="font-semibold mb-2">Quick tips</h3>
                <ul className="list-disc text-sm ml-5 space-y-1">
                  {role==='child' ? (
                    <>
                      <li>Use a simple PIN you remember.</li>
                      <li>Share how you feel. Try both happy and sad words.</li>
                      <li>Look at the badges to see the emotion analyzer.</li>
                    </>
                  ) : (
                    <>
                      <li>Enter your email to sign in.</li>
                      <li>Manage timers and social links after login.</li>
                      <li>Scan activity to update the risk overview.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </Section>
        )}

        {/* Daily content */}
        <Section title="Daily Positivity" subtitle="A little boost for today" tint="pink">
          {content ? (
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border hover:shadow transition"><p className="text-xs text-gray-500">Affirmation</p><p className="font-semibold">{content.affirmation}</p></div>
              <div className="p-3 rounded-lg bg-white border hover:shadow transition"><p className="text-xs text-gray-500">Quote</p><p className="font-semibold">{content.quote}</p></div>
              <div className="p-3 rounded-lg bg-white border hover:shadow transition"><p className="text-xs text-gray-500">Joke</p><p className="font-semibold">{content.joke}</p></div>
            </div>
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </Section>

        {/* Chat (child and parent can use) */}
        {user && (
          <Section title="AI Assistant Chat" subtitle="Friendly, supportive, kid-safe" tint="white">
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
                      <Badge color={m.analysis.sentiment==='positive'?'green':m.analysis.sentiment==='negative'?'red':'gray'}>{m.analysis.sentiment}</Badge>
                      {m.analysis.emotions?.map((e, idx)=>(<Badge key={idx} color="purple">{e}</Badge>))}
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

        {/* Parent-only: Timers */}
        {user?.role === 'parent' && (
          <Section title="Child Timers" subtitle="App-level limits" tint="green">
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
        )}

        {/* Parent-only: Social tracking */}
        {user?.role === 'parent' && (
          <Section title="Social Activity" subtitle="Link accounts and scan for wellbeing signals" tint="blue">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Child ID</label>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Child userId" value={socialChildId} onChange={e=>setSocialChildId(e.target.value)} />
                <div className="grid grid-cols-3 gap-2">
                  <select className="border rounded-lg px-2 py-2" value={socialProvider} onChange={e=>setSocialProvider(e.target.value)}>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                  <input className="col-span-2 border rounded-lg px-3 py-2" placeholder="@handle" value={socialHandle} onChange={e=>setSocialHandle(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button onClick={linkSocial} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Link</button>
                  <button onClick={refreshLinks} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Load Links</button>
                </div>
                {socialLinks.length>0 && (
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold">Linked:</p>
                    <ul className="list-disc ml-5">
                      {socialLinks.map((l,i)=>(<li key={i}>{l.provider}: {l.handle}</li>))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={scanSocial} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Scan Now</button>
                  <button onClick={loadActivity} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Refresh</button>
                </div>
                <p className="text-xs text-gray-500">MVP uses mock posts and on-device analysis.</p>
              </div>
              <div className="md:col-span-2 bg-white rounded-xl border p-3 max-h-64 overflow-y-auto">
                {socialActivity.length===0 ? (
                  <div className="text-sm text-gray-500">No recent items. Link and scan to see activity.</div>
                ) : (
                  <ul className="space-y-2">
                    {socialActivity.map((a,i)=>{
                      const s = a.analysis?.sentiment || 'neutral'
                      const color = s==='positive'? 'green' : s==='negative'? 'red' : 'gray'
                      return (
                        <li key={i} className="p-2 rounded-lg border bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge color="blue">{a.provider}</Badge>
                              <Badge color="purple">{a.handle}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge color={color}>{s}</Badge>
                              <Badge color={a.risk>=60? 'yellow' : a.risk>=30? 'blue' : 'green'}>risk {Math.round(a.risk)}</Badge>
                            </div>
                          </div>
                          <p className="text-sm mt-1">{a.text}</p>
                          {a.analysis?.emotions?.length>0 && (
                            <div className="mt-1 flex gap-1 flex-wrap">
                              {a.analysis.emotions.map((e,idx)=>(<Badge key={idx} color="pink">{e}</Badge>))}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </Section>
        )}

        <footer className="text-center text-xs text-gray-500 py-6">Built for wellbeing. Be kind to yourself 💚</footer>
      </div>
    </div>
  )
}
