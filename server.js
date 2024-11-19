const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const User = require("./User");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat-client.html"));
});

let users = []; // Store all users

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("username", (name) => {
        const newUser = new User(name);
        users.push(newUser);
        io.emit("updateUserList", users);
        io.emit("show message", "userJoined", newUser.name);
    });

    socket.on("disconnect", () => {
        const user = users.find((u) => u.name === socket.username);
        if (user) {
            users = users.filter((u) => u.name !== user.name);
            io.emit("show message", "userLeft", user.name);
            io.emit("updateUserList", users);
        }
    });

    socket.on("l", (username) => {
        const user = users.find((u) => u.name === username);
        if (user) {
            users = users.filter((u) => u.name !== username);
            io.emit("show message", "userLeft", username);
            io.emit("updateUserList", users);
        }
    });

    socket.on("chat message", (username, message, time) => {
        io.emit("show message", "newMessage", username, message, time);
    });
});

const port = 8080;
server.listen(port, () => console.log(`Server running on port ${port}`));