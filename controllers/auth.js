const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('../models/user')
const {registerUser, loginUser} = require('../validations/auth')
const CustomError = require('../utilits/customError')

const register = async(req, res, next)=>{
    const {error, value} = registerUser.validate(req.body)
    if(error) {
        return next(new CustomError(error.details[0].message, 400))
    }
    try {
        //const value = await regUser.body.validateAsync(req.body)
        const userExist = await User.findOne({email: value.email});
        if(userExist) {
            throw new CustomError("Email already exist", 409);
        } //res.status(400).json({error:true, message:"User with email already exist."})

        const hashedPassword = await hashPassword(value.password)

        const user = await User.create({
            email: value.email, 
            password:hashedPassword, 
            phone: value.phone,
            firstName: value.firstName,
            lastName: value.lastName
        })
        // create token
        const token = jwt.sign(
            { userId: user._id, },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME, }
        )
        const { password, ...userInfo} = user._doc
        return res.status(201).json({ status: "Success", message:'user created', user:userInfo, token})
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const login = async(req, res, next)=>{
    const {error, value} = loginUser.validate(req.body)
    if(error) {
        return next(new CustomError(error.details[0].message, 400))
    }
    try {
        const userExist = await User.findOne({email: value.email});
        if(!userExist) throw new CustomError("No user with this email.", 400)
        
        //let {password, ...body} = value
        const matchPassword = await bcrypt.compare(value.password, userExist.password)

        if(!matchPassword){
            throw new CustomError("Wrong password.", 400)
        }

        // create token
        const token = jwt.sign(
            { userId: userExist._id, },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME, }
        )
        const { password, ...userInfo} = userExist._doc
        return res.status(200).json({ status: "Success", message:'user signin', user:userInfo, token})
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}  

const hashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports = {
    register,
    login,
}
