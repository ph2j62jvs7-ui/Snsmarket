const modal=document.querySelector('#modal'),mp=document.querySelector('#mProduct'),mprice=document.querySelector('#mPrice');
document.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>{mp.textContent=b.dataset.product;mprice.textContent=Number(b.dataset.price).toLocaleString('ru-RU')+'₽ / месяц';modal.classList.add('open')});
document.querySelector('.close').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
document.querySelector('.pay').onclick=async()=>{
 const email=document.querySelector('#email'), product=mp.textContent, btn=document.querySelector('.pay');
 if(!email.value||!email.checkValidity()){email.focus();return}
 btn.disabled=true; btn.textContent='Создаём платёж...';
 try{
  const r=await fetch('https://snsmarket-production.up.railway.app/create-payment',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({product:product,email:email.value.trim()})
  });
  const d=await r.json();
  if(!r.ok||!d.confirmation_url) throw new Error(d.error||'Payment error');
  window.location.href=d.confirmation_url;
 }catch(e){
  console.error(e);alert('Не удалось перейти к оплате. Попробуйте ещё раз.');
  btn.disabled=false;btn.textContent='Перейти к оплате';
 }
};