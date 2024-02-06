const joi = require('joi')

// const regUser = {
//     body: joi.object().keys({
//         email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
//         password: joi.string().required(),
//     })
// }

const registerUser = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    firstName: joi.string(),
    lastName: joi.string(),
    phone: joi.string().regex(/^\+251[79]\d{8}$/)
})
const loginUser = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

module.exports = {
    registerUser,
    loginUser
}