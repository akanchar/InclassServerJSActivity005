const socket = io();

//gets username and emits to the username function of socket to create a new user
let username = prompt("What's Your Username? ");
socket.emit('username', username);

document.getElementById('send-button').addEventListener('click',()=>{
    const message = document.getElementById('entry').value;
    //if there is a message after the send button is clicked
    if(message){
        //emit to socket under 'sendMessage' func which emits to all other users the message
        socket.emit('sendMessage', {user: username,message});

        //adds message to your own chat window
        addMessageChat({type:'myMessage', user: username, message});
        messageInput.value = '';
    }
});
document.getElementById('leave-button').addEventListener('click', () => {
    socket.emit('leave', username);
    document.querySelector('.chat-container').style.display = 'none';
    socket.disconnect();
});

// when socket 'message' is called:
socket.on('message',(data)=>{
    addMessageChat(data);
});

socket.on('userlist',(data)=>{
    updateUserList(data);
});

function addMessageChat({type, user,message}){
    const chatWindow = document.getElementById('messages');
    const messageLine = document.createElement('li');
    // adds what type of message it is to the class to denote which one you sent and which one others sent
    messageLine.classList.add(type); 
    messageLine.innerHTML = `<strong>${user}:</strong> <p>${message}</p>`;
    chatWindow.appendChild(messageLine);

}

function updateUserList({users}){
    const userList = document.getElementById('user-list');
    //reset the list to empty
    userList.innerHTML = '';
    user.forEach(user => {
        userItem = document.createElement('li');
        userItem.innerHTML = `<img src  ="https:randomuser.me/api/portraits/men/${user.number}.jpg`;
        userList.appendChild(userItem);
    });

}

