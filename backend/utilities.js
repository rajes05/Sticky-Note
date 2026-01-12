import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// validates a JWT Token
//jwt.verify protects a route by checking if token is valid 

function authenticateToken(req, res, next){
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=> {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    })
}
export default authenticateToken;