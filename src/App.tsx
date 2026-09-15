import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import archiveData from './archive.generated.json'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const cases = [
  { no: '01', name: 'MS.DORYA Body Wipe', year: '2026', image: asset('assets/cases/ms-dorya/packaging-hero.png'), desc: '为身体清洁湿巾建立兼具清爽感、功能识别与货架冲击力的包装视觉，让产品卖点在第一眼被准确理解。', tags: ['Packaging', 'Visual Identity'] },
  { no: '02', name: 'TRÀII Golf Series', year: '2024', image: asset('assets/pack-gift.jpg'), desc: '从高尔夫鞋垫产品定位出发，统一礼盒结构、视觉语言、功能图标与双语信息，形成可量产的系列包装方案。', tags: ['Product Series', 'Packaging'] },
  { no: '03', name: 'FOTANIKAL Global Expo', year: '2025', image: asset('assets/booth.jpg'), desc: '为海外宠物展建立主视觉与传播物料体系，覆盖展板、产品信息、现场物料和社交媒体内容，保持跨场景表达一致。', tags: ['Global Campaign', 'Exhibition'] },
  { no: '04', name: 'Found Fair Digital Growth', year: '2026', image: asset('assets/web-brand.jpg'), desc: '围绕宠物用品海外获客，完成英文 B2B 网站、产品视觉与 Google Ads 素材协同，连接品牌表达、产品信息与询盘转化。', tags: ['B2B Website', 'Digital Marketing'] },
]

type ArchiveWork = { id: string, title: string, category: string, type: string, image: string, group: string }
const archiveWorks = archiveData as ArchiveWork[]
const archiveFilters = ['全部', '包装', '画册', '详情页', '网站', '展会', '活动', '宣传dm', 'logo', 'ppt'] as const
const archiveLabels: Record<string, string> = { 宣传dm: '宣传 DM', logo: 'Logo', ppt: 'PPT' }
const archiveLabel = (category: string) => archiveLabels[category] || category

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

function BodyWipeCase({ onClose }: { onClose: () => void }) {
  return <div className="project-case" role="dialog" aria-modal="true" aria-label="MS.DORYA Body Wipe 项目案例">
    <button className="project-case-close" aria-label="关闭项目案例" onClick={onClose}><X /></button>
    <header className="project-case-hero">
      <div className="project-case-nav"><span>ZHUZI’S SPACE</span><span>CASE STUDY · 01</span></div>
      <div className="project-case-title"><p>PACKAGING DESIGN / 2026</p><h2>BODY<br/><em>WIPE.</em></h2></div>
      <img src={asset('assets/cases/ms-dorya/packaging-hero.png')} alt="MS.DORYA 身体清洁湿巾包装正面与开启结构" />
      <div className="project-case-scroll">SCROLL TO EXPLORE <ArrowRight /></div>
    </header>

    <section className="project-case-intro">
      <div><small>01 / PROJECT INTRODUCTION</small><h3>把清洁力，变成<br/>一眼可感知的清爽。</h3></div>
      <div className="project-case-copy">
        <p>MS.DORYA BODY WIPE 是一款为运动、旅行与日常即时清洁设计的身体湿巾。项目需要在有限的包装表面中，同时传达“双面材质、免冲洗、无酒精”三项核心卖点，并建立足够鲜明的货架识别。</p>
        <p>设计以高明度荧光绿作为能量信号，搭配青绿色植物形态与大面积白色留白，在功能感和轻盈感之间取得平衡。视觉节奏从正面延伸至侧面、顶部与背面，让每个接触面都属于同一套品牌语言。</p>
        <dl><div><dt>CLIENT</dt><dd>MS.DORYA</dd></div><div><dt>SCOPE</dt><dd>PACKAGING / VISUAL SYSTEM</dd></div><div><dt>PRODUCT</dt><dd>ALOE VERA BODY WIPE · 20 COUNT</dd></div></dl>
      </div>
    </section>

    <section className="project-case-statement">
      <small>02 / DESIGN CONCEPT</small>
      <p>FRESHNESS<br/>IN <em>MOTION</em></p>
      <span>将芦荟的天然感转译为流动、舒展的抽象图形。图形穿越包装折面，在不同观看角度中保持连续，也让静态纸盒拥有运动中的生命力。</span>
    </section>

    <section className="project-case-visual">
      <div className="project-case-visual-copy"><small>03 / VISUAL LANGUAGE</small><h3>高能量色彩，<br/>清晰的信息层级。</h3><p>黑色粗体产品名承担远距离识别；荧光绿聚焦顶部与核心信息；青绿色植物图形提供天然联想。功能图标、容量与使用说明则以克制的网格组织，保证不同面向都能快速阅读。</p></div>
      <img src={asset('assets/cases/ms-dorya/packaging-structure.png')} alt="包装顶部、侧面与底部结构细节" loading="lazy" />
    </section>

    <section className="project-case-features">
      <article><span>01</span><strong>DUAL-TEXTURE</strong><p>双面材质在主标题下直接呈现，让差异化卖点进入第一阅读层级。</p></article>
      <article><span>02</span><strong>RINSE FREE</strong><p>免冲洗的便捷体验被简化为短句，适应海外零售语境下的快速决策。</p></article>
      <article><span>03</span><strong>ALCOHOL FREE</strong><p>以清晰、克制的功能信息，强化产品温和清洁的使用感知。</p></article>
    </section>

    <section className="project-case-back">
      <img src={asset('assets/cases/ms-dorya/packaging-back.png')} alt="包装背面的使用说明与信息布局" loading="lazy" />
      <div><small>04 / INFORMATION DESIGN</small><h3>从吸引注意，<br/>到建立信任。</h3><p>背面将成分、使用方式、注意事项与联系信息重新分层。标题与正文形成明确的阅读路径，侧边功能图标则延续正面的识别系统，让品牌表达在信息密集区域依然保持秩序。</p></div>
    </section>

    <footer className="project-case-footer"><small>MS.DORYA · BODY WIPE · 2026</small><h3>Clean design.<br/><em>Fresh impact.</em></h3><button onClick={onClose}>BACK TO PROJECTS <ArrowRight /></button></footer>
  </div>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState<(typeof cases)[number] | null>(null)
  const [activeArchiveFilter, setActiveArchiveFilter] = useState<(typeof archiveFilters)[number]>('全部')
  const [archiveSelected, setArchiveSelected] = useState<(typeof archiveWorks)[number] | null>(null)
  const [time, setTime] = useState('')
  const visibleArchiveWorks = activeArchiveFilter === '全部' ? archiveWorks : archiveWorks.filter(item => item.category === activeArchiveFilter)

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
    document.body.style.overflow = menu || selected || archiveSelected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu, selected, archiveSelected])

  useEffect(() => {
    const root = document.documentElement
    const animated = document.querySelectorAll('.section-head, .profile-card, .mission-copy, .metric-grid article, .skill-list article, .process-grid article, .contact-row')
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

        <div className="archive">
          <div className="archive-heading">
            <span>COMPLETE ARCHIVE</span>
            <h3>完整作品档案</h3>
            <strong className="archive-total">{archiveWorks.length} PROJECTS</strong>
          </div>
          <nav className="archive-filters" aria-label="作品分类">
            {archiveFilters.map(filter => <button className={activeArchiveFilter === filter ? 'active' : ''} key={filter} onClick={() => setActiveArchiveFilter(filter)}>
              {archiveLabel(filter)} <small>{filter === '全部' ? archiveWorks.length : archiveWorks.filter(item => item.category === filter).length}</small>
            </button>)}
          </nav>
          <div className="archive-grid">
            {visibleArchiveWorks.map((item, index) => <button className="archive-card" key={item.id} onClick={() => setArchiveSelected(item)}>
              <img src={asset(item.image)} alt={item.title} loading="lazy" />
              <span className="archive-type">{item.type}</span>
              <ArrowUpRight />
              <div className="archive-caption"><small>{archiveLabel(item.category)} / {item.type}</small><strong>{item.title}</strong><em>{String(index + 1).padStart(2, '0')}</em></div>
            </button>)}
          </div>
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

    {selected?.no === '01' && <BodyWipeCase onClose={() => setSelected(null)} />}
    {selected && selected.no !== '01' && <div className="case-modal">
      <button onClick={() => setSelected(null)}><X /></button>
      <div className="modal-image"><img src={selected.image} alt={selected.name} /></div>
      <div className="modal-info"><small>{selected.no} / {selected.year}</small><h2>{selected.name}</h2><p>{selected.desc}</p><div>{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><em>完整案例将在下一轮素材整理后展开。</em></div>
    </div>}
    {archiveSelected && <div className="archive-modal" onClick={() => setArchiveSelected(null)}>
      <button aria-label="关闭作品预览" onClick={() => setArchiveSelected(null)}><X /></button>
      <img src={asset(archiveSelected.image)} alt={archiveSelected.title} onClick={event => event.stopPropagation()} />
      <div><small>{archiveLabel(archiveSelected.category)} / {archiveSelected.type}</small><strong>{archiveSelected.title}</strong></div>
    </div>}
  </div>
}
