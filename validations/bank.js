const joi = require('joi')


const createBankValidaion = joi.object({
    name: joi.string().required(),
    amount: joi.number().min(1).required()
})


const deleteBankValidaion = joi.object({
    _id: joi.string().hex().length(24).required(),
})


module.exports = {
    createBankValidaion,
    deleteBankValidaion
}