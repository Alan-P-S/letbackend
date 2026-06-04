import { DataTypes } from "sequelize";

export default (sequelize)=>{

    return sequelize.define(
        "TokenTransaction",
        {

            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },

            amount:{
                type:DataTypes.INTEGER,
                allowNull:false
            },

            type:{
                type:DataTypes.ENUM(
                    "QUIZ_REWARD",
                    "BONUS",
                    "PURCHASE",
                    "ADMIN"
                ),
                allowNull:false
            },

            description:{
                type:DataTypes.STRING
            }

        }
    );

};