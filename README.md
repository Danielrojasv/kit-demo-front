# Kit de interfaz Aquaitech

Componentes de interfaz de Aquaitech para los paneles y demos de sus
productos. Sin build ni framework: HTML, CSS y módulos ES planos, con
datos sintéticos de ejemplo. Es la base visual común de los productos
propios, para que todos partan con la misma imagen.

## Qué trae

- `componentes/index.html`: catálogo navegable.
- `componentes/dashboard.html`: panel completo (KPIs animados, mapa,
  feed de eventos, pipeline en vivo, reporte PDF descargable).
- `componentes/pipeline.js`: flujo de etapas que se ilumina mientras el
  backend procesa (sin dependencias; `activar`, `completar`, `fallar`,
  `reiniciar`).
- `componentes/kpi.js`: contador animado para indicadores.
- `componentes/mapa.html`: Leaflet + OpenStreetMap (sin API key) con
  marcadores y capa de calor.
- `componentes/graficos.html`: ECharts (gauge, línea, barras, radar)
  con la paleta del kit.
- `tablero/`: kanban de tareas. Lee `tareas.json`, las tarjetas se
  arrastran entre estados (o un proceso edita el archivo y la página se
  actualiza sola) y lo que pasa de su bloque horario sin terminar se
  marca en rojo.

## Uso

```bash
# catálogo de componentes (cualquier servidor estático sirve)
npx serve .

# tablero con guardado (necesita Node 18+)
node tablero/servidor.mjs 8123
```

El formato de `tablero/tareas.json`:

```json
[{ "id": "t1", "titulo": "…", "persona": "…", "bloque": "09:00-10:30",
   "estado": "pendiente", "depende_de": [] }]
```

Estados: `pendiente`, `en_curso`, `lista`, `atrasada` (el atraso también
se calcula solo comparando el bloque horario con la hora actual).

## Estilo

Institucional sobrio, derivado de la identidad de Aquaitech: fondo
claro frío, texto azul profundo, un único acento teal (el cyan de la
marca oscurecido para cumplir contraste), estados ok/advertencia/peligro
sobrios y nada decorativo. Los 14 pares texto/fondo del tema cumplen
WCAG AA por cálculo (4.5:1 texto normal, 3:1 componentes). Tokens en
`componentes/comun.css`; `prefers-reduced-motion` respetado.

## Dependencias

Vendorizadas en `vendor/` para funcionar sin red (los tiles del mapa sí
requieren conexión): Leaflet 1.9.4, leaflet.heat 0.2.0, ECharts 5.5.1,
pdfmake 0.2.10. Licencias de cada una en sus proyectos.
