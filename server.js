const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = []; // Store user objects

class User {
    constructor(name, socketId) {
        this.name = name;
        this.socketId = socketId;
    }
}

// Serve the static files
app.use(express.static('public'));

// Handle new user connection
io.on('connection', (socket) => {
    socket.on('new user', (username) => {
        const newUser = new User(username, socket.id);
        users.push(newUser);
        socket.username = username; // Save the username to the socket

        // Broadcast user joined to everyone
        io.emit('user joined', username);
        io.emit('update user list', users);
    });

    // Handle chat message
    socket.on('chat message', (chatData) => {
        const { message, to } = chatData;
        const recipient = users.find(user => user.name === to);
        if (recipient) {
            io.to(recipient.socketId).emit('chat message', { message, from: socket.username });
        }
    });

    // Handle user leaving
    socket.on('leave chat', (username) => {
        users = users.filter(user => user.name !== username);
        io.emit('user left', username);
        io.emit('update user list', users);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('user left', socket.username);
        io.emit('update user list', users);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
