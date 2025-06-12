import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    try{
        const { authorization } = req.headers;
        if(!authorization || !authorization.startsWith('Bearer ')){
            return next({message: "Authorization header is missing or invalid", status: 401});
        }
        const [, token] = authorization.split(' ');
        const secretKey = process.env.JWT_SECRET_KEY ||'JWT_SECRET';
        const user = jwt.verify(token, secretKey);
        if(!user){
            return next({message: "auth required", status: 401});
        }
        req.myUser = user;
        next();
    }
    catch(error){
        return next({message: error.message, status: 403});
    }
}

export const checkIsAdmin = (req, res, next) => {
    if(req.myUser.role !== "admin") {
        return next({status: 403, message: "No Access permission"});
    }
    next();
}