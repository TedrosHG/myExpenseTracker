const User = require('../models/user')
const {profile, changePassword} = require('../validations/user')
const CustomError = require('../utilits/customError')

const updateProfile = async (req, res, next)=>{ 
    const {error, value} = profile.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const userExist = await User.findById(req.user.userId)
        if(!userExist) throw new CustomError('User not found',401)
        
        const user = await User.findByIdAndUpdate(req.user.userId ,{...value}, {new: true})
        if(!user){
            //console.log("no user");
            throw new CustomError("User not found", 401)
        }
         
        return res.status(200).json({success:true, message:user})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updatePassword = async (req, res, next)=>{
    const {error, value} = changePassword.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))

}

module.exports = {
    updateProfile,
    updatePassword
}
