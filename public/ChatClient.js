const socket = io();
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    socket.emit('login'); // Let the server randomly assign a profile

    // Set currentUser when the profile is returned from the server
    socket.on('set profile', (userProfile) => {
        currentUser = userProfile;
        const lastNameFirst = `${userProfile.name.split(' ')[1]}, ${userProfile.name.split(' ')[0]}`;
        document.getElementById('current-user').textContent = `Logged in as: ${lastNameFirst}`;
    });

    // Send message on button click
    document.getElementById('send-message').addEventListener('click', () => {
        const messageInput = document.getElementById('input-message');
        if (messageInput.value.trim() && currentUser) {
            socket.emit('message', { user: currentUser.name, text: messageInput.value });
            messageInput.value = '';
        }
    });

    // Leave the chatroom
    document.getElementById('leave-chat').addEventListener('click', () => {
        socket.emit('leave');
        // Disable the leave button and the send button after leaving
        document.getElementById('leave-chat').disabled = true;
        document.getElementById('send-message').disabled = true;
        document.getElementById('input-message').disabled = true;
        // Update the current user display to show "Logged off"
        document.getElementById('current-user').textContent = `You have logged off`;
    });

    // Display incoming messages
    socket.on('message', (msg) => {
        const messages = document.getElementById('messages');
        const messageElem = document.createElement('div');
        messageElem.className = 'message';
        if (msg.serverMessage) {
            messageElem.classList.add('server-message');
        }
        messageElem.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.user}: ${msg.text}`;
        messages.appendChild(messageElem);
    });

    // Update the user list with profile pictures
    socket.on('user list', (users) => {
        const userList = document.getElementById('users');
        userList.innerHTML = ''; // Clear current list
        users.forEach((user) => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = user.img;
            img.className = 'user-thumbnail';
            li.appendChild(img);
            li.appendChild(document.createTextNode(user.name));
            userList.appendChild(li);
        });
    });
});
