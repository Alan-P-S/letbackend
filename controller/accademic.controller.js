import { models } from "../lib/db.js";

const { TimeTable,StudySession,Priority } = models;
    
export const addStudySession = async (req, res) => {

    try {

        const {
            subject,
            date,
            durationSeconds,
            description
        } = req.body;

        const session = await StudySession.create({
            subject,
            date,
            durationSeconds,
            description
        });

        res.status(201).json({
            success: true,
            message: "Study session added successfully",
            data: session
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add study session",
            error: error.message
        });
    }
};

// ===============================
// GET ALL STUDY SESSIONS
// ===============================

export const getStudySessions = async (req, res) => {

    try {

        const sessions = await StudySession.findAll({

            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"]
            ]

        });

        res.status(200).json({

            success: true,

            count: sessions.length,

            data: sessions

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch study sessions",

            error: error.message

        });
    }
};
export const updatetimetable = async (req,res)=>{
   try{
         const data = req.body;
         let modifiedData = {data:data};
         console.log(data);
        if(!data){
        return res.status(500).json("Invalid Time Table")
        }
        const timetable = await TimeTable.findByPk(1);
        if(timetable){
            timetable.update(modifiedData,{where:{id:1}});
            return res.status(200).json("Time Table Updated SucessFully");
        } 
    
        await TimeTable.create(modifiedData);
        return res.status(200).json("Time Table Created SucessFully");
   }
   catch(error){
        console.log(error);
        return res.status(500).json("Internal Server Error"+error);
   }
}

export const getTimeTable = async (req,res)=>{

    const result =  await TimeTable.findByPk(1);
    if(result){
        return res.status(200).json(result.data);
    }
    return res.status(200).json("Cannot Find Time table");
}




// ======================================================
// GET ALL PRIORITIES
// ======================================================

export const getPriorities = async (req, res) => {

    try {

        const priorities = await Priority.findAll({
            order: [["order", "ASC"]]
        });

        res.status(200).json(priorities);

    } catch (error) {

        console.error("Get priorities error:", error);

        res.status(500).json({
            message: "Failed to retrieve priorities",
            error: error.message
        });

    }

};


// ======================================================
// CREATE / SAVE NEW PRIORITY
// ======================================================

export const createPriority = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;


        // -----------------------------------------------
        // Validate name
        // -----------------------------------------------

        if (!name || !name.trim()) {

            return res.status(400).json({
                message: "Priority name is required"
            });

        }


        // -----------------------------------------------
        // Find the last priority
        // -----------------------------------------------

        const lastPriority =
            await Priority.findOne({
                order: [["order", "DESC"]]
            });


        const newOrder =
            lastPriority
                ? lastPriority.order + 1
                : 0;


        // -----------------------------------------------
        // Create priority
        // -----------------------------------------------

        const priority =
            await Priority.create({

                name: name.trim(),

                description:
                    description?.trim() || null,

                progress: 0,

                completed: false,

                order: newOrder,

                totalTime: 0,

                lastStartedAt: null

            });


        // -----------------------------------------------
        // Return created priority
        // -----------------------------------------------

        res.status(201).json(priority);


    } catch (error) {

        console.error(
            "Create priority error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create priority",

            error:
                error.message

        });

    }

};


// ======================================================
// UPDATE PRIORITY PROGRESS
// ======================================================

export const updatePriorityProgress = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            progress,
            timestamp
        } = req.body;


        const priority =
            await Priority.findByPk(id);


        if (!priority) {

            return res.status(404).json({
                message: "Priority not found"
            });

        }


        // -----------------------------------------------
        // Validate progress
        // -----------------------------------------------

        const newProgress =
            Number(progress);


        if (
            Number.isNaN(newProgress) ||
            newProgress < 0 ||
            newProgress > 100
        ) {

            return res.status(400).json({
                message:
                    "Progress must be between 0 and 100"
            });

        }


        // -----------------------------------------------
        // CHECK PRIORITY LOCK
        // -----------------------------------------------

        const currentPriority =
            await Priority.findOne({

                where: {
                    completed: false
                },

                order: [["order", "ASC"]]

            });


        /*
         * Only the first incomplete priority
         * can be updated.
         */

        if (
            !currentPriority ||
            currentPriority.id !== priority.id
        ) {

            return res.status(403).json({

                message:
                    "This priority is locked. Complete the previous priority first."

            });

        }


        // -----------------------------------------------
        // Calculate time
        // -----------------------------------------------

        const now =
            timestamp
                ? new Date(timestamp)
                : new Date();


        let timeAdded = 0;


        if (priority.lastStartedAt) {

            const previousTime =
                new Date(
                    priority.lastStartedAt
                );


            timeAdded =
                Math.max(
                    0,
                    Math.floor(
                        (
                            now -
                            previousTime
                        ) / 1000
                    )
                );

        }


        const newTotalTime =
            Number(
                priority.totalTime || 0
            ) +
            timeAdded;


        // -----------------------------------------------
        // Check completion
        // -----------------------------------------------

        const completed =
            newProgress >= 100;


        // -----------------------------------------------
        // Update priority
        // -----------------------------------------------

        await priority.update({

            progress:
                newProgress,

            completed:
                completed,

            totalTime:
                newTotalTime,

            lastStartedAt:
                now

        });


        // -----------------------------------------------
        // Return updated priority
        // -----------------------------------------------

        res.status(200).json(
            priority
        );


    } catch (error) {

        console.error(
            "Update priority error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update priority",

            error:
                error.message

        });

    }

};


// ======================================================
// REORDER PRIORITIES
// ======================================================

export const reorderPriorities = async (req, res) => {

    const transaction =
        await Priority.sequelize.transaction();


    try {

        const {
            priorities
        } = req.body;


        if (!Array.isArray(priorities)) {

            await transaction.rollback();

            return res.status(400).json({

                message:
                    "priorities must be an array"

            });

        }


        // -----------------------------------------------
        // Update order
        // -----------------------------------------------

        for (
            const item of priorities
        ) {

            await Priority.update(

                {
                    order:
                        item.order
                },

                {
                    where: {
                        id:
                            item.id
                    },

                    transaction
                }

            );

        }


        await transaction.commit();


        const updatedPriorities =
            await Priority.findAll({

                order:
                    [["order", "ASC"]]

            });


        res.status(200).json(
            updatedPriorities
        );


    } catch (error) {

        await transaction.rollback();


        console.error(
            "Reorder priorities error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to reorder priorities",

            error:
                error.message

        });

    }

};


// ======================================================
// DELETE PRIORITY
// ======================================================

export const deletePriority = async (req, res) => {

    try {

        const { id } =
            req.params;


        const priority =
            await Priority.findByPk(id);


        if (!priority) {

            return res.status(404).json({

                message:
                    "Priority not found"

            });

        }


        await priority.destroy();


        // -----------------------------------------------
        // Re-number remaining priorities
        // -----------------------------------------------

        const remaining =
            await Priority.findAll({

                order:
                    [["order", "ASC"]]

            });


        for (
            let i = 0;
            i < remaining.length;
            i++
        ) {

            await remaining[i].update({

                order: i

            });

        }


        res.status(200).json({

            message:
                "Priority deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete priority error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete priority",

            error:
                error.message

        });

    }

};