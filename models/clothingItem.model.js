import { DataTypes, ENUM } from "sequelize";

export default (sequelize)=>{

    return sequelize.define(
        "ClothingItem",
        {

            name:{
                type:DataTypes.STRING,
                allowNull:false
            },

            type:{
                type:DataTypes.STRING,
                allowNull:false
            },

            price:{
                type:DataTypes.FLOAT,
                defaultValue:10
            },
            status:{
                type:DataTypes.ENUM(
                    "WEARING",
                    "UN WORN",
                ),
                default:"UN WORN",
            },
            wornCount:{
                type:DataTypes.INTEGER,
                defaultValue:0,
                allowNull:false
            }

        }
    );

};