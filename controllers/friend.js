const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {createFriendValidaion, updateFriendValidaion, deleteFriendValidaion} = require('../validations/friend')
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

const updateFriend = async (req, res, next)=>{
    const {error, value} = updateFriendValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const friend = await Friend.findOne({user:req.user.userId, _id:value.id})
        if(friend.length == 0 ) return next(new CustomError("No such account found",404))

        //update the data
        Friend.set(value)
        await Friend.save()

        return res.status(200).json({success: true, msg:"friend's account updated successfully."})

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteFriend = async (req, res, next)=>{
    const {error, value} = deleteFriendValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const friend = await Friend.find({user:req.user.userId, _id:value.id})
        if(!friend.length > 0 ) return next(new CustomError("No such account found",404))

        await Friend.remove({_id : value.id , user: req.user.userId})

        return res.status(204).json({success: true, msg:"friend's account deleted successfully."})
 
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    createFriend,
    getAllFriend,
    updateFriend,
    deleteFriend
}
