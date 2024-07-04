const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie;

  if (cookieHeader) {
    const token = cookieHeader
      .split('; ')
      .find(row => row.startsWith('LoginCookie='))
      ?.split('=')[1];

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY , (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error'));
        }
        socket.username = decoded.username;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
};

module.exports = socketAuth;
