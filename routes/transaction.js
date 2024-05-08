const router = require('express').Router()
const {moneyIn, moneyOut, transferToOwnBank} = require('../controllers/transaction')


router.post('/moneyIn', moneyIn)
router.post('/moneyOut', moneyOut)
router.post('/transfer', transferToOwnBank)  


module.exports = router