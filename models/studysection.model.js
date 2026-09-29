import {DataTypes} from 'sequelize';


export default (sequelize)=>{
    return sequelize.define(
    "StudySession",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        subject: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        durationSeconds: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                min: 0
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },

    {
        tableName: "study_sessions",

        timestamps: true
    }
)}


