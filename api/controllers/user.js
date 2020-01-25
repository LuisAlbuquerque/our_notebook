var User = require('../models/users');

const Users = module.exports;

Users.lista_user = () => {
    return User
        .find({})
        .exec();
}

Users.user_id = id => {
    return User
        .find({email : id})
        .exec();
}

Users.user_insert = body => {
    var user = 
            {
                name      : body.name,
                email     : body.email,
                password  : body.password,
                favourite : []
            };
    console.dir(user);
    var object_user = new User(user);
    return object_user.save();
}

Users.favourite_id = id=> {
    return User
        .find({email: id},{favourite : 1})
        .exec();
}


