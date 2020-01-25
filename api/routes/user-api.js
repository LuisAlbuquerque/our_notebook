var express = require('express');
var router  = express.Router();
var Users   = require('../controllers/user');
var passport = require('passport');

//TODO : Login
router.post('/login', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.user_id(req.query.user)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro))
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.favourite_id(req.query.email)
        .then(dados => jsonp(dados))
        .catch(err => jsonp(err))
});

router.post('/favourite', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.favourite_add(req.query.email,req.body.group)  
        .then(dados => jsonp(dados))
        .catch(err => jsonp(err))
});

router.get('/user/:email', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log("entrou!")
    console.log(req.params.email)
    Users.user_id(req.params.email)
            .then(dados => {res.jsonp(dados[0]); console.log(dados)})
            .catch(erro => res.status(500).jsonp(erro))
});

router.post('/register', function(req,res){
    console.log("fora register");
    console.dir(req.body);
    if(req.body.name != undefined && req.body.email != undefined && req.body.password != undefined){
        console.log("register");
        console.dir(req.body);

        Users.user_insert(req.body)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.jsonp({error: "insira todos os campos"})
    }
})

module.exports = router;
