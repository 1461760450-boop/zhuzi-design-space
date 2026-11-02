import { useEffect, useRef } from 'react'

export default function MouseTrail() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(pointer: fine)')
    const points: { x: number; y: number; life: number }[] = []
    const cursor = { x: 0, y: 0 }
    const head = { x: 0, y: 0 }
    let frame = 0, lastFrame = 0, lastInput = 0, active = false
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(innerWidth * dpr)
      canvas.height = Math.round(innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const render = (now: number) => {
      frame = 0
      const dt = Math.min((now - lastFrame) / 16.667, 2.5)
      lastFrame = now
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      const spring = 1 - Math.pow(.84, dt)
      head.x += (cursor.x - head.x) * spring
      head.y += (cursor.y - head.y) * spring
      if (active && (now - lastInput < 75 || Math.hypot(cursor.x - head.x, cursor.y - head.y) > .45)) {
        const p = points[points.length - 1]
        if (!p || Math.hypot(head.x - p.x, head.y - p.y) > 1.2) points.push({ ...head, life: 1 })
      }
      while (points.length > 48) points.shift()
      for (const p of points) p.life -= .018 * dt
      while (points.length && points[0].life <= 0) points.shift()
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 1.1
      for (let i = 1; i < points.length; i++) {
        const a = points[Math.max(0, i - 2)], b = points[i - 1], c = points[i], d = points[Math.min(points.length - 1, i + 1)]
        const alpha = Math.max(0, Math.min(b.life, c.life)) * (.05 + .68 * Math.pow(i / (points.length - 1), .7))
        ctx.strokeStyle = `rgba(116,158,224,${alpha})`
        ctx.beginPath(); ctx.moveTo(b.x, b.y)
        ctx.bezierCurveTo(b.x + (c.x - a.x) / 6, b.y + (c.y - a.y) / 6, c.x - (d.x - b.x) / 6, c.y - (d.y - b.y) / 6, c.x, c.y)
        ctx.stroke()
      }
      if (points.length) frame = requestAnimationFrame(render)
    }
    const move = (e: globalThis.PointerEvent) => {
      if (e.pointerType === 'touch' || motion.matches || !fine.matches) return
      cursor.x = e.clientX; cursor.y = e.clientY
      if (!active) { head.x = cursor.x; head.y = cursor.y }
      active = true; lastInput = performance.now()
      if (!frame) { lastFrame = lastInput; frame = requestAnimationFrame(render) }
    }
    const leave = () => { active = false }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [])
  return <canvas ref={ref} aria-hidden="true" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10000 }} />
}
