document.addEventListener('DOMContentLoaded', async () => {
  const nav = document.querySelector('.navbar-nav');
  if (!nav) return;

  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const userRole = localStorage.getItem('userRole');

  try {
      if (adminToken) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '/frontend/screenAdmin/panelAdmin.html';
        a.textContent = 'Admin Panel';
        li.appendChild(a);
        nav.appendChild(li);
      } else if (userToken && userRole === 'proveedor') {
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
    console.error('Error building navbar:', err);
  }
});
