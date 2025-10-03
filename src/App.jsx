import React, { useMemo, useState } from 'react'
import PptViewer from './components/PptViewer.jsx'

const TEMPLATE_DECKS = {
  business: [
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'
  ],
  classic: [
    'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?q=80&w=1200&auto=format&fit=crop'
  ],
  formal: [
    'https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop'
  ],
  modern: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'
  ]
}

function buildDeckForTemplate(template) {
  const base = TEMPLATE_DECKS[template] || TEMPLATE_DECKS.business
  const looped = []
  while (looped.length < 5) looped.push(...base)
  return looped.slice(0, 5)
}

function triggerDummyDownload(filename, deckLength = 5) {
  const blob = new Blob([
    `Dummy PPT file for: ${filename}\nSlides: ${deckLength}`
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

export default function App() {
  const [activeTab, setActiveTab] = useState('generate')
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [slides, setSlides] = useState('15')
  const [template, setTemplate] = useState('business')

  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerDeck, setViewerDeck] = useState([])
  const [viewerFilename, setViewerFilename] = useState('presentation.pptx')

  const historyItems = useMemo(() => ([
    {
      id: '1',
      title: 'Introduction to AI',
      subtitle: 'Artificial Intelligence Basics',
      date: 'Created on Sep 11, 2025',
      deck: buildDeckForTemplate('modern'),
      filename: 'introduction-to-ai.pptx'
    },
    {
      id: '2',
      title: 'Marketing Strategy 2024',
      subtitle: 'Digital Marketing Trends',
      date: 'Created on Sep 6, 2025',
      deck: buildDeckForTemplate('business'),
      filename: 'marketing-strategy-2024.pptx'
    }
  ]), [])
  const [history, setHistory] = useState(historyItems)

  function handleGenerate(e) {
    e.preventDefault()
    const deck = buildDeckForTemplate(template)
    setViewerDeck(deck)
    setViewerFilename(`${template}-presentation.pptx`)
    setViewerOpen(true)
  }

  function openHistory(item) {
    setViewerDeck(item.deck)
    setViewerFilename(item.filename)
    setViewerOpen(true)
  }

  function deleteHistory(id) {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">📋</div>
            <div className="logo-text">
              <h1>PPT Generator</h1>
              <p>Create professional presentations with AI assistance</p>
            </div>
          </div>
        </div>
      </header>

      <div className="tab-container">
        <input type="radio" id="generate-tab" name="tabs" checked={activeTab === 'generate'} onChange={() => setActiveTab('generate')} />
        <input type="radio" id="history-tab" name="tabs" checked={activeTab === 'history'} onChange={() => setActiveTab('history')} />

        <div className="tab-nav">
          <label htmlFor="generate-tab" className="tab-label">Generate</label>
          <label htmlFor="history-tab" className="tab-label">History</label>
        </div>

        {/* Generate Tab */}
        <div className="tab-content" id="generate-content" style={{ display: activeTab === 'generate' ? 'block' : 'none' }}>
          <div className="main-content">
            <div className="form-section">
              <h2>Presentation Details</h2>
              <p className="section-description">Fill in the details to generate a professional presentation</p>

              <form className="presentation-form" onSubmit={handleGenerate}>
                <div className="form-group">
                  <label htmlFor="topic">Topic</label>
                  <input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Introduction to Machine Learning" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="audience">Target Audience</label>
                    <input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Business executives" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="slides">Number of Slides</label>
                    <select id="slides" value={slides} onChange={(e) => setSlides(e.target.value)}>
                      <option value="10">10 slides</option>
                      <option value="15">15 slides</option>
                      <option value="20">20 slides</option>
                      <option value="25">25 slides</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="style">Presentation Style</label>
                  <div className="template-selector">
                    <input type="radio" id="business" name="template" value="business" checked={template === 'business'} onChange={(e) => setTemplate(e.target.value)} />
                    <input type="radio" id="classic" name="template" value="classic" checked={template === 'classic'} onChange={(e) => setTemplate(e.target.value)} />
                    <input type="radio" id="formal" name="template" value="formal" checked={template === 'formal'} onChange={(e) => setTemplate(e.target.value)} />
                    <input type="radio" id="modern" name="template" value="modern" checked={template === 'modern'} onChange={(e) => setTemplate(e.target.value)} />

                    <div className="template-grid">
                      <label htmlFor="business" className="template-card">
                        <div className="template-image">
                          <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" alt="Business Template" />
                        </div>
                        <div className="template-info">
                          <h4>Business</h4>
                          <p>Professional corporate design</p>
                        </div>
                      </label>

                      <label htmlFor="classic" className="template-card">
                        <div className="template-image">
                          <img src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" alt="Classic Template" />
                        </div>
                        <div className="template-info">
                          <h4>Classic</h4>
                          <p>Timeless elegant layout</p>
                        </div>
                      </label>

                      <label htmlFor="formal" className="template-card">
                        <div className="template-image">
                          <img src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" alt="Formal Template" />
                        </div>
                        <div className="template-info">
                          <h4>Formal</h4>
                          <p>Academic and official style</p>
                        </div>
                      </label>

                      <label htmlFor="modern" className="template-card">
                        <div className="template-image">
                          <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" alt="Modern Template" />
                        </div>
                        <div className="template-info">
                          <h4>Modern</h4>
                          <p>Contemporary minimalist design</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="context">Additional Context</label>
                  <textarea id="context" rows={6} placeholder="Any specific requirements, key points, or context to include..."></textarea>
                </div>

                <button type="submit" className="generate-btn">Generate Presentation</button>
              </form>
            </div>

            <div className="preview-section">
              <h2>Generated Presentation</h2>
              <div className="preview-content">
                <div className="preview-placeholder">
                  <div className="preview-icon">📄</div>
                  <h3>Fill in the details and click "Generate Presentation"</h3>
                  <p>Your AI-generated presentation will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Tab */}
        <div className="tab-content" id="history-content" style={{ display: activeTab === 'history' ? 'block' : 'none' }}>
          <div className="history-section">
            <h2>Presentation History</h2>
            <p className="section-description">View and manage your previously generated presentations</p>

            <div className="presentation-list">
              {history.map((item) => (
                <div className="presentation-item" key={item.id}>
                  <div className="presentation-icon">📋</div>
                  <div className="presentation-info">
                    <h3>{item.title}</h3>
                    <p className="presentation-subtitle">{item.subtitle}</p>
                    <p className="presentation-date">{item.date}</p>
                  </div>
                  <div className="presentation-actions">
                    <button className="action-btn view-btn" title="View" onClick={() => openHistory(item)}>👁️</button>
                    <button className="action-btn download-btn" title="Download" onClick={() => triggerDummyDownload(item.filename, item.deck.length)}>⬇️</button>
                    <button className="action-btn delete-btn" title="Delete" onClick={() => deleteHistory(item.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PptViewer isOpen={viewerOpen} onClose={() => setViewerOpen(false)} deck={viewerDeck} filename={viewerFilename} />
    </div>
  )
}
