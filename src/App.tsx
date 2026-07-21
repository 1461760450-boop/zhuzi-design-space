import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const projects = [
  { category: '包装', title: '礼盒', image: asset('assets/packaging/礼盒.jpg') },
  { category: '包装', title: '乐叔的茶方案3', image: asset('assets/packaging/乐叔的茶方案3.jpg') },
  { category: '包装', title: '偻里奶茶杯 2', image: asset('assets/packaging/偻里奶茶杯2.jpg') },
  { category: 'logo', title: '7', image: asset('assets/logo/7.jpg') },
  { category: '详情页', title: '美妆', image: asset('assets/details/美妆.jpg'), href: asset('assets/details-full/美妆.jpg') },
  { category: '详情页', title: '美妆2', image: asset('assets/details/美妆2.jpg'), href: asset('assets/details-full/美妆2.jpg') },
  { category: '详情页', title: '美妆4', image: asset('assets/details/美妆4.jpg'), href: asset('assets/details-full/美妆4.jpg') },
  { category: '详情页', title: '美妆首页', image: asset('assets/details/美妆首页.jpg'), href: asset('assets/details-full/美妆首页.jpg') },
  { category: '详情页', title: '1.球类详情', image: asset('assets/details/1.球类详情.jpg'), href: asset('assets/details-full/1.球类详情.jpg') },
  { category: '详情页', title: '天猫首页', image: asset('assets/details/天猫首页.jpg'), href: asset('assets/details-full/天猫首页.jpg') },
  { category: '详情页', title: '鞋垫1', image: asset('assets/details/鞋垫1.jpg'), href: asset('assets/details-full/鞋垫1.jpg') },
  { category: '详情页', title: '鞋垫2', image: asset('assets/details/鞋垫2.jpg'), href: asset('assets/details-full/鞋垫2.jpg') },
  { category: '详情页', title: '鞋垫3', image: asset('assets/details/鞋垫3.jpg'), href: asset('assets/details-full/鞋垫3.jpg') },
  { category: '详情页', title: '鞋垫4', image: asset('assets/details/鞋垫4.jpg'), href: asset('assets/details-full/鞋垫4.jpg') },
  { category: '展会活动', title: '在云端在尖端-主KV-1(完稿)', image: asset('assets/poster.jpg') },
  { category: '展会活动', title: '在云端在尖端-签到区', image: asset('assets/event.jpg') },
  { category: '展会活动', title: '新年賀卡2022-亞興泰', image: asset('assets/newyear.jpg') },
  { category: '展会活动', title: '澳大利亚堪培拉留学移民', image: asset('assets/canberra.jpg') },
  { category: '画册', title: '汽车画册5', image: asset('assets/brochure/汽车画册.jpg') },
]

const pdfThumbs = import.meta.glob('./pdf-thumbs/**/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const brochureDisplayNames: Record<string, string> = {
  '留学画册': '留学画册1',
  '海外画册2': '海外画册2',
  '海鲜画册': '海鲜画册3',
  '企业画册1': '企业画册4',
  'VIS企业形象识别手册': 'VIS企业形象识别手册6',
  '企业产品画册': '企业产品画册7',
  '通讯画册': '通讯画册8',
  '产品画册': '产品画册9',
}
const packagingDisplayNames: Record<string, string> = {
  '1湿纸巾包装1': '湿纸巾包装1',
  '2湿纸巾包装2': '湿纸巾包装2',
  '乐叔的茶方案2 拷贝': '乐叔的茶方案1',
  '乐叔的茶方案3 拷贝': '乐叔的茶方案2',
  '乐叔的茶方案3': '乐叔的茶方案3',
  '偻里奶茶杯 2': '偻里奶茶杯 2',
  '偻里奶茶杯': '偻里奶茶杯1',
  ' 3c包装3': '3c包装3',
  'TEASINO奶茶效果图': 'TEASINO奶茶',
}
const packagingPriority = ['湿纸巾包装1','湿纸巾包装2','纸巾包装1','纸巾包装2','棉棒包装1','棉棒包装2','TEASINO奶茶','宠物包装','乐叔的茶方案1','乐叔的茶方案2','乐叔的茶方案3','偻里奶茶杯 2','偻里奶茶杯1','焦枣白茶杯方案1','焦枣白茶杯方案2','3c包装','3c包装2','3c包装3','洗发水包装','礼盒']
const logoPriority = ['1','2','3','4','5','6','7']
const pdfPageImages = import.meta.glob('./pdf-pages/**/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const pagesByPdf = Object.entries(pdfPageImages).sort(([a],[b]) => a.localeCompare(b, 'zh-CN', { numeric: true })).reduce<Record<string, string[]>>((groups, [path, url]) => {
  const parts = path.split('/')
  const key = `${parts[2]}/${parts[3]}`
  ;(groups[key] ||= []).push(url)
  return groups
}, {})
const pdfProjects = Object.entries(pdfThumbs).map(([path, image]) => {
  const parts = path.split('/')
  const sourceTitle = parts.at(-1)?.replace(/\.jpg$/i, '') || '未命名作品'
  const title = parts[2] === '画册' ? (brochureDisplayNames[sourceTitle] || sourceTitle) : parts[2] === '包装' ? (packagingDisplayNames[sourceTitle] || sourceTitle.trim()) : parts[2] === 'logo' ? sourceTitle.trim() : sourceTitle
  return { category: parts[2] === '展会' ? '展会活动' : parts[2], title, sourceTitle, image, kind: 'pdf', pages: pagesByPdf[`${parts[2]}/${sourceTitle}`] || [image] }
})
const allProjects = [...projects.map(project => ({ ...project, kind: 'image' })), ...pdfProjects].filter(project => project.category !== '包装' || packagingPriority.includes(project.title))
const brochurePriority = ['留学画册1', '海外画册2', '海鲜画册3', '企业画册4', '汽车画册5', 'VIS企业形象识别手册6', '企业产品画册7', '通讯画册8', '产品画册9']
const detailShowcase = allProjects.filter(project => project.category === '详情页').sort((a,b) => a.title.localeCompare(b.title,'zh-CN',{numeric:true})).slice(0,3)
const featuredGroups = [
  { category: '包装', title: '包装合集', items: packagingPriority.flatMap(title => allProjects.find(project => project.category === '包装' && project.title === title) || []).slice(0,3) },
  { category: '画册', title: '画册合集', items: brochurePriority.flatMap(title => allProjects.find(project => project.category === '画册' && project.title === title) || []).slice(0,3) },
  { category: '详情页', title: '详情页合集', items: detailShowcase },
]
const imaginationVideos = [
  { label: '互动影像', src: asset('assets/videos/foldcraft-lab.mp4') },
]

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>

const ScrambledHeroTitle = () => {
  const rootRef = useRef<HTMLHeadingElement | null>(null)
  const timersRef = useRef<number[]>([])
  const scrambleChars = '·.:*+'

  useEffect(() => () => timersRef.current.forEach(timer => window.clearTimeout(timer)), [])

  const scrambleNearPointer = (event: React.PointerEvent<HTMLHeadingElement>) => {
    const chars = rootRef.current?.querySelectorAll<HTMLElement>('.scrambled-char')
    if (!chars) return

    chars.forEach(char => {
      const rect = char.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(dx, dy)
      const radius = 120
      if (distance > radius || char.dataset.scrambling === 'true') return

      const original = char.dataset.content || ''
      const frames = Math.max(3, Math.round((1 - distance / radius) * 10))
      let frame = 0
      char.dataset.scrambling = 'true'

      const tick = () => {
        if (frame >= frames) {
          char.textContent = original
          delete char.dataset.scrambling
          return
        }
        char.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        frame += 1
        timersRef.current.push(window.setTimeout(tick, 46))
      }

      tick()
    })
  }

  const renderChars = (text: string) => [...text].map((char, index) => (
    <span className="scrambled-char" data-content={char} key={`${char}-${index}`}>{char}</span>
  ))

  return (
    <h1 className="scrambled-hero-title" ref={rootRef} onPointerMove={scrambleNearPointer}>
      {renderChars('让视觉，')}
      <br />
      <span className="scrambled-hero-emphasis">{renderChars('有温度地发生。')}</span>
    </h1>
  )
}

export default function App() {
  const [filter, setFilter] = useState('全部')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<(typeof pdfProjects)[number] | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<{ title: string; href: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ title: string; src: string; category: string } | null>(null)
  const [detailZoomed, setDetailZoomed] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [interactiveFish, setInteractiveFish] = useState({ x: 76, y: 47, active: false })
  const [clickBursts, setClickBursts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const clickTimersRef = useRef<number[]>([])
  const visible = useMemo(() => {
    const list = filter === '全部' ? allProjects : allProjects.filter(p => p.category === filter)
    if (filter === '包装') return packagingPriority.flatMap(title => {
      const project = list.find(item => item.title === title)
      return project ? [project] : []
    })
    if (filter === 'logo') return logoPriority.flatMap(title => {
      const project = list.find(item => item.title === title)
      return project ? [project] : []
    })
    if (filter === '详情页') return [...list].sort((a, b) => {
      const group = (title: string) => title.includes('美妆') ? 0 : title.includes('鞋垫') ? 2 : 1
      return group(a.title) - group(b.title) || a.title.localeCompare(b.title, 'zh-CN', { numeric: true })
    })
    if (filter !== '画册') return list
    return [...list].sort((a, b) => {
      const aIndex = brochurePriority.indexOf(a.title)
      const bIndex = brochurePriority.indexOf(b.title)
      if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
      return a.title.localeCompare(b.title, 'zh-CN')
    })
  }, [filter])
  const displayedProjects = showAllProjects ? visible : visible.slice(0, 9)

  useEffect(() => {
    if (!selectedPdf) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelectedPdf(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [selectedPdf])

  useEffect(() => {
    if (!selectedDetail) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelectedDetail(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [selectedDetail])

  useEffect(() => {
    if (!selectedImage) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelectedImage(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [selectedImage])

  useEffect(() => {
    const createBurst = (event: PointerEvent) => {
      if (event.button !== 0) return
      const id = Date.now() + Math.random()
      setClickBursts(current => [...current.slice(-5), { id, x: event.clientX, y: event.clientY }])
      clickTimersRef.current.push(window.setTimeout(() => {
        setClickBursts(current => current.filter(burst => burst.id !== id))
      }, 900))
    }

    window.addEventListener('pointerdown', createBurst, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', createBurst)
      clickTimersRef.current.forEach(timer => window.clearTimeout(timer))
      clickTimersRef.current = []
    }
  }, [])

  const openFeatured = (project: (typeof allProjects)[number]) => {
    if (project.kind === 'pdf' && 'pages' in project) setSelectedPdf(project)
    else if (project.category === '详情页' && 'href' in project) { setSelectedDetail({ title: project.title, href: project.href }); setDetailZoomed(false) }
    else setSelectedImage({ title: project.title, src: project.image, category: project.category })
  }

  const selectCategory = (category: string) => {
    setFilter(category)
    setShowAllProjects(false)
    window.setTimeout(() => document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return <>
    <header className="nav glass">
      <a className="brand" href="#top" aria-label="返回首页"><span className="brand-mark">竹</span><span>竹子的设计空间<small>ZHUZI DESIGN SPACE</small></span></a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="切换菜单"><i/><i/></button>
      <nav className={menuOpen ? 'open' : ''} onClick={() => setMenuOpen(false)}>
        <a href="#about">角色介绍</a><a href="#work">作品案例</a><a href="#play">互动体验</a><a href="#contact">联系方式</a>
      </nav>
      <a className="nav-contact" href="#contact">LET'S TALK <Arrow/></a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-media" aria-label="橙色梦幻动态影像背景"><video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4" autoPlay muted loop playsInline preload="metadata"/><div className="grain"/></div>
        <div className="hero-content shell">
          <p className="eyebrow"><span/> VISUAL DESIGNER · GUANGZHOU</p>
          <ScrambledHeroTitle />
          <div className="hero-bottom"><p>品牌视觉 / 包装设计 / 数字营销<br/>为每一个想法找到独特而准确的表达。</p><a className="circle-link" href="#work"><span>探索作品</span><Arrow/></a></div>
        </div>
        <div className="scroll">SCROLL TO EXPLORE <span/></div>
      </section>

      <section className="about shell" id="about">
        <div className="section-index">01 / ABOUT</div>
        <div className="about-main"><div><p className="kicker">你好，我是竹子。</p><h2>用策略梳理复杂，<br/>用设计创造<span>共鸣。</span></h2></div><div className="about-copy"><p>我是彭著娟 Amy，也可以叫我竹子。一名拥有近 9 年品牌与视觉设计经验的资深视觉设计师，专注品牌视觉、产品商业化与海外市场传播。</p><p>从需求分析、创意设计到开发制作与上线运营，我相信真正有效的设计，既要敏锐，也要落地。</p><div className="stats"><div><strong>9</strong><span>年设计经验</span></div><div><strong>50<sup>+</sup></strong><span>款量产包装</span></div><div><strong>20<sup>+</sup></strong><span>产品系列</span></div></div></div></div>
      </section>

      <section className="works" id="work">
        <div className="shell works-head"><div><div className="section-index">02 / SELECTED WORKS</div><h2>被选择的，<br/><em>作品与故事。</em></h2></div><div className="filters">{['全部','包装','画册','详情页','展会活动','logo','ppt'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>selectCategory(x)}>{x}</button>)}</div></div>
        <div className="featured-stack shell">{featuredGroups.map((group,i)=><article className="featured-card" style={{top:88+i*25,zIndex:i+1}} key={group.category}><div className="featured-top"><strong>{String(i+1).padStart(2,'0')}</strong><div><span>{group.category}</span><h3>{group.title}</h3></div><a href="#archive" onClick={event=>{event.preventDefault();selectCategory(group.category)}}>浏览合集 <Arrow/></a></div><div className="featured-images">{group.items[0]&&<button className="featured-main" onClick={()=>openFeatured(group.items[0])} aria-label={`打开${group.items[0].title}`}><img src={group.items[0].image} alt={group.items[0].title}/></button>}<div>{group.items.slice(1,3).map(item=><button key={item.title} onClick={()=>openFeatured(item)} aria-label={`打开${item.title}`}><img src={item.image} alt={item.title}/></button>)}</div></div></article>)}</div>
        <div className="archive-label shell" id="archive"><span>COMPLETE ARCHIVE</span><strong>完整作品档案</strong></div>
        <div className="work-grid shell">{displayedProjects.map((p,i)=><article className={`project project-${(i%3)+1} category-${p.category}`} key={`${p.category}-${p.title}-${i}`} data-motion={p.category === 'logo' ? i % 5 : undefined}><a className="project-image" href={'href' in p ? p.href : p.image} onClick={event=>{event.preventDefault();if(p.kind==='pdf' && 'pages' in p){setSelectedPdf(p)}else if(p.category==='详情页' && 'href' in p){setSelectedDetail({title:p.title,href:p.href});setDetailZoomed(false)}else{setSelectedImage({title:p.title,src:p.image,category:p.category})}}}><img src={p.image} alt={p.title} loading={i>1?'lazy':'eager'}/><span className="format-badge">{p.kind === 'pdf' ? `PDF · ${'pages' in p ? p.pages.length : 1}P` : 'IMAGE'}</span><span className="project-open"><Arrow/></span></a><div className="project-info"><div><span>{p.category} / {p.kind}</span><h3>{p.title}</h3></div><b>{String(i+1).padStart(2,'0')}</b></div></article>)}</div>
        {visible.length>9&&<div className="show-all-wrap shell"><button className="show-all-button" onClick={()=>setShowAllProjects(!showAllProjects)}>{showAllProjects?'收起作品':'展示全部'} <Arrow/></button></div>}
      </section>

      <section
        className="play foldcraft-lab"
        id="play"
        style={{
          '--fish-x': `${interactiveFish.x}%`,
          '--fish-y': `${interactiveFish.y}%`,
        } as CSSProperties}
        onPointerMove={event => {
          const rect = event.currentTarget.getBoundingClientRect()
          setInteractiveFish({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
            active: true,
          })
        }}
        onPointerDown={event => {
          const rect = event.currentTarget.getBoundingClientRect()
          setInteractiveFish({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
            active: true,
          })
        }}
        onPointerLeave={() => setInteractiveFish(current => ({ ...current, active: false }))}
      >
        <video
          className="foldcraft-video"
          src={imaginationVideos[0].src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => event.currentTarget.play().catch(() => undefined)}
        />
        <div className="foldcraft-shade" aria-hidden="true" />
        <div className={`interactive-fish-layer${interactiveFish.active ? ' active' : ''}`} aria-hidden="true">
          {Array.from({ length: 7 }).map((_, index) => <span className="interactive-fish" key={index} />)}
        </div>
        <div className="foldcraft-content">
          <div className="foldcraft-top">
            <div className="section-index light">03 / INTERACTIVE LAB</div>
            <p className="foldcraft-badge">Brand & Visual Storytelling</p>
            <h2>让设计<br/>从想法开始<br/>生长成故事。</h2>
          </div>
          <div className="foldcraft-bottom">
            <p>在光、影、色彩与节奏之间，观察一个想法如何从模糊的感受，生长为清晰的视觉系统。</p>
            <a href="#work" className="foldcraft-cta">Explore Work <ArrowRight size={16} strokeWidth={1.8} /></a>
          </div>
        </div>
      </section>

      <section className="contact" id="contact"><div className="shell"><div className="section-index">04 / CONTACT</div><p className="kicker">期待新的合作机会</p><h2>期待加入优秀的团队，<br/><em>用设计推动品牌与业务共同生长。</em></h2><div className="contact-row"><a href="mailto:1461760450@qq.com">1461760450@qq.com <Arrow/></a><a href="tel:15700715232">+86 157 0071 5232 <Arrow/></a></div><footer><div className="brand"><span className="brand-mark">竹</span><span>竹子的设计空间<small>ZHUZI DESIGN SPACE</small></span></div><p>© 2026 ZHUZI DESIGN SPACE</p><a href="#top">BACK TO TOP ↑</a></footer></div></section>
    </main>
    <div className="click-effects" aria-hidden="true">
      {clickBursts.map(burst => <span className="click-burst" key={burst.id} style={{ left: burst.x, top: burst.y } as CSSProperties}>
        {Array.from({ length: 8 }).map((_, index) => <i key={index} style={{ '--angle': `${index * 45}deg` } as CSSProperties} />)}
      </span>)}
    </div>
    {selectedPdf && <div className="pdf-modal" role="dialog" aria-modal="true" aria-label={`${selectedPdf.title} PDF 预览`} onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedPdf(null)}}><div className="pdf-viewer"><header><div><span>{selectedPdf.category} / PDF</span><h2>{selectedPdf.title}</h2><p>共 {selectedPdf.pages.length} 页</p></div><button onClick={()=>setSelectedPdf(null)} aria-label="关闭 PDF 预览">×</button></header><div className="pdf-pages">{selectedPdf.pages.map((page,i)=><figure key={page}><img src={page} alt={`${selectedPdf.title} 第 ${i+1} 页`} loading={i<2?'eager':'lazy'}/><figcaption>{String(i+1).padStart(2,'0')} / {String(selectedPdf.pages.length).padStart(2,'0')}</figcaption></figure>)}</div></div></div>}
    {selectedImage && <div className="image-modal" role="dialog" aria-modal="true" aria-label={`${selectedImage.title} 图片预览`} onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedImage(null)}}><div className="image-toolbar"><div><span>{selectedImage.category} / IMAGE</span><strong>{selectedImage.title}</strong></div><p>点击图片或两侧返回作品集</p><button onClick={()=>setSelectedImage(null)} aria-label="关闭图片预览">×</button></div><img src={selectedImage.src} alt={selectedImage.title} onClick={()=>setSelectedImage(null)}/></div>}
    {selectedDetail && <div className="detail-modal" role="dialog" aria-modal="true" aria-label={`${selectedDetail.title} 完整详情页`} onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedDetail(null)}}><div className="detail-toolbar"><div><span>DETAIL PAGE</span><strong>{selectedDetail.title}</strong></div><p>点击图片{detailZoomed?'缩小':'放大'} · 点击两侧返回</p><button onClick={()=>setSelectedDetail(null)} aria-label="关闭详情页">×</button></div><img className={detailZoomed?'zoomed':'compact'} src={selectedDetail.href} alt={selectedDetail.title} onClick={()=>setDetailZoomed(!detailZoomed)}/></div>}
  </>
}
