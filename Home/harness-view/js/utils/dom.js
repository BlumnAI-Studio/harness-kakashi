// dom.js — minimal DOM toolkit
export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      el.setAttribute(k, v);
    }
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null) continue;
    if (typeof c === 'string' || typeof c === 'number') {
      el.appendChild(document.createTextNode(String(c)));
    } else {
      el.appendChild(c);
    }
  }
  return el;
}

export function clear(el) {
  while (el && el.firstChild) el.removeChild(el.firstChild);
}

export function mount(target, ...children) {
  clear(target);
  for (const c of children) {
    if (c == null) continue;
    target.appendChild(c);
  }
}

export function fmt(n) {
  if (typeof n !== 'number') return n;
  return n.toLocaleString();
}
