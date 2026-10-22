// Guarda el progreso en el navegador (localStorage) y agrega el botón "Siguiente"
(function () {
  const n = +document.currentScript.dataset.leccion;
  const files = ['01-variables', '02-condicionales', '03-bucles', '04-funciones', '05-arrays'];
  const save = () => { try { localStorage.setItem('academia:leccion' + n, '1'); } catch (e) {} };
  const msg = document.getElementById('msg');
  let added = false;
  new MutationObserver(() => {
    if (!msg.classList.contains('ok')) return;
    save();
    if (added || n >= files.length) return; added = true;
    const a = document.createElement('a'); a.className = 'chip'; a.href = files[n] + '.html';
    a.textContent = 'Siguiente lección →'; a.style.cssText = 'text-decoration:none;background:var(--ok);color:#06281a';
    document.querySelector('header').insertBefore(a, document.querySelector('.progress'));
  }).observe(msg, { attributes: true, attributeFilter: ['class'] });
})();
