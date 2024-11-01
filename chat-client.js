const socket = io();

// Elements
const usernameInput = document.getElementById("username");
const joinButton = document.getElementById("join");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const leaveButton = document.getElementById("leave");
const messages = document.getElementById("messages");

// Join chat
joinButton.addEventListener("click", () => {
    const username = usernameInput.value;
    if (username) {
        socket.emit("username", username);
        usernameInput.disabled = true;
        joinButton.disabled = true;
    }
});

// Send message
sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message) {
        socket.emit("chat message", socket.username, message);
        messageInput.value = "";
    }
});

// Leave chat
leaveButton.addEventListener("click", () => {
    socket.emit("leave"); // Emit leave event to the server
});

// Listen for messages
socket.on("show message", (type, user, message) => {
    const item = document.createElement("li");
    if (type === "userJoined") {
        item.textContent = `${user} joined the chat.`;
        item.classList.add("user-joined");
    } else if (type === "userLeft") {
        item.textContent = `${user} left the chat.`;
        item.classList.add("user-left");
    } else if (type === "newMessage") {
        item.textContent = `${user}: ${message}`;
        item.classList.add("chat-message");
    }
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

// Update user list
socket.on("updateUserList", (users) => {
    // Logic to update user list if needed
});
