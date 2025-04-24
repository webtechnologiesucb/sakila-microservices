const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // <--- Importante
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors()); // <--- Habilita CORS para las rutas HTTP
app.use(express.json());
const languageRouter = require('./languageRouter')(io);
app.use('/languages', languageRouter);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
