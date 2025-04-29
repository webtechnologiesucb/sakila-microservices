const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3001;

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sakila",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL - API sample-test");
});

// Endpoint para obtener todas las películas
app.get("/films", (req, res) => {
  db.query("SELECT * FROM film", (err, results) => {
    if (err) {
      console.error("Error al obtener películas:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`API ejecutándose en http://localhost:${port}`);
});