import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import archiveData from './archive.generated.json'
import MarqueeSection from './MarqueeSection'
import MouseTrail from './MouseTrail'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const cases = [
  { no: '01', name: 'MS.DORYA Body Wipe', year: '2026', image: asset('assets/cases/ms-dorya/homepage-hero-wide.png'), desc: '为身体清洁湿巾建立兼具清爽感、功能识别与货架冲击力的包装视觉，让产品卖点在第一眼被准确理解。', tags: ['Packaging', 'Visual Identity'] },
  { no: '02', name: 'NewStars Study Brochure', year: '2019', image: asset('assets/cases/study-brochure/cover.jpg'), desc: '为留学教育品牌梳理复杂信息，以清晰的数据图表、院校内容与双语版式构建完整的品牌画册。', tags: ['Editorial Design', 'Brochure'] },
  { no: '03', name: 'QuPet Shanghai Pet Fair', year: '2026', image: asset('assets/cases/shanghai-pet-fair/redesign/hero-angle.jpg'), desc: '围绕宠物玩具 OEM 与 ODM 业务，构建高识别度的绿色展位系统，整合品牌形象、产品陈列、洽谈与多媒体展示。', tags: ['Exhibition', 'Spatial Design'] },
  { no: '04', name: 'Found Fair Materials Website', year: '2026', image: asset('assets/cases/leadfair-website/factory-production-line-hero-fast.jpg'), desc: '为 TPE 材料研发与制造企业构建多语言品牌官网，将复杂的产品参数、应用场景与研发能力转化为清晰可信的数字体验。', tags: ['Website', 'Digital Experience'] },
  { no: '05', name: 'COLORCANDY Product Detail', year: '—', image: asset('assets/cases/colorcandy-detail/full-detail.jpg'), desc: 'COLORCANDY 流雾轻烟蜜粉电商详情页设计。以细腻粉质与柔焦妆感为主线，结合控油测试、防水演示及粉扑、筛网细节，将散粉卖点转化为直观的视觉叙事。', tags: ['Beauty / Loose Powder', 'E-commerce'] },
]

type ArchiveWork = { id: string, title: string, category: string, type: string, image: string, group: string, document?: string, pages?: string[] }
const archiveWorks = (archiveData as ArchiveWork[]).filter(item => item.id !== '002' && item.category !== 'ppt')
const archiveFilters = ['全部', '包装', '画册', '详情页', '网站', '展会', '活动', '宣传dm', 'logo'] as const
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

function EmbeddedBodyWipeCase({ onClose, onOpen, onMore }: { onClose: () => void; onOpen: (work: ArchiveWork) => void; onMore: () => void }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    const timer = window.setInterval(() => {
      const frame = frameRef.current
      const doc = frame?.contentDocument
      if (doc?.querySelector('[data-framer-name="Section Next"]') && !doc.querySelector('.packaging-related')) frame?.dispatchEvent(new Event('load'))
    }, 300)
    return () => window.clearInterval(timer)
  }, [])
  return <div className="embedded-case" role="dialog" aria-modal="true" aria-label="MS.DORYA Body Wipe 项目案例">
    <button className="embedded-case-close" aria-label="关闭项目案例" onClick={onClose}><X /></button>
    <iframe ref={frameRef} title="MS.DORYA Body Wipe 完整案例" src={asset('ms-dory-portfolio-page/index.html')} onLoad={event => {
      const doc = event.currentTarget.contentDocument
      if (!doc || doc.querySelector('.packaging-related')) return
      const style = doc.createElement('style')
      style.textContent = 'footer,.framer-xyo2mx{display:none!important}.packaging-related{padding:64px 4%;background:#111;color:#fff;width:100%;box-sizing:border-box}.packaging-related h2{font:400 40px/1.2 Arial;margin:0 0 12px}.packaging-related p{color:#999;margin-bottom:28px}.packaging-related-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.packaging-related button{padding:0;border:0;border-radius:12px;overflow:hidden;background:#191919;color:white;text-align:left;cursor:pointer}.packaging-related img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}.packaging-related strong{display:block;padding:18px;font:400 16px Arial}@media(max-width:600px){.packaging-related-grid{grid-template-columns:1fr}}'
      doc.head.append(style)
      style.textContent += 'header.framer-repFf{display:none!important}'
      doc.querySelectorAll<HTMLAnchorElement>('[data-framer-name="Section Next"] a').forEach(link => {
        if (!link.textContent?.replace(/\s+/g, ' ').toUpperCase().includes('ALL PROJECTS')) return
        link.href = new URL(asset(''), window.location.href).href
        link.onclick = event => {
          event.preventDefault()
          event.stopPropagation()
          onClose()
          requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
        }
      })
      doc.querySelectorAll('[data-framer-name="Section Next"]').forEach(section => {
      const oldRecommendation = section.children[1]
      if (!oldRecommendation) return
      const next = doc.createElement('div')
      next.className = 'packaging-related'
      const heading = doc.createElement('h2'); heading.textContent = 'More Packaging'
      const subtitle = doc.createElement('p'); subtitle.textContent = '其他包装作品'
      const grid = doc.createElement('div'); grid.className = 'packaging-related-grid'
      archiveWorks.filter(item => item.category === '包装').slice(0, 3).forEach(item => {
        const button = doc.createElement('button')
        const img = doc.createElement('img'); img.src = new URL(asset(item.image), window.location.href).href; img.alt = item.title; img.loading = 'lazy'
        const title = doc.createElement('strong'); title.textContent = item.title
        button.append(img, title); button.onclick = () => onOpen(item); grid.append(button)
      })
      next.append(heading, subtitle, grid)
      const more = doc.createElement('button'); more.textContent = 'View All Packaging / 查看更多包装作品 ↗'
      more.style.cssText = 'display:block;margin:32px auto 0;padding:14px 24px;border:1px solid #666;border-radius:30px'
      more.onclick = onMore; next.append(more)
      oldRecommendation.replaceWith(next)
      })
    }} />
  </div>
}

function StudyBrochureCase({ onClose }: { onClose: () => void }) {
  const pages = Array.from({ length: 26 }, (_, index) => asset(`assets/cases/study-brochure/pages/page-${String(index + 1).padStart(2, '0')}.jpg`))
  return <div className="brochure-case" role="dialog" aria-modal="true" aria-label="留学教育品牌画册项目案例">
    <button className="project-case-close brochure-close" aria-label="关闭项目案例" onClick={onClose}><X /></button>
    <header className="brochure-hero">
      <img src={asset('assets/cases/study-brochure/cover.jpg')} alt="留学教育品牌画册版式总览" />
      <div className="brochure-hero-copy"><small>EDITORIAL DESIGN / 2019</small><h2>STUDY<br/>BROCHURE.</h2><p>将学校、住宿、排名、数据与品牌故事组织成清晰、可信且易于阅读的留学信息系统。</p></div>
    </header>
    <section className="brochure-intro">
      <small>02 / CASE OVERVIEW</small>
      <h3>INFORMATION<br/>WITH DIRECTION.</h3>
      <div className="brochure-intro-copy">
        <strong>PROJECT BRIEF</strong>
        <p>这是一套面向留学咨询场景的品牌画册，内容覆盖机构历程、澳洲院校、住宿、城市生活、费用与安全信息。项目需要把大量专业资料转化为清晰、可信且便于快速查阅的阅读体验。</p>
        <strong>DESIGN APPROACH</strong>
        <p>版式以蓝色作为主视觉线索，结合橙色信息提示建立稳定的品牌识别。通过章节色块、双语标题、数据图表和模块化网格区分信息层级，让读者既能连续阅读，也能快速定位重点。</p>
        <dl><div><dt>SCOPE</dt><dd>EDITORIAL DESIGN / INFORMATION DESIGN</dd></div><div><dt>FORMAT</dt><dd>26-PAGE BRAND BROCHURE</dd></div><div><dt>CONTENT</dt><dd>STUDY / CAMPUS / LIVING / DATA</dd></div></dl>
      </div>
    </section>
    <section className="brochure-pages">
      {pages.map((page, index) => <figure key={page}><img src={page} alt={`留学画册第 ${index + 1} 页`} loading="lazy" /><figcaption>{String(index + 1).padStart(2, '0')}</figcaption></figure>)}
    </section>
    <footer className="brochure-footer"><span>NEWSTARS · STUDY BROCHURE</span><button onClick={onClose}>BACK TO PROJECTS <ArrowRight /></button></footer>
  </div>
}

function PetFairCase({ onClose }: { onClose: () => void }) {
  const render = (name: string) => asset(`assets/cases/shanghai-pet-fair/redesign/${name}`)
  return <div className="fair-case" role="dialog" aria-modal="true" aria-label="QuPet 上海亚宠展项目案例">
    <button className="project-case-close fair-close" aria-label="关闭项目案例" onClick={onClose}><X /></button>
    <header className="fair-hero">
      <img src={render('hero-angle.jpg')} alt="QuPet 上海亚宠展展位整体效果图" />
      <div className="fair-hero-nav"><span>QUPET® / E5M18</span><span>PET FAIR ASIA · SHANGHAI</span></div>
      <div className="fair-hero-copy"><small>EXHIBITION &amp; SPATIAL EXPERIENCE / 2026</small><h2>PET TOYS.<br/><em>MADE VISIBLE.</em></h2><p>把 OEM &amp; ODM 制造能力、宠物玩具品类与商务沟通，压缩进一座 6 × 3 米的高识别度展位。</p></div>
      <div className="fair-hero-index"><span>18 M²</span><small>OPEN BOOTH / THREE FUNCTIONS</small></div>
    </header>
    <section className="fair-intro qpf-intro">
      <small>01 / THE BRIEF</small>
      <h3>让品牌先被看见，<br/>再让能力被理解。</h3>
      <div><p>面对信息密集的亚宠展现场，QuPet 需要的不只是一个绿色展台，而是一套能在远距离建立识别、在近距离完成产品沟通的空间系统。</p><p>设计以 QuPet 品牌绿为主场，用连续拱形陈列、白色悬浮门头和黄色信息线建立节奏；入口接待、产品展示、商务洽谈与屏幕演示各自清晰，又保持在同一条参观动线上。</p><dl><div><dt>LOCATION</dt><dd>SHANGHAI / E5M18</dd></div><div><dt>FOOTPRINT</dt><dd>6000 × 3000 × 4400 MM</dd></div><div><dt>SCOPE</dt><dd>SPACE / DISPLAY / VISUAL SYSTEM</dd></div></dl></div>
    </section>
    <section className="qpf-signature">
      <div className="qpf-section-title"><small>02 / SIGNATURE VIEW</small><h3>一眼识别的<br/>绿色坐标。</h3><p>白色弧形门头从绿色体块中切出，兼顾品牌、OEM &amp; ODM 服务与认证信息；入口保持完全开放，让接待台成为自然的第一触点。</p></div>
      <figure className="qpf-image qpf-image-primary"><img src={render('hero-front.jpg')} alt="QuPet 展位正面效果" loading="lazy"/><figcaption><span>FRONT ELEVATION</span><span>品牌入口 / 产品陈列 / 洽谈</span></figcaption></figure>
      <div className="qpf-duo"><figure className="qpf-image"><img src={render('side-view.jpg')} alt="QuPet 展位侧面入口效果" loading="lazy"/><figcaption><span>SIDE ENTRY</span><span>侧向识别</span></figcaption></figure><figure className="qpf-image"><img src={render('plan-angle-a.jpg')} alt="QuPet 展位俯视效果" loading="lazy"/><figcaption><span>OPEN PLAN</span><span>开放动线</span></figcaption></figure></div>
    </section>
    <section className="qpf-display">
      <div className="qpf-section-title qpf-section-title-light"><small>03 / PRODUCT DISPLAY</small><h3>把产品墙变成<br/>可阅读的目录。</h3><p>四组拱形模块按互动、陪伴与训练场景划分品类。圆形场景图负责快速理解，洞洞板与层板承载样品，黄色描边将高密度陈列组织成连续秩序。</p></div>
      <figure className="qpf-image qpf-display-hero"><img src={render('interior-overview.jpg')} alt="QuPet 宠物玩具分类陈列墙" loading="lazy"/><figcaption><span>PRODUCT CATEGORIES</span><span>场景信息 / 实物样品 / OEM 服务</span></figcaption></figure>
      <div className="qpf-detail-grid"><figure className="qpf-image"><img src={render('display-closeup.jpg')} alt="宠物玩具陈列与洽谈区细节" loading="lazy"/></figure><div className="qpf-display-note"><b>04</b><h4>从浏览，<br/>自然进入洽谈。</h4><p>陈列墙前保留完整浏览距离，两组圆桌位于空间内侧。屏幕和材料展示区提供进一步的制造能力说明，让产品兴趣顺势转化为商务沟通。</p><span>DISPLAY → DEMO → TALK</span></div><figure className="qpf-image"><img src={render('interior-detail.jpg')} alt="产品墙与屏幕演示区细节" loading="lazy"/></figure></div>
    </section>
    <section className="qpf-system">
      <div className="qpf-section-title"><small>04 / SPATIAL SYSTEM</small><h3>18 平方米里的<br/>三层信息。</h3><p>顶部解决远距离识别，中部承担品牌与产品沟通，低位完成实物触达。6000 × 3000 mm 的开放平面将接待台靠近入口，洽谈区后置，避免动线互相干扰。</p></div>
      <div className="qpf-system-grid"><figure className="qpf-image qpf-system-main"><img src={render('floor-plan.jpg')} alt="QuPet 展位平面功能与尺寸图" loading="lazy"/><figcaption><span>PLAN / 6000 × 3000 MM</span><span>接待 / 展示 / 洽谈</span></figcaption></figure><figure className="qpf-image"><img src={render('dimensions.jpg')} alt="QuPet 展位立体尺寸图" loading="lazy"/><figcaption><span>HEIGHT / 4400 MM</span><span>工程尺寸</span></figcaption></figure></div>
      <div className="qpf-tech-strip"><figure className="qpf-image"><img src={render('lighting-material.jpg')} alt="展位材质和发光标识说明" loading="lazy"/><figcaption>LIGHTING / 发光字与灯箱</figcaption></figure><figure className="qpf-image"><img src={render('screen-material.jpg')} alt="展位屏幕与材质标注" loading="lazy"/><figcaption>MATERIAL / 贴纸、发光字与电视</figcaption></figure><figure className="qpf-image"><img src={render('plan-angle-b.jpg')} alt="展位后侧俯视动线效果" loading="lazy"/><figcaption>FLOW / 双向开放入口</figcaption></figure></div>
    </section>
    <section className="fair-story fair-onsite qpf-onsite">
      <div className="qpf-section-title"><small>05 / BUILT EXPERIENCE</small><h3>从方案图，<br/>走进真实现场。</h3><p>落地现场延续绿色门头、拱形分类与高密度产品墙。效果图中建立的入口、浏览和沟通关系，在真实展会中形成清晰的参观节奏。</p></div>
      <figure className="qpf-image qpf-onsite-main"><img src={asset('assets/cases/shanghai-pet-fair/onsite-main.jpg')} alt="QuPet 上海亚宠展展位落地现场" loading="lazy"/><figcaption><span>SHANGHAI · PET FAIR ASIA</span><span>现场落地 / 品牌识别</span></figcaption></figure>
      <div className="qpf-onsite-pair"><figure className="qpf-image"><img src={asset('assets/cases/shanghai-pet-fair/onsite-display.jpg')} alt="现场产品分类陈列墙" loading="lazy"/></figure><div><small>DESIGN TO REALITY</small><h4>空间最终服务于<br/>人与产品的相遇。</h4><p>开放入口让观众直接进入产品墙，分类展示降低理解成本；品牌绿贯穿门头、墙面与现场物料，保证从远观到近看的连续记忆。</p></div></div>
    </section>
    <section className="qpf-touchpoints"><div className="qpf-section-title qpf-section-title-light"><small>06 / BRAND TOUCHPOINTS</small><h3>把展位记忆，<br/>带到每次接触。</h3><p>手提袋、名片、易拉宝与邀请函延续相同的绿色识别，让品牌从展前邀约、现场交流一直连接到离场之后。</p></div><div className="qpf-touch-grid"><figure><img src={asset('assets/cases/shanghai-pet-fair/brand-bags.jpg')} alt="QuPet 品牌手提袋" loading="lazy"/><figcaption>TAKEAWAY / 品牌手提袋</figcaption></figure><figure><img src={asset('assets/cases/shanghai-pet-fair/brand-cards.jpg')} alt="QuPet 商务名片" loading="lazy"/><figcaption>CONNECTION / 商务名片</figcaption></figure><figure><img src={asset('assets/cases/shanghai-pet-fair/brand-rollup.jpg')} alt="QuPet 品牌易拉宝" loading="lazy"/><figcaption>INFORMATION / 易拉宝</figcaption></figure><figure><img src={asset('assets/cases/shanghai-pet-fair/brand-invitation.jpg')} alt="QuPet 展会邀请函" loading="lazy"/><figcaption>INVITATION / 展会邀请函</figcaption></figure></div></section>
    <footer className="fair-footer"><span>QUPET · SHANGHAI PET FAIR</span><button onClick={onClose}>BACK TO PROJECTS <ArrowRight /></button></footer>
  </div>
}

function MaterialsWebsiteCase({ onClose }: { onClose: () => void }) {
  const image = (name: string) => asset(`assets/cases/leadfair-website/${name}`)
  return <div className="website-case" role="dialog" aria-modal="true" aria-label="Found Fair Materials 品牌官网项目案例">
    <button className="project-case-close website-close" aria-label="关闭项目案例" onClick={onClose}><X /></button>
    <header className="website-hero">
      <img src={asset('assets/cases/found-fair/polymer-hero.png')} alt="冷蓝光泽下的半透明高分子原料颗粒" />
      <div className="website-hero-shade" />
      <div className="website-case-nav"><span>ZHUZI’S SPACE</span><span>WEB DESIGN · 04</span></div>
      <div className="website-hero-copy"><small>B2B WEBSITE / MATERIALS R&amp;D &amp; MANUFACTURING / 2026</small><h2>FOUND FAIR<br/>MATERIALS.</h2><p>为原材料研发制造企业设计 B2B 获客网站，承接广告流量，引导选材咨询、样品申请与项目询盘。</p></div>
    </header>

    <section className="website-overview">
      <small>01 / PROJECT OVERVIEW</small>
      <h3>面向海外客群的<br/>B2B 材料官网。</h3>
      <div><p>Found Fair Materials 专注 TPE 原材料研发、配方改性、测试与规模化制造。网站面向海外品牌、采购团队、产品开发人员与材料工程师，以英文为核心沟通语言，承接海外广告与搜索流量，促进样品申请和有效询盘。</p><p>内容按海外 B2B 采购决策展开：首屏明确研发制造定位，以应用场景帮助客户确认用途，再用产品牌号与性能参数支持选材；定制开发流程、工厂与实验室展示补充供应与交付依据。咨询工程师、申请样品与项目表单贯穿浏览路径，将海外流量转化为可跟进的业务需求。</p><dl><div><dt>OBJECTIVE</dt><dd>GLOBAL TRAFFIC / SAMPLE REQUESTS / B2B INQUIRIES</dd></div><div><dt>STRUCTURE</dt><dd>APPLICATIONS → GRADES → CAPABILITIES → INQUIRY</dd></div><div><dt>AUDIENCE</dt><dd>GLOBAL PROCUREMENT / PRODUCT TEAMS / ENGINEERS</dd></div></dl></div>
    </section>

<section className="website-design-system"><div className="website-design-label"><small>02 / VISUAL FOUNDATION</small><h3>Color<br/>System<span>以蓝色交互与荧光绿强调，建立材料科技识别。</span></h3></div><div className="website-palette"><article><code>#173DFF</code><b>Action<br/>Blue</b><p>蓝色引导交互，让专业信息有清晰的行动入口。</p></article><article><code>#171817</code><b>Carbon<br/>Black</b><p>深色建立结构与对比，衬托材料的细节和质感。</p></article><article><code>#F8F9F7</code><b>Soft<br/>White</b><p>柔白承载内容，为复杂参数留出清晰的阅读空间。</p></article><article><code>#D1FF49</code><b>Signal<br/>Green</b><p>荧光绿突出关键语句，传达材料科技的活力。</p></article></div><div className="website-design-label"><small>03 / TYPOGRAPHY</small><h3>Typography<br/>System<span>用清晰层级承载专业内容。</span></h3></div><div className="website-type-specimen"><strong>Jakarta</strong><div className="website-type-scale"><div><b>Medium</b><span>500 / 标题字重</span></div><div><b>Regular</b><span>400 / 正文字重</span></div><div><b>70</b><span>PX / 主标题</span></div><div><b>30</b><span>PX / 副标题</span></div><div><b>16</b><span>PX / 正文</span></div><div><b>14</b><span>PX / 辅助信息</span></div></div><p className="website-type-note">PLUS JAKARTA SANS<span>字体层级 / 桌面端展示规范</span></p></div></section>

    <div className="website-presentation-label"><span className="website-presentation-star" aria-hidden="true"/><h3>Desktop<br/>Presentation</h3><p>从应用匹配、牌号选型到研发制造能力，<br className="desktop-presentation-break"/>围绕 B2B 采购决策组织内容，衔接工程师咨询与样品申请。</p></div>
    <figure className="website-static-presentation"><img src={asset('assets/cases/leadfair-website/found-fair-materials-full-page.png')} alt="Found Fair Materials 英文官网整页设计，包含材料 Banner、应用场景、产品、研发服务与询盘表单" loading="lazy" /></figure>
    <section className="website-browser-showcase website-laptop-showcase">
      <div className="website-real-display">
        <div className="website-real-screen"><iframe title="Found Fair Materials English website" src={asset('leadfair-banner-en.html?v=materials-8')} loading="lazy" onLoad={(event) => {
          const frame = event.currentTarget
          try {
            const doc = frame.contentDocument
            if (!doc || doc.documentElement.dataset.previewReady) return
            doc.documentElement.dataset.previewReady = 'true'
            const style = doc.createElement('style')
            style.textContent = '.site-header{position:sticky!important;top:0!important;transform:none!important;visibility:visible!important;z-index:1000!important}.site-header-spacer{display:none!important}html,body{overscroll-behavior:contain}'
            if (/leadfair-banner-(en|preview)\.html$/.test(doc.location.pathname)) style.textContent += 'section.hero#top{background-image:url("' + new URL(asset('assets/cases/found-fair/polymer-hero.png'), location.origin).href + '")!important;background-size:cover!important;background-position:center!important}section.hero#top>img{visibility:hidden!important}'
            doc.head.appendChild(style)
            frame.contentWindow?.scrollTo({ top: 0, behavior: 'instant' })
            doc.addEventListener('click', (click) => {
              const link = (click.target as Element).closest<HTMLAnchorElement>('a[href]')
              if (!link) return
              const destinationUrl = new URL(link.href)
              const isOriginalSite = destinationUrl.pathname.startsWith('/leadfair-materials/')
              const isLocalHome = destinationUrl.origin === location.origin && /leadfair-banner-(en|preview)\.html$/.test(destinationUrl.pathname)
              if (!isOriginalSite && !isLocalHome) return
              click.preventDefault()
              click.stopImmediatePropagation()
              const route = isLocalHome ? '' : destinationUrl.pathname.replace('/leadfair-materials/', '').replace(/^(en|zh-tw|vi)\/?/, '').replace(/^\/+|\/+$/g, '')
              const cachedRoutes = new Set(['products', 'articles', 'company', 'honors', 'contact', 'products/ius-4065', 'products/lf-et78a', 'products/lf-hr53a', 'products/gte-8030', 'products/gte-8075', 'blog/chemical-foaming-vs-supercritical-foaming', 'blog/biobased-carbon14-biodegradability', 'blog/eva-foam-shrinkage-ius-4065'])
              const localPage = !route ? asset('leadfair-banner-en.html?v=materials-local') : cachedRoutes.has(route) ? asset(`materials-preview/en_${route.replaceAll('/', '_')}_.html`) : 'https://leadfair433-lab.github.io/leadfair-materials/en/' + route + '/'
              frame.src = localPage + (route ? destinationUrl.hash : '')
            }, true)
            const language = doc.querySelector<HTMLSelectElement>('.language-switcher select')
            if (language) {
              language.value = 'en'
              language.disabled = true
              language.setAttribute('aria-label', 'English preview')
            }
            doc.querySelector<HTMLButtonElement>('.hero .ghost')?.addEventListener('click', () => doc.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' }))
            doc?.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
              if (link.href.startsWith('https://')) {
                link.target = '_self'
                link.rel = 'noopener noreferrer'
              }
            })
          } catch { /* Original-site pages remain outside the local preview. */ }
        }} /></div>
        <img src={asset('assets/device-mockups/pro-display-xdr-transparent.png')} alt="Apple Pro Display XDR 显示器模型" />
      </div>
      <div className="website-browser-caption"><span>WEBSITE / ENGLISH PREVIEW<br/>英文网站交互展示</span><strong>Scroll and explore the English website inside the display.<br/>在电脑屏幕内滚动浏览，点击导航查看官网页面。</strong><a href="https://leadfair433-lab.github.io/leadfair-materials/en/#top" target="_blank" rel="noreferrer">Open in a new window ↗<br/>新窗口打开官网 ↗</a></div>
    </section>

    <section className="materials-mobile-artwork"><div className="materials-mobile-logo-stage"><img src={image('mobile-mockup-found-fair.jpg')} alt="Found Fair 英文网站三台手机样机展示" loading="lazy" /></div></section>
    <section className="materials-mobile-presentation" hidden>
      <div className="materials-phone-stage" aria-label="Found Fair 英文官网移动端展示">
        {[0, 1, 2].map((page) => <div className={`materials-device materials-device-${page}`} key={page}><div className="materials-device-screen"><img src={image(page === 0 ? 'live-mobile-hero.jpg' : 'live-mobile-full.jpg')} alt={`Found Fair Materials 英文移动端页面 ${page + 1}`} loading="lazy" /></div><span className="materials-device-island" /></div>)}
      </div>
      <div className="materials-mobile-heading"><span aria-hidden="true">✳</span><h3>Mobile<br/>Presentation</h3><p>The mobile site focuses<br/>on clarity, speed and usability.</p></div>
    </section>

    <footer className="materials-thanks-footer"><span className="materials-thanks-star" aria-hidden="true">✳</span><h3><span>Ready to scale your brand?</span><br/>Let’s build something bold together.</h3><div className="materials-thanks-meta"><span>ZHUZI’S SPACE × FOUND FAIR</span><span>2026</span></div><div className="materials-thanks-word">thanks</div><button onClick={onClose}>BACK TO PROJECTS <ArrowRight /></button></footer>
  </div>
}

function ColorCandyDetailCase({ onClose }: { onClose: () => void }) {
  return <div className="detail-page-case" role="dialog" aria-modal="true" aria-label="COLORCANDY 电商详情页项目案例">
    <button className="project-case-close detail-page-close" aria-label="关闭项目案例" onClick={onClose}><X /></button>
    <header className="detail-page-hero">
      <img className="detail-page-hero-bg" src={asset('assets/cases/colorcandy-detail/full-detail.jpg')} alt="COLORCANDY 防水配方人物视觉" />
      <div className="detail-page-nav"><span>ZHUZI’S SPACE</span><span>DETAIL PAGE · 05</span></div>
      <div className="detail-page-hero-copy"><small>BEAUTY / LOOSE POWDER · E-COMMERCE DESIGN</small><h2>EXQUISITE<br/><em>AND SMOOTH.</em></h2><p>COLORCANDY 流雾轻烟蜜粉详情页设计。以细腻如烟的粉质、柔焦定妆与控油表现为核心，串联人物大片、产品特写和功能演示。</p></div>
    </header>
    <section className="detail-page-intro"><small>01 / PROJECT OVERVIEW</small><h3>让细腻粉质，<br/>变成可见妆感。</h3><div><p>本项目为 COLORCANDY 流雾轻烟蜜粉打造电商详情页。内容从“细腻如烟、柔焦定妆”切入，依次呈现球型多孔粉末结构、控油对比、防水测试与持妆场景，让消费者理解散粉的使用体验。</p><p>设计以水面人像与切面粉盒建立视觉记忆，用黑色衬托粉末质感、玫红模块强调关键卖点。柔触粉扑、双层筛网、色号与产品问答补充购买信息，形成从妆感吸引到功能理解的阅读路径。</p><dl><div><dt>SCOPE</dt><dd>E-COMMERCE / DETAIL PAGE</dd></div><div><dt>CATEGORY</dt><dd>BEAUTY / LOOSE POWDER</dd></div><div><dt>FORMAT</dt><dd>790 × 22930 PX</dd></div></dl></div></section>
    <section className="detail-page-full">
      <div className="detail-page-display-head"><div><strong>「详情页展示」</strong><span>Detail page display &gt;</span></div><em>FINISHED PRODUCT<br/>DISPLAY DESIGN</em></div>
      <div className="detail-page-columns">
        <figure className="detail-page-slice detail-page-slice-one"><img src={asset('assets/cases/colorcandy-detail/full-detail.jpg')} alt="COLORCANDY 详情页第一段" loading="lazy" /></figure>
        <figure className="detail-page-slice detail-page-slice-two"><div className="detail-middle-main"><img src={asset('assets/cases/colorcandy-detail/full-detail.jpg')} alt="COLORCANDY 柔焦、防水与持妆展示" loading="lazy" /></div><div className="detail-middle-control"><img src={asset('assets/cases/colorcandy-detail/full-detail.jpg')} alt="COLORCANDY 专利控油与控油测试" loading="lazy" /></div></figure>
        <figure className="detail-page-slice detail-page-slice-three"><img src={asset('assets/cases/colorcandy-detail/full-detail.jpg')} alt="COLORCANDY 详情页第三段" loading="lazy" /></figure>
      </div>
    </section>
    <footer className="detail-page-footer"><div><small>COLORCANDY · PRODUCT DETAIL</small><h3>Designed to attract.<br/><em>Structured to explain.</em></h3></div><button onClick={onClose}>BACK TO PROJECTS <ArrowRight /></button></footer>
  </div>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState<(typeof cases)[number] | null>(null)
  const [activeArchiveFilter, setActiveArchiveFilter] = useState<(typeof archiveFilters)[number]>('全部')
  const [expandedArchiveCategories, setExpandedArchiveCategories] = useState<string[]>([])
  const [archiveSelected, setArchiveSelected] = useState<(typeof archiveWorks)[number] | null>(null)
  const [time, setTime] = useState('')
  const archiveTitles: Record<string, string> = { 包装: 'Packaging', 画册: 'Editorial Design', 详情页: 'Product Detail', 网站: 'Websites', 展会: 'Exhibitions', 活动: 'Events', 宣传dm: 'Marketing Collateral', logo: 'Logo Design', ppt: 'Presentations' }
  const archiveGroups = activeArchiveFilter === '全部' ? archiveFilters.filter(category => category !== '全部') : [activeArchiveFilter]

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
    <MouseTrail />
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
          <div><span>/01&nbsp; AI VISUAL DESIGN</span><span>/02&nbsp; BRAND &amp; PACKAGING</span><span>/03&nbsp; GLOBAL CAMPAIGN</span></div>
        </div>
        <div className="trust">
          <div className="avatar-stack"><span>AI</span><span>VI</span><span>09</span><span>+</span></div>
          <div><strong>9 YEARS / 50+ LAUNCHES</strong><p>BRAND, PACKAGING &amp; GLOBAL COMMUNICATION</p></div>
        </div>
        <p className="hero-side-note">INDEPENDENT AI DESIGNER · GUANGZHOU</p>
        <h1 className="hero-brand">PORTFOLIO</h1>
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

      <MarqueeSection projects={cases.map(item => [item.no === '04' ? asset('assets/cases/leadfair-website/website-display-marquee.png') : item.no === '05' ? asset('assets/cases/colorcandy-detail/marquee-model-cover.png') : item.image, item.name])} otherProjects={archiveWorks.filter(item => ['004', '005', '006', '012', '014'].includes(item.id)).map(item => [asset(item.id === '004' ? 'assets/archive/tea-pattern-marquee.png' : item.id === '006' ? 'assets/cases/colorcandy-detail/brush-marquee.png' : item.id === '012' ? 'assets/archive/cotton-scene-marquee.png' : item.image), item.id === '006' ? 'COLORCANDY · 化妆刷' : item.id === '004' ? '乐叔的茶 · 包装设计' : item.title])} />

      <section className="cases" id="work">
        <div className="section-head">
          <div><small>02 &nbsp; PORTFOLIO</small><h2>Case Studies.</h2></div>
          <p>每个项目都展示我如何在策略、创意、制作与商业目标之间建立连接。</p>
          <button onClick={() => document.querySelector('.case-row')?.scrollIntoView({ behavior: 'smooth' })}>ALL PROJECTS <ArrowRight /></button>
        </div>
        <div className="case-stage">
        <div className="case-list">
          {cases.map(item => <button className={`case-row${item.no === '03' ? ' case-row-qupet' : ''}${item.no === '04' ? ' case-row-website' : ''}${item.no === '05' ? ' case-row-detail' : ''}`} key={item.name} onClick={() => setSelected(item)}>
            <span className="case-no">{item.no}</span>
            <span><small>PROJECT</small><strong>{item.name}</strong></span>
            <span><small>YEAR</small>{item.year}</span>
            <div className="case-image">{item.no === '04' ? <div className="website-cover-canvas" aria-label="Found Fair Materials 响应式官网展示">
              <div className="website-cover-backdrop"><img src={asset('assets/cases/found-fair/polymer-hero.png')} alt="" loading="lazy"/></div>
              <div className="website-cover-display-label">WEBSITE DISPLAY</div>
              <div className="website-cover-monitor">
                <img className="website-cover-monitor-page" src={asset('assets/cases/leadfair-website/found-fair-materials-full-page.png')} alt="Found Fair Materials 最新英文版首页" loading="lazy" />
                <img className="website-cover-monitor-frame" src={asset('assets/device-mockups/pro-display-xdr-transparent.png')} alt="电脑展示模型" loading="lazy" />
              </div>
              <figure className="website-cover-panel website-cover-panel-one" hidden>
                <img src={asset('assets/cases/leadfair-website/desktop-banner-latest.jpg')} alt="原料颗粒官网首屏" loading="lazy"/>
                <figcaption>BRAND ENTRY</figcaption>
              </figure>
              <figure className="website-cover-panel website-cover-panel-two" hidden>
                <img src={asset('assets/cases/leadfair-website/live-desktop-full.jpg')} alt="Found Fair Materials 桌面端官网长页" loading="lazy"/>
                <figcaption>DESKTOP EXPERIENCE</figcaption>
              </figure>
              <figure className="website-cover-panel website-cover-panel-three" hidden>
                <img src={asset('assets/cases/leadfair-website/live-mobile-full.jpg')} alt="Found Fair Materials 移动端官网" loading="lazy"/>
                <figcaption>MOBILE SYSTEM</figcaption>
              </figure>
              <em>WEB / RESPONSIVE / 2026</em>
            </div> : item.no === '05' ? <div className="detail-cover-canvas" aria-label="COLORCANDY 电商详情页展示">
              <div className="detail-cover-backdrop"><img src={item.image} alt="" loading="lazy" /></div>
              <div className="detail-cover-panel detail-cover-one"><img src={item.image} alt="COLORCANDY 详情页顶部视觉" loading="lazy" /></div>
              <div className="detail-cover-panel detail-cover-two"><img src={item.image} alt="COLORCANDY 详情页产品卖点视觉" loading="lazy" /></div>
              <div className="detail-cover-panel detail-cover-three"><img src={item.image} alt="COLORCANDY 详情页产品结构视觉" loading="lazy" /></div>
              <span>790 × 22930 PX</span><em>LONG-FORM E-COMMERCE</em>
            </div> : <img src={item.image} alt={item.name} loading="lazy" />}</div>
            <p>{item.desc}</p>
            <div className="case-tags">{item.tags.map(tag => <em key={tag}>{tag}</em>)}</div>
          </button>)}
        </div>
        </div>

        <div className="archive">
          <div className="archive-heading">
            <div><h3>Work Archive</h3><span className="archive-subtitle">完整作品档案</span></div>
            <p>从品牌与包装，到数字体验与空间设计，<br/>以创意连接品牌表达与真实业务。</p>
          </div>
          <nav className="archive-filters" aria-label="作品分类">
            {archiveFilters.map(filter => <button className={activeArchiveFilter === filter ? 'active' : ''} key={filter} onClick={() => setActiveArchiveFilter(filter)}>
              {archiveLabel(filter)} <small>{filter === '全部' ? archiveWorks.length : archiveWorks.filter(item => item.category === filter).length}</small>
            </button>)}
          </nav>
          {archiveGroups.map(category => {
            const priority = category === '画册' ? ['025', '026', '027'] : category === '包装' ? ['011', '018', '012', '009', '008', '003', '005', '007', '001', '010', '006', '013', '014', '015', '016', '017', '004', '019', '020', '021'] : []
            const works = archiveWorks.filter(item => item.category === category).sort((a, b) => {
              const rank = (id: string) => priority.includes(id) ? priority.indexOf(id) : priority.length
              return rank(a.id) - rank(b.id)
            })
            const showingAll = expandedArchiveCategories.includes(category)
            return <section className="archive-category" key={category} aria-label={archiveLabel(category)}>
              <div className="archive-category-heading">
                <div><h4>{archiveTitles[category]}</h4><p>{archiveLabel(category)} <span>/ {works.length} WORKS</span></p></div>
              </div>
          <div className="archive-grid">
            {(showingAll ? works : works.slice(0, 6)).map((item, index) => <button className="archive-card" key={item.id} onClick={() => setArchiveSelected(item)}>
              <div className="archive-image-frame"><img src={asset(item.image)} alt={item.title} loading="lazy" /></div>
              <span className="archive-type">{item.type}</span>
              <ArrowUpRight />
              <div className="archive-caption"><small>{archiveLabel(item.category)} / {item.type}</small><strong className="archive-title-roll"><span>{item.title}</span><span aria-hidden="true">{item.title}</span></strong><em>{String(index + 1).padStart(2, '0')}</em></div>
            </button>)}
          </div>
              <div className="archive-category-actions">
                {works.length > 6 && <button aria-expanded={showingAll} onClick={event => {
                  if (showingAll) event.currentTarget.closest('.archive-category')?.scrollIntoView({ block: 'start' })
                  setExpandedArchiveCategories(previous => showingAll ? previous.filter(value => value !== category) : [...previous, category])
                }}>{showingAll ? 'Show Less / 收起' : 'View All / 查看更多'} <ArrowUpRight /></button>}
              </div>
            </section>
          })}
        </div>
      </section>

      <section className="services" id="services">
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
          <div><span>PHONE</span><a href="tel:+8615700715232">+86 157 0071 5232 <ArrowUpRight /></a></div>
        </div>
        <div className="contact-wechat"><div><span>LET’S CONNECT / WECHAT</span><h3>期待加入优秀的团队，<br/>用设计推动品牌与业务共同生长。</h3><p>使用微信扫一扫，或保存二维码添加好友。</p></div><a className="contact-wechat-code" href={asset('assets/contact/wechat-qr.png')} target="_blank" rel="noreferrer" aria-label="打开微信二维码原图"><img src={asset('assets/contact/wechat-qr.png')} alt="ZHUZI 微信好友二维码" loading="lazy" /><span>SCAN TO CONNECT ↗</span></a></div>
        <footer><a href="#top">ZHUZI’S SPACE</a><span>AI DESIGNER / VISUAL STRATEGIST</span><span>©2026 ALL RIGHTS RESERVED</span></footer>
      </section>
    </main>

    {selected?.no === '01' && <EmbeddedBodyWipeCase onClose={() => setSelected(null)} onOpen={work => { setSelected(null); setArchiveSelected(work) }} onMore={() => { setSelected(null); setActiveArchiveFilter('包装'); setExpandedArchiveCategories(previous => previous.includes('包装') ? previous : [...previous, '包装']); requestAnimationFrame(() => document.querySelector('.archive')?.scrollIntoView({ block: 'start' })) }} />}
    {selected?.no === '02' && <StudyBrochureCase onClose={() => setSelected(null)} />}
    {selected?.no === '03' && <PetFairCase onClose={() => setSelected(null)} />}
    {selected?.no === '04' && <MaterialsWebsiteCase onClose={() => setSelected(null)} />}
    {selected?.no === '05' && <ColorCandyDetailCase onClose={() => setSelected(null)} />}
    {selected && selected.no !== '01' && selected.no !== '02' && selected.no !== '03' && selected.no !== '04' && selected.no !== '05' && <div className="case-modal">
      <button onClick={() => setSelected(null)}><X /></button>
      <div className="modal-image"><img src={selected.image} alt={selected.name} /></div>
      <div className="modal-info"><small>{selected.no} / {selected.year}</small><h2>{selected.name}</h2><p>{selected.desc}</p><div>{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><em>完整案例将在下一轮素材整理后展开。</em></div>
    </div>}
    {archiveSelected && <div className="archive-reader" onClick={() => setArchiveSelected(null)}>
      <div className="archive-reader-panel" role="dialog" aria-modal="true" aria-label={archiveSelected.title} onClick={event => event.stopPropagation()}>
        <header><small>{archiveLabel(archiveSelected.category)} / {archiveSelected.type}</small><h3>{archiveSelected.title}</h3><span>共 {archiveSelected.pages?.length || 1} 页</span><button aria-label="关闭作品预览" onClick={() => setArchiveSelected(null)}><X /></button></header>
        <div className="archive-reader-pages">{(archiveSelected.pages || [archiveSelected.image]).map((page, index) => <img key={page} src={asset(page)} alt={`${archiveSelected.title} 第 ${index + 1} 页`} loading="lazy" />)}</div>
      </div>
    </div>}
  </div>
}
