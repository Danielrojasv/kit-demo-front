// Servidor del tablero: estáticos + lectura/escritura de tareas.json.
// Uso: node servidor.mjs [puerto]   (default 8123)
// El agente puede editar tareas.json directo en disco; la página lo
// relee sola cada 5 segundos.
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const RAIZ = new URL(".", import.meta.url).pathname;
const ARCHIVO_TAREAS = join(RAIZ, "tareas.json");
const PUERTO = Number(process.argv[2] ?? 8123);

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
};

createServer(async (req, res) => {
  try {
    if (req.url === "/tareas.json" && req.method === "PUT") {
      let cuerpo = "";
      for await (const trozo of req) cuerpo += trozo;
      JSON.parse(cuerpo); // valida antes de escribir
      await writeFile(ARCHIVO_TAREAS, cuerpo);
      res.writeHead(204).end();
      return;
    }
    const ruta = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const archivo = normalize(join(RAIZ, "..", ruta));
    if (!archivo.startsWith(normalize(join(RAIZ, "..")))) {
      res.writeHead(403).end();
      return;
    }
    const final = ruta === "/index.html" || ruta === "/tareas.json"
      ? join(RAIZ, ruta)
      : archivo;
    const datos = await readFile(final);
    res.writeHead(200, { "Content-Type": TIPOS[extname(final)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(datos);
  } catch {
    res.writeHead(404).end("no existe");
  }
}).listen(PUERTO, () => console.log(`tablero en http://localhost:${PUERTO}`));
