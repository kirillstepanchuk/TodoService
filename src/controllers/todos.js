const { connection, dbParameters } = require('../configs/db.config');

const { httpStatusCode } = require('../constants');

const handleGetTodos = async (req, res) => {
  try {
    const queryFindTodos = `
    SELECT color, description, due_date, is_archived, is_favourite, ${dbParameters.NAME}.todos.id ownerId, mo, tu, we, th, fr, st, su FROM ${dbParameters.NAME}.todos
    CROSS JOIN ${dbParameters.NAME}.repeatingDays
    WHERE ownerId='${req.tokenData.userId} and isDeleted='0' and eventId=${dbParameters.NAME}.todos.id
    `

    connection.query(queryFindTodos, (err, results) => {
      if (results === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'You do not have any tasks to do',
        })
      }
      results.map((elem) => {
        return {
          color: elem.color,
          description: elem.description,
          due_date: elem.due_date,
          is_archived: elem.is_archived,
          is_favourite: elem.is_favourite,
          repeating_days: {
            mo: elem.mo,
            tu: elem.tu,
            we: elem.we,
            th: elem.th,
            fr: elem.fr,
            st: elem.st,
            su: elem.su, 
          },
        }
      })
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
    const date = req.body.due_date.toISOString().slice(0, 19).replace(' ', 'T');
    const insertQuery = `INSERT INTO ${dbParameters.NAME}.todos (color, description, due_date, is_archived, is_favourite, ownerId) 
    VALUES ('${req.body.color}', '${req.body.description}', '${date}', '${req.body.is_archived}', '${req.body.is_favourite}', '${req.tokenData.userId}');`

    const insertDaysQuery = `INSERT INTO ${dbParameters.NAME}.repeatingDays (mo, tu, we, th, fr, st, su)
    VALUES('${req.body.repeating_days.mo}', 
    ${req.body.repeating_days.tu}',
    '${req.body.repeating_days.we}',
    '${req.body.repeating_days.th}',
    '${req.body.repeating_days.fr}',
    '${req.body.repeating_days.st}',
    '${req.body.repeating_days.su}');`

    connection.query(insertQuery, (err) => {
      if (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Error occured while adding your task',
        });
      }
      connection.query(insertDaysQuery, (err) => {
        if (err) {
          return res.status(httpStatusCode.BAD_REQUEST).send({
            message: 'Error occured while adding your task',
          });
        }
        return res.status(httpStatusCode.OK).send({
          message: 'Task was successfully added',
        });
      })
    });
  } catch (err) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
}

const handleUpdateTodo = async (req, res) => {
  try {
    const data = req.body;
    const date = data.due_date.toISOString().slice(0, 19).replace(' ', 'T');

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
    due_date='${date}',
    is_archived='${data.is_archived}',
    is_favourite='${data.is_favourite}'
    WHERE ownerId='${req.tokenData.userId}';
    `;

    const queryEditTodoDays = `
    UPDATE ${dbParameters.NAME}.repeatingDays SET
    mo='${data.repeating_days.mo}',
    mo='${data.repeating_days.tu}',
    mo='${data.repeating_days.we}',
    mo='${data.repeating_days.th}',
    mo='${data.repeating_days.fr}',
    mo='${data.repeating_days.st}',
    mo='${data.repeating_days.su}'
    WHERE eventId='${req.query.eventId}';
    `

    connection.query(queryEditTodo, (err) => {
      if (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Error occured while editing your task',
        });
      }
      connection.query(queryEditTodoDays, (err) => {
        if (err) {
          return res.status(httpStatusCode.BAD_REQUEST).send({
            message: 'Error occured while editing your task',
          });
        }
        return res.status(httpStatusCode.OK).send({
          message: 'Task was successfully edited',
        });
      })
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
