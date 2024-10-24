const socket = io();
const userList = document.getElementById('user-list');
const messageBox = document.getElementById('messages');
const joinButton = document.getElementById('join-chat');
const leaveButton = document.getElementById('leave-chat');
const userNameInput = document.getElementById('user-name');
const sendButton = document.getElementById('send-message');
const messageInput = document.getElementById('message');

function updateUserList(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('div');
    const profilePic = document.createElement('img');
    profilePic.src = user.randomNumber % 2 === 0 ? 'https://randomuser.me/api/portraits/men/90.jpg' : 'https://randomuser.me/api/portraits/women/45.jpg';
    userElement.textContent = `${user.name}`;
    userElement.appendChild(profilePic);
    userList.appendChild(userElement);
  });
}

joinButton.addEventListener('click', () => {
  const userName = userNameInput.value;
  if (userName) {
    fetch('/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName })
    }).then(response => response.json())
      .then(updateUserList);
  }
});

leaveButton.addEventListener('click', () => {
  const userName = userNameInput.value;
  if (userName) {
    fetch('/remove-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName })
    }).then(response => response.json())
      .then(updateUserList);
  }
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  const userName = userNameInput.value;
  if (message) {
    const chatMessage = { user: userName, message: message, time: new Date().toLocaleTimeString() };
    displayMessage(chatMessage, true);
    socket.emit('chat-message', chatMessage);
  }
});

socket.on('chat-message', (data) => {
  displayMessage(data, false);
});

socket.on('user-updated', (users) => {
  updateUserList(users);
});

function displayMessage(data, isOwnMessage) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.user}: ${data.message} (${data.time})`;
  messageElement.classList.add(isOwnMessage ? 'own-message' : 'other-message');
  messageBox.appendChild(messageElement);
}
