import { models } from "../lib/db.js";

const {
    ClothingItem
} = models;

// ==========================================
// ADD CLOTHING ITEM
// ==========================================

export const addClothing = async (req, res) => {

    try {

        const {
            name,
            type,
            price,
            status
        } = req.body;


        // Validation

        if (!name || !type) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and type are required"

            });

        }


        const clothing =
            await ClothingItem.create({

                name,

                type,

                price:
                    price || 0,

                status:
                    status || "UN WORN"

            });


        return res.status(201).json({

            success: true,

            message:
                "Clothing added to inventory successfully",

            data: clothing

        });

    }


    catch (error) {

        console.error(
            "Add clothing error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to add clothing",

            error:
                error.message

        });

    }

};



// ==========================================
// GET ALL CLOTHING
// ==========================================

export const getClothing = async (req, res) => {

    try {

        const clothing =
            await ClothingItem.findAll({

                order: [
                    ["createdAt", "DESC"]
                ]

            });


        return res.status(200).json({

            success: true,

            count:
                clothing.length,

            data:
                clothing

        });

    }


    catch (error) {

        console.error(
            "Get clothing error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get clothing",

            error:
                error.message

        });

    }

};

export const deleteClothing = async (req, res) => {

    try {

        const { id } = req.params;

        const clothing =
            await ClothingItem.findByPk(id);

        if (!clothing) {

            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });

        }

        await clothing.destroy();

        return res.status(200).json({
            success: true,
            message: "Clothing deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete clothing",
            error: error.message
        });

    }

};



export const wearClothing = async (req, res) => {

    try {

        const { id } = req.params;


        const clothing =
            await ClothingItem.findByPk(id);


        if (!clothing) {

            return res.status(404).json({

                success: false,

                message:
                    "Clothing item not found"

            });

        }


        // Increase worn count by 1
        clothing.wornCount =
            clothing.wornCount + 1;


        // Change status
        clothing.status =
            "WEARING";


        await clothing.save();


        return res.status(200).json({

            success: true,

            message:
                "Clothing worn successfully",

            data: clothing

        });

    }


    catch (error) {

        console.error(
            "Wear clothing error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to wear clothing",

            error:
                error.message

        });

    }

};


export const resetWornCount = async (req, res) => {
    try {
        const { id } = req.params;

        const clothing = await ClothingItem.findByPk(id);

        if (!clothing) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }

        clothing.wornCount = 0;

        await clothing.save();

        return res.status(200).json({
            success: true,
            message: "Worn count reset successfully",
            data: clothing
        });

    } catch (error) {
        console.error("Reset worn count error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reset worn count",
            error: error.message
        });
    }
};