var express = require('express');
var router  = express.Router();
var Users   = require('../controllers/user');

//TODO : Login
router.post('/login', (req, res) => {
    Users.user_id(req.query.user)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
