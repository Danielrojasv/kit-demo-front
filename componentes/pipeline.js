// Pipeline de etapas que se ilumina a medida que avanza un proceso.
// Sin dependencias. Uso:
//   const p = crearPipeline(contenedor, ["Entrada", "Clasificar", "Decidir"]);
//   p.activar(1);            // ilumina la etapa 1 como "procesando"
//   p.completar(1);          // la deja verde
//   p.fallar(1, "sin datos") // la deja roja con nota
//   p.reiniciar();
export function crearPipeline(el, etapas) {
  const ancho = 170, alto = 64, sep = 48;
  const totalAncho = etapas.length * ancho + (etapas.length - 1) * sep;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${totalAncho} ${alto + 26}`);
  svg.style.width = "100%";
  el.appendChild(svg);

  const estilo = document.createElement("style");
  estilo.textContent = `
    .pl-caja { fill: var(--carta, #F7FAFC); stroke: var(--borde, #D5DEE7); stroke-width: 1.5; rx: 10; }
    .pl-texto { fill: var(--texto, #0B2545); font: 500 14px Roboto, system-ui, sans-serif; }
    .pl-nota { fill: var(--tenue, #4A6076); font: 11px Roboto, system-ui, sans-serif; }
    .pl-flecha { stroke: var(--borde, #D5DEE7); stroke-width: 2; }
    .pl-activa .pl-caja { fill: var(--acento-suave, #E1F2F7); stroke: var(--acento, #07708E); stroke-width: 2.5; }
    .pl-ok .pl-caja { fill: var(--ok-suave, #E3F2E8); stroke: var(--ok, #1D7A43); stroke-width: 2.5; }
    .pl-error .pl-caja { fill: var(--rojo-suave, #FBE7E5); stroke: var(--rojo, #B3261E); stroke-width: 2.5; }
    .pl-pulso { animation: pl-late 1.1s ease-in-out infinite; }
    @keyframes pl-late { 50% { opacity: .7; } }
    @media (prefers-reduced-motion: reduce) { .pl-pulso { animation: none; } }
  `;
  el.prepend(estilo);

  const grupos = etapas.map((nombre, i) => {
    const x = i * (ancho + sep);
    const g = document.createElementNS(ns, "g");
    g.innerHTML = `
      <rect class="pl-caja" x="${x}" y="8" width="${ancho}" height="${alto}" rx="10"></rect>
      <text class="pl-texto" x="${x + ancho / 2}" y="${8 + alto / 2 + 5}" text-anchor="middle">${nombre}</text>
      <text class="pl-nota" x="${x + ancho / 2}" y="${alto + 24}" text-anchor="middle"></text>`;
    svg.appendChild(g);
    if (i < etapas.length - 1) {
      const linea = document.createElementNS(ns, "line");
      linea.setAttribute("class", "pl-flecha");
      linea.setAttribute("x1", x + ancho);
      linea.setAttribute("y1", 8 + alto / 2);
      linea.setAttribute("x2", x + ancho + sep);
      linea.setAttribute("y2", 8 + alto / 2);
      svg.appendChild(linea);
    }
    return g;
  });

  const limpiar = (g) => g.classList.remove("pl-activa", "pl-ok", "pl-error", "pl-pulso");
  const nota = (g, txt) => { g.querySelector(".pl-nota").textContent = txt ?? ""; };

  return {
    activar(i, txt) { limpiar(grupos[i]); grupos[i].classList.add("pl-activa", "pl-pulso"); nota(grupos[i], txt); },
    completar(i, txt) { limpiar(grupos[i]); grupos[i].classList.add("pl-ok"); nota(grupos[i], txt); },
    fallar(i, txt) { limpiar(grupos[i]); grupos[i].classList.add("pl-error"); nota(grupos[i], txt); },
    reiniciar() { grupos.forEach((g) => { limpiar(g); nota(g, ""); }); },
  };
}
