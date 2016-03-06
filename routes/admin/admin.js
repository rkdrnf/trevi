var express = require('express');
var router = express.Router();

router.use('/users', require('./users.js'));
router.use('/regions', require('./regions.js'));

module.exports = router;


