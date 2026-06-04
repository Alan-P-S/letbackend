import { DataTypes } from "sequelize";

export default (sequelize)=>{

    return sequelize.define(
        "Quiz",
        {

            title:{
                type:DataTypes.STRING,
                allowNull:false
            },

            subject:{
                type:DataTypes.STRING,
                allowNull:false
            },

            rewardTokens:{
                type:DataTypes.INTEGER,
                defaultValue:10
            },

            questions:{
                type:DataTypes.JSON,
                allowNull:false
            }

        }
    );

};