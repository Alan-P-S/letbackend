import { DataTypes } from "sequelize";

export default (sequelize)=>{
    return sequelize.define("Date",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
         startDate:{
            type:DataTypes.DATE,
            allowNull:false,
        }
    })
}