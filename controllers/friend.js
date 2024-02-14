const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {createFriendValidaion} = require('../validations/friend')
const CustomError = require('../utilits/customError')
const Friend = require('../models/friend')

const createFriend = async (req, res, next)=>{ 
    const {error, value} = createFriendValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const friendExist = await Friend.findOne({user:req.user.userId, name:value.name.toLowerCase()})
        if(friendExist) throw new CustomError('user already Exist',409)
        
        const friend = await Friend.create({
            user:req.user.userId,
            name: value.name, 
        })

        if(!friend){
            throw new CustomError('Something went wrong',500)
        }
        

        return res.status(201).json({success:true, message:'friend created'})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllFriend = async (req, res, next)=>{ 
    try {
        const friendExist = await Friend.find({user:req.user.userId})
        
        return res.status(200).json({success:true, message:friendExist})
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const deleteBank = async (req, res, next)=>{
    const {error, value} = changePassword.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))

}

module.exports = {
    createFriend,
    getAllFriend
}
