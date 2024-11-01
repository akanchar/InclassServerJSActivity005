const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const http = require('http').createServer(app);
const io = new Server(http);
const User = require("./User");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat-client.html"));
});

let users = []; // Store all users

io.on("connection", (socket) => {
    console.log('A user connected');

    // When a new user sends their username
    socket.on("set username", (username) => {
        socket.username = username; // Set the username on the socket object
        const newUser = new User(username);  // Create a new user
        users.push(newUser);  // Add to users list
        io.emit("updateUserList", users);  // Emit updated user list to all clients
        io.emit("show message", "userJoined", username); // Notify all users that a new user has joined
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log('A user disconnected');
        users = users.filter(user => user.name !== socket.username);
        io.emit("show message", "userLeft", socket.username); // Notify all users that a user has left
        io.emit("updateUserList", users);
    });

    // Listen for incoming chat messages
    socket.on("chat message", (who, what) => {
        io.emit("show message", "newMessage", who, what);
    });
});

const port = 8080;
http.listen(port, () => console.log(`Server running on port ${port}`));
