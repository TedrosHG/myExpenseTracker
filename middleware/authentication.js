const jwt = require('jsonwebtoken')

const User = require('../models/user');
const CustomError = require('../utilits/customError');

const auth = async(req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError("token not provided.", 400)
    }
    // get only the token from the header = Bearer token 
    const token = authHeader.split(' ')[1] 
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      req.user = { userId: payload.userId}
      next()

    } catch (error) {
        console.log(error);
        next(error)
    }

}

module.exports = auth