var express = require('express');
var router = express.Router();
var axios = require('axios')
var bcrypt = require('bcryptjs')
var passport = require('passport')
var jwt = require('jsonwebtoken')

var token = jwt.sign(
                    {}, 
                    'passsword', 
                    {
                        expiresIn: 3000, 
                        issuer:'Interface Ournote'
                    });

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/add_favourite', verificaAutenticacao, function(req, res, next) {
  axios.post('http://localhost:4877/favourite?email=' + req.user.email+"&path="+req.query.path +"&token=" + token)
    .then(dados => 
        res.jsonp({ok : 1})
    )
    .catch(err =>
        res.jsonp({ok : -1})
    )

});

router.get('/profile', verificaAutenticacao, function(req, res, next) {
    tag = req.query.tag;
    tag = tag!=undefined? tag: ""
  axios.get('http://localhost:4877/profile?email=' + req.user.email +
                                            '&token='+ token)
    .then(favs => {
        axios.get('http://localhost:4877/profile?email=' + req.user.email 
                                                         +'&tag='+ tag +
                                                          '&token='+ token)
          .then(tags => {
              if(tag==""){
                res.render('user',{books : favs.data.favourite, 
                                tags : []})
              }else{
                res.render('user',{books : favs.data.favourite, 
                                tags : tags.data})
              }
          })
          .catch(err =>
            res.render('user',{books : favs.data.favourite, tags: []})
          )
    })
    .catch(err =>
      res.render('user',{books : [], tags:[]})
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
  { successRedirect: '/profile',
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
