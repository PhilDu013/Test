const mongoose = require('mongoose');

// useNewUrlParser ;)
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };
  
// --------------------- BDD -----------------------------------------------------
mongoose.connect('mongodb+srv://admin:8gqYDwNLwHrDNTd1@cluster0-vod0k.mongodb.net/Ticketac?retryWrites=true',
     options,
     function(err) {
      if (err) {
        console.log(`error, failed to connect to the database because --> ${err}`);
      } else {
        console.info('*** Database Ticketac connection : Success ***');
      }
     }
  );

module.exports = mongoose;
