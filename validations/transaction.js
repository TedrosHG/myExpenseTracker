const joi = require('joi')

// validation for both moneyIn and moneyOut
const moneyExchangeValidaion = joi.object({
    bankId: joi.string().hex().length(24),
    amount: joi.number().min(1).required(),
    reason: joi.string().required(),
    loan: joi.boolean(),
    friend: joi.string().hex().length(24),
})

//validation for transferToOwnBank
const transferToOwnBankValidaion = joi.object({
    sourceBankId: joi.string().hex().length(24),
    destinationBankId: joi.string().hex().length(24),
    amount: joi.number().min(1).required(),
    reason: joi.string().required(),
})


module.exports = {
    moneyExchangeValidaion,
    transferToOwnBankValidaion
}