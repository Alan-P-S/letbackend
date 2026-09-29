import { models } from "../lib/db.js";

const {
    SquatHold
} = models;

export const addSquatHold = async (req, res) => {

    try {

        const {
            date,
            time,
            duration
        } = req.body;


        // Basic validation
        if (!date || !time || duration === undefined) {

            return res.status(400).json({
                success: false,
                message: "date, time and duration are required"
            });

        }


        const squatHold =
            await SquatHold.create({

                date,
                time,
                duration

            });


        return res.status(201).json({

            success: true,

            message: "Squat hold added successfully",

            data: squatHold

        });

    }

    catch (error) {

        console.error(
            "Add squat hold error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to add squat hold",

            error: error.message

        });

    }

};


// ==========================================
// GET ALL SQUAT HOLDS
// ==========================================

export const getSquatHolds = async (req, res) => {

    try {

        const squatHolds =
            await SquatHold.findAll({

                order: [
                    ["date", "DESC"],
                    ["time", "DESC"]
                ]

            });


        return res.status(200).json({

            success: true,

            count: squatHolds.length,

            data: squatHolds

        });

    }

    catch (error) {

        console.error(
            "Get squat holds error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to get squat holds",

            error: error.message

        });

    }

};