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
    socket.on("username", (msg) => {
        const newUser = new User(msg);  // Create a new user
        users.push(newUser);  // Add to users list
        socket.username = msg; // Store username in socket for later use
        io.emit("updateUserList", users);  // Emit updated user list to all clients
        io.emit("show message", "userJoined", msg);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        if (socket.username) {
            console.log(`${socket.username} disconnected`);
            io.emit("show message", "userLeft", socket.username);
            users = users.filter(user => user.name !== socket.username);
            io.emit("updateUserList", users);
        }
    });

    // Handle leave button click
    socket.on("leave", () => {
        if (socket.username) {
            console.log(`${socket.username} is leaving the chat`);
            io.emit("show message", "userLeft", socket.username);
            users = users.filter(user => user.name !== socket.username);
            io.emit("updateUserList", users);
            socket.disconnect(); // Disconnect the socket
        }
    });

    // Handle chat messages
    socket.on("chat message", (who, what) => {
        io.emit("show message", "newMessage", who, what);
    });
});

const port = 8080;
http.listen(port, () => console.log(`Server running on port ${port}`));
