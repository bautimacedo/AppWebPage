app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});
// Middleware para autenticar el token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header

  if (!token) return res.sendStatus(401); // Si no hay token, no autorizado

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user; // Guardar la información del usuario en la request
    next(); // Continuar con la siguiente función middleware
  });
}
