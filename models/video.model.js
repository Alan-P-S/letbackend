import { DataTypes } from "sequelize";

export default (sequelize) => {

    return sequelize.define(
        "Video",
        {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            title: {
                type: DataTypes.STRING,
                allowNull: false
            },

            description: {
                type: DataTypes.TEXT
            },

            fileName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            fileId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: 'unique_video_fieldId'
            },

            mimeType: {
                type: DataTypes.STRING,
                allowNull: false
            },

            fileSize: {
                type: DataTypes.BIGINT,
                allowNull: false
            },

            thumbnail: {
            type: DataTypes.STRING
            },

            thumbnailFileId: {
            type: DataTypes.STRING
            },

            tokenCost: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },

            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            status: {
                type: DataTypes.ENUM(
                    "PROCESSING",
                    "READY",
                    "PRIVATE",
                    "DELETED"
                ),
                defaultValue: "READY"
            }

        }
    );

};