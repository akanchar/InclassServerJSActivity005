const socket = io();

const userList = document.getElementById('user-list');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');
const chatWithHeader = document.getElementById('chat-with');
const leaveChatButton = document.getElementById('leave-chat');

let currentChatUser = null;

// Function to update user list
function updateUserList(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.name;
        li.onclick = () => selectUser(user); // Attach click event
        userList.appendChild(li);
    });
}

// Function to select a user for chat
function selectUser(user) {
    currentChatUser = user;
    chatWithHeader.textContent = `Chatting with ${user.name}`;
    chatWindow.innerHTML = ''; // Clear the chat window
}

// Function to send a message
sendMessageButton.onclick = () => {
    const message = chatInput.value;
    if (message && currentChatUser) {
        // Display the message in the chat window
        chatWindow.innerHTML += `<div class="my-message">${message}</div>`;
        // Send message to the server
        socket.emit('chat message', { message, to: currentChatUser.name });
        chatInput.value = ''; // Clear input
    }
};

// Receive chat messages from the server
socket.on('chat message', (data) => {
    if (currentChatUser && data.from === currentChatUser.name) {
        chatWindow.innerHTML += `<div class="other-message">${data.from}: ${data.message}</div>`;
    }
});

// Update user list when a new user joins
socket.on('update user list', (users) => {
    updateUserList(users);
});

// Handle user join/leave messages
socket.on('user joined', (username) => {
    chatWindow.innerHTML += `<div class="system-message">${username} has joined the chat.</div>`;
});

socket.on('user left', (username) => {
    chatWindow.innerHTML += `<div class="system-message">${username} has left the chat.</div>`;
});

// Leave chat functionality
leaveChatButton.onclick = () => {
    if (currentChatUser) {
        socket.emit('leave chat', currentChatUser.name); // Notify server
        currentChatUser = null;
        chatWithHeader.textContent = 'Select a user to chat';
        chatWindow.innerHTML = ''; // Clear the chat window
    }
};

// On new user connection
const username = prompt('Enter your username:');
socket.emit('new user', username);
