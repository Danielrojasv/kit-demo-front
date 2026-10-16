// Contador animado para KPIs. Sin dependencias.
// Uso: animarNumero(elemento, 1234, { ms: 900, decimales: 0, sufijo: "%" })
export function animarNumero(el, valor, { ms = 900, decimales = 0, prefijo = "", sufijo = "" } = {}) {
  const inicio = performance.now();
  const desde = Number(el.dataset.valor ?? 0);
  el.dataset.valor = valor;
  function paso(t) {
    const p = Math.min(1, Math.max(0, (t - inicio) / ms));
    const suave = 1 - Math.pow(1 - p, 3);
    const actual = desde + (valor - desde) * suave;
    el.textContent = prefijo + actual.toLocaleString("es-CL", {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    }) + sufijo;
    if (p < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}
