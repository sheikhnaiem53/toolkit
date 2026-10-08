// Toolkit app shell — tool registry, search, favourites, bottom nav
const TOOLS = [
  { id: 'ai-chat',             name: 'AI Chat',              icon: '🤖', bg: '#ede9fe', file: 'tools/ai-chat.html',              popular: true, ai: true },
  { id: 'ai-image',            name: 'AI Image Generator',   icon: '✨', bg: '#fae8ff', file: 'tools/ai-image.html',             popular: true, ai: true },
  { id: 'ai-writer',           name: 'AI Writer',            icon: '✍️', bg: '#e0e7ff', file: 'tools/ai-writer.html',          ai: true },
  { id: 'hashtag-generator',   name: 'Hashtag Generator',    icon: '#️⃣', bg: '#ffedd5', file: 'tools/hashtag-generator.html',  ai: true },
  { id: 'ai-tools-dir',         name: '500+ AI Tools',        icon: '🌐', bg: '#fef3c7', file: 'ai-tools.html',                 popular: true, ai: true },
  { id: 'free-apis-dir',        name: '50+ Free APIs',        icon: '🔌', bg: '#e0e7ff', file: 'free-apis.html',                popular: true, ai: true },
  { id: 'word-counter',         name: 'Word Counter',         icon: '📝', bg: '#ede9fe', file: 'tools/word-counter.html',         popular: true },
  { id: 'text-to-speech',       name: 'Text to Speech',       icon: '🔊', bg: '#e0f2fe', file: 'tools/text-to-speech.html',       popular: true },
  { id: 'emi-calculator',       name: 'EMI Calculator',       icon: '🧮', bg: '#dcfce7', file: 'tools/emi-calculator.html',       popular: true },
  { id: 'image-compressor',     name: 'Image Compressor',     icon: '🖼️', bg: '#fce7f3', file: 'tools/image-compressor.html',     popular: true },
  { id: 'url-shortener',        name: 'URL Shortener',        icon: '🔗', bg: '#fef9c3', file: 'tools/url-shortener.html',        popular: true },
  { id: 'color-picker',         name: 'Color Picker',         icon: '🎨', bg: '#fae8ff', file: 'tools/color-picker.html',         popular: true },
  { id: 'qr-generator',         name: 'QR Generator',         icon: '🔳', bg: '#e0e7ff', file: 'tools/qr-generator.html' },
  { id: 'password-generator',   name: 'Password Generator',   icon: '🔑', bg: '#ffedd5', file: 'tools/password-generator.html' },
  { id: 'age-calculator',       name: 'Age Calculator',       icon: '🎂', bg: '#ede9fe', file: 'tools/age-calculator.html' },
  { id: 'unit-converter',       name: 'Unit Converter',       icon: '📏', bg: '#e0f2fe', file: 'tools/unit-converter.html' },
  { id: 'gst-calculator',       name: 'GST Calculator',       icon: '🧾', bg: '#dcfce7', file: 'tools/gst-calculator.html' },
  { id: 'bmi-calculator',       name: 'BMI Calculator',       icon: '⚖️', bg: '#fce7f3', file: 'tools/bmi-calculator.html' },
  { id: 'percentage-calculator',name: 'Percentage Calculator',icon: '📊', bg: '#fef9c3', file: 'tools/percentage-calculator.html' },
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
    <div class="tool-tile" style="background:${t.bg}">${t.icon}</div><h3>${t.name}</h3>`;
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
