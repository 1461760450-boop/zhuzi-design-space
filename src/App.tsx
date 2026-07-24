import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowDownRight, ArrowUpRight, Mail, Menu, Phone, Sparkles, X } from 'lucide-react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const works = [
  { no: '01', type: 'BRAND / PACKAGING', title: 'Warm Ritual', note: '品牌包装与视觉系统', image: asset('assets/packaging/礼盒.jpg'), tone: 'light' },
  { no: '02', type: 'EXHIBITION / KV', title: 'Beyond Cloud', note: '展会主视觉与空间延展', image: asset('assets/poster.jpg'), tone: 'dark' },
  { no: '03', type: 'COMMERCE / DIGITAL', title: 'Future Beauty', note: '电商内容与数字营销', image: asset('assets/details/美妆4.jpg'), tone: 'light' },
  { no: '04', type: 'IDENTITY / OBJECT', title: 'Tea, Reframed', note: '产品概念与商业化设计', image: asset('assets/packaging/乐叔的茶方案3.jpg'), tone: 'warm' },
]

function MagneticOrb() {
  const ref = useRef<HTMLDivElement>(null)
  const [point, setPoint] = useState({ x: 50, y: 50 })
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPoint({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })
  }
  return (
    <div className="playground" ref={ref} onPointerMove={move} onPointerLeave={() => setPoint({ x: 50, y: 50 })}>
      <div className="play-grid" />
      <div className="orb-glow" style={{ left: `${point.x}%`, top: `${point.y}%` }} />
      <div className="orb" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
        <span>KIKI</span><i>AI</i>
      </div>
      <p>移动光标<br />改变创意引力场</p>
    </div>
  )
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState<(typeof works)[number] | null>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }).format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selected || menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, menu])

  const closeMenu = () => setMenu(false)

  return (
    <div className="site" id="top">
      <header className="nav">
        <a href="#top" className="logo" aria-label="kiki's space 首页">
          <span className="logo-dot" />kiki’s space
        </a>
        <nav className={menu ? 'nav-links open' : 'nav-links'}>
          <button className="mobile-close" onClick={closeMenu} aria-label="关闭菜单"><X /></button>
          <a href="#about" onClick={closeMenu}>角色介绍 <small>01</small></a>
          <a href="#works" onClick={closeMenu}>作品案例 <small>02</small></a>
          <a href="#play" onClick={closeMenu}>互动体验 <small>03</small></a>
          <a href="#contact" onClick={closeMenu}>联系方式 <small>04</small></a>
        </nav>
        <div className="nav-status"><span>CN · {time}</span><i />AVAILABLE</div>
        <button className="mobile-menu" onClick={() => setMenu(true)} aria-label="打开菜单"><Menu /></button>
      </header>

      <main>
        <section className="hero">
          <video autoPlay muted loop playsInline preload="metadata" poster={asset('assets/poster.jpg')}>
            <source src={asset('assets/videos/foldcraft-lab.mp4')} type="video/mp4" />
          </video>
          <div className="hero-shade" />
          <div className="hero-copy max">
            <div className="hero-kicker"><Sparkles /> AI DESIGNER · VISUAL STRATEGIST</div>
            <h1><span>Ideas into</span><br /><em>living</em> visuals.</h1>
            <div className="hero-foot">
              <p>让想象不只停留在屏幕。<br />融合 AI、策略与视觉，创造有生命力的品牌体验。</p>
              <a href="#works" className="round-link">VIEW WORKS <ArrowDownRight /></a>
            </div>
          </div>
          <div className="hero-index">PORTFOLIO · 2026</div>
        </section>

        <section className="about max" id="about">
          <div className="section-label"><span>01</span> ROLE / ABOUT</div>
          <div className="about-grid">
            <h2>I’m Kiki.<br />AI 设计师，<br /><span>也是视觉问题的解题者。</span></h2>
            <div className="about-copy">
              <p>拥有近 9 年品牌与视觉设计经验，从品牌系统、产品商业化到海外市场传播，我擅长把复杂需求转化为清晰、准确且富有情绪的视觉语言。</p>
              <p>现在，我将 AIGC 融入完整的设计流程：更快探索，更深表达，也让每一个创意拥有新的生长方式。</p>
              <div className="stats">
                <div><strong>09</strong><span>YEARS<br />EXPERIENCE</span></div>
                <div><strong>50+</strong><span>PACKAGES<br />LAUNCHED</span></div>
                <div><strong>20+</strong><span>PRODUCT<br />SERIES</span></div>
              </div>
            </div>
          </div>
          <div className="capability-strip">
            {['AIGC VISUAL', 'BRAND SYSTEM', 'PACKAGING', '3D & MOTION', 'GLOBAL CAMPAIGN'].map(x => <span key={x}>{x}<i>✦</i></span>)}
          </div>
        </section>

        <section className="work-section" id="works">
          <div className="max">
            <div className="section-label light"><span>02</span> SELECTED WORKS</div>
            <div className="works-title"><h2>Selected<br /><em>experiments.</em></h2><p>品牌、影像、海报与数字体验。<br />每个项目都是一次新的视觉实验。</p></div>
            <div className="work-grid">
              {works.map((work, index) => (
                <button className={`work-card ${index % 3 === 0 ? 'wide' : ''}`} key={work.title} onClick={() => setSelected(work)}>
                  <div className="work-image"><img src={work.image} alt={work.title} loading={index > 1 ? 'lazy' : 'eager'} /><span>VIEW CASE <ArrowUpRight /></span></div>
                  <div className="work-meta"><small>{work.no} — {work.type}</small><h3>{work.title}</h3><p>{work.note}</p></div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="play-section max" id="play">
          <div className="section-label"><span>03</span> INTERACTIVE / LAB</div>
          <div className="play-heading"><h2>Move.<br />Feel.<br /><em>Imagine.</em></h2><p>创意不是静态答案。<br />试着移动光标，与 Kiki 的数字分身产生连接。</p></div>
          <MagneticOrb />
        </section>

        <section className="contact" id="contact">
          <div className="max">
            <div className="section-label light"><span>04</span> CONTACT / NEXT</div>
            <p className="contact-kicker">HAVE A PROJECT IN MIND?</p>
            <h2>Let’s make<br />something <em>alive.</em></h2>
            <div className="contact-links">
              <a href="mailto:1461760450@qq.com"><Mail /> <span>EMAIL</span><strong>1461760450@qq.com</strong><ArrowUpRight /></a>
              <a href="tel:+8615700715232"><Phone /> <span>PHONE / WECHAT</span><strong>+86 157 0071 5232</strong><ArrowUpRight /></a>
            </div>
            <footer><a href="#top">kiki’s space</a><span>AI DESIGNER · GUANGZHOU</span><span>© 2026 ALL RIGHTS RESERVED</span></footer>
          </div>
        </section>
      </main>

      {selected && <div className="modal" role="dialog" aria-modal="true" aria-label={selected.title}>
        <button className="modal-close" onClick={() => setSelected(null)} aria-label="关闭"><X /></button>
        <div className="modal-visual"><img src={selected.image} alt={selected.title} /></div>
        <div className="modal-copy"><small>{selected.type}</small><h2>{selected.title}</h2><p>{selected.note}</p><span>完整项目内容将在下一版素材补充后展开。</span></div>
      </div>}
    </div>
  )
}
