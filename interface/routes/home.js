var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home');
});
/*
router.post()..
    axios.post(
        dados => 
            verificar
            get root
    )
*/
module.exports = router;
