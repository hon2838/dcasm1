const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize the app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let documentContent = "";
let documentStyles = {
  fontSize: "16px",
  color: "black"
};

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle socket connections
// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current document content and styles to the new client
    socket.emit('load document', { content: documentContent, styles: documentStyles });

    // Handle text changes from clients
    socket.on('text change', (content) => {
        documentContent = content;
        // Broadcast the change to all other clients
        socket.broadcast.emit('text change', content);
    });

    // Handle style changes from clients
    socket.on('style change', (styles) => {
        documentStyles = styles;
        // Broadcast the style change to all clients
        io.emit('style change', styles);
    });

    // Handle user joining
    socket.on('user joined', (userName) => {
        console.log(`User ${userName} joined`);
        // You can broadcast the user's name to all clients if needed
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

