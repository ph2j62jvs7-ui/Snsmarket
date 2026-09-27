const modal=document.querySelector('#modal'),mp=document.querySelector('#mProduct'),mprice=document.querySelector('#mPrice');
const email=document.querySelector('#email');
document.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>{mp.textContent=b.dataset.product;mprice.textContent=Number(b.dataset.price).toLocaleString('ru-RU')+'₽ / месяц';modal.classList.add('open');document.body.classList.add('locked')});
document.querySelector('.close').onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
function closeModal(){modal.classList.remove('open');document.body.classList.remove('locked')}
document.querySelector('.pay').onclick=()=>{if(!email.value||!email.checkValidity()){email.focus();return}alert('Почта сохранена: '+email.value+'\nСледующий этап — подключение ЮKassa и автоматическая выдача кода.')};
const hamb=document.querySelector('.hamb'),nav=document.querySelector('header nav');
hamb.onclick=()=>{nav.classList.toggle('open');hamb.setAttribute('aria-expanded',nav.classList.contains('open'))};
nav.querySelectorAll('a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));
