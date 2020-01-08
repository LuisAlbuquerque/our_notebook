var express = require('express');
var axios = require('axios');
var router = express.Router();

const link = "http://localhost:3000"

var api_post = email => res => result => {
    axios.post(link + "/login?user=" + email)
        .then(dados => {
            result(dados);
        })
        .catch(erro => {
            res.render("error", {error : erro});
        })
}

var api_get = path => res => result => {
    axios.get(link + "/root/" + path)
        .then(dados => {
            result(dados);
        })
        .catch(erro => {
            res.render("error", {error : erro});
        })
}

router.get('/*', function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");
    var name;

    api_get (path) (res) 
        (dados => 
            res.render("root", {path: path?"/"+path:"", 
                               group: dados.data})
        );
});

module.exports = router;
