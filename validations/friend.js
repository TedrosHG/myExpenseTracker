const joi = require('joi')


const createFriendValidaion = joi.object({
    name: joi.string().required()
})

const updateFriendValidaion = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().required()
})

const deleteFriendValidaion = joi.object({
    _id: joi.string().hex().length(24).required(),
})


module.exports = {
    createFriendValidaion,
    updateFriendValidaion,
    deleteFriendValidaion
}