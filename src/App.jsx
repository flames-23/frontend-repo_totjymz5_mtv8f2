import { useState } from 'react'

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

function NavBar() {
  const [open, setOpen] = useState(false)
  const navItems = [
    { label: 'Programs', href: '#programs' },
    { label: 'Therapists', href: '#therapists' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-100">
      <Container className="flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">YS</span>
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
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold border border-emerald-100">Clinically backed • Human + AI</div>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">Personalised mental healthcare for you and your family</h1>
          <p className="mt-4 text-gray-600 text-base md:text-lg">Access compassionate therapists, science-based programs, and an assistant that supports you between sessions.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#contact" variant="primary">Book a free consult</Button>
            <Button href="#programs" variant="secondary">Explore programs</Button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <div>⭐ 4.9 average rating</div>
            <div>🔒 Confidential & secure</div>
            <div>🧑‍⚕️ 100+ licensed experts</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 border border-emerald-100 overflow-hidden shadow-xl">
            <div className="absolute inset-0 grid grid-cols-3 gap-2 p-3">
              <div className="rounded-xl bg-white shadow-sm border border-gray-100" />
              <div className="rounded-xl bg-white shadow-sm border border-gray-100" />
              <div className="rounded-xl bg-white shadow-sm border border-gray-100" />
              <div className="col-span-3 rounded-xl bg-white shadow-md border border-gray-100" />
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-sm">
            <div className="font-semibold">Matched with Dr. Patel</div>
            <div className="text-gray-600">CBT • Anxiety • Teens</div>
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

function Programs() {
  const items = [
    { title: 'Therapy for Individuals', desc: 'One-on-one sessions with licensed therapists tailored to your needs.', icon: '🧠' },
    { title: 'Teen & Parent Support', desc: 'Family-centred care for emotional health and digital wellbeing.', icon: '👨‍👩‍👧' },
    { title: 'Anxiety & Mood Programs', desc: 'Structured, clinician-designed paths with tools and check-ins.', icon: '🌿' },
    { title: 'Workplace Wellbeing', desc: 'Evidence-based programs to support teams and leaders.', icon: '🏢' },
  ]
  return (
    <section id="programs" className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Programs" title="Care that fits your life" subtitle="Choose the format and intensity that works best for you—our team helps you personalise the journey." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it)=> (
            <div key={it.title} className="rounded-2xl border border-gray-100 p-5 bg-white hover:shadow-lg transition">
              <div className="text-3xl">{it.icon}</div>
              <div className="mt-3 font-semibold">{it.title}</div>
              <p className="mt-1 text-sm text-gray-600">{it.desc}</p>
            </div>
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
            <div className="pt-4"><Button href="#contact" variant="primary">Speak to a care guide</Button></div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-white border border-gray-100 shadow-xl" />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-sm">
              <div className="font-semibold">92% feel better in 6 weeks</div>
              <div className="text-gray-600">Based on self-reported outcomes</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Therapists() {
  const people = [
    { name: 'Dr. A. Patel', tags: 'CBT • Anxiety • Teens' },
    { name: 'Dr. R. Sharma', tags: 'Relationships • Family' },
    { name: 'Dr. K. Mehta', tags: 'Depression • Trauma' },
    { name: 'Dr. L. Dutta', tags: 'Stress • Burnout' },
  ]
  return (
    <section id="therapists" className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Therapists" title="You are in expert hands" subtitle="Our clinicians are licensed, experienced, and continuously supervised." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {people.map((p)=> (
            <div key={p.name} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-emerald-100 to-sky-100" />
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
    { name: 'Intro Session', price: 'Free', features: ['15-min care consult', 'Needs assessment', 'Program recommendation'], cta: 'Book now' },
    { name: 'Therapy', price: '₹1,999 / session', features: ['50-min session', 'Personalised plan', 'Progress tracking'], cta: 'Schedule' },
    { name: 'Programs', price: 'From ₹999 / month', features: ['Self-paced lessons', 'Tools & trackers', 'Coach check-ins'], cta: 'Start program' },
  ]
  return (
    <section id="pricing" className="py-16 bg-emerald-50/60">
      <Container>
        <SectionTitle eyebrow="Pricing" title="Simple, transparent pricing" subtitle="Use us for a one-off consult or ongoing care. No hidden fees." />
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t)=> (
            <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col">
              <div className="text-sm font-semibold text-emerald-700">{t.name}</div>
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
    { quote: 'I felt heard and supported from day one. The tools helped between sessions.', name: 'A., Bengaluru' },
    { quote: 'Matched with the right therapist in a day. Huge difference in my anxiety.', name: 'S., Mumbai' },
    { quote: 'Our teen is calmer and more confident. The parent tips were priceless.', name: 'R., Pune' },
  ]
  return (
    <section className="py-16 bg-white">
      <Container>
        <SectionTitle eyebrow="Stories" title="What our clients say" />
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
    { q: 'How do I get matched with a therapist?', a: 'Answer a few questions and our team matches you based on your needs and preferences.' },
    { q: 'Is it confidential?', a: 'Yes. Your information and sessions are kept strictly confidential and secure.' },
    { q: 'Do you offer support for teens?', a: 'Yes. We provide specialised teen therapy and parent guidance programs.' },
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
        <SectionTitle eyebrow="Get Started" title="Book a free consult" subtitle="Tell us a bit about you and we’ll reach out within 24 hours." />
        <form className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
          <input required placeholder="Full name" className="border border-gray-200 rounded-lg px-3 py-2" />
          <input required placeholder="Email" type="email" className="border border-gray-200 rounded-lg px-3 py-2" />
          <input required placeholder="Phone" className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2" />
          <select className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2">
            <option>What are you seeking help for?</option>
            <option>Anxiety / Stress</option>
            <option>Relationships</option>
            <option>Teen support</option>
            <option>Workplace wellbeing</option>
          </select>
          <textarea rows="4" placeholder="Anything you’d like us to know" className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2" />
          <div className="sm:col-span-2">
            <Button href="mailto:hello@yoursaarthi.com?subject=Consult%20request" variant="primary">Request callback</Button>
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
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">YS</span>
            <span className="font-extrabold">Your Saarthi</span>
          </div>
          <p className="mt-3 text-gray-600">Modern, compassionate mental healthcare for individuals, teens, and families.</p>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li><a href="#programs" className="hover:text-gray-900">Programs</a></li>
            <li><a href="#therapists" className="hover:text-gray-900">Therapists</a></li>
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
      <NavBar />
      <Hero />
      <Programs />
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
