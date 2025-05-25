document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('roleSelect').value; // user o provider

  // Según el rol elegimos la URL del login:
  const loginUrl = role === 'provider' ? 'http://localhost:3000/login-provider' : 'http://localhost:3000/login';

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      localStorage.setItem('token', data.token); // Guardamos token
      window.location.href = '/frontend/home.html';  // O a donde quieras redirigir
      
    } else {
      alert(data.error || 'Error en el login');
    }

  } catch (error) {
    console.error('Error al hacer login:', error);
    alert('Hubo un problema al intentar iniciar sesión.');
  }
});

document.getElementById('registerLink').addEventListener('click', function() {
  window.location.href = 'register.html';
});
