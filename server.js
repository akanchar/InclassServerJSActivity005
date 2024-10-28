const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// set up the express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// serve the chat-client.html file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat-client.html'));
});

// user class for managing users
class User {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    const gender = Math.random() < 0.5 ? 'men' : 'women';
    const randomNum = Math.floor(Math.random() * 100);
    this.profilePicture = `https://randomuser.me/api/portraits/${gender}/${randomNum}.jpg`;
  }
}

let users = [];

// handle socket connections
io.on('connection', (socket) => {
  console.log('New user connected');

  // when a new user joins
  socket.on('newUser', (name) => {
    const user = new User(name, socket.id);
    users.push(user);
    io.emit('userList', users);
    socket.broadcast.emit('message', { user: 'System', text: `${user.name} has joined the chat.`, time: new Date().toLocaleTimeString() });
  });

  // handle user sending messages
  socket.on('chatMessage', (message) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.emit('message', { user: user.name, text: message, profilePicture: user.profilePicture, time: new Date().toLocaleTimeString() });
    }
  });

  // when a user disconnects
  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      users = users.filter(u => u.id !== socket.id);
      io.emit('userList', users); 
      io.emit('message', { user: 'System', text: `${user.name} has left the chat.`, time: new Date().toLocaleTimeString() });
    }
  });
});

// start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
