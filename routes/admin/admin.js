var express = require('express');
var router = express.Router();

router.use('/users', require('./users.js'));
router.use('/regions', require('./regions.js'));
router.use('/boards', require('./boards.js'));
router.use('/blogs', require('./blogs.js'));
router.use('/blogBoards', require('./blog_boards.js'));
router.use('/articles', require('./articles.js'));
router.use('/places', require('./places.js'));
router.use('/tags', require('./tags.js'));
router.use('/photo_articles', require('./photo_articles.js'));
router.use('/comments', require('./comments.js'));
router.use('/restaurants', require('./restaurants.js'));
module.exports = router;


