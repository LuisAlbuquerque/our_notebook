var express = require('express');
var axios = require('axios');
var router = express.Router();
var passport = require('passport')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var request = require('request');
var fs = require("fs")
const multer = require('multer');

var upload = multer({dest: 'uploads'})
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
            if(req.query.json == "true"){
                res.jsonp(dados.data);
            }else{
                console.log("group: " + dados.data);
                res.render("root", {path: path?"/"+path:"", 
                                   group: dados.data});
            }
        });
});

router.post('/*', verifyAuthentication_write, upload.single('file'), function(req, res, next) {

    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");

    if(req.query.update == "comment"){
       var id = req.query.id ;
       if(id != undefined){

        console.dir(req.body);
        axios.post(api_link + "/root/" + path + "?update=comment"
                                              + "&id=" + id 
                                              + "&token=" + token
            , req.body
            )

            .then(dados => {
                    res.redirect("/root/" + path)
                })
            .catch(err => res.render('error', {error: err}))
            
       }else{
            res.render('error', {error: "id undefined" })
       }

    }else if(req.query.update == "add"){
        verifyAuthentication_creator(req,res,()=>{
            axios.post(api_link + "/root/" + path + "?update=add"
                                                  + "&token=" + token
                , req.body
                )
                .then(dados => {
                        res.redirect('/root/' + path);
                    })
                .catch(err => res.render('error', {error: err}))
        })
    }else if(req.query.update == "remove"){
        verifyAuthentication_creator(req,res,()=>{
            axios.post(api_link + "/root/" + path + "?update=remove"
                                                  + "&token=" + token
                , req.body
                )
                .then(dados => {
                        res.redirect('/root/' + path);
                    })
                .catch(err => res.render('error', {error: err}))
        })
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
        if(req.query.type == 'file' && req.file != undefined){
            console.log(req.file)
            var r = request.post(api_link + "/root/" 
                                          + path + "?type=file&token="
                                          + token, 
                (err) =>{ if(!err){
                    res.redirect('/root/' + path)
                    }else{
                        res.jsonp(err)
                    } 
                }
            ) 

            var form = r.form();
            var old_path =  __dirname + '/../' + req.file.path
            var file_path = __dirname + '/../files/' + req.file.originalname
            console.log(old_path)
            console.log(file_path)
            fs.renameSync(old_path,file_path)

            //fs.createReadStream(file_path).pipe(request.post(api_link + "/root/" + path + "?type=file&token=" + token)) 

            form.append('file',fs.createReadStream(file_path))

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
          if(dados.data.write_perm.includes(req.user.email)){
            next();
          }
          else{
            res.redirect(interface_link + '/root/' + path);
          }
      })
  } else{
    res.redirect("/");}
}

function verifyAuthentication_creator(req,res,next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
    let path = req.params['0'].replace(/\/+$/, '');
    axios.get(api_link + '/root/' + path + '?token=' + token)
      .then(dados => {
          //console.log("dados");
          //console.log(dados);
          if(dados.data.id_creator==req.user.email){
            //console.log("permissões consebidas")
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
