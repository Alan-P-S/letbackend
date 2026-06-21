import { DataTypes } from "sequelize";

export default (sequelize)=>{
    return sequelize.define(
  "FcmToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },

    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "fcm_tokens",
    timestamps: true,
  }
);
}