var Group = require('../models/groups');

var last = (a) => a[a.length -1];

const Groups = module.exports;

Groups.list_groups = () => {
    return Group
        .find({})
        .exec();
}

Groups.names = () => {
    return Group
        .find({},{name : 1})
        .exec();
}

Groups.add_group = (res,dad,name,mail,read_perm,write_perm) => {
    var path = (dad=="")?name:(dad + "/" + name);
    path = "/" + path;

    var group = {
        path : path,
        id_creator : mail,
        name : name,
        sub_groups : [ ],
        read_perm  : read_perm.split(";").concat( mail ),
        write_perm : write_perm.split(";").concat( mail ),
        page       : [ {"h1" : name} ]
    }
    console.log(group)
    var object_group = new Group(group);
    object_group.save(err =>{
        if(!err){
            Group.updateOne(
                {path : "/" + dad}, 
                {$push: {sub_groups: name}}).exec();
            res.jsonp({ok : 1});
        }
        else{
            res.jsonp({ok : -1});
        }
    });
        
}

Groups.tags = (tag,email) => {
    return Group.aggregate([
        {$unwind    : "$read_perm"},
        {$match     : {"read_perm": email}},
        {$unwind    : "$page"},
        {$unwind    : "$page.tags"},
        {$match     : {"page.tags": tag}},
        {$group     : {"_id" : "$path" ,"path": {$first : "$path"}, "page":{$first : "$page"}}}
    ])
    .exec()
}

Groups.group_id = path => {
    path = "/" + path
    console.log("group_path : " + path)
    return Group
        .find({path : path})
        .exec();
}

var remove_id = (object) => {
    let simplehtml = ["h1","comment","list","h2","h3","p","img","pdf","file","a"]
    res = {}
    type = ""
    simplehtml.forEach((e)=>{
        if(object[e]!= undefined){
            res[e] = object[e]
        }
    }

    ) 

    return res

    //var obj = {};
    //var keys = Object.keys(object);
    //var values = Object.values(object);
    //for(let i = 0; i< keys.length ; i++){
    //    if(simplehtml.find((e)=> e==keys[i]))
    //        obj[keys[i]] = values[i]
    //}
    //console.log(obj)
    //return obj

}


Groups.add_element = (res,path,type,content) => {
    console.log('old add_element')
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
                        page = page.map(remove_id)
                        res.jsonp(page);
                    }else{
                        res.jsonp({ok : -2})
                    }
                })
            })
        .catch(err => res.jsonp({ok : -1}))
}




Groups.swap_elements = (res,path,i,j) => {
    Groups.page(path)
        .then(dados =>{ 
            var page = (dados[0].page);
            var aux = page[i];
            page[i] = page[j];
            page[j] = aux;
            Group.findByIdAndUpdate(
                dados[0]._id,
                {page : page},
                {new : true},
                (err,d) => {
                    if(!err){
                        console.log(d.page.map(remove_id))
                        page = page.map(remove_id)
                        //res = d.page.map(remove_id)
                        res.jsonp(page);
                    }else{
                        res.jsonp({ok : -2})
                    }
                })
            })
        .catch(err => res.jsonp({ok : -1}))
}

var remove_list = (arr,l) =>{
    res = []
    for(let x=0; x<arr.length ; x++){
        if(l.indexOf(x) == -1){
            res.push(arr[x]);
        }
    }
    return res;


}

Groups.add_comment = (res,path,id,comment) => {
    console.log("add comment")
    console.log(path)
    console.log(id)
    console.log(comment)
    Groups.group_id(path) 
        .then(dados =>{ 
            //console.log(dados[0])
            console.log(dados[0].page)

            console.log(dados[0].page[0].h1)
            //page = dados[0].page
            ret = []
            //console.dir(page)
            for( i in dados[0].page){
                card = (dados[0].page[i])
                console.log("---card---")
                console.log(card)

                if(card._id == undefined || card._id != id){
                    ret.push(card)
                }else{
                    if(card.comment == undefined){
                        card.comment = [];
                    }
                    console.log("aqui")
                    console.log(card)
                    card.comment.push(comment);
                    console.log(card)
                    ret.push(card)
                }
            }
            console.log("--ret--")
            console.log(ret)


            //dados[0].page.forEach(card => {
            //    console.dir(card)
            //    //if(card._id == undefined || card._id != id){
            //    //    res.psuh(card)
            //    //}else{
            //    //    var newcard = card;
            //    //    if(newcard.comment == undefined){
            //    //        newcard.comment = [];
            //    //    }
            //    //    newcard[comment].push(comment);
            //    //    res.push(newcard)
            //    //}
            //})
            //console.dir(res)

        Group.findByIdAndUpdate(
            dados[0]._id,
            {
              page : dados[0].page,
            },
            {new : true},
            (err,d) => {
                if(!err){
                    res.jsonp(d);
                }else{
                    res.status(500).jsonp({erro : "nao conseguiu adicionar o comentario"})
                }
            })
        })
        .catch(err => res.jsonp({erro : err}))
};

Groups.add_perm = (res,path,read_perm,write_perm) => {

    Groups.group_id(path) 
        .then(dados =>{ 
            read_perm =  read_perm.split(";") 
            res_read = dados[0].read_perm.concat( read_perm )

            write_perm =  write_perm.split(";") 
            res_write = dados[0].write_perm.concat( write_perm )
        Group.findByIdAndUpdate(
            dados[0]._id,
            {
              read_perm: res_read,
              write_perm: res_write
            },
            {new : true},
            (err,d) => {
                if(!err){
                    res.jsonp(d);
                }else{
                    res.jsonp({erro : "nao conseguiu fazer update"})
                }
            })
        })
        .catch(err => res.jsonp({erro : err}))
};

Groups.remove_perm = (res,path,read_perm,write_perm) => {

    Groups.group_id(path) 
        .then(dados =>{ 

            read_perm =  read_perm.split(";") 
            res_read = dados[0].read_perm.filter(
                            (e)=> !read_perm.includes(e) );


            write_perm =  write_perm.split(";") 
            res_write = dados[0].write_perm.filter(
                            (e)=> !write_perm.includes(e) );

            console.log(res_read)
            console.log(res_write)

        Group.findByIdAndUpdate(
            dados[0]._id,
            {
              read_perm: res_read,
              write_perm: res_write
            },
            {new : true},
            (err,d) => {
                if(!err){
                    res.jsonp(d);
                }else{
                    res.jsonp({erro : "nao conseguiu fazer update"})
                }
            })
        })
        .catch(err => res.jsonp({erro : "nao encontrou pagina"}))
};

Groups.delete_elements = (res,path,l) => {
    Groups.page(path)
        .then(dados =>{ 
        page = (dados[0].page);
        page = remove_list(page,l);
        Group.findByIdAndUpdate(
            dados[0]._id,
            {page : page},
            {new : true},
            (err,d) => {
                if(!err){
                    page = page.map(remove_id)
                    res.jsonp(page);
                }else{
                    res.jsonp({erro : "nao conseguiu fazer update"})
                }
            })
        })
        .catch(err => res.jsonp({erro : "nao encontrou pagina"}))
}

Groups.page = path => {
    path = '/' + path;
    return Group
        .find({path : path},{page : 1})
        .exec();
}

Groups.read_perm = path => {
    path = '/' + path;
    return Group
        .find({path : path},{read_perm : 1})
        .exec();
}

Groups.write_perm = path => {
    path = '/' + path;
    return Group
        .find({path : path},{write_perm : 1})
        .exec();
}

Groups.sub_groups = path => {
    path = '/' + path;
    return Group
        .find({path : path},{sub_groups : 1})
        .exec();
}



var sub_tree_list = groups => ((groups.length >0)
                                            ?groups.map(sub_tree)
                                            :[]
                                        );

var sub_tree = path => { path : sub_tree_list(Groups.sub_groups(path))}

Groups.tree = path => sub_tree_list (path);

/*
    
    [1,3,4] -> [
                {1,[
                    {5,[
                        {10,[
                            {11,[]}
                            ]
                        }
                        ]},
                    {6,[]}
                    ]
                },
                {3,[]}, 
                {4,[]}, 
                ]


    sub_tree_list([1,3,4]) = [sub_tree(1),sub_tree(3),sub_tree(4)]
    sub_tree(1) = sub_tree_list(sub_groups(1))
 */





