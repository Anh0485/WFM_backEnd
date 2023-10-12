import { Sequelize } from "sequelize";
import colors from "colors";
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("wfm_project_02", "root", "123", {
  host: process.env.MYSQL_HOST,
  dialect: "mysql",
  logging: false,
});

const connectDB_01 = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection has been established successfully.`.cyan.underline);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDB_01;
