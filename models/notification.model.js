import { DataTypes } from "sequelize";

export default (sequelize)=>{
    return sequelize.define("Notification",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        body:{
            type:DataTypes.STRING,
            allowNull:false
        }
        
    })
}