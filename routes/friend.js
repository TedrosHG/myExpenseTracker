const router = require('express').Router()
const {createFriend, getAllFriend} = require('../controllers/friend')

router.post('/create', createFriend)
router.get('/getAll', getAllFriend)

module.exports = router