var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var Event = require('../models/event.js');

router.get('/', function(req, res) {
	Event.find().lean().exec(function(err, events) {
		if (err) {
			console.log(err);
		}
		res.render('admin/events/index', { events: events });
	});
});

module.exports = router;
