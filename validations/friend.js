const joi = require('joi')


const createFriendValidaion = joi.object({
    name: joi.string().required()
})


const deleteBankValidaion = joi.object({
    _id: joi.string().hex().length(24).required(),
})


module.exports = {
    createFriendValidaion
}