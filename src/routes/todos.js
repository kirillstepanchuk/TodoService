const express = require('express');

const { handleGetTodos } = require('../controllers/todos');

const router = express();

router.post('/get-todos', handleGetTodos);

module.exports = router;
