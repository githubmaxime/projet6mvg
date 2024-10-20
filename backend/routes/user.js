const express = require('express');
const router = express.Router();

const { validateUser } = require('../models/user')
const validateMiddleware = require('../middleware/validate')
const userCtrl = require('../controllers/user');


router.post('/signup', validateMiddleware(validateUser), userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;