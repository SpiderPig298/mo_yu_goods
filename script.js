document.getElementById('year').textContent = new Date().getFullYear();

// 移动端汉堡菜单
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(open){
  const isOpen = open ?? !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburger.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
}
hamburger.addEventListener('click', () => toggleMenu());
mobileMenu.addEventListener('click', e => {
  if(e.target.matches('a')) toggleMenu(false); // 点击菜单项后关闭
});

// 平滑滚动（已通过 CSS 的 scroll-behavior:smooth；此处兼容 & 阻止 hash 抖动）
function smoothScrollTo(hash){
  const el = document.querySelector(hash);
  if(el){
    el.scrollIntoView({behavior:'smooth', block:'start'});
    history.pushState(null,'',hash);
  }
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const hash = a.getAttribute('href');
    if(hash.length>1){
      e.preventDefault();
      smoothScrollTo(hash);
    }
  });
});

// 在首屏时，滚轮向下自动脱离首屏到下一个区块
const hero = document.getElementById('hero');
let wheelLock = false;
hero.addEventListener('wheel', (e)=>{
  // 仅在向下滚且几乎停留在首屏顶部时触发
  const atTop = Math.abs(window.scrollY) < 8;
  if(!wheelLock && e.deltaY > 0 && atTop){
    wheelLock = true;
    const next = document.querySelector('#products');
    if(next){
      next.scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(()=> wheelLock = false, 600);
      e.preventDefault();
    }
  }
}, {passive:false});

// 键盘辅助：在首屏按 PageDown/Space 也跳到下节
window.addEventListener('keydown', (e)=>{
  if((e.code==='Space' || e.code==='PageDown') && isInView(hero)){
    const next = document.querySelector('#products');
    if(next){
      next.scrollIntoView({behavior:'smooth'});
      e.preventDefault();
    }
  }
});

function isInView(el){
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top <= vh*0.5 && r.bottom >= vh*0.5;
}

// 依据用户偏好减少动画
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.style.scrollBehavior = 'auto';
}