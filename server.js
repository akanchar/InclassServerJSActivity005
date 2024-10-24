const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./User');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = [];
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');
    let currentUser;

    User.createRandomUser().then((newUser) => {
        currentUser = newUser;
        users.push(currentUser);
        socket.emit('welcome', {
            user: currentUser.toJSON(),
            users: users.map((u) => u.toJSON()),
        });
        socket.broadcast.emit('user joined', {
            user: currentUser.toJSON(),
            users: users.map((u) => u.toJSON()),
        });
        console.log(${currentUser.name} joined the chat.);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', {
            message: msg,
            user: currentUser.toJSON(),
            time: new Date().toLocaleTimeString(),
        });
    });

    socket.on('left-confirmed', (user) => {
        users.splice(users.indexOf(user), 1);
        socket.broadcast.emit('user left', {
            user: user,
            users: users.map((u) => u.toJSON()),
        });
        console.log(${user.name} has left the chat.);
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            users.splice(users.indexOf(currentUser), 1);
            socket.broadcast.emit('user left', {
                user: currentUser.toJSON(),
                users: users.map((u) => u.toJSON()),
            });
            console.log(${currentUser.name} disconnected.);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
    console.log(Click to open: http://localhost:${PORT}/chat-client.html);
});