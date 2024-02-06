const joi = require('joi')


const profile = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    phone: joi.string().regex(/^\+251[79]\d{8}$/)
})
const changePassword = joi.object({
    currentPassword: joi.string().required(),
    newPassword: joi.string().required()
})

module.exports = {
    profile,
    changePassword
}