var express = require('express');
var router = express.Router();

parse_url = character => str => {
    
}
    


router.get('/root/:path', function(req, res, next) {
    let path = parse('/', req.params.path);
    res.send('respond with a resource');
});

module.exports = router;
