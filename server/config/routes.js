var mongoose = require('mongoose');
var bikes = require('../controllers/bike.js');
var users = require('../controllers/user.js');
var User = mongoose.model('User')
var path = require('path');

module.exports = function(app){
    //For Bikes
    console.log('in routes');
    app.get('/bikes', (req, res, next) =>{
        console.log('fetching bikes');
        bikes.show(req, res);
    });
    
    app.post('/newBike/:id', (req, res, next) =>{
        console.log('adding bike');
        User.findOne({_id: req.params.id}, function(err, seller){
            console.log("Here is the seller:")
            console.log(seller);
            bikes.create(req, res, seller);
        })
    })

    app.get('/random', (req, res, next)=>{
        console.log('fetching random bike');
        bikes.random(req, res);
    })

    app.delete('/delete/:bike_id/:user_id', (req, res, next)=>{
        console.log(`deleteing bike with id ${req.params.bike_id}`);
        bikes.delete(req, res, req.params.bike_id, req.params.user_id);
    })

    app.patch('/bikes/:bike_id', (req,res,next)=>{
        console.log(`deleteing bike with id ${req.params.bike_id}`)
        bikes.update(req, res, req.params.bike_id)
    })

    //For Users
    app.post('/newUser', (req, res, next) =>{
        console.log('adding user');
        users.create(req, res);
    })
    app.get('/listings/:id', (req,res, next)=>{
        console.log(`fetching listings for user ${req.params.id}`);
        users.getListings(req, res, req.params.id);
    })
    app.post('/login', (req, res, next)=>{
        console.log('attempting login');
        users.login(req, res);
    })

    //Catch-all route
    app.all("*", (req,res,next) => {
        res.sendFile(path.resolve("./client/dist/index.html"))
    });
} 