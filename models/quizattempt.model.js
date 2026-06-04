import { DataTypes } from "sequelize";

export default (sequelize)=>{

    return sequelize.define(
        "QuizAttempt",
        {

            score:{
                type:DataTypes.INTEGER,
                allowNull:false
            },

            totalQuestions:{
                type:DataTypes.INTEGER,
                allowNull:false
            },

            earnedTokens:{
                type:DataTypes.INTEGER,
                defaultValue:0
            },

            submittedAnswers:{
                type:DataTypes.JSON
            }

        }
    );

};