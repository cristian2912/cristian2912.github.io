
/* contacto_form.js */
(function(){
  function bind(){
    const form = document.getElementById('contactForm');
    if(!form){ console.warn('No #contactForm'); return; }
    const btn = form.querySelector('button[type="submit"], #btnSend');
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      btn && (btn.disabled = true);
      const data = Object.fromEntries(new FormData(form).entries());
      try{
        const res = await fetch('http://localhost:3000/contacto', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
          body: new URLSearchParams(data).toString()
        });
        console.log('POST /contacto →', res.status);
        alert(res.ok ? 'Enviado' : 'Error al enviar');
        if(res.ok) form.reset();
      }catch(err){
        console.error('Fallo de red', err);
        alert('No se pudo conectar al servidor');
      }finally{
        btn && (btn.disabled = false);
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
