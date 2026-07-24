import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const cases = [
  { no: '01', name: 'Bio Foam 3.0', year: '2024', image: asset('assets/bio.jpg'), desc: '围绕环保材料与全天候舒适卖点，重构 Dr. Scholl’s Bio Foam 鞋垫包装的信息层级、结构展示与海外货架识别。', tags: ['Packaging System', 'Commercialization'] },
  { no: '02', name: 'TRÀII Golf Series', year: '2024', image: asset('assets/pack-gift.jpg'), desc: '从高尔夫鞋垫产品定位出发，统一礼盒结构、视觉语言、功能图标与双语信息，形成可量产的系列包装方案。', tags: ['Product Series', 'Packaging'] },
  { no: '03', name: 'FOTANIKAL Global Expo', year: '2025', image: asset('assets/booth.jpg'), desc: '为海外宠物展建立主视觉与传播物料体系，覆盖展板、产品信息、现场物料和社交媒体内容，保持跨场景表达一致。', tags: ['Global Campaign', 'Exhibition'] },
  { no: '04', name: 'Found Fair Digital Growth', year: '2026', image: asset('assets/web-brand.jpg'), desc: '围绕宠物用品海外获客，完成英文 B2B 网站、产品视觉与 Google Ads 素材协同，连接品牌表达、产品信息与询盘转化。', tags: ['B2B Website', 'Digital Marketing'] },
]

const skills = [
  ['01', 'AI Visual Creation', '使用 AIGC 完成概念探索、视觉生成与内容迭代，让创意拥有更宽的可能性。'],
  ['02', 'Brand Systems', '从品牌 VI 到多产品线规范，构建清晰、统一且可持续生长的视觉资产。'],
  ['03', 'Packaging & Commerce', '连接概念、打样、印刷与量产，让设计真正进入市场并产生商业价值。'],
  ['04', 'Global Communication', '服务海外官网、展会与社交媒体，让品牌在不同语境中保持准确表达。'],
]

const process = [
  ['01', 'Listen', '需求洞察', '理解品牌、受众、渠道与真正需要解决的问题。'],
  ['02', 'Define', '策略定义', '梳理信息层级、视觉方向和可执行的创意边界。'],
  ['03', 'Explore', 'AI 共创', '用 AIGC 与传统设计方法并行探索，快速验证可能性。'],
  ['04', 'Craft', '视觉落地', '完成系统设计、动效、打样与跨媒介延展。'],
  ['05', 'Launch', '交付上线', '跟进制作与上线，并让设计在真实场景中持续生长。'],
]

function MissionStatement() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(0)
  const phrases = ['你好，', '我是 ZHUZI。', '我帮助品牌', '把复杂的', '产品与想法，', '转化为', '清晰、', '准确、', '有温度的', '视觉系统。']
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .78 - rect.top) / (window.innerHeight * .58)))
      setActive(Math.ceil(progress * phrases.length))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])
  return <h2 className="mission-statement" ref={ref}>{phrases.map((phrase, index) => <span className={index < active ? 'lit' : ''} key={phrase}>{phrase}</span>)}</h2>
}

function CountUp({ value, suffix = '' }: { value: number, suffix?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const duration = 1100
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.disconnect()
    }, { threshold: .45 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])
  return <strong ref={ref}>{String(display).padStart(value < 10 ? 2 : 1, '0')}{suffix}</strong>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState<(typeof cases)[number] | null>(null)
  const [time, setTime] = useState('')

  const floatMetrics = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    event.currentTarget.style.setProperty('--metric-x', x.toFixed(3))
    event.currentTarget.style.setProperty('--metric-y', y.toFixed(3))
  }

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }).format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu || selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu, selected])

  useEffect(() => {
    const root = document.documentElement
    const animated = document.querySelectorAll('.section-head, .profile-card, .mission-copy, .metric-grid article, .case-row, .skill-list article, .process-grid article, .contact-row')
    animated.forEach((element, index) => {
      element.classList.add('scroll-reveal')
      ;(element as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 65}ms`)
    })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' })
    animated.forEach(element => observer.observe(element))

    let frame = 0
    const updateScroll = () => {
      frame = 0
      const y = window.scrollY
      const heroProgress = Math.min(y / Math.max(window.innerHeight, 1), 1)
      root.style.setProperty('--hero-scroll', heroProgress.toFixed(4))
      root.style.setProperty('--page-progress', `${Math.min(y / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1) * 100}%`)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll)
    }
    updateScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="hanza-site" id="top">
    <div className="scroll-progress" aria-hidden="true" />
    <header className="topbar">
      <button className="menu-toggle" onClick={() => setMenu(true)}><Menu /> <span>MENU</span></button>
      <a className="wordmark" href="#top"><i />ZHUZI’S SPACE</a>
      <div className="clock"><strong>{time}</strong><span>LOCAL TIME / CN</span></div>
      <a className="project-cta" href="#contact"><span>START PROJECT</span><b>/ZHUZI</b><ArrowRight /></a>
    </header>

    {menu && <div className="menu-panel">
      <button onClick={() => setMenu(false)}><X /> CLOSE</button>
      {['关于 ZHUZI','作品案例','能力服务','创作流程','联系方式'].map((item, i) => <a key={item} href={['#about','#work','#services','#process','#contact'][i]} onClick={() => setMenu(false)}><small>0{i + 1}</small>{item}<ArrowUpRight /></a>)}
    </div>}

    <main>
      <section className="intro">
        <video className="intro-video" autoPlay muted loop playsInline preload="auto" poster={asset('assets/videos/hanza-flower-poster.png')}><source src={asset('assets/videos/hanza-flower.mp4')} type="video/mp4" /></video>
        <div className="intro-shade" />
        <div className="intro-center">
          <p>I HELP BRANDS TURN COMPLEX<br />IDEAS INTO CLEAR, LIVING VISUALS.</p>
          <div><span>/01&nbsp; AI VISUAL DESIGN</span><span>/02&nbsp; BRAND & PACKAGING</span><span>/03&nbsp; GLOBAL CAMPAIGN</span></div>
        </div>
        <div className="trust">
          <div className="avatar-stack"><span>K</span><span>AI</span><span>09</span><span>+</span></div>
          <div><strong>9 YEARS / 50+ LAUNCHES</strong><p>BRAND, PACKAGING & GLOBAL COMMUNICATION</p></div>
        </div>
        <p className="hero-side-note">INDEPENDENT AI DESIGNER · GUANGZHOU</p>
        <h1 className="hero-brand">ZHUZI’S<br />SPACE</h1>
      </section>

      <section className="mission grid-bg" id="about">
        <div className="profile-card">
          <div className="profile-art profile-placeholder"><span>PORTRAIT</span><i>COMING SOON</i></div>
          <a href="#contact">GET IN TOUCH <b>/ZHUZI</b><ArrowRight /></a>
          <div className="profile-meta"><strong>ZHUZI · AMY PENG</strong><p><span>PROFESSION</span>AI & VISUAL DESIGNER</p><p><span>LOCATION</span>GUANGZHOU, CHINA</p></div>
        </div>
        <div className="mission-copy">
          <div className="mini-title"><i /> 01 &nbsp; MY MISSION <span>©2017—2026</span></div>
          <MissionStatement />
          <div className="metric-grid" onPointerMove={floatMetrics} onPointerLeave={event => {
            event.currentTarget.style.setProperty('--metric-x', '0')
            event.currentTarget.style.setProperty('--metric-y', '0')
          }}>
            <article><div className="metric-inner"><small>01 / EXPERIENCE</small><CountUp value={9} suffix="+" /><p>品牌、包装、数字营销与海外传播经验。</p></div></article>
            <article><div className="metric-inner"><small>02 / PACKAGES</small><CountUp value={50} suffix="+" /><p>完成并推动进入市场的量产包装。</p></div></article>
            <article><div className="metric-inner"><small>03 / PRODUCT SERIES</small><CountUp value={20} suffix="+" /><p>覆盖鞋垫、护具、宠物与消费品系列。</p></div></article>
            <article><div className="metric-inner"><small>04 / BRANDS</small><CountUp value={6} /><p>参与建设与维护的品牌视觉系统。</p></div></article>
          </div>
        </div>
      </section>

      <section className="cases" id="work">
        <div className="section-head">
          <div><small>02 &nbsp; PORTFOLIO</small><h2>Case Studies.</h2></div>
          <p>每个项目都展示我如何在策略、创意、制作与商业目标之间建立连接。</p>
          <button onClick={() => document.querySelector('.case-row')?.scrollIntoView({ behavior: 'smooth' })}>ALL PROJECTS <ArrowRight /></button>
        </div>
        <div className="case-list">
          {cases.map(item => <button className="case-row" key={item.name} onClick={() => setSelected(item)}>
            <span className="case-no">{item.no}</span>
            <span><small>PROJECT</small><strong>{item.name}</strong></span>
            <span><small>YEAR</small>{item.year}</span>
            <div className="case-image"><img src={item.image} alt={item.name} loading="lazy" /><i>VIEW PROJECT</i></div>
            <p>{item.desc}</p>
            <div className="case-tags">{item.tags.map(tag => <em key={tag}>{tag}</em>)}</div>
          </button>)}
        </div>
      </section>

      <section className="services grid-bg" id="services">
        <div className="section-head">
          <div><small>03 &nbsp; SERVICES</small><h2>What I Create.</h2></div>
          <p>从第一张概念草图到量产与上线，建立兼具创意张力和落地能力的完整设计体验。</p>
        </div>
        <div className="skill-list">{skills.map(([no,title,desc]) => <article key={no}><span>{no}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight /></article>)}</div>
      </section>

      <section className="process" id="process">
        <div className="section-head">
          <div><small>04 &nbsp; PROCESS</small><h2>5 Steps to Launch.</h2></div>
          <p>让过程保持简单透明：理解、定义、探索、落地、发布。</p>
        </div>
        <div className="process-grid">{process.map(([no,en,cn,text]) => <article key={no}><strong>{no}</strong><small>{en}</small><h3>{cn}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="contact" id="contact">
        <small>05 &nbsp; CONTACT</small>
        <h2>Ready to make<br />something <em>alive?</em></h2>
        <div className="contact-row">
          <div><span>EMAIL</span><a href="mailto:1461760450@qq.com">1461760450@qq.com <ArrowUpRight /></a></div>
          <div><span>PHONE / WECHAT</span><a href="tel:+8615700715232">+86 157 0071 5232 <ArrowUpRight /></a></div>
        </div>
        <footer><a href="#top">ZHUZI’S SPACE</a><span>AI DESIGNER / VISUAL STRATEGIST</span><span>©2026 ALL RIGHTS RESERVED</span></footer>
      </section>
    </main>

    {selected && <div className="case-modal">
      <button onClick={() => setSelected(null)}><X /></button>
      <div className="modal-image"><img src={selected.image} alt={selected.name} /></div>
      <div className="modal-info"><small>{selected.no} / {selected.year}</small><h2>{selected.name}</h2><p>{selected.desc}</p><div>{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><em>完整案例将在下一轮素材整理后展开。</em></div>
    </div>}
  </div>
}
