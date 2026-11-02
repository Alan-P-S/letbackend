
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "HangmanGameSlot",
    {
      id: {
        type: DataTypes.TINYINT.UNSIGNED,
        primaryKey: true,
        allowNull: false
      },

      currentTaskId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: "hangman_game_slots",
      timestamps: true
    }
  );
};
