const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.status(__dirname + "/public"));

const expressServer = app.listen(8000);

const io = socketio(expressServer);

io.on("connection", (socket) => {
  console.log(socket.id, "has connected!");

  socket.on("newMessageToServer", (dataFromClient) => {
    io.emit("newMessageToClients", { text: dataFromClient.text });
  });
});
