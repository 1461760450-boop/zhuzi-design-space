import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const works = [
  {
    no: '01', client: 'BRAND SYSTEM', title: 'Four Brands, One System', year: '2026',
    image: asset('assets/bio.jpg'), type: 'BRAND / VISUAL SYSTEM',
    text: '负责 4 个品牌与约 10 个产品系列的视觉建设与维护，让多品牌资产保持清晰、一致与可持续延展。',
  },
  {
    no: '02', client: 'PACKAGING', title: 'From Concept to Shelf', year: '2025',
    image: asset('assets/packaging/乐叔的茶方案3.jpg'), type: 'PACKAGING / COMMERCE',
    text: '覆盖建模、效果图、刀模、材质、专色、UV、打样及印刷跟进，累计推动近 50 款包装进入量产。',
  },
  {
    no: '03', client: 'GLOBAL CAMPAIGN', title: 'Across Markets', year: '2025',
    image: asset('assets/poster.jpg'), type: 'CAMPAIGN / EXHIBITION',
    text: '为国际展会、LinkedIn、YouTube 与 Facebook 建立统一的视觉传播体验。',
  },
  {
    no: '04', client: 'B2B DIGITAL', title: 'Built for Growth', year: '2026',
    image: asset('assets/details/美妆4.jpg'), type: 'WEB / GOOGLE ADS',
    text: '独立统筹英文 B2B 网站从需求分析、服务商筛选、设计开发到上线运营的完整流程。',
  },
]

const capabilities = [
  ['01', '品牌视觉系统', '品牌 VI、多产品线统一、规范制定与视觉资产管理。'],
  ['02', '包装商业化', '从概念、建模、打样到量产落地与供应链协作。'],
  ['03', '数字营销设计', 'B2B 官网、Google Ads、落地页与电商视觉。'],
  ['04', '海外品牌传播', '国际展会、英文宣传片与海外社交媒体内容。'],
]

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const node = useRef<HTMLElement>(null)
  const [value, setValue] = useState(0)
  useEffect(() => {
    const el = node.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const started = performance.now()
      const frame = (time: number) => {
        const progress = Math.min((time - started) / 1000, 1)
        setValue(Math.round(end * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
      io.disconnect()
    }, { threshold: .4 })
    io.observe(el)
    return () => io.disconnect()
  }, [end])
  return <strong ref={node}>{String(value).padStart(end < 10 ? 2 : 1, '0')}{suffix}</strong>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai',
    }).format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu])

  useEffect(() => {
    const reveal = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' })
    reveal.forEach(el => observer.observe(el))

    let raf = 0
    const update = () => {
      raf = 0
      const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1)
      document.documentElement.style.setProperty('--page', `${scrollY / max * 100}%`)
      document.documentElement.style.setProperty('--hero', `${Math.min(scrollY / innerHeight, 1)}`)
    }
    const scroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', scroll, { passive: true })
    return () => {
      observer.disconnect()
      removeEventListener('scroll', scroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const pointer = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width - .5) * 2}`)
    event.currentTarget.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height - .5) * 2}`)
  }

  const reset = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--x', '0')
    event.currentTarget.style.setProperty('--y', '0')
  }

  return <div className="zhuzi" id="top">
    <div className="page-progress" />
    <header className="header">
      <button onClick={() => setMenu(true)}><Menu /> MENU</button>
      <a className="brand" href="#top"><i />竹子®</a>
      <div className="local-time"><b>{time}</b><span>LOCAL TIME / CN</span></div>
      <a className="start-project" href="#contact">START PROJECT <small>/ ZHUZI</small><ArrowRight /></a>
    </header>

    {menu && <nav className="overlay-menu">
      <button onClick={() => setMenu(false)}><X /> CLOSE</button>
      {[
        ['01', '角色介绍', '#about'], ['02', '作品案例', '#work'],
        ['03', '互动体验', '#experience'], ['04', '联系方式', '#contact'],
      ].map(([no, label, href]) => <a href={href} key={no} onClick={() => setMenu(false)}>
        <small>{no}</small><span>{label}</span><ArrowUpRight />
      </a>)}
    </nav>}

    <main>
      <section className="hero">
        <video autoPlay muted loop playsInline poster={asset('assets/videos/hanza-flower-poster.png')}>
          <source src={asset('assets/videos/hanza-flower.mp4')} type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-statement">
          <p>I TURN COMPLEX PRODUCTS<br />INTO CLEAR, LIVING VISUALS.</p>
          <div><span>/01&nbsp; BRAND SYSTEM</span><span>/02&nbsp; PACKAGING</span><span>/03&nbsp; GLOBAL COMMUNICATION</span></div>
        </div>
        <p className="hero-role">VISUAL DESIGNER · GUANGZHOU</p>
        <div className="hero-proof"><b>09+</b><span>YEARS OF<br />VISUAL PRACTICE</span></div>
        <h1>竹子®</h1>
      </section>

      <section className="brand-strip">
        {['BRAND SYSTEM', 'PACKAGING', 'B2B WEBSITE', 'GOOGLE ADS', 'GLOBAL EXPO', 'SOCIAL MEDIA', 'MOTION', 'AIGC'].map((item, i) =>
          <span key={item}><i>{String(i + 1).padStart(2, '0')}</i>{item}</span>)}
      </section>

      <section className="about grid" id="about">
        <aside className="profile-card" data-reveal>
          <div className="portrait"><span>PORTRAIT</span><i>COMING SOON</i></div>
          <a href="#contact">GET IN TOUCH <small>/ ZHUZI</small><ArrowRight /></a>
          <div className="profile-meta">
            <b>竹子 · 彭著娟 AMY</b>
            <p><span>PROFESSION</span>VISUAL DESIGNER</p>
            <p><span>LOCATION</span>GUANGZHOU, CHINA</p>
          </div>
        </aside>

        <div className="about-content">
          <div className="label"><i />01&nbsp;&nbsp; MY MISSION <span>©2017-2026</span></div>
          <h2 data-reveal>你好，我是竹子。我帮助品牌把复杂的产品与想法，转化为<span>清晰、准确、有温度的视觉系统。</span></h2>
          <div className="metrics" onPointerMove={pointer} onPointerLeave={reset}>
            <div>
              <article className="metric-accent"><small>01 / PACKAGES</small><Counter end={50} suffix="+" /><p>完成并推动进入市场的量产包装。</p></article>
              <article><small>03 / EXPERIENCE</small><Counter end={9} suffix="+" /><p>品牌、包装、数字营销与海外传播经验。</p></article>
            </div>
            <div className="metric-right">
              <article className="metric-accent"><small>02 / PRODUCT SERIES</small><Counter end={20} suffix="+" /><p>覆盖鞋垫、护具、宠物与消费品系列。</p></article>
              <article><small>04 / BRANDS</small><Counter end={6} /><p>参与建设与维护的品牌视觉系统。</p></article>
            </div>
          </div>
          <div className="work-lead" data-reveal><small><i />02&nbsp;&nbsp; PORTFOLIO</small><h3><span>CASE</span><br />STUDIES.</h3><p>STRATEGY, SYSTEM AND<br />COMMERCIAL DELIVERY.</p></div>
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-heading" data-reveal>
          <div><small>02&nbsp;&nbsp; PORTFOLIO</small><h2>SELECTED<br />WORK.</h2></div>
          <p>从品牌系统与包装量产，到 B2B 网站、数字营销和全球传播，设计最终要进入真实商业场景。</p>
        </div>
        <div className="work-list">
          {works.map(work => <article key={work.no} data-reveal>
            <span className="work-no">{work.no}</span>
            <div className="work-name"><small>CLIENT / FIELD</small><h3>{work.title}</h3><p>{work.client}</p></div>
            <div className="work-year"><small>YEAR</small><b>{work.year}</b></div>
            <div className="work-image"><img src={work.image} alt={work.title} loading="lazy" /><i>VIEW PROJECT</i></div>
            <div className="work-copy"><small>{work.type}</small><p>{work.text}</p></div>
            <button aria-label={`查看 ${work.title}`}><ArrowUpRight /></button>
          </article>)}
        </div>
      </section>

      <section className="capabilities grid">
        <div className="section-heading" data-reveal>
          <div><small>03&nbsp;&nbsp; CAPABILITIES</small><h2>WHAT I<br />CREATE.</h2></div>
          <p>将品牌策略、视觉表达、制作工艺与传播渠道连接成完整的设计结果。</p>
        </div>
        <div className="capability-list">
          {capabilities.map(([no, name, text]) => <article key={no} data-reveal><span>{no}</span><h3>{name}</h3><p>{text}</p><ArrowUpRight /></article>)}
        </div>
      </section>

      <section className="experience" id="experience" onPointerMove={pointer} onPointerLeave={reset}>
        <div className="experience-copy" data-reveal><small>04&nbsp;&nbsp; INTERACTIVE EXPERIENCE</small><h2>MOVE.<br /><em>FEEL.</em><br />DISCOVER.</h2><p>移动鼠标，感受视觉元素在秩序与变化之间产生呼吸。后续这里会承载 AI 视觉实验、动态海报和交互作品。</p></div>
        <div className="experience-stage">
          <div className="ring ring-a" /><div className="ring ring-b" />
          <div className="satellite s-one">BRAND</div><div className="satellite s-two">MOTION</div><div className="satellite s-three">AIGC</div>
          <div className="core"><b>竹</b><span>MOVE YOUR CURSOR</span></div>
        </div>
      </section>

      <section className="contact" id="contact">
        <small>05&nbsp;&nbsp; CONTACT</small>
        <h2>LET’S MAKE<br />SOMETHING <em>ALIVE.</em></h2>
        <div className="contact-links">
          <a href="mailto:1461760450@qq.com"><span>EMAIL</span>1461760450@qq.com<ArrowUpRight /></a>
          <a href="tel:+8615700715232"><span>PHONE / WECHAT</span>+86 157 0071 5232<ArrowUpRight /></a>
        </div>
        <footer><a href="#top">竹子®</a><span>VISUAL DESIGNER / BRAND & COMMUNICATION</span><span>©2026 ALL RIGHTS RESERVED</span></footer>
      </section>
    </main>
  </div>
}
