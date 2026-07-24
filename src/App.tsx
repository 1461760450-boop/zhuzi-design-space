import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Menu, Minus, Plus, X } from 'lucide-react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const nav = [
  ['01', 'ABOUT', '#about'],
  ['02', 'WORK', '#work'],
  ['03', 'SERVICES', '#services'],
  ['04', 'PROCESS', '#process'],
  ['05', 'CONTACT', '#contact'],
]

const projects = [
  ['01', 'PROJECT NAME', 'CATEGORY / 01', '2026', 'PROJECT IMAGE'],
  ['02', 'PROJECT NAME', 'CATEGORY / 02', '2026', 'PROJECT IMAGE'],
  ['03', 'PROJECT NAME', 'CATEGORY / 03', '2026', 'PROJECT VIDEO'],
  ['04', 'PROJECT NAME', 'CATEGORY / 04', '2026', 'PROJECT IMAGE'],
]

const serviceRows = [
  ['01', 'Creative Direction', 'ADD SERVICE DESCRIPTION'],
  ['02', 'AI Visual Design', 'ADD SERVICE DESCRIPTION'],
  ['03', 'Brand & Packaging', 'ADD SERVICE DESCRIPTION'],
  ['04', 'Digital Experience', 'ADD SERVICE DESCRIPTION'],
]

const steps = [
  ['01', 'PLAN', 'ADD PROCESS DESCRIPTION'],
  ['02', 'DEFINE', 'ADD PROCESS DESCRIPTION'],
  ['03', 'DESIGN', 'ADD PROCESS DESCRIPTION'],
  ['04', 'BUILD', 'ADD PROCESS DESCRIPTION'],
  ['05', 'LAUNCH', 'ADD PROCESS DESCRIPTION'],
]

const faqs = [
  ['WHAT DO YOU OFFER?', 'Add your answer here. This module can be replaced with your own service details later.'],
  ['HOW DOES A PROJECT START?', 'Add your answer here. Explain your preferred briefing and collaboration process.'],
  ['WHAT IS THE USUAL TIMELINE?', 'Add your answer here.'],
  ['DO YOU WORK WITH GLOBAL CLIENTS?', 'Add your answer here.'],
]

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [value, setValue] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const animate = (time: number) => {
        const p = Math.min((time - start) / 1100, 1)
        setValue(Math.round(end * (1 - (1 - p) ** 3)))
        if (p < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
      observer.disconnect()
    }, { threshold: .35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [end])
  return <strong ref={ref}>{value}{suffix}</strong>
}

function Placeholder({ label, dark = false }: { label: string; dark?: boolean }) {
  return <div className={`placeholder ${dark ? 'placeholder-dark' : ''}`}>
    <span>{label}</span><i>CONTENT SLOT</i>
  </div>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(0)
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai',
    }).format(new Date()))
    updateTime()
    const timer = window.setInterval(updateTime, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .1, rootMargin: '0px 0px -8% 0px' })
    items.forEach(item => observer.observe(item))

    let frame = 0
    const update = () => {
      frame = 0
      const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1)
      document.documentElement.style.setProperty('--scroll', `${scrollY / max * 100}%`)
      document.documentElement.style.setProperty('--hero-shift', `${Math.min(scrollY / innerHeight, 1)}`)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const float = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width - .5) * 2}`)
    event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height - .5) * 2}`)
  }

  const resetFloat = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--mx', '0')
    event.currentTarget.style.setProperty('--my', '0')
  }

  return <div className="site-shell" id="top">
    <div className="progress" />
    <header className="nav-bar">
      <button className="nav-cell menu-button" onClick={() => setMenuOpen(true)}><Menu /> MENU</button>
      <a className="nav-cell logo" href="#top"><i />KIKI’S SPACE</a>
      <div className="nav-cell time"><b>{time}</b><span>LOCAL TIME / CN</span></div>
      <a className="nav-cell start" href="#contact">START PROJECT <small>/ KIKI</small><ArrowRight /></a>
    </header>

    {menuOpen && <aside className="menu-overlay">
      <button onClick={() => setMenuOpen(false)}><X /> CLOSE</button>
      {nav.map(([no, label, href]) => <a href={href} key={label} onClick={() => setMenuOpen(false)}>
        <small>{no}</small><span>{label}</span><ArrowUpRight />
      </a>)}
    </aside>}

    <main>
      <section className="hero">
        <video autoPlay muted loop playsInline poster={asset('assets/videos/hanza-flower-poster.png')}>
          <source src={asset('assets/videos/hanza-flower.mp4')} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p>ADD YOUR PRIMARY VALUE PROPOSITION HERE.</p>
          <div className="hero-services">
            <span>/01<br />SERVICE ONE</span><span>/02<br />SERVICE TWO</span><span>/03<br />SERVICE THREE</span>
          </div>
        </div>
        <div className="hero-rating"><b>4.92/5</b><span>YOUR TRUST MESSAGE</span></div>
        <h1>KIKI’S SPACE</h1>
      </section>

      <section className="logo-rail">
        {['BRAND 01','BRAND 02','BRAND 03','BRAND 04','BRAND 05','BRAND 06','BRAND 07','BRAND 08'].map((name, i) =>
          <span key={name}><i>{String(i + 1).padStart(2, '0')}</i>{name}</span>)}
      </section>

      <section className="about grid-lines" id="about">
        <aside className="profile" data-reveal>
          <Placeholder label="PORTRAIT" />
          <a href="#contact">GET IN TOUCH <small>/ KIKI</small><ArrowRight /></a>
          <div className="profile-meta"><b>YOUR NAME</b><p><span>PROFESSION</span>YOUR ROLE</p><p><span>LOCATION</span>YOUR CITY</p></div>
        </aside>

        <div className="about-main">
          <div className="eyebrow"><i />01&nbsp;&nbsp; MY MISSION <span>©2026</span></div>
          <h2 data-reveal>HELLO, I’M <em>YOUR NAME.</em> ADD YOUR PERSONAL INTRODUCTION AND DESIGN MISSION HERE.</h2>
          <div className="stats" onPointerMove={float} onPointerLeave={resetFloat}>
            <div>
              <article className="has-accent"><small>01&nbsp; PROJECTS</small><Counter end={0} suffix="+" /><p>ADD SUPPORTING DESCRIPTION</p></article>
              <article><small>02&nbsp; SPECIALISM</small><Counter end={0} suffix="+" /><p>ADD SUPPORTING DESCRIPTION</p></article>
            </div>
            <div className="stats-offset">
              <article className="has-accent"><small>03&nbsp; YEARS</small><Counter end={0} suffix="+" /><p>ADD SUPPORTING DESCRIPTION</p></article>
              <article><small>04&nbsp; CLIENTS</small><Counter end={0} suffix="+" /><p>ADD SUPPORTING DESCRIPTION</p></article>
            </div>
          </div>
          <div className="case-intro" data-reveal><small><i />02&nbsp;&nbsp; PORTFOLIO</small><h3><span>CASE</span><br />STUDIES.</h3><p>EACH PROJECT SHOWS HOW I APPROACH<br />DESIGN, STRUCTURE, AND DEVELOPMENT.</p></div>
        </div>
      </section>

      <section className="work dark-section" id="work">
        <div className="section-title" data-reveal><div><small>02&nbsp;&nbsp; PORTFOLIO</small><h2>SELECTED<br />WORK.</h2></div><p>ADD YOUR PORTFOLIO INTRODUCTION HERE.</p><a href="#projects">ALL PROJECTS <ArrowRight /></a></div>
        <div className="project-list" id="projects">
          {projects.map(([no, name, category, year, label], i) => <article key={no} data-reveal>
            <div className="project-index">{no}</div>
            <div><small>CLIENT</small><h3>{name}</h3></div>
            <div><small>YEAR</small><p>{year}</p></div>
            <Placeholder label={label} dark />
            <div className="project-note"><small>{category}</small><p>ADD PROJECT SUMMARY</p></div>
            <button aria-label={`View ${name}`}><ArrowUpRight /></button>
            {i === 0 && <i className="project-cursor">VIEW<br />PROJECT</i>}
          </article>)}
        </div>
      </section>

      <section className="services grid-lines" id="services">
        <div className="section-title" data-reveal><div><small>03&nbsp;&nbsp; SERVICES</small><h2>WHAT I<br />CREATE.</h2></div><p>ADD YOUR SERVICES INTRODUCTION HERE.</p><a href="#contact">CONTACT <ArrowRight /></a></div>
        <div className="service-list">
          {serviceRows.map(([no, title, desc]) => <article key={no} data-reveal><span>{no}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight /></article>)}
        </div>
      </section>

      <section className="process" id="process">
        <div className="section-title" data-reveal><div><small>04&nbsp;&nbsp; PROCESS</small><h2>5 STEPS<br />TO LAUNCH.</h2></div><p>ADD YOUR PROCESS INTRODUCTION HERE.</p></div>
        <div className="steps">
          {steps.map(([no, title, desc], i) => <article key={no} data-reveal className={i === 3 ? 'step-indent' : ''}><strong>{no}</strong><small>{title}</small><h3>{title}</h3><p>{desc}</p></article>)}
        </div>
      </section>

      <section className="testimonials dark-section">
        <div className="section-title" data-reveal><div><small>05&nbsp;&nbsp; TESTIMONIALS</small><h2>CLIENT<br />STORIES.</h2></div><p>ADD A SHORT INTRODUCTION TO CLIENT FEEDBACK.</p></div>
        <div className="quote-grid">
          <Placeholder label="CLIENT PORTRAIT" dark />
          <blockquote>“ADD A CLIENT TESTIMONIAL HERE. KEEP IT SHORT, SPECIFIC, AND HUMAN.”<footer>CLIENT NAME<br /><span>ROLE / COMPANY</span></footer></blockquote>
        </div>
      </section>

      <section className="results">
        {[['0K','VISITORS'],['0.0M','IMPRESSIONS'],['0%','CONVERSION']].map(([value, label]) => <article key={label} data-reveal><strong>{value}</strong><small>{label}</small><p>ADD RESULT DESCRIPTION</p></article>)}
      </section>

      <section className="feature-case dark-section">
        <div className="feature-copy"><small>06&nbsp;&nbsp; CASE STUDY</small><blockquote>“ADD ONE STRONG PROJECT OUTCOME OR INSIGHT HERE.”</blockquote><div><b>0K</b><span>RESULT ONE</span><b>0%</b><span>RESULT TWO</span></div></div>
        <Placeholder label="FEATURED CASE STUDY VIDEO" dark />
      </section>

      <section className="pricing grid-lines">
        <div className="section-title" data-reveal><div><small>07&nbsp;&nbsp; PRICING</small><h2>DESIGN<br />PACKAGES.</h2></div><p>OPTIONAL MODULE — REPLACE OR REMOVE LATER.</p></div>
        <div className="price-grid">
          {['ESSENTIAL','PREMIUM','CUSTOM'].map((name, i) => <article key={name} data-reveal className={i === 1 ? 'featured-price' : ''}><small>{name}</small><strong>¥—</strong><p>/ PROJECT</p><ul><li>SERVICE ITEM</li><li>SERVICE ITEM</li><li>SERVICE ITEM</li></ul><a href="#contact">GET STARTED <ArrowRight /></a></article>)}
        </div>
      </section>

      <section className="faq">
        <div className="section-title" data-reveal><div><small>08&nbsp;&nbsp; FAQ</small><h2>QUICK<br />ANSWERS.</h2></div><p>EVERYTHING A CLIENT SHOULD KNOW BEFORE STARTING.</p></div>
        <div className="faq-list">{faqs.map(([question, answer], i) => <article key={question} className={faqOpen === i ? 'open' : ''}>
          <button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}><span>{String(i + 1).padStart(2, '0')}</span>{question}{faqOpen === i ? <Minus /> : <Plus />}</button>
          <div><p>{answer}</p></div>
        </article>)}</div>
      </section>

      <section className="journal grid-lines">
        <div className="section-title" data-reveal><div><small>09&nbsp;&nbsp; JOURNAL</small><h2>DESIGN<br />NOTES.</h2></div><p>OPTIONAL ARTICLES OR THINKING MODULE.</p></div>
        <div className="journal-grid">{[1,2,3].map(i => <article key={i} data-reveal><Placeholder label="ARTICLE IMAGE" /><small>DATE&nbsp;&nbsp; / &nbsp;&nbsp;CATEGORY</small><h3>ADD ARTICLE TITLE</h3><a href="#contact">READ ARTICLE <ArrowUpRight /></a></article>)}</div>
      </section>

      <section className="contact dark-section" id="contact">
        <small>10&nbsp;&nbsp; CONTACT</small>
        <h2>LET’S MAKE<br />SOMETHING <em>ALIVE.</em></h2>
        <div className="contact-links"><a href="mailto:hello@example.com"><span>EMAIL</span>HELLO@EXAMPLE.COM<ArrowUpRight /></a><a href="#top"><span>SOCIAL</span>ADD SOCIAL LINK<ArrowUpRight /></a></div>
        <footer><b>KIKI’S SPACE</b><span>AI DESIGNER / CREATIVE PRACTICE</span><span>©2026</span></footer>
      </section>
    </main>
  </div>
}
