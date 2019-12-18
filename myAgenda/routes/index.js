var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
    axios.get('http://localhost:3000')
    .then(dados => res.render('index', {lista: dados.data}))
    .catch(e => res.render('error', {error: e}));
});

router.get('/eventos/:id', verificaAutenticacao, (req, res) => {
    axios.get('http://localhost:3000/eventos/' + req.params.id)
    .then(dados => res.render('evento', {evento: dados.data}))
    .catch(e => res.render('error', {error: e}));
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        successFlash: 'Utilizador autenticado com sucesso!',
        failureRedirect: '/login',
        failureFlash: 'Utilizador ou password inválido...'
    }));

function verificaAutenticacao(req,res,next){
    if(req.isAuthenticated()){
        //res.send('Atingiste a area protegida: ' + JSON.stringify(req.user));
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;
