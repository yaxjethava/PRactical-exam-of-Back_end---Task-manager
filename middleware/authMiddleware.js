const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied. Admin only.' });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).render('error', { message: 'Access denied. User only.' });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin, isUser };
