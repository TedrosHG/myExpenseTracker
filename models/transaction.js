const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    bank: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bank',
        required: true,
    },
    amount: { type: Number, require: true},
    deposit: { type: Boolean, default:true ,require: true},
    reason: { type: String},
},
{ timestamps: true}
)

module.exports = mongoose.model('Transaction',TransactionSchema)