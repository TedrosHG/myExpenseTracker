const router = require('express').Router()
const {createBank, getAllBank ,deleteBank} = require('../controllers/bank')

router.post('/create', createBank)
router.get('/getAll', getAllBank)
router.delete('/delete', deleteBank)

module.exports = router