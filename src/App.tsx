import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const cases = [
  { no: '01', name: 'Bio Foam', year: '2024', image: asset('assets/bio.jpg'), desc: '从产品结构到海外货架呈现，建立清晰、有识别度的包装视觉系统。', tags: ['Packaging', 'Global'] },
  { no: '02', name: 'Beyond Cloud', year: '2023', image: asset('assets/poster.jpg'), desc: '以视觉叙事连接主 KV、展板、物料与现场空间体验。', tags: ['Campaign', 'Exhibition'] },
  { no: '03', name: 'Future Beauty', year: '2024', image: asset('assets/details/美妆4.jpg'), desc: '为电商增长打造兼具情绪张力与信息效率的数字内容。', tags: ['E-commerce', 'Visual'] },
  { no: '04', name: 'Tea Reframed', year: '2022', image: asset('assets/packaging/乐叔的茶方案3.jpg'), desc: '将东方茶饮转译为当代、轻盈并适合商业传播的产品形象。', tags: ['Branding', 'Packaging'] },
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

export default function App() {
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState<(typeof cases)[number] | null>(null)
  const [time, setTime] = useState('')

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

  return <div className="hanza-site" id="top">
    <header className="topbar">
      <button className="menu-toggle" onClick={() => setMenu(true)}><Menu /> <span>MENU</span></button>
      <a className="wordmark" href="#top"><i />KIKI’S SPACE</a>
      <div className="clock"><strong>{time}</strong><span>LOCAL TIME / CN</span></div>
      <a className="project-cta" href="#contact"><span>START PROJECT</span><b>/KIKI</b><ArrowRight /></a>
    </header>

    {menu && <div className="menu-panel">
      <button onClick={() => setMenu(false)}><X /> CLOSE</button>
      {['关于 Kiki','作品案例','能力服务','创作流程','联系方式'].map((item, i) => <a key={item} href={['#about','#work','#services','#process','#contact'][i]} onClick={() => setMenu(false)}><small>0{i + 1}</small>{item}<ArrowUpRight /></a>)}
    </div>}

    <main>
      <section className="intro grid-bg">
        <div className="intro-left">
          <p className="overline"><i /> INDEPENDENT AI DESIGNER · GUANGZHOU</p>
          <h1>I turn complex<br />ideas into <em>clear,</em><br />living visuals.</h1>
          <div className="service-list">
            <span><b>/01</b>AI 视觉创作</span><span><b>/02</b>品牌与包装</span><span><b>/03</b>数字营销</span>
          </div>
        </div>
        <div className="intro-feature">
          <video autoPlay muted loop playsInline poster={asset('assets/poster.jpg')}><source src={asset('assets/videos/foldcraft-lab.mp4')} type="video/mp4" /></video>
          <div className="video-tag">AI × DESIGN × MOTION</div>
        </div>
        <div className="trust">
          <div className="avatar-stack"><span>K</span><span>AI</span><span>09</span></div>
          <strong>9 YEARS / 50+ LAUNCHES</strong>
          <p>Trusted visual practice across brand, packaging and global communication.</p>
        </div>
      </section>

      <section className="mission grid-bg" id="about">
        <div className="profile-card">
          <div className="profile-art"><span>K</span><i>AI DESIGNER</i></div>
          <a href="#contact">GET IN TOUCH <b>/KIKI</b><ArrowRight /></a>
          <div className="profile-meta"><strong>KIKI · AMY PENG</strong><p><span>PROFESSION</span>AI & VISUAL DESIGNER</p><p><span>LOCATION</span>GUANGZHOU, CHINA</p></div>
        </div>
        <div className="mission-copy">
          <div className="mini-title"><i /> 01 &nbsp; MY MISSION <span>©2017—2026</span></div>
          <h2>你好，我是 Kiki。我帮助品牌把复杂的产品与想法，转化为<span>清晰、准确、有温度的视觉系统。</span></h2>
          <div className="metric-grid">
            <article><small>01 / EXPERIENCE</small><strong>09+</strong><p>年品牌、包装与视觉设计经验。</p></article>
            <article><small>02 / PACKAGES</small><strong>50+</strong><p>完成并进入市场的量产包装。</p></article>
            <article><small>03 / SERIES</small><strong>20+</strong><p>跨鞋垫、护具、宠物与消费品系列。</p></article>
            <article><small>04 / BRANDS</small><strong>06</strong><p>持续服务的品牌视觉与商业系统。</p></article>
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
        <footer><a href="#top">KIKI’S SPACE</a><span>AI DESIGNER / VISUAL STRATEGIST</span><span>©2026 ALL RIGHTS RESERVED</span></footer>
      </section>
    </main>

    {selected && <div className="case-modal">
      <button onClick={() => setSelected(null)}><X /></button>
      <div className="modal-image"><img src={selected.image} alt={selected.name} /></div>
      <div className="modal-info"><small>{selected.no} / {selected.year}</small><h2>{selected.name}</h2><p>{selected.desc}</p><div>{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><em>完整案例将在下一轮素材整理后展开。</em></div>
    </div>}
  </div>
}
