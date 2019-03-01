const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name:               {type: String, require: true},
    email:              {type: String, require: true },
    password:           {type: String, require: true},
    isAdmin:            {type: Boolean, require: false},
    cart:               {type: Array, require: false},
    resetToken:         {type: String, require: false},
    resetTokenExpDate:  {type: Number, require: false},
});

module.exports = mongoose.model(`User`, userSchema);