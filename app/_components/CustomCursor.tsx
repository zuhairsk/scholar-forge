'use client'

import { useEffect } from 'react'

/**
 * Lightweight cursor enhancement for the migration.
 * We keep it subtle and non-invasive; can be swapped for a richer cursor later.
 */
export function CustomCursor() {
  useEffect(() => {
    const dot = document.createElement('div')
    dot.setAttribute('data-scholarforge-cursor', 'true')
    dot.style.position = 'fixed'
    dot.style.left = '0'
    dot.style.top = '0'
    dot.style.width = '10px'
    dot.style.height = '10px'
    dot.style.borderRadius = '9999px'
    dot.style.pointerEvents = 'none'
    dot.style.zIndex = '9999'
    dot.style.transform = 'translate(-50%, -50%)'
    dot.style.background = 'rgba(212,168,67,0.75)'
    dot.style.boxShadow = '0 0 18px rgba(212,168,67,0.25)'
    dot.style.mixBlendMode = 'screen'
    document.body.appendChild(dot)

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`
      dot.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      dot.remove()
    }
  }, [])

  return null
}

