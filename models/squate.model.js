
import { DataTypes } from "sequelize";

export default (sequelize) => {

    return sequelize.define(
        "SquatHold",
        {

            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            time: {
                type: DataTypes.TIME,
                allowNull: false
            },

            duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }

        }
    );

};