const path = require("path");
const express= require("express");
const { Socket } = require("socket.io");
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/public/chat-client.html")
})

io.on("connection", (Socket) =>{
    SocketAddress.on("username", (msg) => {
        Socket.username = msg
    }
)
})
const port=8080
app.listen(port, ()=>
console.log("hi"))