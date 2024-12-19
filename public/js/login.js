document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token, role } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      window.location.href = '/hotels.html';
    } else {
      const error = await response.json();
      alert(`Login failed: ${error.error}`);
    }
  } catch (error) {
    alert('An error occurred during login.');
  }
});

console.log('Login JavaScript file updated.');
