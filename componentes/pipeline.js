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
    .pl-caja { fill: var(--carta, #1b2940); stroke: var(--borde, #2a3b57); stroke-width: 1.5; rx: 10; }
    .pl-texto { fill: var(--texto, #dce6f5); font: 600 14px system-ui, sans-serif; }
    .pl-nota { fill: var(--tenue, #7e92b3); font: 11px system-ui, sans-serif; }
    .pl-flecha { stroke: var(--borde, #2a3b57); stroke-width: 2; }
    .pl-activa .pl-caja { stroke: var(--acento, #27c3e8); stroke-width: 2.5; filter: drop-shadow(0 0 6px var(--acento, #27c3e8)); }
    .pl-ok .pl-caja { stroke: var(--ok, #3ddc97); stroke-width: 2.5; }
    .pl-error .pl-caja { stroke: var(--rojo, #ff5d6c); stroke-width: 2.5; }
    .pl-pulso { animation: pl-late 1.1s ease-in-out infinite; }
    @keyframes pl-late { 50% { opacity: .55; } }
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
