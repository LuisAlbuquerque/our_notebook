var express = require('express');
var router  = express.Router();
var Users   = require('../controllers/users');
var Groups  = require('../controllers/groups');

//TODO : Login
router.post('/login', (req, res) => {
    Users.user_id(req.query.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
});

router.get('/', (req, res) => {
    Users.favourite(req.query.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:url_page', (req, res) => {
    let path = (req.params.url_page).split("/");
    Users.favourite(req.query.user)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
});



module.exports = router;
