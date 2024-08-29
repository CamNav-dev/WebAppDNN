// authenticateUser.js
export const authenticateUser = (req, res, next) => {
  // Lógica para autenticar al usuario
  // Ejemplo: Si el usuario está autenticado, asigna su ID a req.userId
  if (req.isAuthenticated()) {
    req.userId = req.user._id; // Asigna el ID del usuario autenticado
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
