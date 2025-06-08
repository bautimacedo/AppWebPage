document.addEventListener('DOMContentLoaded', async () => {
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  try {
    const token = userToken || adminToken;
    if (!token) {
      // No está logueado, redirigir a login
      window.location.href = '/frontend/login.html';
      return;
    }

    const endpoint = adminToken ? 'http://localhost:3000/admin/profile'
                                : 'http://localhost:3000/profile';

    const response = await fetch(endpoint, {
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

    const data = await response.json();

    const nav = document.querySelector('.navbar-nav');

    if (adminToken) {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = '/frontend/screenAdmin/panelAdmin.html';
      a.textContent = 'Admin Panel';
      li.appendChild(a);
      nav.appendChild(li);
    } else if (data.rol === 'proveedor') {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = '/frontend/screenProviders/panelProvider.html';
      a.textContent = 'Provider Panel';
      li.appendChild(a);
      nav.appendChild(li);
    }

  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
  }
});