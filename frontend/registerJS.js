  document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            // Capturando los valores de los campos del formulario
            const name = document.getElementById('name').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rol = document.getElementById('rol').value;
            const sector = document.getElementById('sector').value;

            try {
                const res = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, lastname, email, password, rol, sector })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                e.target.reset(); // Limpiar el formulario
            } else {
                alert('Error: ' + (data.error || 'No se pudo registrar'));
            }
            } catch (err) {
                alert('Error de conexión al servidor');
                console.error(err);
            }
         });