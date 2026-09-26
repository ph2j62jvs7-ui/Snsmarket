const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const card=document.querySelector('.hero-card');
window.addEventListener('pointermove',e=>{
  if(!card || window.innerWidth<900)return;
  const x=(e.clientX/window.innerWidth-.5)*2, y=(e.clientY/window.innerHeight-.5)*2;
  card.style.transform=`rotateY(${-10+x*7}deg) rotateX(${5-y*5}deg) translateZ(8px)`;
});
window.addEventListener('pointerleave',()=>{if(card)card.style.transform='rotateY(-10deg) rotateX(5deg)'});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});
