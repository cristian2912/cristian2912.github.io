(function(){
  function fixImgs(){
    var imgs=document.querySelectorAll('img');
    imgs.forEach(function(img){
      var dl = img.getAttribute('data-lazy-src') || img.getAttribute('data-src');
      if(dl && (!img.getAttribute('src') || img.getAttribute('src').trim()==='')){
        img.setAttribute('src', dl);
      }
      var dlset = img.getAttribute('data-lazy-srcset');
      if(dlset){ img.setAttribute('srcset', dlset); }
      img.classList.remove('lazyload');
      img.style.opacity='1';
      img.style.visibility='visible';
    });
    // Divi background helpers
    document.querySelectorAll('[data-bg],[data-parallax-image]').forEach(function(el){
      var bg = el.getAttribute('data-bg') || el.getAttribute('data-parallax-image');
      if(bg && !el.style.backgroundImage){
        el.style.backgroundImage = "url('"+bg+"')";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center center';
      }
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', fixImgs);
  } else {
    fixImgs();
  }
  // In case Divi toggles after load
  window.addEventListener('load', function(){ setTimeout(fixImgs, 100); });
})();

// Scroll-down button behavior: go to the next .et_pb_section after the header
document.addEventListener('click', function(ev){
  var a = ev.target.closest && ev.target.closest('.scroll-down-container');
  if(!a) return;
  ev.preventDefault();
  var header = document.querySelector('.et_pb_fullwidth_header_0');
  var next = null;
  if(header){
    // find the parent .et_pb_section of header, then its next sibling .et_pb_section
    var section = header.closest('.et_pb_section');
    next = section && section.nextElementSibling;
    while(next && !next.classList.contains('et_pb_section')){ next = next.nextElementSibling; }
  }
  if(!next){ next = document.querySelectorAll('.et_pb_section')[1]; }
  if(next){
    var top = next.getBoundingClientRect().top + window.pageYOffset - 20;
    window.scrollTo({top: top, behavior: 'smooth'});
  }
}, {passive:false});


// Map WP uploads to local images by basename (ignores size suffixes like -480x480)
(function(){
  function basenameNoSize(fn){
    var m = fn.match(/([^\/]+?)(?:-\d+x\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
    return m ? m[1] : null;
  }
  function remapImgs(){
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function(img){
      var src = img.getAttribute('src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-src');
      if(!src) return;
      if(/\/wp-content\/uploads\//.test(src)){
        var bn = basenameNoSize(src);
        if(!bn) return;
        var map = (window.__LOCAL_IMAGES__ || {});
        var local = map[bn];
        if(local){
          img.setAttribute('src', 'images/'+local);
          img.removeAttribute('srcset');
        }
      }
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', remapImgs);
  } else { remapImgs(); }
  window.addEventListener('load', remapImgs);
})();


// Force backgrounds for sections 2 and 3 at runtime with !important
(function(){
  function setImportant(el, prop, val){ try{ el.style.setProperty(prop, val, 'important'); }catch(e){} }
  function apply(){
    var s2 = document.querySelector('.et_pb_section_2.et_pb_with_background');
    var s3 = document.querySelector('.et_pb_section_3.et_pb_with_background');
    [s2,s3].forEach(function(s){
      if(!s) return;
      setImportant(s, 'background-image', "url('images/spa1-1.jpg')");
      setImportant(s, 'background-size', 'cover');
      setImportant(s, 'background-position', 'center center');
      setImportant(s, 'background-repeat', 'no-repeat');
      setImportant(s, 'position', 'relative');
    });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', apply); } else { apply(); }
  window.addEventListener('load', apply);
})();


// --- Patch "¿Cómo funciona?" section without relying on Divi classes ---
(function(){
  function normalize(t){ return (t||"").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  function patchHow(){
    var headings = Array.from(document.querySelectorAll('h2,h3,h1'));
    var target = headings.find(h => normalize(h.textContent||'').indexOf('como funciona') !== -1);
    if(!target) return;
    var section = target.closest('.et_pb_section') || target.closest('section') || target.closest('div');
    if(!section) return;
    section.classList.add('cf-patched');
    // Ensure background gradient
    section.style.setProperty('position','relative','important');
    section.style.setProperty('background','radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.6) 48%, #b1a066 70%, #b1a066 100%)','important');
    // Style inner columns as cards
    var cols = section.querySelectorAll('.et_pb_row_7 .et_pb_column');
    cols.forEach(function(c){
      c.style.setProperty('background','rgba(177,160,102,0.95)','important');
      c.style.setProperty('border-radius','14px','important');
      c.style.setProperty('border','1px solid rgba(0,0,0,0.08)','important');
      c.style.setProperty('box-shadow','0 10px 30px rgba(0,0,0,0.18)','important');
      c.style.setProperty('padding','24px 28px','important');
    });
    // Center icons and enforce text colors
    section.querySelectorAll('.et_pb_image img').forEach(function(img){
      img.style.display='block'; img.style.margin='0 auto 8px'; img.style.width='32px'; img.style.height='auto';
    });
    section.querySelectorAll('.et_pb_text h4').forEach(function(h){ h.style.color='#14110f'; });
    section.querySelectorAll('.et_pb_text p').forEach(function(p){ p.style.color='#ffffff'; });
    // Style CTA button pill
    var cta = section.querySelector('.et_pb_button_5, .et_pb_button');
    if(cta){
      cta.style.setProperty('background','#b1a066','important');
      cta.style.setProperty('color','#fff','important');
      cta.style.setProperty('border-radius','40px','important');
      cta.style.setProperty('padding','18px 36px','important');
      cta.style.setProperty('border','2px solid #fff','important');
      cta.style.setProperty('box-shadow','0 6px 20px rgba(0,0,0,.15)','important');
    }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', patchHow); } else { patchHow(); }
  window.addEventListener('load', patchHow);
})();


(function(){
  function iconFix(){
    var sec = document.querySelector('.cf-patched') || document.querySelector('.et_pb_section_5');
    if(!sec) return;
    var cols = sec.querySelectorAll('.et_pb_row_7 .et_pb_column');
    var icons = [
      'Health-Clinic-icon-orange-1-1.png',
      'Health-Clinic-icon-orange-3-1.png',
      'Health-Clinic-icon-orange-4-1.png'
    ];
    cols.forEach(function(col, idx){
      var img = col.querySelector('.et_pb_image img');
      var ic = icons[idx];
      if(img && ic){ img.src = 'images/'+ic; img.srcset=''; img.style.width='48px'; }
    });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', iconFix); } else { iconFix(); }
  window.addEventListener('load', iconFix);
})();

// --- Animations for "¿Cómo funciona?" section ---
(function(){
  function norm(t){ return (t||"").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  function findSection(){
    var byClass = document.querySelector('.et_pb_section_5');
    if(byClass) return byClass;
    var h = Array.from(document.querySelectorAll('h1,h2,h3')).find(x => norm(x.textContent||'').indexOf('como funciona')!==-1);
    return h ? (h.closest('.et_pb_section') || h.closest('section') || h.closest('div')) : null;
  }
  function init(){
    var sec = findSection();
    if(!sec) return;
    // mark header row and cards
    var headerCols = sec.querySelectorAll('.et_pb_row_6 .et_pb_column');
    headerCols.forEach(c => c.classList.add('cf-anim'));
    var cards = sec.querySelectorAll('.et_pb_row_7 .et_pb_column');
    cards.forEach((c,i)=>{ c.classList.add('cf-anim'); });

    // IntersectionObserver to reveal
    var io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add('cf-in');
      });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.1});
    headerCols.forEach(el=>io.observe(el));
    cards.forEach(el=>io.observe(el));

    // subtle parallax on scroll
    var lastY = window.pageYOffset;
    function tick(){
      var y = window.pageYOffset;
      if(Math.abs(y-lastY)<1){ requestAnimationFrame(tick); return; }
      lastY = y;
      var rect = sec.getBoundingClientRect();
      var v = Math.max(0, Math.min(1, 1 - Math.abs(rect.top)/ (window.innerHeight*1.2)));
      cards.forEach((c,idx)=>{
        var offset = (idx-1)*4; // -4, 0, +4 px
        c.style.transform = (c.classList.contains('cf-in') ? 'translateY('+( -4*v + offset )+'px) scale(1.0)' : c.style.transform);
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
  window.addEventListener('load', init);
})();


// Reveal anim: fondo y tarjetas de "¿Cómo funciona?"
(function(){
  function norm(t){ return (t||"").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  function findSection(){
    var s = document.querySelector('.et_pb_section_5'); if(s) return s;
    var h = Array.from(document.querySelectorAll('h1,h2,h3')).find(x => norm(x.textContent||'').includes('como funciona'));
    return h ? (h.closest('.et_pb_section') || h.closest('section') || h.closest('div')) : null;
  }
  function initReveal(){
    var sec = findSection(); if(!sec) return;
    sec.classList.add('cf-bg-reveal');
    var cards = sec.querySelectorAll('.et_pb_row_7 .et_pb_column');
    var headCols = sec.querySelectorAll('.et_pb_row_6 .et_pb_column');
    [...headCols, ...cards].forEach((el,i)=>{
      el.classList.add('cf-anim');
      el.style.transitionDelay = (150 + i*120) + 'ms'; // escalonado
    });
    var io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          if(e.target===sec){ sec.classList.add('cf-in-bg'); }
          else { e.target.classList.add('cf-in'); }
        }
      });
    }, {threshold: 0.12});
    io.observe(sec);
    [...headCols, ...cards].forEach(el=>io.observe(el));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initReveal);
  else initReveal();
  window.addEventListener('load', initReveal);
})();


// --- Re-trigger reveal on reload and when initially in view ---
(function(){
  function inViewport(el){
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight||document.documentElement.clientHeight) && r.bottom > 0;
  }
  function stagedAdd(el, cls){
    // force reflow then add class next frame for reliable transition
    void el.offsetWidth;
    requestAnimationFrame(function(){ el.classList.add(cls); });
  }
  function retrigger(){
    var sec = document.querySelector('.et_pb_section_5') || document.querySelector('.cf-bg-reveal');
    if(!sec) return;
    // reset classes in case of bfcache restore
    sec.classList.remove('cf-in-bg');
    var nodes = sec.querySelectorAll('.cf-anim');
    nodes.forEach(function(n){ n.classList.remove('cf-in'); });
    // if visible on load, stage the animation
    if(inViewport(sec)){
      // reveal background
      stagedAdd(sec, 'cf-in-bg');
      nodes.forEach(function(n){ stagedAdd(n, 'cf-in'); });
    }
  }
  // run on load and on pageshow (bfcache)
  window.addEventListener('load', retrigger);
  window.addEventListener('pageshow', function(e){ if(e.persisted) retrigger(); });
})();

// Build Contact section background and social icons
(function(){
  function setupContact(){
    var sec = document.querySelector('.et_pb_section_7');
    if(!sec) return;
    
  // Color the phone number dark for contrast
  var phoneBox = Array.from(sec.querySelectorAll('.et_pb_text')).find(n => /\+?\d[\d\s().-]{6,}/.test((n.textContent||'')));
  if(phoneBox){ phoneBox.classList.add('cf-phone'); }
    // Hide Divi social list if present
    var ul = sec.querySelector('.et_pb_social_media_follow');
    if(ul) ul.style.display='none';
    // Create our own icons row once
    if(sec.querySelector('.cf-social')) return;
    var row = document.createElement('div'); row.className='cf-social';
    // Links (replace # with real ones if needed)
    var links = {
      instagram: 'https://www.instagram.com/terapiasdebienestarcecimor/',
      facebook: '#',
      tiktok: '#'
    };
    function iconSVG(name){
  // Pixel-aligned 24x24 icons
  if(name==='facebook') return '<svg viewBox="0 0 24 24" aria-label="Facebook"><path fill="currentColor" d="M14 3.5c-2.2 0-3.5 1.3-3.5 3.6v2.3H8v3h2.5V21h3.2v-8.6h2.7l.4-3h-3.1V7.4c0-.7.2-1.2 1.2-1.2h1.9V3.6c-.5-.1-1.7-.1-3.1-.1z"/></svg>';
  if(name==='instagram') return '<svg viewBox="0 0 24 24" class="outline" aria-label="Instagram"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17" cy="7" r="1.2"/></svg>';
  if(name==='tiktok') return '<svg viewBox="0 0 16 16" aria-label="TikTok"><path fill="currentColor" d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg>'; return '';
}
    ['facebook','instagram','tiktok'].forEach(function(name){
      var a = document.createElement('a');
      a.href = links[name] || '#'; a.target = '_blank'; a.rel='noopener'; a.dataset.icon = name;
      a.innerHTML = iconSVG(name);
      row.appendChild(a);
    });
    // Append after email block
    var emailBlock = sec.querySelector('.et_pb_text_35') || sec.querySelector('.et_pb_text:last-of-type');
    (emailBlock && emailBlock.parentNode) ? emailBlock.parentNode.appendChild(row) : sec.appendChild(row);
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', setupContact); }
  else { setupContact(); }
  window.addEventListener('load', setupContact);
})();
