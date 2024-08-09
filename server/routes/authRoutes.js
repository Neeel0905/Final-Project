const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/auth/login', userController.login);
router.post('/auth/signup', userController.createUser);

module.exports = router;
