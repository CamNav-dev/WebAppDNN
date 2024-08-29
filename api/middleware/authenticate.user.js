import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Ensure this matches what you set in the token payload
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
