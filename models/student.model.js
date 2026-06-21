import { DataTypes } from "sequelize";

export default (sequelize) => {

    return sequelize.define("Student", {

        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        username:{
            type:DataTypes.STRING,
            allowNull:false
        },

        email:{
            type:DataTypes.STRING,
            unique: 'unique_student_email'
        },

        password:{
            type:DataTypes.STRING,
            allowNull:false
        },

        points:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },

        tokens:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        attemptedCount:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        

    });

};