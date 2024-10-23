const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));

// User class to store user details
class User {
    constructor(name) {
        this.name = name;
        this.randomNumber = Math.floor(Math.random() * 100) + 1;
        this.profilePicture = this.randomNumber % 2 === 0
            ? `https://randomuser.me/api/portraits/men/${this.randomNumber}.jpg`
            : `https://randomuser.me/api/portraits/women/${this.randomNumber}.jpg`;
    }
}

let users = [];

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new user
    socket.on('new user', (username) => {
        const user = new User(username);
        user.socketId = socket.id; // Store socket ID
        users.push(user);
        io.emit('update user list', users);
        socket.broadcast.emit('user joined', user.name);
    });

    // Handle chat message
    socket.on('chat message', (chatMessage) => {
        socket.broadcast.emit('chat message', chatMessage);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        const userIndex = users.findIndex(u => u.socketId === socket.id);
        if (userIndex !== -1) {
            const user = users[userIndex];
            users.splice(userIndex, 1);
            io.emit('update user list', users);
            socket.broadcast.emit('user left', user.name);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
