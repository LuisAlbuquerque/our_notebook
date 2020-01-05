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

Users.favourite_id = id=> {
    return User
        .find({email: id},{favourite : 1})
        .exec();
}


