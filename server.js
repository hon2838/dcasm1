const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let documentContent = "";
let documentStyles = {
  fontSize: "16px",
  color: "black"
};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Notify all clients about the new user connection
  socket.broadcast.emit('user connected');

  socket.emit('load document', { content: documentContent, styles: documentStyles });

  socket.on('text change', (content) => {
    documentContent = content;
    socket.broadcast.emit('text change', content);
  });

  socket.on('style change', (styles) => {
    documentStyles = styles;
    io.emit('style change', styles);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    io.emit('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
