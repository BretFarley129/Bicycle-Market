var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = {

  //Login
  login: function(req,res){
    console.log('In the db');
    //Search to see if email is in DB
    User.findOne({email: req.body.email}, function(err, theUser){ 
      if(err) {
        console.log('something went wrong');
        console.log(theUser.errors);
      }
      else { //Query goes through
        console.log("step 2");
        console.log(theUser);
        if( theUser ){   //Returns User object
          console.log(theUser.password);
          console.log(theUser.email);
          //--------------------REFORMAT---------------------
          if( !theUser ){       //pretty sure this block doesn't work
            console.log('query does not match any records')
          }
          else{
            //Just for troubleshooting
            console.log(req.body.password);
            console.log('original');
            console.log(theUser['password']);
            //Password matches
            if(req.body.password == theUser['password']){
              console.log("it's a match");
              console.log( theUser);
              res.json( theUser);
            }
            //Password match fails
            else{
              console.log('Incorrect password')
              res.json({message: 'Incorrect password '})
            }
          }
          //-------------------------------------------------
        }
        // No user found by given email
        else{
          console.log('the inputted email is not in the db')
          res.json({message: 'The inputted email is not in the db'})
        }
        console.log('done');       
      }
    })
  },

  //Registration
  create: function(req,res){
    console.log('adding new user to db');
    console.log(req.body);

    //Check if the email is already registered
    User.findOne({email: req.body.email}, function(err, exists){
      if(err) {
        console.log('sometihng went wrong');
        console.log(exists.errors);
      }
      else{
        if(!exists){  //Email is available
          //Stage new user for creation
          var user = new User({
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            password: req.body.password
          });
          user.save(function(err) {
            // Failure
            if(err) {
              console.log('something went wrong');
              let errors = [];
              for (var key in err.errors){
                errors.push(err.errors[key].message)
              }
              res.json({message: "Error", error:errors})
            } 
            // Success
            else {
              console.log('successfully added a User!');
              res.json({user:user});
            }
          })
        }
        // END CREATE BLOCK
        else{
          console.log('email already in DB')
          res.json({message: 'email address already registered'})
        }
      }
    });
  },

  //Retrieves all the bikes one user has entered
  getListings: function(req, res, userId){
    User.findOne({_id: userId}).populate('bikes').exec(function(err, user){
      let userBikes = user.bikes;
      res.json({listings: userBikes});
    })
  }
}