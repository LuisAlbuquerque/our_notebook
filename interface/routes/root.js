var express = require('express');
var router = express.Router();

router.get('/*', function(req, res, next) {
    let path = req.params['0'].replace(/\/+$/, '');
    let path_list = path.split("/");

    res.render('root', {path: path});
});

module.exports = router;
