var express = require('express');
var router = express.Router();
var userControll = require('../controllers/userController');
var middleware = require('../middleware/user.middleware');

const model = require('../models/user.model');

router.use((req, res, next) => {
  next();
})

router.get('/list', middleware.check_login, userControll.listUser);

router.post('/reg', userControll.registerUser);

router.post('/login', userControll.login);

module.exports = router;
