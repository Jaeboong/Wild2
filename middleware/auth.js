const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.redirect("/login"); 
  }
};

module.exports = checkLogin;
