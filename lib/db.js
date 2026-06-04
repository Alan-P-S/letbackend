import { Sequelize } from "sequelize";
import createModels from "./associate.js";
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:"mysql",
        logging:false
    }
);

const models = createModels(sequelize);

await sequelize.sync({ alter:true });

export {
    sequelize,
    models
};