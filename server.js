const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const http = require('http').createServer(app);
const io = new Server(http);

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat-client.html"));
});

// User class to store user information
class User {
    constructor(name) {
        this.name = name;
        this.randomNumber = Math.floor(Math.random() * 100) + 1;

        // Assign profile picture based on random number
        if (this.randomNumber % 2 === 0) {
            this.profilePic = `https://randomuser.me/api/portraits/men/${this.randomNumber}.jpg`;
        } else {
            this.profilePic = `https://randomuser.me/api/portraits/women/${this.randomNumber}.jpg`;
        }
    }
}

const users = []; // Store all users

io.on("connection", (socket) => {
    console.log('A user connected');

    // When a new user sends their username
    socket.on("username", (msg) => {
        const newUser = new User(msg);  // Create a new user
        users.push(newUser);  // Add to users list
        io.emit("updateUserList", users);  // Emit updated user list to all clients
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log('A user disconnected');
    });
});

const port = 8080;
http.listen(port, () => console.log(`Server running on port ${port}`));

