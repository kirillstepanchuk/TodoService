const { connection, dbParameters } = require('../configs/db.config');

const { httpStatusCode, NUM_PER_PAGE } = require('../constants');

const handleGetTodos = async (req, res) => {
  try {
    let selectFilteredTodos;
    const dateNow = new Date().toISOString().slice(0, 19).replace(' ', 'T');
    const defaultSql = `SELECT id, color, description, due_date, is_archived, is_favorite, owner_id, mo, tu, we, th, fr, st, su FROM ${dbParameters.NAME}.todos`

    switch (req.query.filter_type) {
      case 'overdue':
        selectFilteredTodos = `WHERE due_date < '${dateNow}' AND owner_id='${req.tokenData.userId}'`;
        break;
      case 'today':
        selectFilteredTodos = `WHERE due_date > '${dateNow}' AND owner_id='${req.tokenData.userId}'`;
        break;
      case 'favourites':
        selectFilteredTodos = `WHERE is_favourite='1' AND owner_id='${req.tokenData.userId}'`;
        break;
      case 'archived':
        selectFilteredTodos = `WHERE is_archived='1' AND owner_id='${req.tokenData.userId}'`;
        break;
      case 'repeating':
        selectFilteredTodos = `WHERE mo='1' OR tu='1' OR we='1' OR th='1' OR fr='1' OR st='1' OR su='1' AND owner_id='${req.tokenData.userId}'`;
        break;
      case 'all':
      default:
        selectFilteredTodos = `WHERE is_archived='0' AND owner_id='${req.tokenData.userId}'`;
    }

    connection.query(`${defaultSql} ${selectFilteredTodos}`, (err, results) => {
      if (results === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'You do not have any tasks that matches this filter',
        })
      }
      const result = results.map((elem) => {
        return {
          id: elem.id,
          color: elem.color,
          description: elem.description,
          due_date: elem.due_date,
          is_archived: Boolean(elem.is_archived),
          is_favourite: Boolean(elem.is_favorite),
          repeating_days: {
            mo: Boolean(elem.mo),
            tu: Boolean(elem.tu),
            we: Boolean(elem.we),
            th: Boolean(elem.th),
            fr: Boolean(elem.fr),
            st: Boolean(elem.st),
            su: Boolean(elem.su),
          },
        }
      })

      switch (req.query.sort_type) {
        case 'down':
          result.filter((a, b) => { return new Date(b.due_date) - new Date(a.due_date) });
          break;
        case 'up':
        default:
          result.filter((a, b) => { return new Date(a.due_date) - new Date(b.due_date) })
          break;
      }

      const start = ((+req.query.page - 1) * NUM_PER_PAGE);
      const end = start + NUM_PER_PAGE;
      const pagedResult = result.slice(start, end);

      return res.send(pagedResult);
    })
  } catch (err) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
}

const handleAddTodo = async (req, res) => {
  try {
    const data = req.body;
    const date = new Date(req.body.due_date).toISOString().slice(0, 19).replace(' ', 'T');
    const insertQuery = `
    INSERT INTO ${dbParameters.NAME}.todos 
    (color, description, due_date, is_archived, is_favorite, owner_id, mo, tu, we, th, fr, st, su)
    VALUES 
    ('${data.color}',
    '${data.description}',
    '${date}',
    '${data.is_archived}',
    '${data.is_favourite}',
    '${req.tokenData.userId}',
    '${data.repeating_days.mo}', 
    '${data.repeating_days.tu}',
    '${data.repeating_days.we}',
    '${data.repeating_days.th}',
    '${data.repeating_days.fr}',
    '${data.repeating_days.st}',
    '${data.repeating_days.su}');`

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
    const data = req.body;
    const date = new Date(data.due_date).toISOString().slice(0, 19).replace(' ', 'T');

    const queryFindOrganizer = `SELECT owner_id FROM ${dbParameters.NAME}.todos where id='${req.params.id}'`;

    connection.query(queryFindOrganizer, (err, result) => {
      if (result[0].owner_id !== req.tokenData.userId) {
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
    is_favorite='${data.is_favorite}',
    mo='${data.repeating_days.mo}',
    tu='${data.repeating_days.tu}',
    we='${data.repeating_days.we}',
    th='${data.repeating_days.th}',
    fr='${data.repeating_days.fr}',
    st='${data.repeating_days.st}',
    su='${data.repeating_days.su}'
    WHERE id='${req.params.id}';
    `;

    connection.query(queryEditTodo, (err) => {
      if (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Error occured while editing your task',
        });
      }

      return res.status(httpStatusCode.OK).send({
        message: 'Task was successfully edited',
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
    const sqlQuery = `UPDATE ${dbParameters.NAME}.todos SET is_deleted='1' WHERE id='${req.params.id}';`;

    connection.query(sqlQuery, (err) => {
      if (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Error occured while deleting your task',
        })
      }

      return res.status(httpStatusCode.OK).send({
        message: 'Task was deleted successfully',
      })
    });
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
