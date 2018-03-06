var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BikeSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 3},
    description: {type: String, required: true, maxlength: 200},
    img_url: {type: String, required: true},
    location: {type: String, required: true},
    price: {type: Number, required: true, min: 1},
    _user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true})

mongoose.model('Bike', BikeSchema); 
var Bike = mongoose.model('Bike');