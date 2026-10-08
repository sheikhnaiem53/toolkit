(function(){'use strict';
var d=document;
function toggleMenu(){var m=d.getElementById('mmenu');if(!m)return;m.classList.toggle('open');var b=d.getElementById('menubtn');if(b)b.setAttribute('aria-expanded',m.classList.contains('open')?'true':'false')}
window.toggleMenu=toggleMenu;
d.addEventListener('click',function(e){var m=d.getElementById('mmenu');if(m&&m.classList.contains('open')&&!e.target.closest('#mmenu')&&!e.target.closest('#menubtn')){m.classList.remove('open');var b=d.getElementById('menubtn');if(b)b.setAttribute('aria-expanded','false')}});
function savedSet(){try{return new Set(JSON.parse(localStorage.getItem('toolkit_saved')||'[]'))}catch(e){return new Set()}}
function isSaved(id){return savedSet().has(id)}
function paintStars(){var s=savedSet();d.querySelectorAll('.star').forEach(function(el){var on=s.has(el.getAttribute('data-id'));el.classList.toggle('on',on);el.setAttribute('aria-pressed',on?'true':'false')})}
window.toggleSave=function(id,btn){var s=savedSet();if(s.has(id))s.delete(id);else s.add(id);try{localStorage.setItem('toolkit_saved',JSON.stringify(Array.from(s)))}catch(e){}paintStars();if(typeof drawSaved==='function')drawSaved();return false};
d.addEventListener('click',function(e){var st=e.target.closest('.star');if(st){e.preventDefault();e.stopPropagation();window.toggleSave(st.getAttribute('data-id'),st)}});
d.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('star')){e.preventDefault();window.toggleSave(e.target.getAttribute('data-id'),e.target)}});
var searchCache=null;
function getSearch(){if(searchCache)return Promise.resolve(searchCache);return fetch('/search.json').then(function(r){return r.json()}).then(function(j){searchCache=j;return j}).catch(function(){return[]})}
function setupSearch(){d.querySelectorAll('[data-search]').forEach(function(inp){
var box=inp.parentElement,dd=null,noneMsg=inp.getAttribute('data-none')||'No results';
function close(){if(dd){dd.remove();dd=null}}
function render(items,q){close();dd=d.createElement('div');dd.className='sugg';dd.setAttribute('role','listbox');
if(!items.length){dd.innerHTML='<div class="none">'+noneMsg+'</div>'}else{var pl=d.documentElement.lang||'hi';items.slice(0,8).forEach(function(it){var a=d.createElement('a');a.href=(typeof it.u==='string')?it.u:(it.u[pl]||it.u.hi);a.setAttribute('role','option');var nm=d.createElement('span');nm.textContent=(typeof it.n==='string')?it.n:(it.n[pl]||it.n.hi);var k=d.createElement('small');k.textContent=it.k;a.appendChild(nm);a.appendChild(k);dd.appendChild(a)})}
box.appendChild(dd)}
inp.setAttribute('autocomplete','off');inp.setAttribute('role','combobox');inp.setAttribute('aria-expanded','false');
inp.addEventListener('input',function(){var q=inp.value.trim().toLowerCase();if(q.length<2){close();inp.setAttribute('aria-expanded','false');return}
getSearch().then(function(all){var hits=all.filter(function(it){return it.t.toLowerCase().indexOf(q)>-1}).slice(0,8);render(hits,q);inp.setAttribute('aria-expanded','true')})});
inp.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
d.addEventListener('click',function(e){if(dd&&!box.contains(e.target))close()});
})}
function setupDir(){var bar=d.getElementById('catbar');if(!bar)return;var cards=Array.prototype.slice.call(d.querySelectorAll('.ai-card'));var cnt=d.getElementById('dircount');var all=bar.getAttribute('data-all')||'All';
function apply(){var cat=bar.querySelector('.on').getAttribute('data-cat');var q=(d.getElementById('dir-q').value||'').trim().toLowerCase();var n=0;
cards.forEach(function(c){var ok=(cat==='all'||c.getAttribute('data-cat')===cat);if(ok&&q){ok=c.getAttribute('data-keys').toLowerCase().indexOf(q)>-1}
c.style.display=ok?'':'none';if(ok)n++});
if(cnt)cnt.textContent=n+' / '+cards.length;
var none=d.getElementById('dir-none');if(none)none.hidden=n>0}
bar.addEventListener('click',function(e){var b=e.target.closest('.cat-btn');if(!b)return;bar.querySelectorAll('.cat-btn').forEach(function(x){x.classList.remove('on')});b.classList.add('on');apply()});
var q=d.getElementById('dir-q');if(q)q.addEventListener('input',apply);apply()}
window.drawSaved=function(){var grid=d.getElementById('saved-grid');if(!grid)return;var raw=d.getElementById('saved-data');var all=raw?JSON.parse(raw.textContent):[];var s=savedSet();var list=all.filter(function(t){return s.has(t.id)});
d.getElementById('saved-empty').hidden=list.length>0;grid.innerHTML='';
list.forEach(function(t){var a=d.createElement('a');a.className='tool-card';a.href=t.url;var st=d.createElement('span');st.className='star on';st.setAttribute('data-id',t.id);st.setAttribute('role','button');st.setAttribute('tabindex','0');st.setAttribute('aria-label','★');st.textContent='★';var tile=d.createElement('span');tile.className='tool-tile';tile.style.background=t.bg;tile.textContent=t.icon;var h=d.createElement('h3');h.textContent=t.name;a.appendChild(st);a.appendChild(tile);a.appendChild(h);grid.appendChild(a)});paintStars()};
d.addEventListener('DOMContentLoaded',function(){paintStars();setupSearch();setupDir();if(d.getElementById('saved-grid'))window.drawSaved()});
})();