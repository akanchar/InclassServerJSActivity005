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

let users = [];

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("username", (username) => {
        const newUser = new User(username);
        users.push(newUser);
        socket.username = username;
        io.emit("updateUserList", users);
        io.emit("show message", "userJoined", username);
    });

    socket.on("chat message", (who, what) => {
        io.emit("show message", "newMessage", who, what);
    });

    socket.on("leave", () => {
        handleUserDisconnect(socket);
    });

    socket.on("disconnect", () => {
        handleUserDisconnect(socket);
    });

    function handleUserDisconnect(socket) {
        if (socket.username) {
            users = users.filter(user => user.name !== socket.username);
            io.emit("show message", "userLeft", socket.username);
            io.emit("updateUserList", users);
            console.log(`${socket.username} disconnected`);
        }
    }
});

const port = 8080;
server.listen(port, () => console.log(`Server running on port ${port}`));
