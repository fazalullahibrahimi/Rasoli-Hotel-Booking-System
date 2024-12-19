document
  .getElementById('registerForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        alert('Registration successful. Please log in.');
        window.location.href = '/login.html';
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.error}`);
      }
    } catch (error) {
      alert('An error occurred during registration.');
    }
  });

console.log('Register JavaScript file updated.');
