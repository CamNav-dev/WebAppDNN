import jwt from 'jsonwebtoken';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, 'You are not authenticated!'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, 'Token is not valid!'));
    req.user = user;
    next();
  });
};

export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export const refreshTokenHandler = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return next(createError(401, 'Refresh token not found'));

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return next(createError(403, 'Refresh token is not valid'));
    
    const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    
    res.cookie('access_token', newAccessToken, { httpOnly: true });
    res.status(200).json({ token: newAccessToken });
  });
};