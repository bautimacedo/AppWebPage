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
        // Remove any user tokens when logging in as admin
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');

        localStorage.setItem('adminToken', data.token);
        window.location.href = '/frontend/home.html';
      } else {
        // Remove any admin token when logging in as a regular user
        localStorage.removeItem('adminToken');

        localStorage.setItem('token', data.token);
        if (data.rol) {
          localStorage.setItem('userRole', data.rol);
        }
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
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
document.getElementById('registerLink').addEventListener('click', function () {
  window.location.href = 'register.html';
});
