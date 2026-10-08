// Toolkit app shell — tool registry, search, favourites, bottom nav
// Professional SVG icon set (24x24 stroke icons)
const _svgw = inner => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const ICONS = {
  chat:   _svgw('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'),
  image:  _svgw('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'),
  pen:    _svgw('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'),
  hash:   _svgw('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'),
  globe:  _svgw('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  code:   _svgw('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
  doc:    _svgw('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
  speaker:_svgw('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'),
  calc:   _svgw('<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6.5" x2="16" y2="6.5"/><line x1="8" y1="12" x2="8.01" y2="12"/><line x1="12" y1="12" x2="12.01" y2="12"/><line x1="16" y1="12" x2="16.01" y2="12"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="12" y1="16" x2="12.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/>'),
  compress:_svgw('<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="14" y1="10" x2="3" y2="21"/>'),
  link:   _svgw('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  drop:   _svgw('<path d="M12 2.7l5.66 5.66a8 8 0 1 1-11.31 0z"/>'),
  qr:     _svgw('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v3M14 21h3M18 18h3v3h-3z"/>'),
  key:    _svgw('<circle cx="8" cy="15" r="4"/><path d="M10.9 12.1L20 3m-4 1l3 3"/>'),
  cal:    _svgw('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
  swap:   _svgw('<path d="M17 3l4 4-4 4"/><path d="M21 7H8"/><path d="M7 21l-4-4 4-4"/><path d="M3 17h13"/>'),
  receipt:_svgw('<path d="M5 3h14v18l-2.3-1.6-2.3 1.6-2.4-1.6-2.4 1.6L7.3 19.4 5 21z"/><path d="M9 8h6M9 12h6"/>'),
  pulse:  _svgw('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
  percent:_svgw('<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'),
  home:   _svgw('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
  grid:   _svgw('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'),
  star:   _svgw('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
};
const NAV_ICONS = { home: ICONS.home, tools: ICONS.grid, saved: ICONS.star };

const TOOLS = [
  { id: 'ai-chat',             name: 'AI Chat',              icon: 'chat', bg: '#ede9fe', file: 'tools/ai-chat.html',              popular: true, ai: true },
  { id: 'ai-image',            name: 'AI Image Generator',   icon: 'image', bg: '#fae8ff', file: 'tools/ai-image.html',             popular: true, ai: true },
  { id: 'ai-writer',           name: 'AI Writer',            icon: 'pen', bg: '#e0e7ff', file: 'tools/ai-writer.html',          ai: true },
  { id: 'hashtag-generator',   name: 'Hashtag Generator',    icon: 'hash', bg: '#ffedd5', file: 'tools/hashtag-generator.html',  ai: true },
  { id: 'ai-tools-dir',         name: '500+ AI Tools',        icon: 'globe', bg: '#fef3c7', file: 'ai-tools.html',                 popular: true, ai: true },
  { id: 'free-apis-dir',        name: '50+ Free APIs',        icon: 'code', bg: '#e0e7ff', file: 'free-apis.html',                popular: true, ai: true },
  { id: 'word-counter',         name: 'Word Counter',         icon: 'doc', bg: '#ede9fe', file: 'tools/word-counter.html',         popular: true },
  { id: 'text-to-speech',       name: 'Text to Speech',       icon: 'speaker', bg: '#e0f2fe', file: 'tools/text-to-speech.html',       popular: true },
  { id: 'emi-calculator',       name: 'EMI Calculator',       icon: 'calc', bg: '#dcfce7', file: 'tools/emi-calculator.html',       popular: true },
  { id: 'image-compressor',     name: 'Image Compressor',     icon: 'compress', bg: '#fce7f3', file: 'tools/image-compressor.html',     popular: true },
  { id: 'url-shortener',        name: 'URL Shortener',        icon: 'link', bg: '#fef9c3', file: 'tools/url-shortener.html',        popular: true },
  { id: 'color-picker',         name: 'Color Picker',         icon: 'drop', bg: '#fae8ff', file: 'tools/color-picker.html',         popular: true },
  { id: 'qr-generator',         name: 'QR Generator',         icon: 'qr', bg: '#e0e7ff', file: 'tools/qr-generator.html' },
  { id: 'password-generator',   name: 'Password Generator',   icon: 'key', bg: '#ffedd5', file: 'tools/password-generator.html' },
  { id: 'age-calculator',       name: 'Age Calculator',       icon: 'cal', bg: '#ede9fe', file: 'tools/age-calculator.html' },
  { id: 'unit-converter',       name: 'Unit Converter',       icon: 'swap', bg: '#e0f2fe', file: 'tools/unit-converter.html' },
  { id: 'gst-calculator',       name: 'GST Calculator',       icon: 'receipt', bg: '#dcfce7', file: 'tools/gst-calculator.html' },
  { id: 'bmi-calculator',       name: 'BMI Calculator',       icon: 'pulse', bg: '#fce7f3', file: 'tools/bmi-calculator.html' },
  { id: 'percentage-calculator',name: 'Percentage Calculator',icon: 'percent', bg: '#fef9c3', file: 'tools/percentage-calculator.html' },
];

const savedSet = () => new Set(JSON.parse(localStorage.getItem('toolkit_saved') || '[]'));
const isSaved = id => savedSet().has(id);
function toggleSave(id) {
  const s = savedSet();
  s.has(id) ? s.delete(id) : s.add(id);
  localStorage.setItem('toolkit_saved', JSON.stringify([...s]));
  document.querySelectorAll(`.star[data-id="${id}"]`).forEach(b => b.classList.toggle('on', s.has(id)));
}

function toolCard(t, base) {
  const a = document.createElement('a');
  a.className = 'tool-card';
  a.href = (base || '') + t.file;
  a.innerHTML = `<button class="star ${isSaved(t.id) ? 'on' : ''}" data-id="${t.id}" aria-label="save">★</button>
    <div class="tool-tile" style="background:${t.bg}">${ICONS[t.icon] || t.icon}</div><h3>${t.name}</h3>`;
  a.querySelector('.star').addEventListener('click', e => { e.preventDefault(); toggleSave(t.id); });
  return a;
}

function renderGrid(el, list, base) {
  el.innerHTML = '';
  list.forEach(t => el.appendChild(toolCard(t, base)));
}

function bindSearch(inputId, gridId, list, base, emptyMsg) {
  const input = document.getElementById(inputId), grid = document.getElementById(gridId);
  if (!input || !grid) return;
  const draw = () => {
    const q = input.value.trim().toLowerCase();
    const hit = list.filter(t => t.name.toLowerCase().includes(q));
    renderGrid(grid, hit, base);
    if (!hit.length) grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="big-ico">🔍</div><p>${emptyMsg || 'कोई टूल नहीं मिला'}</p></div>`;
  };
  input.addEventListener('input', draw);
  draw();
}
