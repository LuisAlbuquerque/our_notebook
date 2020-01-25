var express = require('express');
var axios = require('axios');
var router = express.Router();
var passport = require('passport')
var bcrypt = require('bcryptjs')

const api_link = "http://localhost:4877"
const interface_link = "http://localhost:5877"

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

router.get('/*', verifyAuthentication_read, function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");

    api_get (path) (res) 
        (dados => {
            console.log("group: " + dados.data);
            res.render("root", {path: path?"/"+path:"", 
                               group: dados.data});
        });
});

router.post('/*', verifyAuthentication_write, function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");

         
    if(req.body.name!=undefined){
        api_create_group (path) (req.body) (res)
            (dados => {
                res.redirect(interface_link + "/root/" + path);
            });
    } else {
        console.log("type: "+ req.query.type)
        console.log("--body--")
        console.log(req.body)
        axios.put(api_link + '/root/' + path + "?type=" + req.query.type, req.body)
            .then(dados => {
                res.redirect(interface_link + '/root/' + path )
            })
            .catch(err => res.render('error', {error: err}));
    }
});

router.put('/*', verifyAuthentication_write, function(req, res, next) {
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

router.delete('/*', verifyAuthentication_write, function(req, res, next) {
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

function verifyAuthentication_read (req,res,next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
    let path = req.params['0'].replace(/\/+$/, '');
    axios.get(api_link + '/root/' + path)
      .then(dados => {
          if(dados.data.read_perm.includes(req.user.email) || path == ""){
            next();
          }
          else{
            res.redirect(interface_link + '/root');
          }
      })
  } else{
    res.redirect("/");}
}

function verifyAuthentication_write(req,res,next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
    let path = req.params['0'].replace(/\/+$/, '');
    axios.get(api_link + '/root/' + path)
      .then(dados => {
          if(dados.data.write_perm.includes(req.user.email) || req.body.name != undefined){
            next();
          }
          else{
            res.redirect(interface_link + '/root/' + path);
          }
      })
  } else{
    res.redirect("/");}
}

module.exports = router;
