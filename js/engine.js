// Motor compartido del campo de tiro (lecciones 3, 4 y 5)

const W = 640, H = 400, TX = W / 2, TY = H - 26;
const $ = id => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d');
(function () { const d = Math.min(window.devicePixelRatio || 1, 2); cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); })();
let aim = -Math.PI / 2, flash = 0, shake = 0, P = [], F = [], last = performance.now();
const say = (k, t) => { const m = $('msg'); m.className = k; m.textContent = t; };
const setUnlocked = b => $('stage').classList.toggle('unlocked', b);
function boom(x, y, hue, n = 16) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 60 + Math.random() * 200; P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: .5 + Math.random() * .3, hue }); } }
function floater(x, y, text, color, size = 20) { F.push({ x, y, text, color, size, life: .9 }); }
function fx(dt) {
  flash = Math.max(0, flash - dt); shake = Math.max(0, shake - dt * 14);
  P.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }); P = P.filter(p => p.life > 0);
  F.forEach(f => { f.y -= 40 * dt; f.life -= dt; }); F = F.filter(f => f.life > 0);
}
function bg() {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#120d3a'); g.addColorStop(1, '#2a1560');
  ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, H + 20);
  ctx.strokeStyle = 'rgba(120,100,255,.14)'; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = '#1a1636'; ctx.fillRect(0, H - 16, W, 16);
}
function bullets(list) { list.forEach(b => { ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 14; ctx.fillStyle = '#fff3a8'; ctx.beginPath(); ctx.arc(b.x, b.y, 4.5, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0; }); }
function turret(col) {
  ctx.save(); ctx.translate(TX, TY); ctx.rotate(aim);
  ctx.fillStyle = '#d9d4ff'; ctx.fillRect(0, -7, 44, 14); ctx.fillStyle = col; ctx.fillRect(34, -9, 14, 18);
  if (flash > 0) { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(48, 0); ctx.lineTo(70, -8); ctx.lineTo(64, 0); ctx.lineTo(70, 8); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = '#2f2864'; ctx.beginPath(); ctx.arc(TX, TY + 6, 28, Math.PI, 0); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(TX, TY, 12, 0, 6.283); ctx.fill();
}
function fxDraw() {
  P.forEach(p => { ctx.globalAlpha = Math.max(0, p.life * 1.6); ctx.fillStyle = `hsl(${p.hue} 95% 62%)`; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }); ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  F.forEach(f => { ctx.globalAlpha = Math.min(1, f.life * 2); ctx.font = `700 ${f.size}px "Chakra Petch", sans-serif`; ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y); }); ctx.globalAlpha = 1;
}
function overlay(won, sub) {
  ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(16,13,31,.7)'; ctx.fillRect(0, 0, W, H);
  ctx.font = '700 48px "Chakra Petch", sans-serif'; ctx.fillStyle = won ? '#4cf0a0' : '#ff5c93'; ctx.fillText(won ? '¡MISIÓN CUMPLIDA!' : 'TIEMPO AGOTADO', W / 2, H / 2);
  ctx.font = '700 18px "Chakra Petch", sans-serif'; ctx.fillStyle = '#ece9ff'; ctx.fillText(sub, W / 2, H / 2 + 34);
}
function pos(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
function aimAt(e) { const p = pos(e); let a = Math.atan2(p.y - TY, p.x - TX); if (a > 0) a = a < Math.PI / 2 ? -.12 : -Math.PI + .12; aim = Math.max(-Math.PI + .12, Math.min(-.12, a)); }
cv.addEventListener('pointermove', aimAt);
cv.addEventListener('pointerdown', e => { aimAt(e); onShoot(); });
$('hintBtn').onclick = () => { $('hint').style.display = 'block'; };
$('code').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCode(); } });
$('run').onclick = () => runCode();
function loop(n) {
  const dt = Math.min((n - last) / 1000, .05); last = n;
  fx(dt); step(dt);
  ctx.save(); if (shake > 0) ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
  bg(); render(); fxDraw(); ctx.restore(); hud(); requestAnimationFrame(loop);
}
const stripCode = c => c.split('\n').filter(l => !l.trim().startsWith('//')).join(' ').trim();
