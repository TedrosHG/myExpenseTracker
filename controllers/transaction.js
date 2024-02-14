const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {moneyExchangeValidaion} = require('../validations/transaction')
const CustomError = require('../utilits/customError')
const Friend = require('../models/friend')



const moneyIn = async (req, res, next)=>{ 
    const {error, value} = moneyExchangeValidaion.validate(req.body)
    if(error) return next(new CustomError(error.details[0].message, 400))
    try {
        const bankExist = await Bank.findOne({_id:value.bankId})
        if(!bankExist) throw new CustomError('Bank not found',400)
        
        const bank = await Bank.findOneAndUpdate({_id:bankExist._id},{
            $inc:{
                amount: value.amount
            }
        },{ new: true })

        if(!bank){
            throw new CustomError('Something went wrong',500)
        }
        //create new transaction 
        const transaction = await Transaction.create({
            user:req.user.userId,
            bank: bank._id, 
            amount: value.amount,
            reason: value.reason,
            loan: value.loan,
            friend: value.friend
        })

        if(transaction.loan){
            const friend = await Friend.findOneAndUpdate({_id:transaction.friend},{
                $inc:{
                    loan: value.amount
                }
            },{ new: true })
        }
        

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
        if(value.loan && !value.friend) throw new CustomError('friend is required',400)
        const bankExist = await Bank.findOne({_id:value.bankId})
        if(!bankExist) throw new CustomError('Bank not found',400)
        
        const bank = await Bank.findOneAndUpdate({_id:bankExist._id},{
            $inc:{
                amount: -1 * value.amount
            }
        },{ new: true })

        if(!bank){
            throw new CustomError('Something went wrong',500)
        }
        //create new transaction 
        const transaction = await Transaction.create({
            user:req.user.userId,
            bank: bank._id, 
            amount: value.amount,
            reason: value.reason,
            deposit:  false,
            loan: value.loan,
            friend: value.friend
        })

        if(transaction.loan){
            const friend = await Friend.findOneAndUpdate({_id:transaction.friend},{
                $inc:{
                    loan: -1 * value.amount
                }
            },{ new: true })
        }
        

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
