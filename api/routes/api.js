var express = require('express');
var router  = express.Router();
var Users   = require('../controllers/user');
var Groups  = require('../controllers/group');

//TODO : Login
router.post('/login', (req, res) => {
    Users.user_id(req.query.user)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro))
});

/*
        Users.favourite(req.query.user)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro));
 */
router.get('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    Groups.group_id("/" + path)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;
