import { DataTypes } from "sequelize";


export default (sequelize)=>{
return sequelize.define(
  "WebsiteMonitor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lastHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "",
    },
    lastContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "website_monitors",
    timestamps: true,
  }
);
}