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

export const checkUploadLimits = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const currentDate = new Date();
  const lastUploadDate = user.lastUploadDate || new Date(0);
  const daysSinceLastUpload = (currentDate - lastUploadDate) / (1000 * 60 * 60 * 24);

  if (daysSinceLastUpload >= RETENTION_PERIOD_DAYS) {
    // Reset upload count if retention period has passed
    user.uploadCount = 0;
    user.lastUploadDate = null;
    await user.save();
  }

  if (user.uploadCount >= FILE_LIMITS[user.membershipType]) {
    return res.status(403).json({ message: "File upload limit reached for your membership plan." });
  }

  next();
};
