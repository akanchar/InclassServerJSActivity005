const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// User class to store name and random number
class User {
  constructor(name) {
    this.name = name;
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
  }
}

// Store user objects in a list
let users = [];

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route to add a new user
app.post('/add-user', (req, res) => {
  const userName = req.body.name;
  const newUser = new User(userName);
  users.push(newUser);
  res.json(users);  // Return updated user list
});

// Route to remove a user
app.post('/remove-user', (req, res) => {
  const userName = req.body.name;
  users = users.filter(user => user.name !== userName);
  res.json(users);  // Return updated user list
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
