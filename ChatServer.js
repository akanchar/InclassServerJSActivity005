const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');  // Add this to fetch user data

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

async function getRandomUserProfile() {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const user = data.results[0];
    const name = `${user.name.first} ${user.name.last}`;
    const img = user.picture.medium;
    return { name, img };
}

// Serve static files (client)
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    let currentUser = null;

    socket.on('login', async () => {
        currentUser = await getRandomUserProfile();
        currentUser.socketId = socket.id;
        users.push(currentUser);

        // Send the current user's profile back to them
        socket.emit('set profile', currentUser);

        // Notify all users about the new user
        io.emit('user list', users);
        io.emit('message', {
            user: 'Server',
            text: `${currentUser.name} has joined the chat`,
            timestamp: new Date(),
            serverMessage: true
        });
    });

    socket.on('message', (msg) => {
        // Broadcast user message to all clients
        io.emit('message', { user: msg.user, text: msg.text, timestamp: new Date() });
    });

    socket.on('leave', () => {
        if (currentUser) {
            users = users.filter((user) => user.socketId !== socket.id);
            io.emit('user list', users);
            io.emit('message', {
                user: 'Server',
                text: `${currentUser.name} has left the chat`,
                timestamp: new Date(),
                serverMessage: true
            });
        }
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            users = users.filter((user) => user.socketId !== socket.id);
            io.emit('user list', users);
            io.emit('message', {
                user: 'Server',
                text: `${currentUser.name} has left the chat`,
                timestamp: new Date(),
                serverMessage: true
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
