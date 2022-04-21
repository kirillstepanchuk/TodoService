const express = require('express');

const authRouter = require('./auth');

const router = express();

router.use(authRouter);

module.exports = router;
