const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
  socket.send("getCategories");
};

socket.onmessage = (event) => {
  console.log("Datos recibidos:", JSON.parse(event.data));
};