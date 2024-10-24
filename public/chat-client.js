document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentUser;
    const chatContainer = document.getElementById('chat-container');
    const userListDiv = document.createElement('div');
    userListDiv.id = 'user-list';
    chatContainer.appendChild(userListDiv);
    const chatPanel = document.createElement('div');
    chatPanel.id = 'chat-panel';
    chatContainer.appendChild(chatPanel);
    const messagesDiv = document.createElement('div');
    messagesDiv.id = 'messages';
    chatPanel.appendChild(messagesDiv);
    const inputDiv = document.createElement('div');
    inputDiv.id = 'input-div';
    const messageInput = document.createElement('input');
    messageInput.id = 'message-input';
    messageInput.type = 'text';
    messageInput.placeholder = 'Type your message here...';
    const sendButton = createButton('send-button', 'Send', () => {
        sendMessage();
    });
    const leaveButton = createButton('leave-button', 'Leave', () => {
        const leaveConfirmed = window.confirm('You have left the chat. Click OK to confirm.');
        if (leaveConfirmed) {
            socket.emit('leave');
            chatContainer.style.display = 'none';
        }
    });
    inputDiv.appendChild(messageInput);
    inputDiv.appendChild(sendButton);
    inputDiv.appendChild(leaveButton);
    chatPanel.appendChild(inputDiv);
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
    function sendMessage() {
        const msg = messageInput.value;
        if (msg) {
            socket.emit('chat message', msg);
            messageInput.value = '';
        }
    }
    socket.on('welcome', (data) => {
        currentUser = data.user;
        updateUserList(data.users);
    });
    socket.on('user joined', (data) => {
        addSystemMessage(${data.user.name} has joined the chat.);
        updateUserList(data.users);
    });
    socket.on('user left', (data) => {
        addSystemMessage(${data.user.name} has left the chat., 'leave-message');
        updateUserList(data.users);
    });
    socket.on('chat message', (data) => {
        let className = data.user.id === currentUser.id ? 'own-message' : 'other-message';
        let displayName = className === 'own-message' ? 'You' : data.user.name;
        addMessage(displayName, data.message, data.time, className, data.user.profilePictureUrl);
    });
    function addMessage(sender, message, time, className, profilePictureUrl) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        if (profilePictureUrl) {
            const img = document.createElement('img');
            img.src = profilePictureUrl;
            img.alt = sender;
            img.classList.add('user-img');
            messageDiv.appendChild(img);
        }
        const senderSpan = document.createElement('span');
        senderSpan.classList.add('sender');
        senderSpan.textContent = ${sender} [${time}]: ;
        const messageSpan = document.createElement('span');
        messageSpan.classList.add('text');
        messageSpan.textContent = message;
        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(messageSpan);
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    function addSystemMessage(message, className = 'system-message') {
        const systemMessageDiv = document.createElement('div');
        systemMessageDiv.classList.add('message', className);
        systemMessageDiv.textContent = message;
        messagesDiv.appendChild(systemMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    function updateUserList(users) {
        userListDiv.innerHTML = '';
        users.forEach((user) => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user');
            const img = document.createElement('img');
            img.src = user.profilePictureUrl;
            img.alt = user.name;
            img.classList.add('user-img');
            const nameSpan = document.createElement('span');
            nameSpan.textContent = user.name;
            userDiv.appendChild(img);
            userDiv.appendChild(nameSpan);
            userListDiv.appendChild(userDiv);
        });
    }
});