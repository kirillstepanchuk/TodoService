const express = require('express');

const { handleRegisterUser, handleLoginUser } = require('../controllers/auth');

const router = express();

router.post('/register', handleRegisterUser);
router.post('/login', handleLoginUser);

module.exports = router;
