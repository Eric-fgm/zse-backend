export default {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_PORT: process.env.DB_PORT || 3306,
  DB_DATABASE: process.env.DB_DATABASE || "zse",
  DB_CONNECTION_LIMIT: process.env.MY_SQL_DB_CONNECTION_LIMIT
    ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT)
    : 4,
};
