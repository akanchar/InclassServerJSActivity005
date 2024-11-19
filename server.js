const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = [];

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = 'public';

app.use(express.static(PUBLIC_DIR));

const sendUserList = (socket, event, currentUser) => {
    const userData = currentUser.toJSON ? currentUser.toJSON() : currentUser;
    const allUsersData = users.map((user) => user.toJSON ? user.toJSON() : user);
    socket.emit(event, {
        user: userData,
        users: allUsersData,
    });
};

const broadcastUserList = (socket, event, currentUser) => {
    const userData = currentUser.toJSON ? currentUser.toJSON() : currentUser;
    const allUsersData = users.map((user) => user.toJSON ? user.toJSON() : user);
    socket.broadcast.emit(event, {
        user: userData,
        users: allUsersData,
    });
};

io.on('connection', (socket) => {
    console.log('A user connected');
    let currentUser;

    User.createRandomUser().then((newUser) => {
        currentUser = newUser;
        users.push(currentUser);
        sendUserList(socket, 'welcome', currentUser);
        broadcastUserList(socket, 'user joined', currentUser);
        console.log(`${currentUser.name} joined the chat.`);
    });

    socket.on('chat message', (message) => {
        io.emit('chat message', {
            message: message,
            user: currentUser.toJSON(),
            time: new Date().toLocaleTimeString(),
        });
    });

    const handleUserLeft = (user) => {
        users.splice(users.indexOf(currentUser), 1);
        broadcastUserList(socket, 'user left', user);
        console.log(`${user.name} has left the chat.`);
    };

    socket.on('left-confirmed', (user) => {
        if (user && currentUser) {
            handleUserLeft(currentUser);  
            console.log(`${currentUser.name} has left the chat.`);
            currentUser = null;  
        }
    });
    
    socket.on('disconnect', () => {
        if (currentUser) {  
            handleUserLeft(currentUser);
            console.log(`${currentUser.name} disconnected.`);
            currentUser = null;
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Click to open: http://localhost:${PORT}/chat-client.html`);
});