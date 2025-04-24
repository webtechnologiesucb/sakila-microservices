const express = require('express');
const fs = require('fs');
const { soap } = require('strong-soap');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sakila', 
  port: '3306'
});

// Servicio SOAP
const service = {
  SakilaService: {
    SakilaServiceSoapPort: {
      getFilmsByCategory(args, callback) {
        const category = args.category;

        const sql = `
          SELECT f.title
          FROM film f
          JOIN film_category fc ON f.film_id = fc.film_id
          JOIN category c ON fc.category_id = c.category_id
          WHERE c.name = ?
        `;

        db.query(sql, [category], (err, results) => {
          if (err) {
            console.error('Error al consultar MySQL:', err);
            return callback({ error: 'Error de base de datos' });
          }

          const filmTitles = results.map(row => row.title);
          const response = {
            films: {
              film: filmTitles
            }
          };

          callback(null, response);
        });
      }
    }
  }
};

const wsdl = fs.readFileSync('sakila.wsdl', 'utf8');

const server = app.listen(PORT, () => {
  console.log(`SOAP corriendo en http://localhost:${PORT}/wsdl?wsdl`);
  soap.listen(server, '/wsdl', service, wsdl);
});
