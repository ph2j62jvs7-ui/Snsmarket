const modal=document.querySelector('#modal'),mp=document.querySelector('#mProduct'),mprice=document.querySelector('#mPrice');
document.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>{mp.textContent=b.dataset.product;mprice.textContent=Number(b.dataset.price).toLocaleString('ru-RU')+'₽ / месяц';modal.classList.add('open')});
document.querySelector('.close').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
document.querySelector('.pay').onclick=()=>{const email=document.querySelector('#email');if(!email.value||!email.checkValidity()){email.focus();return}alert('Форма готова. Следующим шагом подключим ЮKassa и автоматическую выдачу на '+email.value)};
