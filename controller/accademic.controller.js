import { models } from "../lib/db.js";

const { TimeTable,StudySession } = models;
    
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