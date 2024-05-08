const Bank = require('../models/bank')
const Transaction = require('../models/transaction')
const {moneyExchangeValidaion, transferToOwnBankValidaion} = require('../validations/transaction')
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

        if(bankExist.amount < value.amount) throw new CustomError("You don't have enough money in this account")
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
            amount: -1 * value.amount,
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

const transferToOwnBank = async (req, res, next) => {
    const { error, value } = transferToOwnBankValidaion.validate(req.body);
    if (error) return next(new CustomError(error.details[0].message, 400));

    let rollbackError = null; // Variable to store rollback errors
    let session
    try {
        session = await Bank.startSession(); // Start a MongoDB transaction session
        session.startTransaction(); // Start a transaction

        // Find the source bank account
        const sourceBank = await Bank.findOne({ _id: value.sourceBankId }).session(session);
        if (!sourceBank) throw new CustomError('Source bank not found', 400);

        if(sourceBank.amount < value.amount) throw new CustomError("You don't have enough money in this account")

        // Deduct amount from source bank
        const updatedSourceBank = await Bank.findOneAndUpdate(
            { _id: value.sourceBankId },
            { $inc: { amount: -1 * value.amount } },
            { new: true, session }
        );
        if (!updatedSourceBank) throw new CustomError('Something went wrong with the source bank', 500);

        // Add amount to the destination bank
        const updatedDestinationBank = await Bank.findOneAndUpdate(
            { _id: value.destinationBankId },
            { $inc: { amount: value.amount } },
            { new: true, session }
        );
        if (!updatedDestinationBank) throw new CustomError('Something went wrong with the destination bank', 500);

        // Create transaction records
const sourceTransaction = await Transaction.create([
    {
        user: req.user.userId,
        bank: value.sourceBankId,
        amount: -1 * value.amount,
        reason: value.reason,
        deposit: false,
        loan: false,
        friend: null
    },
    {
        user: req.user.userId,
        bank: value.destinationBankId,
        amount: value.amount,
        reason: value.reason,
        deposit: true,
        loan: false,
        friend: null
    }
], { session });

        await session.commitTransaction(); // Commit the transaction

        return res.status(201).json({ success: true, message: 'Transfer successful' });
    } catch (error) {
        console.log(error);
        rollbackError = error; // Store the error for rollback
        next(error);
    } finally {
        if (rollbackError) {
            // Rollback changes if an error occurred
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.log('Error occurred during rollback:', abortError);
            }
        }
        if (session) session.endSession(); // End the session if it was successfully created
    }
};




module.exports = {
    moneyIn,
    moneyOut,
    transferToOwnBank,
}
