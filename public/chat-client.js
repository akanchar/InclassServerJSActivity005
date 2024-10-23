const socket = io();

let currentUser;

// Prompt for username
while (!currentUser) {
    currentUser = prompt("Enter your name:");
}

// Emit new user
socket.emit('new user', currentUser);

// Handle user list update
socket.on('update user list', (userList) => {
    const userContainer = document.getElementById('user-list');
    userContainer.innerHTML = '<h2>Users Online</h2>'; // Clear current list
    userList.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `<img class="profile-picture" src="${user.profilePicture}" alt="${user.name}"> ${user.name}`;
        userContainer.appendChild(userItem);
    });
});

// Handle user joined message
socket.on('user joined', (username) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-joined';
    messageElement.innerText = `${username} has joined the chat`;
    document.getElementById('messages').appendChild(messageElement);
});

// Handle chat messages
socket.on('chat message', (chatMessage) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<strong>${chatMessage.user}</strong>: ${chatMessage.message} <em>(${chatMessage.time})</em>`;
    document.getElementById('messages').appendChild(messageElement);
});

// Send chat message
document.getElementById('send-button').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (message) {
        const chatMessage = {
            user: currentUser,
            message: message,
            time: new Date().toLocaleTimeString()
        };
        socket.emit('chat message', chatMessage);
        messageInput.value = ''; // Clear input
    }
});

// Leave chat
document.getElementById('leave-button').addEventListener('click', () => {
    socket.emit('user left', currentUser);
    document.getElementById('messages').innerHTML = ''; // Clear messages
});

// Handle user left message
socket.on('user left', (username) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-left';
    messageElement.innerText = `${username} has left the chat`;
    document.getElementById('messages').appendChild(messageElement);
});
