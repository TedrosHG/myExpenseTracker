const mongoose = require('mongoose')

const FriendSchema = new mongoose.Schema({
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
    loan: { 
        type: Number, 
        default:0,
        require: true},

},
{ timestamps: true}
)

module.exports = mongoose.model('Friend',FriendSchema)