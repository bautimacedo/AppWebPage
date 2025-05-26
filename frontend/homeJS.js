document.addEventListener('DOMContentLoaded', async () => {
console.log('TOKEN DESDE HOME:', localStorage.getItem('token'));

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // No está logueado, redirigir a login
      window.location.href = '/frontend/login.html';
      return;
    }

    const response = await fetch('http://localhost:3000/profile', { // o la ruta que devuelva datos del usuario con token
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Token inválido o expirado, redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/frontend/login.html';
      return;
    }

    const user = await response.json();

    if (user.rol === 'proveedor') {
      const nav = document.querySelector('.navbar-nav');

      const li = document.createElement('li');
      li.className = 'nav-item';

      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = '/frontend/screenProviders/providerPanel.html'; // Asegúrate de que esta ruta exista
      a.textContent = 'Provider Panel';

      li.appendChild(a);
      nav.appendChild(li);
    }

  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
  }
});