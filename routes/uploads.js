var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/images/user_images/'});

router.post('/', upload.single('file'), function(req, res, next) {

	res.json({location: req.file.path.split('/').slice(1).join('/')});
});


module.exports = router;
