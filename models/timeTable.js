import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define("TimeTable", {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        data:{
            type:DataTypes.JSON,
            allowNull:false
        }

    });

};