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
        this.randomNumber = Math.floor(Math.random() * 100) + 1;
        this.profilePicture = this.randomNumber % 2 === 0
            ? `https://randomuser.me/api/portraits/men/${this.randomNumber}.jpg`
            : `https://randomuser.me/api/portraits/women/${this.randomNumber}.jpg`;
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
        socket.broadcast.emit('user joined', username); // Notify others
        io.emit('update user list', users); // Update user list for all
    });

    // Handle chat message
    socket.on('chat message', (chatMessage) => {
        const messageData = {
            message: chatMessage.message,
            user: socket.username,
            time: new Date().toLocaleTimeString()
        };
        
        // Broadcast message to all clients, including sender
        io.emit('chat message', messageData);
    });

    // Handle user leaving
    socket.on('leave chat', () => {
        // Remove user from the list
        users = users.filter(user => user.socketId !== socket.id);
        
        // Broadcast that the user left
        socket.broadcast.emit('user left', socket.username);
        io.emit('update user list', users); // Update user list for all
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        if (socket.username) {
            socket.broadcast.emit('user left', socket.username);
            io.emit('update user list', users); // Update user list for all
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});