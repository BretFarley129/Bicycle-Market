var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    first: {type: String, required: true},
    last: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, minlength: 8},
    bikes:[{type: Schema.Types.ObjectId, ref: 'Bike'}],
}, {timestamps: true})

mongoose.model('User', UserSchema); 
var User = mongoose.model('User');