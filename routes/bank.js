const router = require('express').Router()
const {createBank, deleteBank} = require('../controllers/bank')

router.post('/create', createBank)
router.delete('/delete', deleteBank)

module.exports = router