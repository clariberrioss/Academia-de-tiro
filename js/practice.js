// Ejercicios de práctica de cada lección. La misión final se desbloquea al terminarlos.
const PRACTICE = (() => {
  const strip = c => c.split('\n').filter(l => !l.trim().startsWith('//')).join(' ').trim();
  // ch: la PRIMERA opción es la correcta (se mezclan al mostrarlas)
  const ch = (q, code, opts, why) => ({ t: 'choice', q, code, opts, why });
  const fi = (q, before, after, check, show, hint) => ({ t: 'fill', q, before, after, check, show, hint });
  const co = (q, start, check, show, hint) => ({ t: 'code', q, start, check, show, hint });
  const isNum = v => /^\s*\d+\s*$/.test(v);
  const num = target => v => isNum(v) ? (+v === target ? true : 'Ahora vale ' + (+v) + ', pero el enunciado pide ' + target + '.') : 'Escribe solo un número, por ejemplo ' + target + '.';
  const row = (icon, n) => icon.repeat(Math.max(0, Math.min(n, 40)));
  const viz = h => '<div class="pviz">' + h + '</div>';
  const loopCount = src => { const m = strip(src).match(/^for\s*\(\s*let\s+i\s*=\s*(\d+)\s*;\s*i\s*(<=|<)\s*(\d+)\s*;\s*i\+\+\s*\)\s*\{\s*disparar\(\s*\)\s*;?\s*\}$/); return m ? Math.max(0, (+m[3]) - (+m[1]) + (m[2] === '<=' ? 1 : 0)) : null; };
  const triple = src => {
    const s = strip(src);
    if (!/^function\s+triple\s*\(\s*n\s*\)/.test(s)) return { err: 'Empieza con: function triple(n) { ... }' };
    const m = s.match(/\{\s*return\s+([^;]*?)\s*;\s*\}$/);
    if (!m) return { err: 'Dentro de las llaves { } va: return una operación; (con punto y coma).' };
    if (!m[1]) return { err: 'Después de return falta la operación.' };
    if (!/^[\d\s+\-*/().]+$/.test(m[1].replace(/\bn\b/g, '1'))) return { err: 'Solo puedes usar n, números y los signos + - * /' };
    let f; try { f = new Function('n', 'return (' + m[1] + ');'); f(1); } catch (e) { return { err: 'Esa operación no se puede calcular. Revisa los signos.' }; }
    return { f };
  };
  const enem = src => {
    const m = strip(src).match(/^(?:const|let)\s+enemigos\s*=\s*\[(.*)\]\s*;?$/);
    if (!m) return { err: 'Revisa la forma: const enemigos = [ ... ];' };
    const items = m[1].trim() ? m[1].split(',').map(x => x.trim()) : [];
    const out = [];
    for (const it of items) { const k = it.match(/^(["'])(\w+)\1$/); if (!k) return { err: 'Cada elemento va entre comillas y separado por comas, sin comas de más.' }; out.push(k[2]); }
    return { out };
  };
  const ARM = ['"arco"', '"hacha"', '"lanza"'], ARR = 'const armas = ["arco", "hacha", "lanza"];';
  return {
    1: [
      ch('Lee el código. ¿Qué valor guarda la variable balas?', 'let balas = 12;', ['12', '"balas"', 'let'], 'La variable es la caja: balas es la etiqueta y 12 es lo que guarda.'),
      fi('Guarda 20 balas en la variable municion. Escribe el número que falta.', 'let municion = ', ';', num(20), v => isNum(v) ? viz('📦 municion = <b>' + (+v) + '</b><br>' + row('🟡', +v)) : '', 'Escribe solamente el número 20, sin letras.'),
      fi('Tu personaje tiene 3 vidas. Cámbialas a 5.', 'let vidas = ', ';', num(5), v => isNum(v) ? viz('❤️ vidas = <b>' + (+v) + '</b><br>' + row('❤️', +v)) : '', 'Cambia el 3 por un 5.'),
      ch('Lee con atención. ¿Cuánto vale balas al final?', 'let balas = 10;\nbalas = 4;', ['4', '10', '14'], 'Una variable puede cambiar: la caja guarda siempre el último valor que le pusiste.'),
      ch('¿Cuánto vale balas al final?', 'let balas = 10;\nbalas = balas - 1;', ['9', '10', '1'], 'Primero se calcula balas - 1 (10 - 1 = 9) y ese resultado se guarda otra vez en la caja.'),
      co('Escribe tú solo una variable llamada danio que valga 15. Recuerda: let, el nombre, =, el valor y ; al final.', '// Escribe tu variable aquí\n', src => {
        const s = strip(src);
        if (!/^let\s/.test(s)) return 'Empieza con let, la palabra que crea la caja.';
        if (!/^let\s+danio\b/.test(s)) return 'La caja debe llamarse danio (sin tilde y sin ñ).';
        if (!/=/.test(s)) return 'Falta el signo = para guardar el valor.';
        const m = s.match(/^let\s+danio\s*=\s*(\d+)\s*;$/);
        if (!m) return /;\s*$/.test(s) ? 'Dentro de la caja va un número entero. Ejemplo: 15' : 'Falta el punto y coma (;) al final.';
        return +m[1] === 15 ? true : 'Tu variable vale ' + m[1] + ', pero debe valer 15.';
      }, src => { const m = strip(src).match(/=\s*(\d+)/); return m ? viz('💥 danio = <b>' + m[1] + '</b>') : ''; }, 'Se escribe así: let danio = 15;')
    ],
    2: [
      ch('¿Qué hace un if?', 'if (balas === 0) {\n  recargar();\n}', ['Ejecuta lo que hay entre llaves solo si la pregunta es verdadera', 'Ejecuta el código siempre', 'Borra la variable balas'], 'El if hace una pregunta. Si la respuesta es sí (verdadero), ejecuta lo de las llaves.'),
      ch('balas vale 0. ¿Se ejecuta recargar()?', 'let balas = 0;\nif (balas === 0) {\n  recargar();\n}', ['Sí, porque balas es igual a 0', 'No, porque balas es un número', 'Solo si pulsas una tecla'], '=== pregunta “¿es igual?”. Como 0 es igual a 0, la respuesta es sí.'),
      fi('Lee: “Si la vida es igual a 0, se acaba el juego”. Completa con el signo de comparación.', 'if (vida ', ' 0) { finDelJuego(); }', v => { const t = v.trim(); return (t === '===' || t === '==') ? true : t === '=' ? 'Un solo = guarda un valor. Para preguntar si es igual usa tres: ===' : 'Para preguntar “¿es igual?” se usa ===' ; }, v => ['===', '=='].includes(v.trim()) ? viz('💀 vida es 0 → ¡se acaba el juego!') : '', 'Son tres signos iguales seguidos.'),
      fi('“Dispara solo si quedan MÁS de 0 balas”. ¿Qué signo va?', 'if (balas ', ' 0) { disparar(); }', v => { const t = v.trim(); return (t === '>' || t === '!==') ? true : t === '<' ? 'Ese signo es “menor que”. Necesitas “mayor que”.' : 'Prueba con el signo de “mayor que”.'; }, v => v.trim() === '>' ? viz('🔫 Hay balas: ¡disparas!') : '', 'El signo > significa “mayor que”.'),
      ch('balas vale 5. ¿Qué pasa?', 'let balas = 5;\nif (balas > 10) {\n  recargar();\n}', ['No pasa nada: 5 no es mayor que 10', 'Se recarga', 'Da un error'], 'La pregunta “¿5 es mayor que 10?” es falsa, así que el if se salta lo de las llaves.'),
      co('Escribe un if completo que llame a recargar() cuando balas valga 0.', 'if () {\n  \n}', src => {
        const s = strip(src);
        if (!/^if\b/.test(s)) return 'Empieza con if.';
        if (!/balas/.test(s)) return 'La pregunta debe usar la variable balas.';
        if (!/recargar\(\s*\)/.test(s)) return 'Entre las llaves { } escribe recargar();';
        return /^if\s*\(\s*balas\s*(?:===?\s*0|<=\s*0|<\s*1)\s*\)\s*\{\s*recargar\(\s*\)\s*;?\s*\}$/.test(s) ? true : 'Casi. La pregunta debe ser verdadera cuando balas vale 0, por ejemplo balas === 0, y no olvides las llaves.';
      }, src => /^if\s*\(\s*balas\s*(?:===?\s*0|<=\s*0|<\s*1)\s*\)/.test(strip(src)) ? viz('🔄 balas = 0 → ¡recargando!') : '', 'Estructura: if (pregunta) { acción }. Aquí: if (balas === 0) { recargar(); }')
    ],
    3: [
      ch('¿Para qué sirve un bucle?', null, ['Para repetir una acción muchas veces', 'Para guardar un número', 'Para decidir entre dos caminos'], 'Un bucle repite lo que hay entre llaves, sin que tengas que escribirlo una y otra vez.'),
      ch('¿Cuántas veces se ejecuta disparar()?', 'for (let i = 0; i < 4; i++) {\n  disparar();\n}', ['4 veces', '3 veces', '5 veces'], 'i vale 0, 1, 2 y 3. Cuando llega a 4 ya no cumple i < 4, así que da 4 vueltas.'),
      fi('Dispara 5 balas cambiando el número que falta.', 'for (let i = 0; i < ', '; i++) { disparar(); }', num(5), v => isNum(v) ? viz(row('🔸', +v) + '<br>' + (+v) + ' disparos') : '', 'El número de la condición es la cantidad de vueltas.'),
      fi('Ahora dispara 10 balas.', 'for (let i = 0; i < ', '; i++) { disparar(); }', num(10), v => isNum(v) ? viz(row('🔸', +v) + '<br>' + (+v) + ' disparos') : '', 'Si 5 daba 5 disparos, ¿qué número da 10?'),
      ch('¿Qué hace i++ en cada vuelta?', 'for (let i = 0; i < 5; i++) {\n  disparar();\n}', ['Suma 1 al contador i', 'Resta 1 al contador i', 'Dispara una bala extra'], 'i++ es lo mismo que i = i + 1: el contador sube de a uno hasta que la condición deja de cumplirse.'),
      co('Completa el bucle para disparar 6 balas: cambia el número y escribe disparar(); entre las llaves.', 'for (let i = 0; i < 1; i++) {\n  \n}', src => {
        const c = loopCount(src);
        if (c === null) return /disparar\(\s*\)/.test(src) ? 'Algo no encaja. Revisa paréntesis, punto y coma y llaves.' : 'Falta disparar(); entre las llaves.';
        return c === 6 ? true : 'Tu bucle da ' + c + ' vueltas, pero necesitas 6.';
      }, src => { const c = loopCount(src); return c === null ? '' : viz(row('🔸', c) + '<br>' + c + ' disparos'); }, 'Cambia el 1 por un 6 y escribe disparar(); dentro de las llaves.')
    ],
    4: [
      ch('¿Qué es una función?', null, ['Una receta con nombre que puedes usar cuando quieras', 'Un número guardado en una caja', 'Una lista de armas'], 'Una función guarda instrucciones con un nombre para usarlas muchas veces.'),
      ch('¿Qué devuelve esta función?', 'function saludo() {\n  return "hola";\n}', ['"hola"', 'Nada', 'El número 0'], 'return entrega el resultado de la función a quien la llamó.'),
      ch('¿Cuánto vale doble(5)?', 'function doble(n) {\n  return n * 2;\n}', ['10', '5', '2'], 'El parámetro n recibe el 5 y la función devuelve 5 * 2 = 10.'),
      fi('Haz que el daño sea el triple: completa el número.', 'function calcularDanio(base) { return base * ', '; }', num(3), v => isNum(v) ? viz('calcularDanio(10) = <b>' + 10 * (+v) + '</b>') : '', 'Triple significa multiplicar por 3.'),
      fi('Suma las balas: ¿qué signo va entre a y b?', 'function sumar(a, b) { return a ', ' b; }', v => v.trim() === '+' ? true : 'Para sumar se usa el signo +', v => v.trim() === '+' ? viz('sumar(2, 3) = <b>5</b>') : '', 'Es el signo de la suma.'),
      co('Escribe la función triple(n): debe devolver n multiplicado por 3.', 'function triple(n) {\n  return ;\n}', src => { const r = triple(src); if (r.err) return r.err; const a = r.f(4); return (a === 12 && r.f(10) === 30) ? true : 'Con n = 4 tu función devuelve ' + a + ' y debería devolver 12.'; }, src => { const r = triple(src); return r.f ? viz('triple(4) = <b>' + r.f(4) + '</b>') : ''; }, 'Después de return escribe: n * 3')
    ],
    5: [
      ch('¿Qué es un array?', null, ['Una lista ordenada de elementos', 'Un solo número', 'Una función'], 'Un array es una mochila con casilleros numerados, cada uno con un elemento.'),
      ch('¿Qué vale armas[0]?', ARR, ['"arco"', '"hacha"', '"lanza"'], 'Los casilleros se cuentan desde 0. El primero es armas[0].'),
      ch('¿Qué vale armas[2]?', ARR, ['"lanza"', '"hacha"', 'Da error'], 'armas[0] es arco, armas[1] es hacha y armas[2] es lanza: el tercero.'),
      fi('Quieres elegir el hacha. ¿Qué número va entre los corchetes?', ARR + '\nlet elegida = armas[', '];', v => { if (!isNum(v)) return 'Escribe solo un número.'; const k = +v; return k === 1 ? true : 'armas[' + k + '] es ' + (ARM[k] || 'un casillero que no existe') + '. Recuerda que se cuenta desde 0.'; }, v => isNum(v) ? viz('elegida = <b>' + (ARM[+v] || 'undefined (¡ese casillero no existe!)') + '</b>') : '', 'arco está en el 0. ¿Cuál es el siguiente?'),
      ch('¿Qué vale armas.length?', ARR, ['3', '2', '0'], 'length cuenta cuántos elementos hay: son 3, aunque el último casillero sea el número 2.'),
      co('Crea un array llamado enemigos con tres elementos, en este orden: "zombi", "robot" y "alien".', 'const enemigos = [];', src => {
        const r = enem(src); if (r.err) return r.err;
        if (r.out.length !== 3) return 'Necesitas 3 elementos y tienes ' + r.out.length + '.';
        return r.out.join() === 'zombi,robot,alien' ? true : 'Los nombres o el orden no coinciden: zombi, robot, alien.';
      }, src => { const r = enem(src); return r.out ? viz(r.out.map((x, i) => 'enemigos[' + i + '] = ' + x).join('<br>')) : ''; }, 'const enemigos = ["zombi", "robot", "alien"];')
    ]
  };
})();

(function () {
  const n = +document.currentScript.dataset.leccion, D = PRACTICE[n], KEY = 'academia:practica' + n;
  const main = document.querySelector('.main'); if (!main || !D) return;
  const others = [...main.children];
  const sec = document.createElement('section'); sec.className = 'panel practice'; main.insertBefore(sec, main.firstChild);
  const lock = on => others.forEach(x => { x.classList.toggle('locked', on); x.inert = on; });
  const getI = () => { try { return Math.min(+localStorage.getItem(KEY) || 0, D.length); } catch (e) { return 0; } };
  const setI = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  const el = (tag, cls, txt) => { const x = document.createElement(tag); if (cls) x.className = cls; if (txt !== undefined) x.textContent = txt; return x; };
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  let i = getI(), review = false, fails = 0;

  function draw() {
    sec.innerHTML = '';
    const total = D.length, head = el('div', 'code-h'), dots = el('div', 'dots');
    head.appendChild(el('h2', '', 'Práctica guiada'));
    for (let k = 0; k < total; k++) dots.appendChild(el('i', k < i ? 'ok' : k === i ? 'cur' : ''));
    head.appendChild(dots); sec.appendChild(head);
    if (i >= total) {
      lock(false);
      sec.appendChild(el('div', 'pfb ok', '🎉 ¡Ejercicios completos! La misión final ya está desbloqueada. Baja y ponla a prueba.'));
      const r = el('button', 'ghost', 'Repasar los ejercicios'); r.style.marginTop = '10px';
      r.onclick = () => { review = true; i = 0; draw(); }; sec.appendChild(r); return;
    }
    lock(!review);
    const e = D[i]; fails = 0;
    sec.appendChild(el('div', 'pstep', 'Ejercicio ' + (i + 1) + ' de ' + total + ' · ' + { choice: 'Elige la respuesta', fill: 'Completa el hueco', code: 'Escribe el código' }[e.t]));
    sec.appendChild(el('div', 'pq', e.q));
    const vizBox = el('div'), fb = el('div', 'pfb', 'Tómate tu tiempo. Puedes intentarlo las veces que quieras.'), actions = el('div', 'row');
    const setFb = (k, t) => { fb.className = 'pfb ' + k; fb.textContent = t; };
    const win = why => {
      setFb('ok', '¡Muy bien! ' + (why || ''));
      const nx = el('button', 'run', i === total - 1 ? 'Terminar ejercicios' : 'Siguiente ejercicio');
      nx.onclick = () => { i++; if (!review) setI(i); draw(); if (i >= total && !review) setTimeout(() => others[0].scrollIntoView({ behavior: 'smooth', block: 'start' }), 200); };
      actions.innerHTML = ''; actions.appendChild(nx); nx.focus();
    };
    let field = null;
    if (e.t === 'choice') {
      if (e.code) sec.appendChild(el('div', 'pcode', e.code));
      const box = el('div');
      shuffle(e.opts.map((t, k) => ({ t, ok: k === 0 }))).forEach(o => {
        const b = el('button', 'opt', o.t);
        b.onclick = () => {
          if (b.disabled) return;
          if (o.ok) { b.classList.add('good'); [...box.children].forEach(x => { x.disabled = true; }); win(e.why); }
          else { b.classList.add('bad'); b.disabled = true; fails++; setFb('err', 'Todavía no. Lee el código otra vez y piensa paso a paso.'); }
        };
        box.appendChild(b);
      });
      sec.appendChild(box); sec.appendChild(fb);
    } else {
      if (e.t === 'fill') {
        const line = el('div', 'pcode'); field = document.createElement('input'); field.type = 'text'; field.autocomplete = 'off'; field.spellcheck = false; field.setAttribute('aria-label', 'Tu respuesta');
        line.appendChild(document.createTextNode(e.before)); line.appendChild(field); line.appendChild(document.createTextNode(e.after)); sec.appendChild(line);
      } else { field = el('textarea', 'pta'); field.value = e.start; field.spellcheck = false; field.setAttribute('aria-label', 'Editor de código'); sec.appendChild(field); }
      sec.appendChild(vizBox);
      const run = () => {
        const v = field.value; let r;
        try { r = e.check(v); } catch (x) { r = 'No pude leer lo que escribiste. Revisa que esté completo.'; }
        vizBox.innerHTML = ''; try { if (e.show) vizBox.innerHTML = e.show(v) || ''; } catch (x) {}
        if (r === true) { field.disabled = true; win(); }
        else { fails++; setFb('err', r + (fails >= 2 && e.hint ? ' Pista: ' + e.hint : '')); }
      };
      const go = el('button', 'run', 'Comprobar'); go.onclick = run; actions.appendChild(go);
      field.addEventListener('keydown', k => { if (k.key === 'Enter' && (e.t === 'fill' || k.ctrlKey || k.metaKey)) { k.preventDefault(); if (!field.disabled) run(); } });
      sec.appendChild(actions); sec.appendChild(fb);
    }
    if (e.t === 'choice') sec.appendChild(actions);
    if (!review) sec.appendChild(el('div', 'plock', '🔒 La misión final se desbloquea al terminar los ejercicios.'));
  }
  draw();
})();
