(function(){'use strict';
var d=document,CACHE={};
function getVid(){try{var v=null;try{v=localStorage.getItem('tk_vid')}catch(e){}
if(!v){v='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c=='x'?r:(r&0x3|0x8)).toString(16)});try{localStorage.setItem('tk_vid',v)}catch(e){}}return v||'anon'}catch(e){return 'anon'}}
function starsHTML(val,slug){var h='<span class="rstars">';for(var i=1;i<=5;i++){h+='<button type="button" class="rstar'+(i<=Math.round(val)?' lit':'')+'" data-slug="'+slug+'" data-v="'+i+'" aria-label="'+i+' / 5">\u2605</button>'}return h+'</span>'}
function paint(el){var slug=el.getAttribute('data-slug'),r=CACHE[slug],none=el.getAttribute('data-norate')||'No ratings yet';var h='';
if(r&&r.count>=5){h='<span class="rate-val">\u2605 '+r.avg.toFixed(1)+' ('+r.count+')</span> '+starsHTML(r.avg,slug)}else{h='<span class="rate-msg">'+none+'</span><br>'+starsHTML(0,slug)}el.innerHTML=h}
function load(el){var slug=el.getAttribute('data-slug');if(CACHE[slug]!==undefined){paint(el);return}
fetch('/api/rate?tool='+encodeURIComponent(slug)).then(function(x){return x.json()}).then(function(j){CACHE[slug]=j;paint(el)}).catch(function(){paint(el)})}
function scan(root){var els=(root||d).querySelectorAll('.rate:not([data-rd])');for(var k=0;k<els.length;k++){(function(el){el.setAttribute('data-rd','1');
if('IntersectionObserver' in window){var ob=new IntersectionObserver(function(en){for(var j=0;j<en.length;j++){if(en[j].isIntersecting){ob.disconnect();load(el)}}},{rootMargin:'200px'});ob.observe(el)}else{load(el)}})(els[k])}}
d.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.rstar'):null;if(!b)return;e.preventDefault();
var slug=b.getAttribute('data-slug'),v=parseInt(b.getAttribute('data-v'),10);
fetch('/api/rate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool:slug,stars:v,vid:getVid()})}).then(function(x){return x.json()}).then(function(j){if(j&&typeof j.count==='number'){CACHE[slug]=j;var els=d.querySelectorAll('.rate[data-slug="'+slug+'"]');for(var k=0;k<els.length;k++)paint(els[k])}}).catch(function(){})});
window.tkRateScan=scan;
if(d.readyState==='loading'){d.addEventListener('DOMContentLoaded',function(){scan(d)})}else{scan(d)}
})();