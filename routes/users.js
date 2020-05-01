var express = require('express');
var router = express.Router();
var userModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('/login');
});

router.post('/sign-up', async function(req, res, next) {
  //On recherche l'user dans la bdd
  var searchUser = await userModel.findOne({
    email: req.body.email
  })

  //Si l'user n'est pas présent :
  if (!searchUser) {
    //Requête permettant de créer un nouvel user dans la bdd
    var newUser = new userModel({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
  });

    var newUserSave = await newUser.save();
  ////Si l'user existe, on enregistre en session les infos relatives à l'user et on redirige sur la page /homepage, sinon on reste sur la page login
    req.session.user = {
      first_name: newUserSave.first_name, 
      last_name: newUserSave.last_name,
      id: newUserSave._id
  };  
    res.redirect('/homepage'); //On redirige vers la page /weather
} else {
  res.render('login'); //Si l'user est déjà présent dans la bdd, on reste sur la page login
};
});

router.post('/sign-in', async function(req, res, next) {

  var searchUser = await userModel.findOne(
    {email: req.body.email},
    {password: req.body.password} 
  )

if (searchUser != null) {
  req.session.user = {
    first_name: searchUser.first_name, 
    last_name: searchUser.last_name,
    id: searchUser._id
  };
  res.redirect('/homepage');
} else {
  res.render('login');
}
});

 //Route logout
 router.get('/logout', function(req, res, next) {
  //Permet de déco l'user. L'user est co uniquement car ses infos sont mises en session. Null permet d'annuler ça et de se déco
  req.session.user = null;
res.redirect('/login');
})

module.exports = router;
