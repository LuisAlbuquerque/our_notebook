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

Groups.add_group = (res,dad,name,mail) => {
    var path = (dad=="")?name:(dad + "/" + name);
    path = "/" + path;
    var group = {
        path : path,
        id_creator : mail,
        name : name,
        sub_groups : [ ],
        read_perm  : [ mail ],
        write_perm : [ mail ],
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

Groups.group_id = path => {
    path = "/" + path
    console.log("group_path : " + path)
    return Group
        .find({path : path})
        .exec();
}

var remove_id = (object) => {
    let simplehtml = ["h1","list","h2","h3","p","img","pdf","file","a"]
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
                    res.jsonp({ok : -2})
                }
            })
        })
        .catch(err => res.jsonp({ok : -1}))
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





