var express = require('express');
var router = express.Router();

var nyController = require('../controllers/NYControler');
var middleware = require('../middleware/user.middleware');

var multer = require('multer');
var uploader = multer({dest: '.tmp'});

router.get('/list-ny',  nyController.listNy);
router.post('/add-ny', uploader.single('image'), nyController.addNy);
router.put('/update-ny-:id', uploader.single('image'), nyController.updateNY);
router.delete('/delete-ny-:id', nyController.deleteNY);

router.get('/list-nyType', nyController.listOfType);

module.exports = router;
