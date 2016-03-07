var express = require('express');
var router = express.Router();

router.use('/users', require('./users.js'));
router.use('/regions', require('./regions.js'));
router.use('/boards', require('./boards.js'));
router.use('/blogs', require('./blogs.js'));
router.use('/blogBoards', require('./blog_boards.js'));

module.exports = router;

