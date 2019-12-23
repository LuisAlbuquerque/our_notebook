var User = require('../models/users');

const User = module.exports;

Users.lista_user = () => {
    return User
        .find({})
        .exec();
}

Users.user_id = id => {
    return User
        .find({_id: id})
        .exec();
}

Users.favourite_id = id => {
    return User
        .find({_id: id},{favourite : 1})
        .exec();
}


