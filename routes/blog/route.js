var express = require('express');
var router = express.Router();
var UserBlog = require('../../models/user_blog.js');
var BlogRouter = require('./blogs.js');


router.use('/', BlogRouter);


module.exports = router;
