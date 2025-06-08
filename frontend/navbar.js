document.addEventListener('DOMContentLoaded', async () => {
  const nav = document.querySelector('.navbar-nav');
  if (!nav) return;

  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  try {
    if (adminToken) {
      const res = await fetch('http://localhost:3000/admin/profile', {
        headers: {
          'Authorization': 'Bearer ' + adminToken,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '/frontend/screenAdmin/panelAdmin.html';
        a.textContent = 'Admin Panel';
        li.appendChild(a);
        nav.appendChild(li);
      }
    } else if (userToken) {
      const res = await fetch('http://localhost:3000/profile', {
        headers: {
          'Authorization': 'Bearer ' + userToken,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) return;
      const user = await res.json();
      if (user.rol === 'proveedor') {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '/frontend/screenProviders/panelProvider.html';
        a.textContent = 'Provider Panel';
        li.appendChild(a);
        nav.appendChild(li);
      }
    }
  } catch (err) {
    console.error('Error building navbar:', err);
  }
});
