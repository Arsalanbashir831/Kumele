const express = require('express');
const AuthController = require('../controllers/AuthController');
const EventController = require('../controllers/EventController');
const ProfileController = require('../controllers/ProfileController');
const router = express.Router();

router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)
router.get('/profile', AuthController.verifyToken, ProfileController.getProfile)
router.post('/UpdateProfile', AuthController.verifyToken, ProfileController.updateProfile)
router.post('/createEvent', AuthController.verifyToken,EventController.createEvent)

module.exports = router;
