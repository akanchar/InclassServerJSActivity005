const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const userList = [];

// User class; stores username and generates random number for pic from 1-100
class UserClass {
    constructor (username){
        this.username = username
        this.number = Math.floor(Math.random()*100)+1; 
    }
}

//handle requests for static resources
app.use("/static", express.static(path.join(__dirname, "public")));

// recieves root get request, send the chat client page
app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/public/chat-client.html");
})

// these are all the methods of the socket
io.on('connection', (socket)=>{
    console.log("A User Connected"); // checking
   
    //new user joins --> create user object, add to list, and broadcast to all users
    socket.on('username',(name)=>{
        // creates User object
        const newUser = new UserClass(name);
        newUser.socketID = socket.id;
        // adds to user list
        userList.push(newUser); 
        // lets all user know new user has joined
        io.emit('userList',userList);
        io.emit('message', {type: 'userJoined',user: newUser});
    });

    // emits the message to all users
    socket.on('sendMessage',(data)=>{
        socket.broadcast.emit('message',{type:'userMessage', ...data});
    });

    socket.on('disconnect', ()=>{
        const index = userList.findIndex(user => user.socketID === socket.id);
        if(index!== -1){
            // splice removes that one element (user that is leaving), and puts it into its own array, [0] is that new array with leaving user
            const leavingUser = users.splice(index,1)[0];
            io.emit('userList', userList);
            io.emit('message',{type: 'userLeft', leavingUser}) 
        }
    });
});



const PORT = process.env.PORT || 3000;
Server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));