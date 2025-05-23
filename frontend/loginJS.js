  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token); // <-- guardás el token
        window.location.href = '/frontend/home.html';
        
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