var mongoose = require('mongoose');
var Bike = mongoose.model('Bike');
var User = mongoose.model('User');


var dailyBike; // Stores the Bike of the day
var responder = true; //checks to see if setDaily function needs to respond
module.exports = {
  
  // Not "RESTFUL" show, more like "ALL" function
  show: function(req, res){
    Bike.find({}).populate('_user').exec(function(err, bikes){
      if(err) {
      console.log('something went wrong');
      console.log(bikes.errors);
      }
      else {
        console.log("show works")
        res.json( bikes);
        
      }
    })
  }, 

  //Random function. vestigial name, just returns the bike of the day
  random: function(req, res){
    console.log("in 'random' method")
    // Initiate setDaily function if it hasn't started yet
    if( !dailyBike ){
      module.exports.setDaily(req, res)
    }
    // Otherwise, just return the current value of the bike of the day
    else{
      console.log(dailyBike)
      res.json(dailyBike)
    }
  },

  //Funtion to determine the Bike of the Day
  setDaily:function(req, res){
    //Find count of bikes in DB
    Bike.count().exec(function(err, count){
      if (err){
        console.log('Something went wrong')
      }
      else{
        //Grab singular bike at random
        var offset = Math.floor(Math.random()* count);
        Bike.findOne().skip(offset).exec(function(err, result){
          if (err)
            console.log('Something went wrong')
          else{
            //Set random bike to bike of the day
            console.log('Random works');
            dailyBike = result
            console.log("TADA! The bike of the day:\n" + dailyBike)
            // If initial call, respond to request
            if (responder){
              res.json(dailyBike);
              responder = false;
            }
          }
          setTimeout(function(){
            module.exports.setDaily(req, res);
          },3600000*24) // 1 day in milliseconds
        })
      }
    })
  },

  //Look at the name
  create: function(req,res, seller){
    console.log('adding new bike to db');
    console.log(req.body);
    console.log('Confirming seller:')
    console.log(seller)
    //Staging new bike
    var bike = new Bike({
      title: req.body.title,
      description: req.body.description,
      img_url: req.body.img_url,
      location: req.body.location,
      price: req.body.price
    });
    // Setting association
    bike._user = seller._id;
    seller.bikes.push(bike);
    //First save bike
    bike.save(function(err) {
      if(err) {
        console.log('something went wrong');
        let errors = [];
        for (var key in err.errors){
          errors.push(err.errors[key].message)
        }
        res.json({message: "Error", error:errors})
      } 
      else {
        //Then save user
        seller.save(function(err){
          if(err) {
            console.log('something went wrong');
            let errors = [];
            for (var key in err.errors){
              errors.push(err.errors[key].message)
            }
            res.json({message: "Error", error:errors})
          } 
          else{
            console.log('successfully added a Bike!');
            res.json({success: "Success", bike:bike});
          }
        })
      }
    })
  },

  //Look at the name
  update: function(req, res, bike_id){
    console.log('UPDATING');
    var bike ={
      title: req.body.title,
      description: req.body.description,
      img_url: req.body.img_url,
      location: req.body.location,
      price: req.body.price
    };
    Bike.update({_id: bike_id}, bike, function(err){
      if (err){
        console.log("Something went wrong");
        let errors = [];
        for (var key in err.errors){
          errors.push(err.errors[key].message)
        }
        res.json({message: "Error", error:errors})
      }
      else{
        console.log("SUCCESS");
        res.json({success: "success"})
      }
    })
  },

  //Look at the name
  delete: function(req, res, bike_id, user_id){
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nIN DELETE')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    Bike.remove({_id: bike_id}, function(err){
      if (err){
        console.log("Somthing went wrong deleting bike")
      }
      else{
        User.findOne({_id: user_id}, function(err, user){
          if (err){
            console.log("Something went wrong removing bike from user")
          }
          else{
            for (var i = 0; i < user.bikes.length; i ++){
              if (user.bikes[i] == bike_id){
                user.bikes.splice(i, 1);
                console.log("Success!");
              }
            }
            user.save();
            res.json({message: "Bike removed from database"})
          }
        })
      }
    })
    console.log('END DELETE')
  }

} 