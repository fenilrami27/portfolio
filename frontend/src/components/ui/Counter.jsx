import React, { useEffect, useState, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function Counter({ target, duration = 1200, suffix = '', prefix = '' }) {
  const shouldReduceMotion = useReducedMotion()
  const [count, setCount] = useState(shouldReduceMotion ? target : 0)
  const hasAnimatedRef = useRef(false)
  const elementRef = useRef(null)

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          let startTimestamp = null
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            // Ease-out quad function
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * target))
            if (progress < 1) {
              window.requestAnimationFrame(step)
            } else {
              setCount(target)
            }
          }
          window.requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )

    const el = elementRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [target, duration, shouldReduceMotion])

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
