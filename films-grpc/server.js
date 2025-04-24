const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2');

// Cargar el archivo .proto
const PROTO_PATH = './films.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const filmsProto = grpc.loadPackageDefinition(packageDefinition).films;

// Conectar a la base de datos Sakila
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678', // Cambia esto a tu contraseña
  database: 'sakila',
  port: '3307',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos Sakila');
});

// Implementar el servicio gRPC
const getFilms = (call, callback) => {
  db.query('SELECT film_id, title, description, release_year, language_id FROM film LIMIT 10', (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Obtener el nombre del idioma (opcional: puedes optimizar con JOIN)
    const films = results.map(film => ({
      film_id: film.film_id,
      title: film.title,
      description: film.description,
      release_year: film.release_year,
      language: `Language ${film.language_id}`, // Aquí puedes hacer una consulta adicional para obtener el nombre del idioma
    }));

    callback(null, { films });
  });
};

// Definir el servidor gRPC
const server = new grpc.Server();
server.addService(filmsProto.FilmService.service, { GetFilms: getFilms });

// Iniciar el servidor en el puerto 50051
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Servidor gRPC corriendo en http://localhost:50051');
  server.start();
});
