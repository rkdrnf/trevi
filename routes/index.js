var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		res.render('index', { regions: regions });
	});
});

module.exports = router;
