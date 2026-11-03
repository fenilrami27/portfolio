import React, { useEffect, useCallback } from 'react'
import { LuX, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export function Lightbox({ images = [], currentIndex = 0, isOpen = false, onClose, onIndexChange }) {
  const total = images.length
  const current = images[currentIndex] || images[0]

  const handlePrev = useCallback(() => {
    if (total <= 1) return
    onIndexChange?.((currentIndex - 1 + total) % total)
  }, [currentIndex, total, onIndexChange])

  const handleNext = useCallback(() => {
    if (total <= 1) return
    onIndexChange?.((currentIndex + 1) % total)
  }, [currentIndex, total, onIndexChange])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handlePrev, handleNext, onClose])

  if (!isOpen || !current) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between text-white/90 z-10 w-full max-w-6xl mx-auto py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
            {currentIndex + 1} / {total}
          </span>
          <span className="text-xs text-white/70 truncate max-w-xs sm:max-w-md">
            {current.caption || current.alt || 'Screenshot preview'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
        >
          <LuX className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-auto min-h-0 w-full max-w-6xl mx-auto">
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white transition-transform hover:scale-110 cursor-pointer"
          >
            <LuChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="max-h-[78vh] max-w-full flex items-center justify-center p-2">
          <img
            src={current.src}
            alt={current.alt || current.caption || `Image ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10 select-none"
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white transition-transform hover:scale-110 cursor-pointer"
          >
            <LuChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption */}
      <div className="w-full max-w-3xl mx-auto text-center py-2 z-10">
        {current.caption && (
          <p className="text-sm text-white/90 font-medium bg-black/40 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm inline-block">
            {current.caption}
          </p>
        )}
      </div>
    </div>
  )
}
