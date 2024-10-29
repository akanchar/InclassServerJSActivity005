const socket = io();
const userList = document.getElementById('user-list');
const messageBox = document.getElementById('messages');
const joinButton = document.getElementById('join-chat');
const leaveButton = document.getElementById('leave-chat');
const userNameInput = document.getElementById('user-name');
const sendButton = document.getElementById('send-message');
const messageInput = document.getElementById('message');

// Update user list on the client side
function updateUserList(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        const profilePic = document.createElement('img');
        // Modifies the image URL dynamically based on randomNumber
        profilePic.src = user.randomNumber % 2 === 0 ? 
            `https://randomuser.me/api/portraits/men/${user.randomNumber % 100}.jpg` :
            `https://randomuser.me/api/portraits/women/${user.randomNumber % 100}.jpg`;
        userElement.textContent = `${user.name}`;
        userElement.appendChild(profilePic);
        userList.appendChild(userElement);
    });
}

// Handle user joining the chat
joinButton.addEventListener('click', () => {
  const userName = userNameInput.value.trim();
  if (userName) {
    fetch('/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName })
    }).then(response => response.json())
      .then(data => {
        if (data.success) {  // Check if the server confirms the user was added successfully
            updateUserList(data.users); // Update the client-side user list
            // Construct a message to indicate joining
            const joinMessage = { user: 'System', message: `${userName} joined the chat`, time: new Date().toLocaleTimeString() };
            
            socket.emit('chat-message', joinMessage);  // Broadcast join message to all clients
        } else {
            console.error("Failed to join chat:", data.message);  // Log error to console instead of alerting
        }
    });
  }
});



// Handle user leaving the chat
leaveButton.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    if (userName) {
        fetch('/remove-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName })
        }).then(response => response.json())
          .then(data => {
              updateUserList(data);
              messageBox.style.display = 'none'; // Hide the chat window
          });
    }
});

// Handle sending a new message
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const userName = userNameInput.value.trim();
    if (message && userName) {
        const chatMessage = { user: userName, message: message, time: new Date().toLocaleTimeString() };
        displayMessage(chatMessage, true);
        socket.emit('chat-message', chatMessage);
        messageInput.value = ''; // Clear the input after sending
    }
});

// Update user list when it changes
socket.on('user-updated', (users) => {
    updateUserList(users);
});

socket.on('chat-message', (data) => {
  displayMessage(data, false);
});

function displayMessage(data, isOwnMessage) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.user}: ${data.message} (${data.time})`;
  messageElement.classList.add(isOwnMessage ? 'own-message' : 'other-message');
  messageBox.appendChild(messageElement);
  messageBox.scrollTop = messageBox.scrollHeight; // Auto-scroll to the latest message
}

