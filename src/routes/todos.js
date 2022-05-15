const express = require('express');

const {
  handleGetTodos,
  handleAddTodo,
  handleUpdateTodo,
  handleDeleteTodo,
} = require('../controllers/todos');
const verifyToken = require('../middleware/verifyToken')

const router = express();

router.get('/tasks', verifyToken, handleGetTodos);
// router.get('/tasks', (req, res) => {
//   console.log('req: ', req);
// });

router.post('/tasks', verifyToken, handleAddTodo);
router.put('/tasks/:id', verifyToken, handleUpdateTodo);
router.delete('/tasks/:id', verifyToken, handleDeleteTodo);

module.exports = router;
