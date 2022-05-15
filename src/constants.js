module.exports = {
  CLIENT_URL: 'http://localhost:3001',
  NUM_PER_PAGE: 4,
  FILE_SIZE_LIMIT: '50mb',
  EXPIRE_HOURS: 20,
  appParameters: {
    PORT: process.env.PORT || 5000,
  },
  httpStatusCode: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
  },
};
