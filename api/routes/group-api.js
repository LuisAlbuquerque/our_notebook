var express = require('express');
var fs = require('fs');
var router  = express.Router();
var Groups  = require('../controllers/group');
var Group = require('../models/groups');

const multer = require('multer');
const multerConfig = require('./config/multer');

const add_element = (res,path,type,content) => {
    Groups.page(path)
        .then(dados =>{ 
            page = (dados[0].page);
            switch(type){
                case 'p' : page.push({p:content});
                   break;
                case 'pdf' : page.push({pdf:content});
                   break;
                case 'img' : page.push({img:content});
                   break;
                case 'h1' : page.push({h1:content});
                   break;
                case 'h2' : page.push({h2:content});
                   break;
                case 'h3' : page.push({h3:content});
                   break;
                case 'a' : page.push({a:content});
                   break;
                default: page.push({file:content});
            }
            Group.findByIdAndUpdate(
                dados[0]._id,
                {page : page},
                {new : true},
                (err,d) => {
                    if(!err){
                        console.log(d)
                        //page = page.map(remove_id)
                        //console.log(page);
                    }else{
                        console.log({ok : -2})
                    }
                })
            })
        .catch(err => console.log(err))
}



//var upload = multer(multerConfig)
var upload = multer({dest: 'uploads'})

/*
        Users.favourite(req.query.user)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro));
 */
router.get('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    Groups.group_id(path)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro));
});

router.post('/*', upload.single('file'), (req, res) => {
    console.log("add new group")
    let path = req.params['0'].replace(/\/+$/, '');
    console.log(path)
    let email = req.body["mail"];
    //let group_name = req.body["group_name"];
    let name = req.body["name"];
    console.log(req.body)
    if(req.file != undefined){
        console.log("path: " + path)
        movefile(req,res,path);
        res.redirect('http://localhost:5877/root/' + path);
        console.log(req.file);
    }else{
        Groups.add_group(res,path,name,email);
    }
});

var movefile = (req,res,path) => {
    let oldpath = __dirname + '/../' + req.file.path;
    let newfolder = __dirname + '/../public/uploads/'+ path +'/';
    let nameFile = req.file.originalname;
    let nameFile_list = (nameFile.split("."))
    nameFile = (nameFile_list[nameFile_list.length -1] == "html")?nameFile_list.slice(0,nameFile_list.length -1).join("."): nameFile
    let newpath = newfolder + nameFile;
    console.log(oldpath);
    console.log(newpath);
    console.log(path);
    fs.mkdirSync(newfolder, { recursive: true });
    fs.rename(oldpath, newpath, (err)=>{
        if(err) res.jsonp(err)
        //res.jsonp(newpath);
        //
        var servepath = "http://localhost:4877/uploads/" + path + "/" + nameFile;
        console.log("servepath: " + servepath);
        console.log(req.file.mimetype)
        switch(req.file.mimetype){
            case 'application/pdf': add_element(res,path,"pdf", servepath);
                                   break;

            case 'image/gif':      add_element(res,path,"img", servepath);
                                   break;

            case 'image/jpeg':     add_element(res,path,"img", servepath);
                                   break;

            case 'image/png':      add_element(res,path,"img", servepath);
                                   break;

            //case 'audio/wav':      add_element(res,path,{audio : servepath});
            //                       break;

            //case 'audio/wave':      add_element(res,path,{audio : servepath});
            //                       break;

            //case 'video/webm':      add_element(res,path,{video : servepath});
            //                       break;

            //case 'video/ogg':      add_element(res,path,{video : servepath});
            //                       break;

            default:
                add_element(res,path,"file", servepath);

        }
        //add_element(res,path,{img : servepath});
    });
}

router.put('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    let i    = req.body.i;
    let j    = req.body.j;

    let text = req.body.text;
    let type = req.body.type;
    console.log("--body--");
    console.dir(req.body);
    if(text!= undefined && type!= undefined){
        add_element(res,path,type,text);
        res.jsonp({ok:1})
    }else{
        Groups.swap_elements(res,path,i,j);
    }

});

router.delete('/*', (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    let l = req.body.l;
    console.log(l);
    console.log(path);
    Groups.delete_elements(res,path,l);

});

module.exports = router;
