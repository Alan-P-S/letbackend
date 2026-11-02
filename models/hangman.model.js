
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("HangmanTask", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "failed"),
      defaultValue: "active",
      allowNull: false
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: "hangman_tasks",
    timestamps: true
  });
};
