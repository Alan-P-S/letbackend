import { models } from "../lib/db.js";

const { TimeTable } = models;



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