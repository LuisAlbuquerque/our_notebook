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


module.exports = router;
