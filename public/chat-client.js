// Elements
const userList = document.getElementById('user-list'); // Get the user list container element
const joinButton = document.getElementById('join-chat'); // Get the Join Chat button element
const leaveButton = document.getElementById('leave-chat'); // Get the Leave Chat button element
const userNameInput = document.getElementById('user-name'); // Get the input element for the user's name

// Function to update the user list
function updateUserList(users) {
  userList.innerHTML = '';  // Clear existing user list
  users.forEach(user => { // Iterate through each user in the list
    const userElement = document.createElement('div'); // Create a new div for each user
    userElement.textContent = `${user.name} (ID: ${user.randomNumber})`; // Set the text content to the user's name and ID
    userList.appendChild(userElement); // Append the user element to the user list container
  });
}

// Join chat (send POST request to add user)
joinButton.addEventListener('click', () => { // Add click event listener to the Join button
  const userName = userNameInput.value; // Get the value from the username input
  if (userName) { // Check if the username is not empty
    fetch('/add-user', { // Send a POST request to add the user
      method: 'POST', // Specify the request method as POST
      headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
      body: JSON.stringify({ name: userName }) // Convert the username to JSON format for the request body
    })
    .then(response => response.json()) // Parse the JSON response from the server
    .then(updateUserList); // Update the user list with the new data from the server
  }
});

// Leave chat (send POST request to remove user)
leaveButton.addEventListener('click', () => { // Add click event listener to the Leave button
  const userName = userNameInput.value; // Get the value from the username input
  if (userName) { // Check if the username is not empty
    fetch('/remove-user', { // Send a POST request to remove the user
      method: 'POST', // Specify the request method as POST
      headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
      body: JSON.stringify({ name: userName }) // Convert the username to JSON format for the request body
    })
    .then(response => response.json()) // Parse the JSON response from the server
    .then(updateUserList); // Update the user list with the new data from the server
  }
});
