const jwt = require('jsonwebtoken');

const { connection, dbParameters } = require('../configs/db.config');
const getExpireTokenTime = require('../utils/getExpireTokenTime');

const { EXPIRE_HOURS, httpStatusCode } = require('../constants');

const handleRegisterUser = async (req, res) => {
  try {
    const queryFindUser = `SELECT login FROM ${dbParameters.NAME}.users WHERE login='${req.body.login}'`;

    connection.query(queryFindUser, (err, users) => {
      if (users && users.length > 0) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'A user has already registered with this login',
        });
      }

      if (req.body.password !== req.body.repeatPassword) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Passwords must match',
        });
      }

      const queryAddUser = `
      INSERT INTO ${dbParameters.NAME}.users (login, password) 
      VALUES ('${req.body.login}', '${req.body.password}');
      `;

      connection.query(queryAddUser, async (error, results) => {
        if (error) {
          return res.status(httpStatusCode.BAD_REQUEST).send({
            message: error.message,
          });
        }
        return res.status(httpStatusCode.OK).send({
          message: 'User successfully registred',
        });
      });
    });
  } catch (err) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
};

const handleLoginUser = async (req, res) => {
  try {
    const queryFindUser = `SELECT id, password, login FROM ${dbParameters.NAME}.users WHERE login='${req.body.login}'`;

    connection.query(queryFindUser, (err, users) => {
      if (users.length === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'There is no user with this login',
        });
      }

      const user = users[0];

      const passwordMatch = req.body.password === user.password;

      if (!passwordMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          message: 'Wrong password or login, please try again',
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: `${EXPIRE_HOURS}h` },
      );

      const expireTime = getExpireTokenTime();

      const queryInsertOrUpdateToken = `
      REPLACE INTO ${dbParameters.NAME}.login_tokens (userId, token, expireDate) 
      VALUES (${user.id}, '${token}', '${expireTime}') 
      `;

      connection.query(queryInsertOrUpdateToken);

      return res.status(httpStatusCode.OK).send({
        token,
        userId: user.id,
        login: user.login
      });
    });
  } catch (e) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Something went wrong, try again',
    });
  }
};


module.exports = {
  handleRegisterUser,
  handleLoginUser,
};
