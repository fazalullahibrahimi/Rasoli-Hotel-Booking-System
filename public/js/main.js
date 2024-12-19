// Check if user is logged in
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login.html';
}

function addLogoutButton() {
  const header = document.querySelector('header');
  if (header) {
    if (isLoggedIn()) {
      const logoutButton = document.createElement('button');
      logoutButton.textContent = 'Logout';
      logoutButton.className = 'bg-red-500 text-white px-4 py-2 rounded ml-4';
      logoutButton.onclick = logout;
      header.appendChild(logoutButton);
    } else {
      const loginButton = document.createElement('a');
      loginButton.textContent = 'Login';
      loginButton.href = '/login.html';
      loginButton.className = 'bg-green-500 text-white px-4 py-2 rounded ml-4';
      header.appendChild(loginButton);
    }
  }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', addLogoutButton);

console.log('Main JavaScript file updated with logout functionality.');
