import jwt from 'jsonwebtoken';

const jwtAuthenticate = (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (e) {
    res.clearCookie('token');
    return res.status(500).json({ message: 'Server error' });
  }
};

export default jwtAuthenticate;
