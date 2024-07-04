const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    
    const token = req.cookies.LoginCookie;

    if (!token) {
        return res.status(403).json({ msg: "No token, please log in" });
    }

    try {
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            req.user = verifyToken;
            return next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token, please log in" });
    }
}

module.exports = { checkAuth };
