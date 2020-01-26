var express = require('express');
var router = express.Router();
var axios = require('axios')
var bcrypt = require('bcryptjs')
var passport = require('passport')

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/add_favourite', function(req, res, next) {
  axios.post('http://localhost:4877/favourite?email=' + req.user.email+"&path="+req.query.path)
    .then(dados => 
        res.jsonp({ok : 1})
    )
    .catch(err =>
        res.jsonp({ok : -1})
    )

});

router.get('/profile', function(req, res, next) {
  axios.get('http://localhost:4877/profile?email=' + req.user.email)
    .then(dados => 
        res.render('user',{books : dados.data.favourite})
    )
    .catch(err =>
      res.render('user',{books : []})
    )

});

router.get('/logout', verificaAutenticacao, function(req, res, next) {
  req.logout()
  res.redirect('/')
});

router.post('/register', function(req,res){
    var hash = bcrypt.hashSync(req.body.password, 10);
    console.log("hash");
    console.log(hash);
    axios.post('http://localhost:4877/register', {
        email: req.body.email,
        name: req.body.name,
        password: hash
    })
        .then(dados => res.redirect('/'))
        .catch(e => res.render('error', {error: e}))
})

router.post('/login', passport.authenticate('local', 
  { successRedirect: '/root',
    successFlash: 'Utilizador autenticado com sucesso!',
    failureRedirect: '/',
    failureFlash: 'Utilizador ou password inválido(s)...'
  })
)

function verificaAutenticacao(req,res,next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
    next();
  } else{
    res.redirect("/login");}
}

module.exports = router;
