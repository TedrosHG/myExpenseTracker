const joi = require('joi')


const moneyExchangeValidaion = joi.object({
    bankId: joi.string().hex().length(24),
    amount: joi.number().min(1).required(),
    reason: joi.string().required(),
    loan: joi.boolean(),
    friend: joi.string().hex().length(24)
})



module.exports = {
    moneyExchangeValidaion
}