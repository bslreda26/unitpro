import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function isFinePointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches
  )
}

function isClickable(el) {
  if (!el) return false
  return !!el.closest(
    'a,button,[role="button"],input,select,textarea,summary,[data-cursor="hover"]',
  )
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  const [dot, setDot] = useState({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    setEnabled(isFinePointer())
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      setDot(pos.current)
    }

    const onOver = (e) => setHovering(isClickable(e.target))
    const onOut = () => setHovering(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mouseout', onOut, { passive: true })

    let raf = 0
    const loop = () => {
      const target = pos.current
      ring.current = {
        x: ring.current.x + (target.x - ring.current.x) * 0.12,
        y: ring.current.y + (target.y - ring.current.y) * 0.12,
      }
      setRingPos(ring.current)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          transform: `translate3d(${dot.x - 3}px, ${dot.y - 3}px, 0)`,
        }}
      >
        <div className="h-[6px] w-[6px] bg-primary" />
      </div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        animate={{
          x: ringPos.x - (hovering ? 20 : 16),
          y: ringPos.y - (hovering ? 20 : 16),
          width: hovering ? 40 : 32,
          height: hovering ? 40 : 32,
          opacity: hovering ? 0.85 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 520, damping: 44 }}
        style={{
          border: '2px solid rgba(227,27,35,0.9)',
          borderRadius: 999,
          boxShadow: hovering ? '0 0 40px rgba(227,27,35,0.18)' : 'none',
        }}
      />
    </>
  )
}

