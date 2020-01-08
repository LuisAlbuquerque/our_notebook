var Group = require('../models/groups');

var last = (a) => a[a.lenght -1];

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

Groups.add_group = (res,path,name,mail) => {
    var group = {
        path : path,
        id_creator : mail,
        name : name,
        sub_groups : [ ],
        read_perm  : [ mail ],
        write_perm : [ mail ],
        page       : [ {"h1" : name}]
    }
    console.log(group)
    var object_group = new Group(group);
    object_group.save(err =>{
        if(!err){
            res.jsonp({ok : 1});
        }
        else{
            res.jsonp({ok : -1});
        }
    });
        
}

Groups.group_id = id => {
    console.log("group_id : " + id)
    return Group
        .find({path : id})
        .exec();
}

Groups.page = id => {
    return Group
        .find({path : id},{page : 1})
        .exec();
}

Groups.read_perm = id => {
    return Group
        .find({path : id},{read_perm : 1})
        .exec();
}

Groups.write_perm = id => {
    return Group
        .find({path : id},{write_perm : 1})
        .exec();
}

Groups.sub_groups = id => {
    return Group
        .find({path : id},{sub_groups : 1})
        .exec();
}



var sub_tree_list = groups => ((groups.lenght >0)
                                            ?groups.map(sub_tree)
                                            :[]
                                        );

var sub_tree = path => { path : sub_tree_list(Groups.sub_groups(path))}

Groups.tree = id => sub_tree_list (id);

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





