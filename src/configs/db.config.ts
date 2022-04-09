export default {
  DB_HOST: process.env.DB_HOST || "sql11.freesqldatabase.com",
  DB_USER: process.env.DB_USER || "sql11484777",
  DB_PASSWORD: process.env.DB_PASSWORD || "e8N13hsWpu",
  DB_PORT: process.env.DB_PORT || 3306,
  DB_DATABASE: process.env.DB_DATABASE || "sql11484777",
  DB_CONNECTION_LIMIT: process.env.MY_SQL_DB_CONNECTION_LIMIT
    ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT)
    : 4,
};
