import mysql from "mysql2/promise";
import colors from "colors";
const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      connectionLimit: 10,
    });
    console.log(`MariaDB connected: ${process.env.MYSQL_HOST}`.cyan.underline);

    await connection.end();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
