const router = require('express').Router()
const { updateProfile, updatePassword} = require('../controllers/user')

router.put('/profile', updateProfile)
router.put('/changePassword', updatePassword)

module.exports = router