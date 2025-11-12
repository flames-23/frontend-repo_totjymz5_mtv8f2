import { useState } from 'react'
import { Brain, MessageSquare, Languages, Building2, Users, ShieldAlert, BarChart3, Library, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react'

function Container({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  )
}

function Button({ children, variant = 'primary', href = '#', onClick }) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 focus:ring-gray-300',
    ghost: 'bg-transparent text-emerald-700 hover:text-emerald-800',
  }
  if (href) {
    return (
      <a href={href} onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</a>
    )
  }
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>
  )
}

function AnimatedLogo() {
  const [hover, setHover] = useState(false)
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold transition-all duration-300 relative overflow-hidden ${hover ? 'shadow-[0_0_0_4px_rgba(16,185,129,0.25)]' : ''}`}
      style={{ background: 'conic-gradient(from 180deg, #10b981, #34d399, #06b6d4, #10b981)' }}
      aria-label="Your Saarthi"
    >
      <span className={`absolute inset-0 opacity-30 ${hover ? 'animate-spin-slow' : ''}`} />
      <span className="relative z-10">YS</span>
    </span>
  )
}

function NavBar() {
  const [open, setOpen] = useState(false)
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Team', href: '#therapists' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-100">
      <Container className="flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2">
          <AnimatedLogo />
          <span className="font-extrabold text-lg tracking-tight">Your Saarthi</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((n)=> (
            <a key={n.href} href={n.href} className="text-sm text-gray-700 hover:text-gray-900">{n.label}</a>
          ))}
          <Button href="#contact" variant="primary">Get Started</Button>
        </nav>
        <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200" onClick={()=>setOpen(!open)} aria-label="Toggle Menu">☰</button>
      </Container>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <Container className="py-3 space-y-2">
            {navItems.map((n)=> (
              <a key={n.href} href={n.href} onClick={()=>setOpen(false)} className="block text-sm text-gray-700 hover:text-gray-900">{n.label}</a>
            ))}
            <Button href="#contact" onClick={()=>setOpen(false)} variant="primary">Get Started</Button>
          </Container>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-sky-50"/>
      <Container className="py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold border border-emerald-100">Human care, AI-powered</div>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">Your Saarthi for mental wellbeing</h1>
          <p className="mt-4 text-gray-600 text-base md:text-lg">Personalised care paths, multilingual support, and always-on guidance—built for individuals, families, and teams.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#features" variant="primary">Explore features</Button>
            <Button href="#contact" variant="secondary">Talk to us</Button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <div>⭐ 4.9 average rating</div>
            <div>🔒 Confidential & secure</div>
            <div>🌐 Hindi + English</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-emerald-100">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop" alt="People collaborating and supporting each other" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-sm">
            <div className="font-semibold">Smart care plan active</div>
            <div className="text-gray-600">Weekly insights • Gentle nudges</div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-8">
      {eyebrow && <div className="text-emerald-700 font-semibold text-xs mb-1">{eyebrow}</div>}
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-5 bg-white hover:shadow-lg transition group">
      <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition">
        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  )
}

function Features() {
  const data = [
    { icon: Brain, title: 'AI‑guided care paths', desc: 'Personalised plans that adapt to your mood, goals, and progress.' },
    { icon: MessageSquare, title: '24/7 chat support', desc: 'Reach a human coach any time for check‑ins and guidance.' },
    { icon: Languages, title: 'Hindi + English therapy', desc: 'Multilingual, culturally attuned support that meets you where you are.' },
    { icon: Building2, title: 'Corporate wellness suite', desc: 'Dashboards, engagement tools, and impact reporting for teams.' },
    { icon: Users, title: 'Community circles', desc: 'Moderated peer groups by topic with safe, supportive spaces.' },
    { icon: ShieldAlert, title: 'Crisis ready', desc: 'Rapid escalation protocols and safety planning when needed.' },
    { icon: BarChart3, title: 'Progress tracking', desc: 'Clear goals, weekly insights, and nudges to keep you moving.' },
    { icon: Library, title: 'Self‑care library', desc: 'Guided audios, CBT tools, and mini‑courses you can use anytime.' },
    { icon: CalendarCheck, title: 'One‑tap booking', desc: 'Instant scheduling for therapists, coaches, and group sessions.' },
    { icon: ShieldCheck, title: 'Insurance support', desc: 'Help with reimbursements and cashless options where available.' },
  ]
  return (
    <section id="features" className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Features" title="Built for real‑world care" subtitle="Everything you need to start, stay on track, and feel supported—without the fluff." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function WhyUs() {
  const points = [
    { title: 'Expert clinicians', text: 'Handpicked, licensed therapists with specialised training.' },
    { title: 'Personalised plans', text: 'Assessments and matching ensure you get the right care.' },
    { title: 'Measured outcomes', text: 'We track your progress and adapt based on data.' },
    { title: 'Human + AI', text: 'Between sessions, our assistant helps you practice skills.' },
  ]
  return (
    <section id="why-us" className="py-16 bg-emerald-50/60">
      <Container>
        <SectionTitle eyebrow="Why Choose Us" title="Clinical care, delivered with heart" subtitle="A modern experience that keeps the human connection at the centre." />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {points.map((p)=> (
              <div key={p.title} className="flex gap-4">
                <div className="h-10 w-10 flex-none rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">✓</div>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <p className="text-sm text-gray-600">{p.text}</p>
                </div>
              </div>
            ))}
            <div className="pt-4"><Button href="#contact" variant="primary">Talk to our team</Button></div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1600&auto=format&fit=crop" alt="Team wellbeing and collaboration" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-sm">
              <div className="font-semibold">92% feel better in 6 weeks</div>
              <div className="text-gray-600">Based on self‑reported outcomes</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Therapists() {
  const people = [
    { name: 'Dr. A. Patel', tags: 'CBT • Anxiety • Teens', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Dr. R. Sharma', tags: 'Relationships • Family', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Dr. K. Mehta', tags: 'Depression • Trauma', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Dr. L. Dutta', tags: 'Stress • Burnout', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop' },
  ]
  return (
    <section id="therapists" className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Team" title="You are in expert hands" subtitle="Our clinicians are licensed, experienced, and continuously supervised." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {people.map((p)=> (
            <div key={p.name} className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition">
              <div className="h-40 w-full overflow-hidden">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.tags}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Pricing() {
  const tiers = [
    { name: 'Care Plan', price: '₹999 / month', features: ['Smart care path', 'Weekly insights', 'Self‑care library'], cta: 'Start plan' },
    { name: 'Guided Programs', price: '₹1,499 / month', features: ['CBT tools + audios', 'Coach check‑ins', 'One‑tap booking'], cta: 'Start program' },
    { name: 'Enterprise', price: 'Custom', features: ['Dashboards & reports', 'Engagement tooling', 'Dedicated success team'], cta: 'Contact sales' },
  ]
  return (
    <section id="pricing" className="py-16 bg-emerald-50/60">
      <Container>
        <SectionTitle eyebrow="Pricing" title="Simple, transparent options" subtitle="Choose a plan that fits—no consultations required." />
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t)=> (
            <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Sparkles className="h-4 w-4" />{t.name}</div>
              <div className="mt-2 text-2xl font-extrabold">{t.price}</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {t.features.map((f)=> (<li key={f} className="flex items-start gap-2"><span className="text-emerald-600">✓</span><span>{f}</span></li>))}
              </ul>
              <div className="mt-6"><Button href="#contact" variant="primary">{t.cta}</Button></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Testimonials() {
  const items = [
    { quote: 'The care plan nudges kept me consistent without pressure.', name: 'A., Bengaluru' },
    { quote: 'Instant booking and Hindi support made it easy for my parents.', name: 'S., Mumbai' },
    { quote: 'Our team dashboard finally shows impact, not just usage.', name: 'R., Pune' },
  ]
  return (
    <section className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Stories" title="What our users say" />
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i)=> (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-3xl text-emerald-600">“”</div>
              <p className="mt-2 text-gray-700">{t.quote}</p>
              <div className="mt-4 text-sm text-gray-500">{t.name}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FAQ() {
  const items = [
    { q: 'Is this a consultation service?', a: 'No. We focus on structured care paths, programs, and ongoing support—not one‑off consultations.' },
    { q: 'Can I talk to someone when I need help?', a: 'Yes. You can chat with a human coach 24/7 for guidance and check‑ins.' },
    { q: 'Do you support Hindi?', a: 'Yes. We offer Hindi and English support across care, content, and coaching.' },
  ]
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="py-16 bg-emerald-50/60">
      <Container>
        <SectionTitle eyebrow="FAQ" title="Your questions, answered" />
        <div className="space-y-3 max-w-3xl mx-auto">
          {items.map((it, idx)=> (
            <div key={it.q} className="rounded-xl border border-gray-100 bg-white">
              <button onClick={()=>setOpen(open===idx? -1 : idx)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                <span className="font-semibold">{it.q}</span>
                <span className="text-emerald-700">{open===idx? '−' : '+'}</span>
              </button>
              {open===idx && (
                <div className="px-4 pb-4 text-sm text-gray-600">{it.a}</div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Get in touch" title="Start your care plan" subtitle="Share a few details and we’ll get back within 24 hours." />
        <form className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
          <input required placeholder="Full name" className="border border-gray-200 rounded-lg px-3 py-2" />
          <input required placeholder="Email" type="email" className="border border-gray-200 rounded-lg px-3 py-2" />
          <input required placeholder="Phone" className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2" />
          <select className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2">
            <option>What do you need support with?</option>
            <option>Anxiety / Stress</option>
            <option>Relationships</option>
            <option>Teen support</option>
            <option>Workplace wellbeing</option>
          </select>
          <textarea rows="4" placeholder="Anything you’d like us to know" className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2" />
          <div className="sm:col-span-2">
            <Button href="mailto:hello@yoursaarthi.com?subject=Care%20plan%20inquiry" variant="primary">Send inquiry</Button>
          </div>
        </form>
      </Container>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <Container className="py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <AnimatedLogo />
            <span className="font-extrabold">Your Saarthi</span>
          </div>
          <p className="mt-3 text-gray-600">Human care with AI assistance—multilingual, secure, and built for India.</p>
        </div>
        <div>
          <div className="font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li><a href="#features" className="hover:text-gray-900">Features</a></li>
            <li><a href="#why-us" className="hover:text-gray-900">Why us</a></li>
            <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
            <li><a href="#faq" className="hover:text-gray-900">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Resources</div>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li><a href="#" className="hover:text-gray-900">Blog</a></li>
            <li><a href="#" className="hover:text-gray-900">Self-help tools</a></li>
            <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
            <li><a href="#" className="hover:text-gray-900">Terms</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Get in touch</div>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>hello@yoursaarthi.com</li>
            <li>+91 98XX-XXXXXX</li>
            <li>Mon–Sat, 9am–7pm IST</li>
          </ul>
        </div>
      </Container>
      <div className="text-center text-xs text-gray-500 pb-8">© {new Date().getFullYear()} Your Saarthi. For emergencies, contact your local helpline.</div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 6s linear infinite; }`}</style>
      <NavBar />
      <Hero />
      <Features />
      <WhyUs />
      <Therapists />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
