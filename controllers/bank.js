const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {createBankValidaion, moneyExchangeValidaion} = require('../validations/bank')
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



const deleteBank = async (req, res, next)=>{
    const {error, value} = changePassword.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))

}

module.exports = {
    createBank,
    deleteBank
}
