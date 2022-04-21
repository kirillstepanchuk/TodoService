const express = require('express');

const { appParameters, FILE_SIZE_LIMIT } = require('./constants');

const router = require('./routes/index');

const app = express();

app.use(express.json({ limit: FILE_SIZE_LIMIT }));
app.use(router);

const startServer = async () => {
  try {
    app.listen(appParameters.PORT, () => {
      console.info(`Server started on port ${appParameters.PORT}!`);
    });
  } catch (error) {
    console.log(`The ${error} happend with server`);
    console.log(`It means ${error.message}`);
  }
};

startServer();