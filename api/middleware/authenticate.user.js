import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  // Verifica si existe un token en la cabecera de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired', expired: true });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Añadir más información del usuario al request, si es necesario
    req.user = { _id: decoded.id, roles: decoded.roles || [] }; // Ejemplo: Incluyendo roles
    next();
  });
};
