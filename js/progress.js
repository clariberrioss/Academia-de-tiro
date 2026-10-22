// Guarda el progreso (localStorage), bloquea lecciones no desbloqueadas y agrega "Siguiente"
(function () {
  const n = +document.currentScript.dataset.leccion;
  const files = ['01-variables', '02-condicionales', '03-bucles', '04-funciones', '05-arrays'];
  const get = k => { try { return localStorage.getItem(k) === '1'; } catch (e) { return false; } };
  if (n > 1 && !get('academia:libre') && !get('academia:leccion' + (n - 1))) {
    const app = document.querySelector('.app'); if (app) app.inert = true;
    const o = document.createElement('div');
    o.style.cssText = 'position:fixed;inset:0;z-index:100;background:var(--bg);display:grid;place-items:center;padding:24px;text-align:center';
    o.innerHTML = '<div style="max-width:420px"><div style="font-size:3rem">🔒</div><h2 style="font:700 1.5rem var(--ui);margin:8px 0">Lección bloqueada</h2><p style="color:var(--muted)">Primero completa la lección ' + (n - 1) + ' para desbloquear esta.</p><p style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="chip" style="text-decoration:none;background:var(--ok);color:#06281a" href="' + files[n - 2] + '.html">Ir a la lección ' + (n - 1) + '</a><a class="chip" style="text-decoration:none" href="../index.html">Menú</a></p></div>';
    document.body.appendChild(o); return;
  }
  const save = () => { try { localStorage.setItem('academia:leccion' + n, '1'); } catch (e) {} };
  const msg = document.getElementById('msg'); let added = false;
  new MutationObserver(() => {
    if (!msg.classList.contains('ok')) return;
    save(); if (added || n >= files.length) return; added = true;
    const a = document.createElement('a'); a.className = 'chip'; a.href = files[n] + '.html'; a.textContent = 'Siguiente lección →';
    a.style.cssText = 'text-decoration:none;background:var(--ok);color:#06281a';
    document.querySelector('header').insertBefore(a, document.querySelector('.progress'));
  }).observe(msg, { attributes: true, attributeFilter: ['class'] });
})();
