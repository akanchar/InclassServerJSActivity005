const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const http = require('http').createServer(app);
const io = new Server(http);
const User = require("./User")

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat-client.html"));
});

const users = []; // Store all users

io.on("connection", (socket) => {
    console.log('A user connected');

    // When a new user sends their username
    socket.on("username", (msg) => {
        const newUser = new User(msg);  // Create a new user
        users.push(newUser);  // Add to users list
        io.emit("updateUserList", users);  // Emit updated user list to all clients
        io.emit("show message", "userJoined")
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log('A user disconnected');
        io.emit("show message", "userLeft")
    });

    socket.on("chat message", (type) => {
        io.emit("show message", "newMessage")
    });
});

const port = 8080;
http.listen(port, () => console.log(`Server running on port ${port}`));
