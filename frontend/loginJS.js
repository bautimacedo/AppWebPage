  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginType = document.getElementById('loginType').value; // user o admin
    const endpoint = loginType === 'admin' ? '/login-admin' : '/login';

    
    try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      if (loginType === 'admin') {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/frontend/home.html';
      } else {
        localStorage.setItem('token', data.token);
        window.location.href = '/frontend/home.html';
      }
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }

  } catch (error) {
    console.error('Error al hacer login:', error);
    alert('Hubo un problema al intentar iniciar sesión.');
  }
  });
    document.getElementById('registerLink').addEventListener('click', function() {
        window.location.href = 'register.html';
    });