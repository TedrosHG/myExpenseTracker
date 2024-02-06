const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String},
    email: { type: String, require: true, unique:true ,lowercase: true},
    password: {type:String, require:true},
    phone: { type: String},
    status: { type: Boolean, default: true}

},
{ timestamps: true}
)

module.exports = mongoose.model('User',UserSchema)