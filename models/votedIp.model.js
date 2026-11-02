
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("VotedIP", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ipHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    }
  });
};
