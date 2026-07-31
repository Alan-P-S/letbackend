import { DataTypes } from "sequelize";


export default (sequlize)=>{
    return sequlize.define("ScheduledNotification",{
        "id":{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        "subject":{
            type:DataTypes.STRING,
            allowNull:false
        },
        "title":{
            type:DataTypes.STRING,
            allowNull:false,
        },
        "body":{
            type:DataTypes.STRING,
            allowNull:false,
        },
        "DateTime":{
            type:DataTypes.DATE,
            allowNull:false,
        },
        "isNotified":{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            default:false
        }
    })
}