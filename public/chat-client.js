// Elements
const userList = document.getElementById('user-list');
const joinButton = document.getElementById('join-chat');
const leaveButton = document.getElementById('leave-chat');
const userNameInput = document.getElementById('user-name');

// Function to update the user list
function updateUserList(users) {
  userList.innerHTML = '';  // Clear existing list
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.textContent = `${user.name} (ID: ${user.randomNumber})`;
    userList.appendChild(userElement);
  });
}

// Join chat (send POST request to add user)
joinButton.addEventListener('click', () => {
  const userName = userNameInput.value;
  if (userName) {
    fetch('/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName })
    })
    .then(response => response.json())
    .then(updateUserList);
  }
});

// Leave chat (send POST request to remove user)
leaveButton.addEventListener('click', () => {
  const userName = userNameInput.value;
  if (userName) {
    fetch('/remove-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName })
    })
    .then(response => response.json())
    .then(updateUserList);
  }
});
