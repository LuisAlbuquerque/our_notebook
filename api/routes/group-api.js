var express = require('express');
var router  = express.Router();
var Groups  = require('../controllers/group');

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

router.post('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    Groups.group_id("/" + path)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro));
});

router.put('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    Groups.group_id("/" + path)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro));
});

router.delete('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    Groups.group_id("/" + path)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;
