
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("Vote", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
};
