import verifyToken from '../middleware/verifyToken';

const express = require('express');

const {
  handleGetTodos,
  handleAddTodo,
  handleUpdateTodo,
  handleDeleteTodo,
} = require('../controllers/todos');

const router = express();

router.get('/tasks', verifyToken, handleGetTodos);
router.post('/tasks', verifyToken, handleAddTodo);
router.put('/tasks', verifyToken, handleUpdateTodo);
router.delete('/tasks', verifyToken, handleDeleteTodo);

module.exports = router;
