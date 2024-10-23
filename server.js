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
        io.emit('userlist',{users: userList});
        io.emit('message', {type: 'userJoined',user: newUser.username, message:"Joined Chat"});
    });

    // emits the message to all users
    socket.on('sendMessage',(data)=>{
        console.log("Data received:", data); // Log the data for debugging
        
        if (data&&data.user&&data.message) {
            
            socket.broadcast.emit('message', {type:data.type, user: data.user, message:data.message});
        } else {
            console.error('Invalid message data:', data);
        }
        
    });

    socket.on('disconnect', ()=>{
        const index = userList.findIndex(user => user.socketID === socket.id);
        if(index!== -1){
            // splice removes that one element (user that is leaving), and puts it into its own array, [0] is that new array with leaving user
            const leavingUser = userList.splice(index,1)[0];
            console.log('USER LEAVING', leavingUser);
            const name = leavingUser.username
            io.emit('userlist', {users: userList});
            io.emit('message',{type: 'userLeft', user: name, message: "Left Chat"}); 
        }
    });
});



const PORT = process.env.PORT || 3000;
http.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));