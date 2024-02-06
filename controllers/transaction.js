const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {createBankValidaion, moneyExchangeValidaion} = require('../validations/bank')
const CustomError = require('../utilits/customError')



const moneyIn = async (req, res, next)=>{ 
    const {error, value} = moneyExchangeValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const bankExist = await Bank.findOne({user:req.user.userId, name:value.name.toLowerCase()})
        if(!bankExist) throw new CustomError('Bank not found',400)
        
        const bank = await Bank.findOneAndUpdate({_id:bankExist._id},{
            $inc:{
                amount: value.amount
            }
        },{ new: true })

        if(!bank){
            throw new CustomError('Something went wrong',500)
        }
        const updateTransaction = await Transaction.findOneAndUpdate({user:req.user.userId, bank:bank._id},{
            $set:{
                reason: value.reason
            },
            $inc:{
                amount: value.amount
            }
            
        },{ new: true })

        return res.status(201).json({success:true, message:bank})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const moneyOut = async (req, res, next)=>{ 
    const {error, value} = moneyExchangeValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const bankExist = await Bank.findOne({user:req.user.userId, name:value.name.toLowerCase()})
        if(!bankExist) throw new CustomError('Bank not found',400)
        
        const bank = await Bank.findOneAndUpdate({_id:bankExist._id},{
            $inc:{
                amount: -1 * value.amount
            }
        },{ new: true })

        if(!bank){
            throw new CustomError('Something went wrong',500)
        }
        const updateTransaction = await Transaction.findOneAndUpdate({user:req.user.userId, bank:bank._id},{
            $set:{
                reason: value.reason,
                deposit:  false
            },
            $inc:{
                amount: -1 * value.amount
            }
            
        },{ new: true })

        return res.status(201).json({success:true, message:bank})
    } catch (error) {
        console.log(error)
        next(error)
    }
}



module.exports = {
    moneyIn,
    moneyOut,
}
