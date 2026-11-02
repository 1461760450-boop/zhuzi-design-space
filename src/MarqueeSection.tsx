function MarqueeRow({ items, reverse = false }: { items: string[][], reverse?: boolean }) {
  return <div className={`marquee-row${reverse ? ' marquee-row-reverse' : ''}`}>
    <div className="marquee-track">
      {[...items, ...items].map(([image, label], index) => <figure className={`marquee-card${image.includes('brush-marquee') ? ' marquee-card-contain marquee-card-brush' : image.includes('packaging-005') ? ' marquee-card-contain marquee-card-box' : ''}`} key={`${image}-${index}`} aria-hidden={index >= items.length}>
        <img src={image} alt={index < items.length ? label : ''} loading="lazy" />
        <figcaption>{label}</figcaption>
      </figure>)}
    </div>
  </div>
}

export default function MarqueeSection({ projects, otherProjects }: { projects: string[][]; otherProjects: string[][] }) {
  return <div className="marquee-section" aria-label="精选作品滚动展示">
    <MarqueeRow items={projects} />
    <MarqueeRow items={otherProjects} reverse />
  </div>
}
