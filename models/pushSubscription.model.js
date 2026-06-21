import { DataTypes } from "sequelize";


export default (sequelize) => {
  // Add 'return' here so the initialization file can capture it
  return sequelize.define("PushSubscription", {
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    p256dh: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    auth: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};
