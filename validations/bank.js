const joi = require('joi')


const createBankValidaion = joi.object({
    name: joi.string().required(),
    amount: joi.number().min(1).required()
})

const updateBankValidaion = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().required()
})

const deleteBankValidaion = joi.object({
    id: joi.string().hex().length(24).required(),
})


module.exports = {
    createBankValidaion,
    updateBankValidaion,
    deleteBankValidaion
}