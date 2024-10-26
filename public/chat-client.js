const socket = io();  // Connect to the server

// Handle receiving the updated user list
socket.on("updateUserList", (users) => {
    const usersContainer = document.getElementById('users');
    usersContainer.innerHTML = '';  // Clear the existing users list

    // Regenerate the user list with profile pictures
    users.forEach(user => {
        const userDiv = document.createElement('div');
        const profilePic = document.createElement('img');
        
        // Set profile picture based on random number
        if (user.randomNum % 2 === 0) {
            profilePic.src = `https://randomuser.me/api/portraits/men/${user.randomNumber}.jpg`;
        } else {
            profilePic.src = `https://randomuser.me/api/portraits/women/${user.randomNumber}.jpg`;
        }

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

// Optional: Handle message sending logic here
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const message = document.getElementById('messageInput').value;
    // Emit message to server (you'll need to handle this on the server side)
    // socket.emit('chat message', message);
    document.getElementById('messageInput').value = ''; // Clear the input after sending
});
