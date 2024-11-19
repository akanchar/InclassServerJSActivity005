const socket = io();

// DOM elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.getElementById('messages');
const usersList = document.getElementById('users');
const leaveButton = document.getElementById('leave-button');

// store your username
let userName = prompt('Enter your name:');
if (userName) {
  socket.emit('newUser', userName);
} else {
  alert('A name is required to join the chat.');
  window.location.reload(); // Reload if no name is provided
}

// when the send button is clicked, send a message to the server
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim()) {
    
    socket.emit('chatMessage', message);
    
    displayMessage({ user: 'You', text: message, time: new Date().toLocaleTimeString() });
    messageInput.value = '';
  }
});

// display messages in the chat window
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  
  messageElement.innerHTML = `
    <strong>${message.user}:</strong> ${message.text} <span class="time">${message.time}</span>
  `;

  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


socket.on('userList', (users) => {
  usersList.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('li');
    userElement.innerHTML = `<img src="${user.profilePicture}" alt="Profile" class="profile-pic"> ${user.name}`;
    usersList.appendChild(userElement);
  });
});

// skip displaying the message if it's from the current user
socket.on('message', (message) => {
  if (message && message.user && message.text) {
    if (message.user !== userName) {
      displayMessage(message);
    }
  }
});

// handle the leave button click
leaveButton.addEventListener('click', () => {
  socket.disconnect();
  document.getElementById('chat-container').style.display = 'none';
});
