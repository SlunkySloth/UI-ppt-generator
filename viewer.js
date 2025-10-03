// Simple dummy PPT previewer
// - Creates a fake deck of slide images (URLs)
// - Opens a modal with next/prev and thumbnails

const DEFAULT_DECK = [
  // Royalty-free placeholder images (unsplash pics)
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop'
];

const overlay = document.getElementById('ppt-viewer-overlay');
const slideImg = document.getElementById('ppt-viewer-slide');
const thumbs = document.getElementById('ppt-thumbs');
const closeBtn = document.getElementById('ppt-close-btn');
const prevBtn = document.getElementById('ppt-prev-btn');
const nextBtn = document.getElementById('ppt-next-btn');
const counter = document.getElementById('ppt-slide-counter');
const downloadBtn = document.getElementById('ppt-download-btn');

let currentDeck = [...DEFAULT_DECK];
let currentIndex = 0;
let currentFilename = 'presentation.pptx';

function renderSlide(index) {
  if (!currentDeck.length) return;
  currentIndex = Math.max(0, Math.min(index, currentDeck.length - 1));
  slideImg.src = currentDeck[currentIndex];
  counter.textContent = `Slide ${currentIndex + 1} / ${currentDeck.length}`;
  Array.from(thumbs.children).forEach((btn, i) => {
    btn.classList.toggle('active', i === currentIndex);
  });
}

function openViewer(deck = DEFAULT_DECK, filename = 'presentation.pptx') {
  currentDeck = deck.length ? deck : DEFAULT_DECK;
  currentFilename = filename || 'presentation.pptx';
  buildThumbs();
  renderSlide(0);
  overlay.hidden = false;
}

function closeViewer() {
  overlay.hidden = true;
}

function buildThumbs() {
  thumbs.innerHTML = '';
  currentDeck.forEach((url, i) => {
    const btn = document.createElement('button');
    const img = document.createElement('img');
    img.src = url;
    img.alt = `Slide ${i + 1}`;
    btn.appendChild(img);
    btn.addEventListener('click', () => renderSlide(i));
    thumbs.appendChild(btn);
  });
}

prevBtn?.addEventListener('click', () => renderSlide(currentIndex - 1));
nextBtn?.addEventListener('click', () => renderSlide(currentIndex + 1));
closeBtn?.addEventListener('click', closeViewer);

// Clicking outside closes viewer
overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) closeViewer();
});

// Dummy download: creates a text blob as placeholder PPTX
function triggerDummyDownload() {
  const blob = new Blob([
    `Dummy PPT file for: ${currentFilename}\nSlides: ${currentDeck.length}`
  ], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = currentFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

downloadBtn?.addEventListener('click', triggerDummyDownload);

// Wire existing buttons in the static HTML to open the viewer
function wireHistoryButtons() {
  document.querySelectorAll('.presentation-item .view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewer(DEFAULT_DECK, 'history-item.pptx'));
  });
  document.querySelectorAll('.presentation-item .download-btn').forEach(btn => {
    btn.addEventListener('click', triggerDummyDownload);
  });
}

function wireGenerateForm() {
  const form = document.querySelector('.presentation-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Create a themed deck based on selected template for variety
    const selected = document.querySelector('input[name="template"]:checked');
    const template = selected?.value || 'business';
    const deck = buildDeckForTemplate(template);
    openViewer(deck, `${template}-presentation.pptx`);
  });
}

function buildDeckForTemplate(template) {
  const byTemplate = {
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
  };
  const base = byTemplate[template] || DEFAULT_DECK;
  // Ensure at least 5 slides for consistent UX
  const looped = [];
  while (looped.length < 5) {
    looped.push(...base);
  }
  return looped.slice(0, 5);
}

function init() {
  wireHistoryButtons();
  wireGenerateForm();
}

document.addEventListener('DOMContentLoaded', init);
