const express = require('express');

const authRouter = require('./auth');
const todosRouter = require('./todos');

const router = express();

router.use(authRouter);
router.use(todosRouter);

module.exports = router;
