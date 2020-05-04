var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey');
var userModel = require('../models/users');

//Route login
router.get('/', function(req, res, next) {
  res.render('login');
});

//Route homepage
router.get('/homepage', function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/')
  } else { 
  res.render('homepage');
};
});

//Route qui envoie les infos saisies à result
router.post('/search', async function(req, res, next) {
   //Contrôle pour vérifier que l'user est bien co
   if (!req.session.user) {
    res.redirect('/')
  } else {

  var departure = req.body.departure[0].toUpperCase() + req.body.departure.slice(1).toLowerCase();
  var arrival = req.body.arrival[0].toUpperCase() + req.body.arrival.slice(1).toLowerCase();
  var date = req.body.date;

  // Cherche un élem avec departure = nom de ville de l'input
  var journey = await journeyModel.find({
    departure: departure,
    arrival: arrival,
    date: date
  });

    res.render('search-result', {journey});
  };
});

router.get('/basket', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/')
  } else { 

  //Si basket est undefined, on initialise un array vide
  if (req.session.basket == undefined) {
    req.session.basket = [];
  };
  
  //on récupère l'id du trajet choisi et on push dans basket
  var addTicket = await journeyModel.findById(req.query.id);
  req.session.basket.push(addTicket);
    
  res.render('basket', {basket: req.session.basket});
}
});

router.get('/delete', function(req, res, next) {
  //Récupère la position ciblée et supprime
  req.session.basket.splice(req.query.id,1)

  res.render('basket', {basket: req.session.basket});
}); 

//Route confirm qui envoie les data de l'achat de l'user à la page user-page
router.get('/confirm', async function(req, res, next) {
  //On retrouve l'user grâce à son id
  var user = await userModel.findById(req.session.user._id);
  var userTrip = user.trip; //On assigne user trip (clé étrangère) à la var userTrip 
  
  //On boucle sur la longueur du basket enregistré en session et on push le contenu dans userTrip
  for (var i = 0; i < req.session.basket.length; i++){
    userTrip.push(req.session.basket[i]);
  };

  await userModel.updateOne(
    {_id :req.session.user._id}, 
    {trip: userTrip}
  );
  
  res.render('homepage');
}); 

router.get('/user-page', async function(req, res, next) {
  //Si l'user n'est pas log > redirect page login
  if (!req.session.user) {
    res.redirect('/')
  } else {
  //sinon on populate trip (tableau de référence) avec l'id du voyage en question
    var user = await userModel.findById(req.session.user._id)
                              .populate('trip')
                              .exec();

                              /* console.log(user) */

    res.render('user-page', {trip:user.trip});
  };
});

module.exports = router;