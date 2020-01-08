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
    console.log("add new group")
    let path = req.params['0'].replace(/\/+$/, '');
    let group_name = req.body["group_name"];
    let email = req.body["mail"];
    let name = req.body["name"];
    console.log(req.body)
    Groups.add_group(res,group_name,name,email);
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
