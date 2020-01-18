var express = require('express');
var axios = require('axios');
var router = express.Router();

const api_link = "http://localhost:4877"
const interface_link = "http://localhost:5877"

//TODO nao devia ser um get?
//var api_post = email => body => res => result => {
//    axios.post(api_link + "/login?user=" + email, body)
//        .then(result)
//        .catch(erro => {
//            res.render("error", {error : erro});
//        })
//}

var api_create_group = path => body => res => result => {
    axios.post(api_link + "/root/" + path, body)
        .then(result)
        .catch(erro => {
            res.render("error", {error : erro});
        })
}

var api_get = path => res => result => {
    axios.get(api_link + "/root/" + path)
        .then(result)
        .catch(erro => {
            res.render("error", {error : erro});
        })
}

router.get('/*', function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");

    api_get (path) (res) 
        (dados => {
            console.log("group: " + dados.data);
            res.render("root", {path: path?"/"+path:"", 
                               group: dados.data});
        });
});

router.post('/*', function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");

    if(req.body.name!=undefined){
        api_create_group (path) (req.body) (res)
            (dados => {
                res.redirect(interface_link + "/root/" + path);
            });
    } else {
        axios.put(api_link + '/root/' + path, req.body)
            .then(dados => {
                res.redirect(interface_link + '/root/' + path)
            })
            .catch(err => res.render('error', {error: err}));
    }
});

router.put('/*', function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");
    console.dir(req.body)

    axios.put(api_link + '/root/' + path, req.body)
        .then(dados => {
            //res.redirect(interface_link + '/root/' + path)
            res.jsonp({ok: 1});
        })
        .catch(err => res.render('error', {error: err}));
});

router.delete('/*', function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");
    console.dir(req.body);

    axios.delete(api_link + '/root/' + path, {data: req.body})
        .then(dados => {
            //res.redirect(interface_link + '/root/' + path)
            res.jsonp({ok: 1});
        })
        .catch(err => res.render('error', {error: err}));
});

module.exports = router;
