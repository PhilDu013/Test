var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey');
var userModel = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"] 

/* GET home page. */
router.get('/homepage', function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login')
  } else { 
  res.render('homepage');
};
});

//Route login
router.get('/', function(req, res, next) {
  res.render('login');
});

//Route qui envoie les infos saisies à result
router.post('/search', async function(req, res, next) {
   //Contrôle pour vérifier que l'user est bien co
   if (!req.session.user) {
    res.redirect('/')
  } else { 

  /* console.log(req.body.date);
  console.log(req.body.departure);
  console.log(req.body.arrival)
  console.log(typeof req.body.date);
  console.log(typeof req.body.departure);
  console.log(typeof req.body.arrival) */

  var departure = req.body.departure[0].toUpperCase() + req.body.departure.slice(1).toLowerCase();
  var arrival = req.body.arrival[0].toUpperCase() + req.body.arrival.slice(1).toLowerCase();
  var date = req.body.date;
  /* console.log(departure)
  console.log(arrival) */
  // Cherche un élem avec departure = nom de ville de l'input
  var journey = await journeyModel.find({
    departure: departure,
    arrival: arrival,
    date: date
  });

  /* console.log(journey); */
    res.render('search-result', {journey});
  };
});

router.get('/basket', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login')
  } else { 

  //Si basket est undefined, on initalise un array vide
  if (req.session.basket == undefined) {
    req.session.basket = [];
  };
  
  //on récupère l'id du trajet choisi et on push dans basket
  var addTicket = await journeyModel.findById(req.query.id);
  req.session.basket.push(addTicket);
  /* console.log('BASKET =========== ', req.session.basket)  */
    
  res.render('basket', {basket: req.session.basket});
}
});

router.get('/confirm', async function(req, res, next) {

  var user = await userModel.findById(req.session.user._id);
  var userTrip = user.trip;
  
  console.log('SESSION BASKET =========================', req.session.basket); 
  //boucle sur la longueur de basket - push basket dans userTrip ?
  //update usermodel avec id ?
  for(var i=0; i<req.session.basket.length; i++){
    userTrip.push(req.session.basket[i]);
  };

  /* await userModel.save()
  console.log('USERTRIP ===============================', userTrip) */
  await userModel.updateOne({_id :req.session.user._id}, {trip: userTrip});
  console.log('USERTRIP ===============================', userTrip);
  
  res.render('homepage');
}); 

router.get('/delete', function(req, res, next) {

  req.session.basket.splice(req.query.id,1)

  res.render('basket', {basket: req.session.basket});
}); 

router.get('/user-page', async function(req, res, next) {

  if (req.session.user !== undefined) {
    var user = await userModel.findById(req.session.user._id)
                              .populate('trip')
                              .exec();

                              console.log(user)

    res.render('user-page', {trip:user.trip});
  } else {
    res.redirect('/')
  }
})

 // Remplissage de la base de donnée, une fois suffit
 router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    };

  };
  res.render('index', { title: 'Express' });
}); 


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
 router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
}); 

module.exports = router;