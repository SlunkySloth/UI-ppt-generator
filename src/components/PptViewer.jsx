import React, { useEffect, useState } from 'react'

const DEFAULT_DECK = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop'
]

export default function PptViewer({ isOpen, onClose, deck = DEFAULT_DECK, filename = 'presentation.pptx', initialIndex = 0 }) {
  const slides = deck && deck.length ? deck : DEFAULT_DECK
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex)
  }, [isOpen, initialIndex])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  function prev() {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }
  function next() {
    setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))
  }

  function triggerDummyDownload() {
    const blob = new Blob([
      `Dummy PPT file for: ${filename}\nSlides: ${slides.length}`
    ], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="ppt-viewer-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="ppt-viewer" role="dialog" aria-modal="true" aria-labelledby="ppt-viewer-title">
        <div className="ppt-viewer-header">
          <h3 id="ppt-viewer-title">Presentation Preview</h3>
          <div className="viewer-actions">
            <button onClick={triggerDummyDownload} className="viewer-btn" title="Download">⬇️</button>
            <button onClick={onClose} className="viewer-btn" title="Close" aria-label="Close">✖</button>
          </div>
        </div>

        <div className="ppt-viewer-main">
          <button onClick={prev} className="nav-btn" aria-label="Previous slide">‹</button>
          <img src={slides[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
          <button onClick={next} className="nav-btn" aria-label="Next slide">›</button>
        </div>

        <div className="ppt-viewer-footer">
          <div className="slide-counter">Slide {currentIndex + 1} / {slides.length}</div>
          <div className="ppt-thumbs" aria-label="Slide thumbnails">
            {slides.map((s, i) => (
              <button key={i} className={i === currentIndex ? 'active' : ''} onClick={() => setCurrentIndex(i)}>
                <img src={s} alt={`Slide ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
