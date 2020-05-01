var mongoose = require('mongoose');

/* var orderSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});  */             //Ou clé étrangère de journey ?

var userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    tickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'journey'}]
  });
  
  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;