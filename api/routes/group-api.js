var express = require('express');
var fs = require('fs');
var router  = express.Router();
var Groups  = require('../controllers/group');
const multer = require('multer');
const multerConfig = require('./config/multer');

//var upload = multer(multerConfig)
var upload = multer({dest: 'uploads'})

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
    console.log(path)
    let email = req.body["mail"];
    //let group_name = req.body["group_name"];
    let name = req.body["name"];
    console.log(req.body)
    Groups.add_group(res,path+"/"+name,name,email);
});

var movefile = (req,res,path) => {
    let oldpath = __dirname + '/../' + req.file.path;
    let newfolder = __dirname + '/../public/uploads/'+ path +'/';
    let newpath = newfolder + req.file.originalname;
    console.log(oldpath);
    console.log(newpath);
    console.log(path);
    fs.mkdirSync(newfolder, { recursive: true });
    fs.rename(oldpath, newpath, (err)=>{
        if(err) res.jsonp(err)
        res.jsonp(newpath);
    });
}

router.put('/*', upload.single('file'), (req, res) => {

    let path = req.params['0'].replace(/\/+$/, '');
    let i    = req.body.i;
    let j    = req.body.j;

    let text = req.body.text;
    if(text!= undefined){
        Groups.add_element(res,path,text);
    }else{
        if(req.file != undefined){

            movefile(req,res,path);
            console.log(req.file);
            //res.jsonp('enviado')
            //Groups.add_element(res,path,{});
        }else{
            Groups.swap_elements(res,path,i,j);
        }
    }

});

router.delete('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    let l = req.body.i;
    Groups.swap_elements(res,path,l);

});

module.exports = router;
