var express = require('express');
var axios = require('axios');
var router = express.Router();
var passport = require('passport')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var fs = require("fs")
const formdata = require('form-data')

const api_link = "http://localhost:4877"
const interface_link = "http://localhost:5877"

var token = jwt.sign(
                    {}, 
                    'passsword', 
                    {
                        expiresIn: 3000, 
                        issuer:'Interface Ournote'
                    });

var api_create_group = path => body => res => result => {
    axios.post(api_link + "/root/" + path + '?token=' + token, body)
        .then(result)
        .catch(erro => {
            res.render("error", {error : erro});
        })
}

var api_get = path => res => result => {
    axios.get(api_link + "/root/" + path + '?token=' + token)
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

    if(req.query.update == "comment"){
        console.log("entrou comment")
        var id = req.query.id;
        if(id != undefined){
            console.log(api_link + "/root/" + path + "?update=comment" + "&id=" + id + "&token=" + token);
            axios.post(api_link + "/root/" + path + "?update=comment"
                                              + "&id=" + id 
                                              + "&token=" + token , req.body)
                .then(dados => {
                        
                        res.jsonp(dados);
                    })
                .catch(err => res.render('error', {error: err}))
       }else{
            res.render('error', {error: "id undefined"})
       }

    }else if(req.query.update == "add"){

        axios.post(api_link + "/root/" + path + "?update=add"
                                              + "&token=" + token
            , req.body
            )
            .then(dados => {
                    res.redirect('/root/' + path);
                })
            .catch(err => res.render('error', {error: err}))

    }else if(req.query.update == "remove"){

        axios.post(api_link + "/root/" + path + "?update=remove"
                                              + "&token=" + token
            , req.body
            )
            .then(dados => {
                    res.redirect('/root/' + path);
                })
            .catch(err => res.render('error', {error: err}))
        
    }else if(req.body.name!=undefined){
        var body = {
            name : req.body.name,
            email: req.user.email,
            read_perm : req.body.read_perm,
            write_perm : req.body.write_perm
        }
        api_create_group (path) (body) (res)
            (dados => {
                res.redirect(interface_link + "/root/" + path);
            });
    } else {
        if(req.query.type == 'file'){

            var name = "../GotIt.png"
            let form_data = new formdata()      
            form_data.append('name', name)
            const file = fs.createReadStream(name)
            form_data.append('content', file, name)

            axios.post(api_link + "/root/" + path + "?type=file&token="
                                                  + token, form_data, {
                       headers: {
                                  "Content-Type": "multipart/form-data"
                                  }, responseType: "json"
            })
                .then(dados => {
                    res.redirect('/' + path);
                })
                .catch(err => res.render('error', {error: err}))
            //console.dir(req);
        } else {
            console.log("type: "+ req.query.type)
            console.log("--body--")
            console.log(req.body)
            axios.put(api_link + '/root/' + path + "?type=" + req.query.type 
                                                 + "&token=" + token, req.body)

                .then(dados => {
                    res.redirect(interface_link + '/root/' + path )
                })
                .catch(err => res.render('error', {error: err}));
        }
    }
});

router.put('/*', verifyAuthentication_write, function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");
    console.dir(req.body)

    axios.put(api_link + '/root/' + path + '?token=' + token, req.body)
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

    axios.delete(api_link + '/root/' + path + '?token=' + token, {data: req.body})
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
    axios.get(api_link + '/root/' + path + '?token=' + token)
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
    axios.get(api_link + '/root/' + path + '?token=' + token)
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
