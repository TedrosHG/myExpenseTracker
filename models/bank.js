const mongoose = require('mongoose')

const BankSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    name: { 
        type: String,
        require:true,
        lowercase: true
    },
    amount: { type: Number, require: true},
},
{ timestamps: true}
)

module.exports = mongoose.model('Bank',BankSchema)