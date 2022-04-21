const { connection, dbParameters } = require('../configs/db.config');

const { httpStatusCode } = require('../constants');

const handleGetTodos = async (req, res) => {
  try {
    const queryFindTodos = `SELECT * from ${dbParameters.NAME}.todos WHERE ownerId='${req.tokenData.userId}'`

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

module.exports = {
  handleGetTodos,
}
