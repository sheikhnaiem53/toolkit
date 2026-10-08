(function(){'use strict';
var d=document;
var grid=d.getElementById('dir-grid');if(!grid)return;
var L=JSON.parse(d.getElementById('ai-dir-l10n').textContent);
var moreBtn=d.getElementById('dir-more'),cnt=d.getElementById('dircount'),
    q=d.getElementById('dir-q'),bar=d.getElementById('aibar'),
    freeT=d.getElementById('free-only'),sortS=d.getElementById('dir-sort'),
    noneBox=d.getElementById('dir-none');
var ALL=null,RATINGS=null,loading=false;
var state={cat:'all',free:false,q:'',sort:'pop',limit:48},BATCH=48;
function escA(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function cardHTML(t){
var logo=t.logo?'<img class="ai-logo" src="/assets/logos/'+escA(t.logo)+'" width="64" height="64" alt="'+escA(t.n)+' '+escA(L.logoword)+'" loading="lazy">'
:'<span class="ai-logo ai-logo-ph" style="background:'+t.bg+'" aria-hidden="true">'+escA(t.n.charAt(0).toUpperCase())+'</span>';
var checked=t.checked?' <span class="checked">'+escA(L.checked)+'</span>':'';
return '<article class="ai-card" data-slug="'+t.slug+'"><div class="ai-top">'+logo+'<div class="ai-head">'
+'<a class="ai-name" href="'+L.prefix+'/ai-tools/'+t.slug+'/">'+escA(t.n)+'</a>'
+'<div class="ai-meta"><span class="badge badge-'+t.t+'">'+escA(L['badge_'+t.t])+'</span>'+checked+'<span class="cat-tag">'+escA(L.cats[t.c]||t.c)+'</span></div>'
+'</div></div><span class="ai-desc">'+escA(t.d)+'</span>'
+'<div class="rate" data-slug="'+t.slug+'" data-norate="'+escA(L.norate)+'"></div>'
+'<a class="ai-offbtn" href="'+escA(t.u)+'" target="_blank" rel="noopener nofollow">'+escA(L.open)+'</a></article>'}
function rkey(t){var r=RATINGS&&RATINGS[t.slug];return(r&&r.count>=5)?r.avg:-1}
function filtered(){var list=ALL||[];
if(state.cat!=='all')list=list.filter(function(t){return t.c===state.cat});
if(state.free)list=list.filter(function(t){return t.t==='free'});
if(state.q){var s=state.q;list=list.filter(function(t){return(t.n+' '+t.d).toLowerCase().indexOf(s)>-1})}
list=list.slice();
if(state.sort==='az')list.sort(function(a,b){return a.n.localeCompare(b.n)});
else if(state.sort==='top'&&RATINGS)list.sort(function(a,b){return rkey(b)-rkey(a)});
return list}
function render(){if(!ALL)return;var list=filtered(),show=list.slice(0,state.limit),h='';
for(var i=0;i<show.length;i++)h+=cardHTML(show[i]);
grid.innerHTML=h;
var left=list.length-state.limit;
moreBtn.hidden=list.length<=state.limit;
moreBtn.textContent=L.more+(left>0?' ('+left+')':'');
cnt.textContent=list.length+' / '+ALL.length;
noneBox.hidden=list.length>0;
if(window.tkRateScan)window.tkRateScan(grid)}
function ensureData(cb){if(ALL){cb();return}
if(loading){var iv=setInterval(function(){if(ALL){clearInterval(iv);cb()}},200);return}
loading=true;
fetch('/assets/ai-extra.json').then(function(x){return x.json()}).then(function(j){ALL=j;loading=false;cb()}).catch(function(){loading=false})}
function apply(){ensureData(render)}
bar.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.cat-btn'):null;if(!b)return;
var bs=bar.querySelectorAll('.cat-btn');for(var i=0;i<bs.length;i++)bs[i].classList.remove('on');
b.classList.add('on');state.cat=b.getAttribute('data-cat');state.limit=BATCH;apply()});
freeT.addEventListener('click',function(){freeT.classList.toggle('on');state.free=freeT.classList.contains('on');state.limit=BATCH;apply()});
sortS.addEventListener('change',function(){state.sort=sortS.value;state.limit=BATCH;
if(state.sort==='top'&&!RATINGS){fetch('/api/rate').then(function(x){return x.json()}).then(function(j){RATINGS=j;apply()}).catch(function(){apply()})}else apply()});
var qt=null;
q.addEventListener('input',function(){clearTimeout(qt);qt=setTimeout(function(){state.q=q.value.trim().toLowerCase();state.limit=BATCH;apply()},250)});
moreBtn.addEventListener('click',function(){state.limit+=BATCH;render()});
ensureData(function(){if(!ALL)return;var left=ALL.length-state.limit;moreBtn.hidden=left<=0;moreBtn.textContent=L.more+(left>0?' ('+left+')':'');cnt.textContent=Math.min(state.limit,ALL.length)+' / '+ALL.length});
})();