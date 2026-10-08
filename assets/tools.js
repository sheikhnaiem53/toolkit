// Toolkit — all client-side tools (guarded: each block runs only if its elements exist)
const $ = id => document.getElementById(id);
const kb = n => n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(2) + ' MB';

/* ---------- Image Compressor ---------- */
if ($('img-input')) {
  $('img-q').addEventListener('input', e => $('img-q-val').textContent = e.target.value + '%');
  $('img-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const q = +$('img-q').value / 100;
    const fmt = document.querySelector('input[name=img-fmt]:checked').value;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1920 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        $('img-before').textContent = kb(file.size);
        $('img-after').textContent = kb(blob.size);
        const saved = Math.round((1 - blob.size / file.size) * 100);
        $('img-saved').textContent = saved > 0 ? saved + '% smaller' : 'larger than original';
        $('img-preview').src = url;
        const dl = $('img-download');
        dl.href = url;
        dl.download = 'compressed.' + fmt;
        $('img-result').hidden = false;
        URL.revokeObjectURL(img.src);
      }, 'image/' + fmt, q);
    };
    img.src = URL.createObjectURL(file);
  });
}

/* ---------- QR Generator ---------- */
if ($('qr-make')) {
  $('qr-make').addEventListener('click', () => {
    const text = $('qr-text').value.trim();
    if (!text) { alert('Please enter some text or a link first.'); return; }
    if (typeof QRCode === 'undefined') { alert('QR library failed to load. Check your internet connection.'); return; }
    $('qr-box').innerHTML = '';
    new QRCode($('qr-box'), { text, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
    $('qr-result').hidden = false;
  });
  $('qr-download').addEventListener('click', () => {
    const img = document.querySelector('#qr-box img') || document.querySelector('#qr-box canvas');
    if (!img) return;
    const a = document.createElement('a');
    a.href = img.src || img.toDataURL('image/png');
    a.download = 'qrcode.png';
    a.click();
  });
}

/* ---------- Password Generator ---------- */
if ($('pass-make')) {
  const makePass = () => {
    const len = +$('pass-len').value;
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if ($('pass-upper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if ($('pass-num').checked) chars += '0123456789';
    if ($('pass-sym').checked) chars += '@#$%^&*!?-_=+';
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    let out = '';
    for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
    $('pass-out').textContent = out;
  };
  $('pass-len').addEventListener('input', e => { $('pass-len-val').textContent = e.target.value; makePass(); });
  ['pass-upper', 'pass-num', 'pass-sym'].forEach(id => $(id).addEventListener('change', makePass));
  $('pass-make').addEventListener('click', makePass);
  $('pass-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('pass-out').textContent); alert('Copied to clipboard!'); }
    catch { alert('Copy failed — please select the password manually.'); }
  });
  makePass();
}

/* ---------- Word Counter ---------- */
if ($('words-input')) {
  $('words-input').addEventListener('input', e => {
    const t = e.target.value;
    $('w-words').textContent = ((t.trim().match(/\S+/g) || []).length).toLocaleString('en-US');
    $('w-chars').textContent = t.length.toLocaleString('en-US');
    $('w-chars-ns').textContent = t.replace(/\s/g, '').length.toLocaleString('en-US');
    $('w-sent').textContent = (t.match(/[.!?]+/g) || []).length;
    $('w-read').textContent = Math.ceil(((t.trim().match(/\S+/g) || []).length) / 200) || 0;
  });
}

/* ---------- Age Calculator ---------- */
if ($('age-go')) {
  $('age-go').addEventListener('click', () => {
    const dobVal = $('age-dob').value;
    if (!dobVal) { alert('Please select your date of birth.'); return; }
    const dob = new Date(dobVal + 'T00:00:00');
    const now = new Date();
    if (dob > now) { alert('Date of birth cannot be in the future.'); return; }
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    $('age-big').textContent = years + ' years, ' + months + ' months, ' + days + ' days';
    $('age-months').textContent = (years * 12 + months).toLocaleString('en-US') + ' months';
    $('age-days').textContent = Math.floor((now - dob) / 864e5).toLocaleString('en-US') + ' days';
    $('age-weekday').textContent = dob.toLocaleDateString('en-US', { weekday: 'long' });
    $('age-result').hidden = false;
  });
}

/* ---------- Unit Converter ---------- */
if ($('uc-cat')) {
  const UNITS = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
    temp: { C: 'C', F: 'F', K: 'K' }
  };
  const LABELS = {
    length: { m: 'Metres', km: 'Kilometres', cm: 'Centimetres', mm: 'Millimetres', mi: 'Miles', yd: 'Yards', ft: 'Feet', in: 'Inches' },
    weight: { kg: 'Kilograms', g: 'Grams', lb: 'Pounds', oz: 'Ounces' },
    temp: { C: 'Celsius (°C)', F: 'Fahrenheit (°F)', K: 'Kelvin (K)' }
  };
  const fillUnits = () => {
    const cat = $('uc-cat').value;
    const keys = Object.keys(UNITS[cat]);
    $('uc-from').innerHTML = keys.map(k => `<option value="${k}">${LABELS[cat][k]}</option>`).join('');
    $('uc-to').innerHTML = keys.map(k => `<option value="${k}">${LABELS[cat][k]}</option>`).join('');
    $('uc-to').selectedIndex = 1;
    convert();
  };
  const convert = () => {
    const cat = $('uc-cat').value;
    const v = parseFloat($('uc-val').value);
    if (isNaN(v)) { $('uc-out').textContent = '—'; return; }
    const from = $('uc-from').value, to = $('uc-to').value;
    let out;
    if (cat === 'temp') {
      let c = from === 'C' ? v : from === 'F' ? (v - 32) * 5 / 9 : v - 273.15;
      out = to === 'C' ? c : to === 'F' ? c * 9 / 5 + 32 : c + 273.15;
    } else {
      out = v * UNITS[cat][from] / UNITS[cat][to];
    }
    $('uc-out').textContent = (+out.toFixed(4)).toLocaleString('en-US') + ' ' + LABELS[cat][to].split(' ')[0].toLowerCase();
  };
  $('uc-cat').addEventListener('change', fillUnits);
  ['uc-val', 'uc-from', 'uc-to'].forEach(id => $(id).addEventListener('input', convert));
  fillUnits();
}
