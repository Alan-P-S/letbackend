import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define("Priority", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING,
            allowNull: true
        },

        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        totalTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },

        lastStartedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });
};