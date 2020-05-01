var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    trip: [{type: mongoose.Schema.Types.ObjectId, ref: 'journey'}],
    first_name: String,
    last_name: String,
    email: String,
    password: String, 
  });
  
  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;