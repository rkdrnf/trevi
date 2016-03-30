var express = require('express');
var router = express.Router();
var Place = require('../models/place.js');


router.get('/:id', function(req, res) {
	Place.findById(req.params.id).populate('region photos').lean().exec(function(err, place) {
		res.render('places/show', { place: place });
	});

});

module.exports = router;
