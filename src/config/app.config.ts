export const envConfiguration = () => ({
  port: +process.env.PORT || 3000,
  mysql_host: process.env.MYSQL_HOST || '127.0.0.1',
  mysql_port: +process.env.MYSQL_PORT || 3306,
  mysql_username: process.env.MYSQL_USERNAME || 'user',
  mysql_password: process.env.MYSQL_PASSWORD || 'password',
  mysql_database: process.env.MYSQL_DATABASE || 'db',
});
