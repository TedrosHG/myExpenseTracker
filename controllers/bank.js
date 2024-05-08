const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {createBankValidaion, updateBankValidaion ,deleteBankValidaion} = require('../validations/bank')
const CustomError = require('../utilits/customError')

const createBank = async (req, res, next)=>{
    const {error, value} = createBankValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const bankExist = await Bank.findOne({user:req.user.userId, name:value.name.toLowerCase()})
        if(bankExist) throw new CustomError('Bank already Exist',409)

        const bank = await Bank.create({
            user:req.user.userId,
            name: value.name,
            amount: value.amount,
        })

        if(!bank){
            throw new CustomError('Something went wrong',500)
        }
        //create new transaction
        const transaction = await Transaction.create({
            user:req.user.userId,
            bank: bank._id,
            amount: value.amount,
            reason: "Initial deposit"
        })

        return res.status(201).json({success:true, message:bank})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllBank = async (req, res, next)=>{
    try {
        const bank = await Bank.find({user:req.user.userId})

        return res.status(200).json({success:true, message:bank})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateBank = async (req, res, next)=>{
    const {error, value} = updateBankValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const bank = await Bank.findOne({user:req.user.userId, _id:value.id})
        if(bank.length == 0 ) return next(new CustomError("No such account found",404))

        //update the data
        bank.set(value)
        await bank.save()

        return res.status(200).json({success: true, msg:"Account updated successfully."})

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteBank = async (req, res, next)=>{
    const {error, value} = deleteBankValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const bank = await Bank.find({user:req.user.userId, _id:value.id})
        if(!bank.length > 0 ) return next(new CustomError("No such account found",404))

        await Bank.remove({_id : value.id , user: req.user.userId})

        return res.status(204).json({success: true, msg:"Account deleted successfully."})

    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    createBank,
    getAllBank,
    updateBank,
    deleteBank
}
