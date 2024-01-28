import jwt from "jsonwebtoken";

export default (req, res, next) => {
   console.log('ниже')
   console.log(req.headers.authorization)
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    console.log(token)
    if (token) {
        try {

            const decoded = jwt.verify(token, 'secret111');
            console.log('auth me ok')
            req.userId = decoded._id;

            next();
        } catch (err) {
         
        }
    } else {
        return res.status(403).json({
            message: 'Нерабочий токен'
        })
    }


}