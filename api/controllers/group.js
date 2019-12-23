var Group = require('../models/grops');

const Group = module.exports;

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

Groups.group_id = id => {
    return Group
        .find({_id: id})
        .exec();
}

Groups.page = id => {
    return Group
        .find({_id: id},{page : 1})
        .exec();
}

Groups.read_perm = id => {
    return Group
        .find({_id: id},{read_perm : 1})
        .exec();
}

Groups.write_perm = id => {
    return Group
        .find({_id: id},{write_perm : 1})
        .exec();
}

Groups.sub_groups = id => {
    return Group
        .find({_id: id},{sub_groups : 1})
        .exec();
}



var sub_tree_list = groups => return ((groups.lenght >0)
                                            ?groups.map(sub_tree)
                                            :[]
                                        );

var sub_tree = id => return { id : sub_tree_list(Groups.sub_groups(id))}

Groups.tree = id => return sub_tree_list (id):

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





