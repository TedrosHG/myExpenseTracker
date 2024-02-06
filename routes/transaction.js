const router = require('express').Router()
const {moneyIn, moneyOut} = require('../controllers/transaction')


router.post('/moneyIn', moneyIn)
router.post('/moneyOut', moneyOut)


module.exports = router