
const socket = io();

//gets username and emits to the username function of socket to create a new user
let username = prompt("What's Your Username? ");
socket.emit('username', username);

document.getElementById('send-button').addEventListener('click',(e)=>{
    e.preventDefault();
    let message = document.getElementById('entry').value;
    //if there is a message after the send button is clicked
    if(message){
        console.log(`sending message ${message} from ${username}`)
        //emit to socket under 'sendMessage' func which emits to all other users the message
        socket.emit('sendMessage', {type:'userMeslolsage',user: username, message:message});

        //adds message to your own chat window
        addMessageChat({type:'myMessage', user: username, message});
        //clear input
        document.getElementById('entry').value = '';
    }
    else{
        console.log("Empty Message")
    }
});
document.getElementById('leave-button').addEventListener('click', () => {
    socket.disconnect();
    document.querySelector('.chat-container').style.display = 'none';
    alert("You have left the chat.");
    
});

// when socket 'message' is called:
socket.on('message',(data)=>{
    console.log('message received', data);
    const {type, user, message}= data;
    addMessageChat({type, user,message});
});

socket.on('userlist',(data)=>{
    updateUserList(data);
});

function addMessageChat({type, user, message}){
    const chatWindow = document.getElementById('messages');
    const messageLine = document.createElement('li');
    // adds what type of message it is to the class to denote which one you sent and which one others sent
    messageLine.classList=type; 
    messageLine.innerHTML = `<strong>${user}:</strong> <p>${message}</p>`;
    chatWindow.appendChild(messageLine);
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateUserList({users}){
    const list = document.getElementById('user-list');
    list.innerHTML = ''; // Clear the current list

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');
        
        // Create the profile picture
        const userPic = document.createElement('img');
        if (user.number % 2 === 0) {
            userPic.src = `https://randomuser.me/api/portraits/men/${user.number}.jpg`;
        } else {
            userPic.src = `https://randomuser.me/api/portraits/women/${user.number}.jpg`;
        }
        userPic.classList.add('user-pic');
        
        // Create the user's name and status
        const userName = document.createElement('span');
        userName.textContent = user.username;
        
        const userStatus = document.createElement('span');
        userStatus.classList.add(user.online ? 'online' : 'offline');
        userStatus.textContent = user.online ? 'Online' : 'Offline';
        
        // Append the profile picture, name, and status to the userDiv
        userDiv.appendChild(userPic);
        userDiv.appendChild(userName);
        userDiv.appendChild(userStatus);
        
        // Append the userDiv to the user list
        list.appendChild(userDiv);
    });
}



