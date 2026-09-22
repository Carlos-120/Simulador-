const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8765;
const pages = {
  "/": "Simulador-Complexivo-Local.html",
  "/Simulador-Complexivo-Local.html": "Simulador-Complexivo-Local.html",
  "/Guia-de-Temas-Repaso.html": "Guia-de-Temas-Repaso.html",
  "/Fichas-de-Repaso.html": "Fichas-de-Repaso.html",
  "/Cuaderno-de-Practica.html": "Cuaderno-de-Practica.html",
  "/Manual-de-Estudio-Completo.html": "Manual-de-Estudio-Completo.html",
};

http.createServer((request, response) => {
  const pageName = pages[request.url];
  if (!pageName) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Página no encontrada.");
    return;
  }

  fs.readFile(path.join(__dirname, pageName), (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("No se pudo cargar el simulador.");
      return;
    }
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
}).listen(port, "127.0.0.1", () => {
  console.log("Simulador disponible en http://127.0.0.1:" + port + "/");
});
