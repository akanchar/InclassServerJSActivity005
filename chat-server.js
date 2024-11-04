const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/chat-client.html");
});

class User {
    constructor(name, gender) {
        this.name = name;
        this.id = Math.floor(Math.random() * 99) + 1;
        this.gender = gender === "female" ? "women" : "men"; 
     }
}

let users = [];

io.on("connection", (socket) => {
    socket.on("username", ({ username, gender }) => {
        const user = new User(username, gender);
        socket.user = user;
        users.push(user);

        io.emit("user list", users);
        io.emit("user joined", { user: user.name, message: `${user.name} has joined` });
    });

    socket.on("chat from client", (msg) => {
        const obj = { user: socket.user.name, message: msg };
        socket.broadcast.emit("chat from server", obj);
    });

    socket.on("leave", () => {
        removeUser(socket);
    });

    socket.on("disconnect", () => {
        removeUser(socket);
    });

    function removeUser(socket) {
        if (socket.user) {
            users = users.filter(user => user.name !== socket.user.name);
            io.emit("user list", users);
            io.emit("user left", { user: socket.user.name, message: `${socket.user.name} has left` });
        }
    }
});

http.listen(7000, () => {
    console.log("listening on *:7000");
});
