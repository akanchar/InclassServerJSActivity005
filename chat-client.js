const socket = io();  // Connect to the server

// Handle receiving the updated user list
socket.on("updateUserList", (users) => {
    const usersContainer = document.getElementById('users');
    usersContainer.innerHTML = '';  // Clear the existing users list

    // Regenerate the user list with profile pictures
    users.forEach(user => {
        const userDiv = document.createElement('div');
        const profilePic = document.createElement('img');
        
        profilePic.src = user.profilePic; // Use the profile picture from user object
        profilePic.alt = user.name;

        userDiv.textContent = user.name;
        userDiv.prepend(profilePic);  // Add the profile picture before the username

        usersContainer.appendChild(userDiv);  // Append user div to users container
    });
});

// Send username to server when user enters it
function sendUsername(username) {
    socket.emit('username', username);
}

// Handle the username form submission
document.getElementById('usernameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('usernameInput').value;
    sendUsername(username);
    document.getElementById('usernameForm').style.display = 'none'; // Hide the username input after joining
});

// Handle sending chat messages
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const message = document.getElementById('messageInput').value;
    
    // Display message directly in the chat window
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;  // You may want to format it more
    messagesContainer.appendChild(messageDiv);

    // Emit message to server
    socket.emit('chat message', message);
    document.getElementById('messageInput').value = ''; // Clear the input after sending
});

// Optional: Handle user leaving logic
document.getElementById('leave').addEventListener('click', () => {
    // Emit leave message to the server
    socket.emit('leave');
    // Hide chat window logic here
});
