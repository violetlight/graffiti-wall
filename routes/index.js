var express = require('express');
var router = express.Router();
var Graffiti = require('../models/graffiti');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* write to wall */
router.post('/', function(req, res, next) {
  var graffiti = new Graffiti({
    body: req.body.body
  });

  graffiti.save(function(err, data){
    if (err) console.log(err);
    else console.log('saved: ', data);
    res.render('index');
  });
});

/* 10 most recent Graffiti */
router.get('/g', function(req, res, next) {
  Graffiti.find({}, function(err, data) {
    if (err) console.log(err);
    else res.json(data);
  });
});


module.exports = router;
