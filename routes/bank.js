const router = require('express').Router()
const {createBank, getAllBank ,deleteBank, updateBank} = require('../controllers/bank')

router.post('/create', createBank)
router.get('/getAll', getAllBank)
router.patch('/update', updateBank)
router.delete('/delete', deleteBank)

module.exports = router