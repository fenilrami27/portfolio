import React, { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) {
        setProgress(0)
        return
      }
      const currentScroll = window.scrollY
      const percent = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100))
      setProgress(percent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      id="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full accent-gradient-bg transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
