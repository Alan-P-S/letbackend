
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("Party", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  });
};
