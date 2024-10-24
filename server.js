const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(express.static('public'));

class User {
  constructor(name) {
    this.name = name;
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
  }
}

let users = [];

app.post('/add-user', (req, res) => {
  const newUser = new User(req.body.name);
  users.push(newUser);
  io.emit('user-updated', users);
  res.json(users);
});

app.post('/remove-user', (req, res) => {
  users = users.filter(user => user.name !== req.body.name);
  io.emit('user-updated', users);
  res.json(users);
});

io.on('connection', (socket) => {
  socket.on('chat-message', (data) => {
    socket.broadcast.emit('chat-message', data);
  });
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
