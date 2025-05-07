const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    req.auth = token;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
