document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentUser;

    // Constants
    const chatContainer = document.getElementById('chat-container');
    const currentUserInfoDiv = createAndAppendElement('div', 'current-user-info', chatContainer);
    const mainContentDiv = createAndAppendElement('div', 'main-content', chatContainer);
    const userListDiv = createAndAppendElement('div', 'user-list', mainContentDiv);
    const chatPanel = createAndAppendElement('div', 'chat-panel', mainContentDiv);
    const messagesDiv = createAndAppendElement('div', 'messages', chatPanel);
    const inputDiv = createAndAppendElement('div', 'input-div', chatPanel);

    // Message Input
    const messageInput = createInputField('message-input', 'Type your message here...');
    inputDiv.appendChild(messageInput);

    // Buttons
    const sendButton = createButton('send-button', 'Send', sendMessage);
    const leaveButton = createButton('leave-button', 'Leave', confirmAndLeaveChat);
    inputDiv.appendChild(sendButton);
    inputDiv.appendChild(leaveButton);

    // Event Listeners
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    socket.on('welcome', (data) => {
        currentUser = data.user;
        updateUserList(data.users);
        updateCurrentUserInfo(currentUser);
    });

    socket.on('user joined', (data) => {
        addSystemMessage(`${data.user.name} has joined the chat.`);
        updateUserList(data.users);
    });

    socket.on('user left', (data) => {
        addSystemMessage(`${data.user.name} has left the chat.`, 'leave-message');
        updateUserList(data.users);
    });

    socket.on('chat message', (data) => {
        const className = data.user.id === currentUser.id ? 'own-message' : 'other-message';
        const displayName = className === 'own-message' ? 'You' : data.user.name;
        appendMessage(displayName, data.message, data.time, className, data.user.profilePictureUrl);
    });

    function sendMessage() {
        const msg = messageInput.value;
        if (msg) {
            socket.emit('chat message', msg);
            messageInput.value = '';
        }
    }

    function confirmAndLeaveChat() {
        const leaveConfirmed = window.confirm('You have left the chat. Click OK to confirm.');
        if (leaveConfirmed) {
            socket.emit('leave');
            chatContainer.style.display = 'none';
        }
    }

    function createAndAppendElement(tag, id, parent) {
        const element = document.createElement(tag);
        element.id = id;
        parent.appendChild(element);
        return element;
    }

    function createButton(id, text, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function createInputField(id, placeholder) {
        const input = document.createElement('input');
        input.id = id;
        input.type = 'text';
        input.placeholder = placeholder;
        return input;
    }

    function appendMessage(sender, message, time, className, profilePictureUrl) {
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
        senderSpan.textContent = `${sender} [${time}]: `;
        messageDiv.appendChild(senderSpan);

        const messageSpan = document.createElement('span');
        messageSpan.classList.add('text');
        messageSpan.textContent = message;
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
            userDiv.appendChild(img);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = user.name;
            userDiv.appendChild(nameSpan);

            userListDiv.appendChild(userDiv);
        });
    }

    function updateCurrentUserInfo(user) {
        currentUserInfoDiv.innerHTML = '';

        const userImg = document.createElement('img');
        userImg.src = user.profilePictureUrl;
        userImg.alt = user.name;
        currentUserInfoDiv.appendChild(userImg);

        const userName = document.createElement('span');
        userName.classList.add('user-name');
        userName.textContent = user.name;
        currentUserInfoDiv.appendChild(userName);
    }
});