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

/* ---------- GST Calculator ---------- */
if ($('gst-amt')) {
  const calcGST = () => {
    const amt = parseFloat($('gst-amt').value);
    const rate = parseFloat($('gst-rate').value);
    const mode = document.querySelector('input[name=gst-mode]:checked').value;
    const f = n => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    if (isNaN(amt)) { $('gst-base').textContent = $('gst-tax').textContent = $('gst-total').textContent = '—'; return; }
    let base, tax, total;
    if (mode === 'add') { base = amt; tax = amt * rate / 100; total = amt + tax; }
    else { total = amt; base = amt * 100 / (100 + rate); tax = amt - base; }
    $('gst-base').textContent = f(base);
    $('gst-tax').textContent = f(tax);
    $('gst-total').textContent = f(total);
  };
  ['gst-amt', 'gst-rate'].forEach(id => $(id).addEventListener('input', calcGST));
  document.querySelectorAll('input[name=gst-mode]').forEach(r => r.addEventListener('change', calcGST));
}

/* ---------- BMI Calculator ---------- */
if ($('bmi-go')) {
  $('bmi-go').addEventListener('click', () => {
    const h = parseFloat($('bmi-h').value), w = parseFloat($('bmi-w').value);
    if (!h || !w || h <= 0 || w <= 0) { alert('Please enter valid height and weight.'); return; }
    const bmi = w / Math.pow(h / 100, 2);
    $('bmi-val').textContent = bmi.toFixed(1);
    $('bmi-cat').textContent = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    $('bmi-range').textContent = (18.5 * Math.pow(h / 100, 2)).toFixed(1) + ' – ' + (24.9 * Math.pow(h / 100, 2)).toFixed(1) + ' kg';
    $('bmi-result').hidden = false;
  });
}

/* ---------- Percentage Calculator ---------- */
if ($('p1-go')) {
  $('p1-go').onclick = () => {
    const x = parseFloat($('p1-x').value), y = parseFloat($('p1-y').value);
    $('p1-out').textContent = (!isNaN(x) && !isNaN(y)) ? (+(x * y / 100).toFixed(4)).toLocaleString('en-US') : '—';
  };
  $('p2-go').onclick = () => {
    const x = parseFloat($('p2-x').value), y = parseFloat($('p2-y').value);
    $('p2-out').textContent = (!isNaN(x) && !isNaN(y) && y !== 0) ? (+(x / y * 100).toFixed(2)).toLocaleString('en-US') + '%' : '—';
  };
  $('p3-go').onclick = () => {
    const o = parseFloat($('p3-old').value), n = parseFloat($('p3-new').value);
    if (isNaN(o) || isNaN(n) || o === 0) { $('p3-out').textContent = '—'; return; }
    const d = (n - o) / o * 100;
    $('p3-out').textContent = (d >= 0 ? '+' : '') + (+d.toFixed(2)).toLocaleString('en-US') + '% ' + (d >= 0 ? 'increase' : 'decrease');
  };
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

/* ---------- Text to Speech (native + online fallback) ---------- */
if ($('tts-speak')) {
  const statusEl = $('tts-status');
  const say = msg => { if (statusEl) statusEl.textContent = msg; };
  const hasNative = ('speechSynthesis' in window) && !!window.speechSynthesis;
  const rateEl = $('tts-rate'), rateVal = $('tts-rate-val'), textEl = $('tts-text'), voiceSel = $('tts-voice');
  rateEl.addEventListener('input', e => rateVal.textContent = e.target.value + 'x');

  /* ---- Online fallback: Google TTS audio (har browser me chalta hai) ---- */
  const fb = { audio: null, queue: [], playing: false };
  const hasHindi = t => /[\u0900-\u097F]/.test(t);
  const chunkText = t => {
    const parts = t.match(/[^\u0964.!?\n]+[\u0964.!?\n]?/g) || [t];
    const out = [];
    for (const p of parts) {
      const s2 = p.trim();
      if (!s2) continue;
      if (s2.length <= 180) out.push(s2);
      else for (let i = 0; i < s2.length; i += 180) out.push(s2.slice(i, i + 180));
    }
    return out.slice(0, 20);
  };
  const fbStop = () => {
    fb.queue = []; fb.playing = false;
    try { if (fb.audio) { fb.audio.pause(); fb.audio.removeAttribute('src'); fb.audio.load(); } } catch (e) {}
  };
  const fbUrls = (text, lang) => {
    const g = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=' + lang + '&client=tw-ob&q=' + encodeURIComponent(text);
    return [g, g]; /* do baar try: pehli baar network hiccup ho to */
  };
  const fbPlayNext = () => {
    if (!fb.queue.length) { fb.playing = false; say(''); return; }
    fb.playing = true;
    const item = fb.queue.shift();
    const a = fb.audio || (fb.audio = new Audio());
    a.playbackRate = parseFloat(rateEl.value) || 1;
    const urls = fbUrls(item.text, item.lang);
    let ui = 0, settled = false;
    const done = msg => { if (!settled) { settled = true; fb.playing = false; say(msg); } };
    const tryUrl = () => {
      if (ui >= urls.length) { done('\u26A0\uFE0F Awaz load nahi hui \u2014 internet check karo, ya Chrome browser me kholo.'); return; }
      say('\uD83D\uDD0A Awaz load ho rahi hai...');
      try { a.pause(); } catch (e) {}
      a.src = urls[ui++];
      try { a.load(); } catch (e) {}
      const pr = a.play();
      if (pr && pr.catch) pr.catch(() => { /* load error -> onerror bhi fire hoga */ });
    };
    a.onended = () => { settled = true; fbPlayNext(); };
    a.onplaying = () => { settled = true; say('\uD83D\uDD0A Bol raha hai... (online awaz)'); };
    a.onerror = () => { settled = false; tryUrl(); };
    tryUrl();
  };
  const fbSpeak = text => {
    fbStop();
    const lang = hasHindi(text) ? 'hi' : 'en';
    fb.queue = chunkText(text).map(t => ({ text: t, lang }));
    if (!fb.queue.length) { say('Pehle kuch text likho!'); return; }
    fbPlayNext();
  };

  if (!hasNative) {
    /* Is browser me built-in TTS nahi — online fallback */
    if (voiceSel) { voiceSel.innerHTML = '<option>Online awaz (auto)</option>'; voiceSel.disabled = true; }
    say('\u2139\uFE0F Is browser me built-in awaz nahi hai \u2014 online awaz use hogi (internet chahiye).');
    $('tts-speak').addEventListener('click', () => {
      const text = textEl.value.trim();
      if (!text) { say('Pehle kuch text likho!'); return; }
      fbSpeak(text);
    });
    $('tts-stop').addEventListener('click', () => { fbStop(); say(''); });
  } else {
    const synth = window.speechSynthesis;
    const fillVoices = () => {
      const voices = synth.getVoices();
      const prev = voiceSel.value;
      voiceSel.innerHTML = '';
      let hiIdx = -1;
      voices.forEach((v, i) => {
        const o = document.createElement('option');
        o.value = i; o.textContent = v.name + ' (' + v.lang + ')';
        if (hiIdx < 0 && v.lang.toLowerCase().startsWith('hi')) hiIdx = i;
        voiceSel.appendChild(o);
      });
      if (voices.length) voiceSel.selectedIndex = (prev !== '' && +prev < voices.length) ? +prev : (hiIdx >= 0 ? hiIdx : 0);
    };
    fillVoices();
    try { synth.onvoiceschanged = fillVoices; } catch (e) {}
    document.addEventListener('pointerdown', function once() { fillVoices(); document.removeEventListener('pointerdown', once); });
    $('tts-speak').addEventListener('click', () => {
      const text = textEl.value.trim();
      if (!text) { say('Pehle kuch text likho!'); return; }
      try {
        synth.cancel();
        if (synth.paused) synth.resume();
        const u = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        const vi = parseInt(voiceSel.value, 10);
        if (voices[vi]) { u.voice = voices[vi]; u.lang = voices[vi].lang; }
        else { u.lang = 'hi-IN'; }
        u.rate = parseFloat(rateEl.value) || 1;
        u.onend = () => say('');
        u.onerror = () => say('\u26A0\uFE0F Awaz chalane me dikkat aayi \u2014 dusri awaz chun kar try karo.');
        window._ttsU = u;
        say('\uD83D\uDD0A Bol raha hai...');
        setTimeout(() => synth.speak(u), 60);
      } catch (err) { say('\u26A0\uFE0F Error: ' + err.message); }
    });
    $('tts-stop').addEventListener('click', () => { try { synth.cancel(); } catch (e) {} say(''); });
  }
}

/* ---------- Color Picker ---------- */
if ($('cp-input')) {
  const upd = () => {
    const hex = $('cp-input').value.toUpperCase();
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    $('cp-hex').textContent = hex;
    $('cp-rgb').textContent = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  };
  $('cp-input').addEventListener('input', upd);
  $('cp-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('cp-hex').textContent); alert('कॉपी हो गया! 📋'); }
    catch { alert('कॉपी नहीं हुआ'); }
  });
  const presets = ['#6c4dff', '#4d96ff', '#00c853', '#ffab00', '#ff5252', '#ec407a', '#00bcd4', '#8d6e63', '#000000', '#ffffff'];
  const box = $('cp-swatches');
  presets.forEach(c => {
    const s = document.createElement('div');
    s.className = 'swatch'; s.style.background = c; s.title = c;
    s.onclick = () => { $('cp-input').value = c; upd(); };
    box.appendChild(s);
  });
  upd();
}

/* ---------- URL Shortener (is.gd) ---------- */
if ($('us-go')) {
  $('us-go').addEventListener('click', async () => {
    let url = $('us-url').value.trim();
    if (!url) { alert('पहले URL लिखो'); return; }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    $('us-go').textContent = '⏳ छोटा हो रहा...';
    try {
      const r = await fetch('https://is.gd/create.php?format=simple&url=' + encodeURIComponent(url));
      const short = (await r.text()).trim();
      if (!short.startsWith('http')) throw new Error(short);
      $('us-out').textContent = short;
      $('us-result').hidden = false;
    } catch (e) { alert('छोटा नहीं हो पाया — URL सही है? फिर try करो।'); }
    $('us-go').textContent = '✂️ छोटा करो';
  });
  $('us-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('us-out').textContent); alert('कॉपी हो गया! 📋'); }
    catch { alert('कॉपी नहीं हुआ'); }
  });
}

/* ---------- EMI Calculator ---------- */
if ($('emi-p')) {
  const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  const calcEMI = () => {
    const P = +$('emi-p').value, annual = +$('emi-r').value, years = +$('emi-n').value;
    const r = annual / 12 / 100, n = years * 12;
    const emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    $('emi-p-val').textContent = '₹' + inr.format(P);
    $('emi-r-val').textContent = annual + '%';
    $('emi-n-val').textContent = years + ' साल';
    $('emi-emi').textContent = '₹' + inr.format(Math.round(emi));
    $('emi-interest').textContent = '₹' + inr.format(Math.round(emi * n - P));
    $('emi-total').textContent = '₹' + inr.format(Math.round(emi * n));
  };
  ['emi-p', 'emi-r', 'emi-n'].forEach(id => $(id).addEventListener('input', calcEMI));
  calcEMI();
}

/* ---------- AI helpers (Pollinations — free, no key) ---------- */
async function aiText(prompt) {
  const r = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt));
  if (!r.ok) throw new Error('AI busy');
  return (await r.text()).trim();
}

/* ---------- AI Chat ---------- */
if ($('chat-send')) {
  const box = $('chat-box');
  const addMsg = (text, who) => {
    const d = document.createElement('div');
    d.className = 'msg ' + who; d.textContent = text;
    box.appendChild(d); box.scrollTop = box.scrollHeight;
    return d;
  };
  const send = async () => {
    const q = $('chat-in').value.trim();
    if (!q) return;
    addMsg(q, 'user');
    $('chat-in').value = '';
    const typing = addMsg('सोच रहा है... 🤔', 'typing');
    try {
      const ans = await aiText('Reply in the same language as the user (Hindi or English). Keep it short and helpful. User: ' + q);
      typing.className = 'msg ai'; typing.textContent = ans;
    } catch { typing.className = 'msg ai'; typing.textContent = '😅 AI अभी व्यस्त है — थोड़ी देर में फिर try करो।'; }
    box.scrollTop = box.scrollHeight;
  };
  $('chat-send').addEventListener('click', send);
  $('chat-in').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

/* ---------- AI Image Generator ---------- */
if ($('aig-go')) {
  const make = () => {
    const p = $('aig-prompt').value.trim();
    if (!p) { alert('पहले बताओ कैसी फोटो चाहिए'); return; }
    const [w, h] = $('aig-size').value.split('x');
    const seed = Math.floor(Math.random() * 999999);
    const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(p) + '?width=' + w + '&height=' + h + '&nologo=true&seed=' + seed;
    $('aig-go').textContent = '⏳ बन रही है...';
    const img = $('aig-img');
    img.onload = () => { $('aig-result').hidden = false; $('aig-go').textContent = '✨ फोटो बनाओ'; };
    img.onerror = () => { alert('फोटो नहीं बन पाई — फिर try करो'); $('aig-go').textContent = '✨ फोटो बनाओ'; };
    img.src = url;
    $('aig-download').href = url;
  };
  $('aig-go').addEventListener('click', make);
  $('aig-again').addEventListener('click', make);
}

/* ---------- AI Writer ---------- */
if ($('aiw-go')) {
  const PROMPTS = {
    shayari: t => 'Write a beautiful 4-line Hindi shayari (Devanagari script) on: ' + t,
    story: t => 'Write a short interesting story in Hindi (Devanagari, ~150 words) on: ' + t,
    essay: t => 'Write a simple essay in Hindi (Devanagari, ~200 words) on: ' + t,
    caption: t => 'Write 3 catchy social media captions in Hindi+English mix for: ' + t,
    paraphrase: t => 'Rewrite this text in better, simpler Hindi without changing meaning: ' + t
  };
  $('aiw-go').addEventListener('click', async () => {
    const mode = $('aiw-mode').value, topic = $('aiw-topic').value.trim();
    if (!topic) { alert('पहले विषय लिखो'); return; }
    $('aiw-go').textContent = '⏳ लिख रहा है...';
    try {
      $('aiw-out').textContent = await aiText(PROMPTS[mode](topic));
      $('aiw-result').hidden = false;
    } catch { alert('😅 AI अभी व्यस्त है — थोड़ी देर में फिर try करो।'); }
    $('aiw-go').textContent = '✨ लिखवाओ';
  });
  $('aiw-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('aiw-out').textContent); alert('कॉपी हो गया! 📋'); }
    catch { alert('कॉपी नहीं हुआ'); }
  });
}

/* ---------- Hashtag Generator ---------- */
if ($('ht-go')) {
  $('ht-go').addEventListener('click', async () => {
    const topic = $('ht-topic').value.trim();
    if (!topic) { alert('पहले विषय लिखो'); return; }
    $('ht-go').textContent = '⏳ बना रहा है...';
    try {
      const out = await aiText('Generate 15 trending hashtags (mix of popular and niche) for social media on this topic, comma separated, each starting with #: ' + topic);
      $('ht-out').textContent = out;
      $('ht-result').hidden = false;
    } catch { alert('😅 AI अभी व्यस्त है — थोड़ी देर में फिर try करो।'); }
    $('ht-go').textContent = '#️⃣ हैशटैग बनाओ';
  });
  $('ht-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('ht-out').textContent); alert('कॉपी हो गया! 📋'); }
    catch { alert('कॉपी नहीं हुआ'); }
  });
}
