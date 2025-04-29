const express = require("express");
const WebSocket = require("ws");
const mysql = require("mysql2");

const app = express();
const port = 3000;
const wss = new WebSocket.Server({ noServer: true });

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Manejo de conexiones WebSocket
wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);
    
    if (message === "getCategories") {
      db.query("SELECT * FROM category", (err, results) => {
        if (err) {
          console.error("Error al obtener categorías:", err);
          return;
        }
        ws.send(JSON.stringify(results));
      });
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

// Integrar WebSocket en el servidor HTTP de Express
const server = app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});