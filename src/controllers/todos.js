const { connection, dbParameters } = require('../configs/db.config');

const { httpStatusCode } = require('../constants');

const handleGetTodos = async (req, res) => {
  try {
    const queryFindTodos = `SELECT * from ${dbParameters.NAME}.todos WHERE ownerId='${req.tokenData.userId} and isDeleted='0';`

    connection.query(queryFindTodos, (err, results) => {
      if (results === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'You do not have any tasks to do',
        })
      }
      return res.send(results);
    })
  } catch (err) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
}

const handleAddTodo = async (req, res) => {
  try {
    const insertQuery = `INSERT INTO ${dbParameters.NAME}.todos (color, description, due_date, is_archived, is_favourite, ownerId) 
    VALUES ('${req.body.color}', '${req.body.description}', '${req.body.due_date}', '${req.body.is_archived}', '${req.body.is_favourite}', '${req.tokenData.userId}');`

    connection.query(insertQuery, (err) => {
      if (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Error occured while adding your task',
        });
      }
      return res.status(httpStatusCode.OK).send({
        message: 'Task was successfully added',
      });
    });
  } catch (err) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
}

const handleUpdateTodo = async (req, res) => {
  try {
    const { data } = req.body;

    const queryFindOrganizer = `SELECT ownerId FROM ${dbParameters.NAME}.todos where id='${req.query.eventId}'`;

    connection.query(queryFindOrganizer, (err, result) => {
      if (result[0].ownerId !== req.tokenData.userId) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'You have no permission to edit this task',
        });
      }
    })

    const queryEditTodo = `
    UPDATE ${dbParameters.NAME}.todos SET 
    color='${data.color}',
    description='${data.description}',
    due_date='${data.due_date}',
    is_archived='${data.is_archived}',
    is_favourite='${data.is_favourite}',
    WHERE ownerId='${req.tokenData.userId}';
    `;

    connection.query(queryEditTodo, (err) => {
      if (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Error occured while adding your task',
        });
      }
      return res.status(httpStatusCode.OK).send({
        message: 'Task was successfully added',
      });
    });
  } catch (err) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
}

const handleDeleteTodo = async (req, res) => {
  try {
    const sqlQuery = `UPDATE ${dbParameters.NAME}.todos SET isDeleted='1' WHERE id='${req.body.eventId}';`;

    connection.query(sqlQuery, () => res.status(httpStatusCode.OK).send({
      message: 'Task was deleted successfully',
    }));
  } catch (e) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
};

module.exports = {
  handleGetTodos,
  handleAddTodo,
  handleUpdateTodo,
  handleDeleteTodo,
}
