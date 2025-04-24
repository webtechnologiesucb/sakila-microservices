const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Cargar el archivo .proto
const PROTO_PATH = './films.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const filmsProto = grpc.loadPackageDefinition(packageDefinition).films;

// Crear el cliente
const client = new filmsProto.FilmService('localhost:50051', grpc.credentials.createInsecure());

// Llamar al método GetFilms
client.GetFilms({}, (error, response) => {
  if (!error) {
    console.log('Películas:', response);
  } else {
    console.error(error);
  }
});
