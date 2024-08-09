const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/users', userController.createUser);

router.get('/users', userController.getUsers);

router.get('/users/:email', userController.getUserByEmail);

router.put('/users/:email', userController.updateUserByEmail);

router.delete('/users/:email', userController.deleteUserByEmail);

module.exports = router;
