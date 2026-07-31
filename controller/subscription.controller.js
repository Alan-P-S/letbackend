import { models } from "../lib/db.js";
import { sendNotificationToAll } from "../lib/pushService.js";
import { sendNativeNotificationToAll } from "../lib/NativeNotification.js";
import axios from "axios";
import { unixToDate } from "../lib/Time.js";
const {
    PushSubscription,
    FcmToken,
    Notification,
    StartDate,
    ScheduledNotification
} = models;

export const subscribe = async (req, res) => {
  const { endpoint, keys } = req.body;
  console.log("UserSubed: "+endpoint+" "+keys);
    const exists = await PushSubscription.findOne({ where: { endpoint } });
    if (!exists) {
        await PushSubscription.create({ endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth });
            return res.json({success: true,});
            
    }
    return res.status(500).json({message:"Already Exist"});

  
};

export const fetchActiveusers =  async(req,res)=>{
    const tokens = await FcmToken.findAll({
      attributes: ["token"],where:{
        isActive:true,
      }
    });

    return res.status(200).json({tokens});

}
export const getTime = async (req,res)=>{
  const response = await axios.get("https://timeapi.io/api/v1/time/current/zone?timezone=Asia%2FKolkata");
  const sampleDate = new Date("2026-06-20");
  const datetime = response.data.date_time;
  const date = new Date(datetime);
  const diffInMs = date.getTime() - sampleDate.getTime();
  const msInaDay = 1000*60*60*24;
  const DiffInDays = diffInMs / msInaDay;
  console.log(Math.floor(DiffInDays));
  return res.json(date.toDateString() + `Days: ${Math.floor(DiffInDays)}`);
}

export const getElapsedDays = async(req,res)=>{
  const response = await axios.get("https://timeapi.io/api/v1/time/current/zone?timezone=Asia%2FKolkata");
  const currentDate = new Date(response.data.date_time);
  const result = await StartDate.findByPk(1);
  console.log(currentDate);
  if(!result){
    await StartDate.create({
      startDate:currentDate
    });

    return res.json({message:"Created new Date"});
  }
  const oldDate = new Date(result.startDate);
  const diffInMs = currentDate.getTime() - oldDate.getTime();
  const msInaDay = 1000*60*60*24;
  const diffInDays = Math.floor(diffInMs / msInaDay);

  return res.json({"Dasy":diffInDays});
}
export const getAllNotifications = async(req,res)=>{
  try{
      const allNotifications = await Notification.findAll();
      return res.status(200).json(allNotifications);
  }catch(error){
      console.log("Error in fetching Notifications");
      return res.status(500).json({message:"Internal Server error"});
  }
  
  
}

export const sendCustomNotification = async(req,res)=>{
    const {title,body} =req.body;
    if(!title || !body){
        return res.status(500).json({message:"Title and Body Required!!"});
    }
    const url = "sample.com";
    await sendNotificationToAll(
            title,
            body,
            url
    );
    return res.status(200).json({message:"Custom-Notifications send success"});

};

export const saveFcmToken = async (req, res) => {
    console.log("device called");
    console.log(req.body);
  try {
    const { token, deviceId, platform } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM Token required",
      });
    }
    const deviceName= deviceId;

    const [fcmToken, created] =
      await FcmToken.findOrCreate({
        where: {
          token,
        },
        defaults: {
          token,
          deviceName,
          platform,
        },
      });

    return res.json({
      success: true,
      created,
      data: fcmToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendNotification = async (req, res) => {
  try{
        const { title, body } = req.body;
        if(!title||!body){
            return res.status(400).json({message:"Title and body required!!"});
        }
        await sendNativeNotificationToAll(title,body);

        return res.status(200).json({message:"Messages send Success"})
  } catch{
        return res.status(500).json({message:"Internal server Error Notifications can't send!!"});
  } 
  
};

export const scheduleNotification = async (req,res)=>{
  try{
    const {subject,title,body,DateTime} = req.body;
    if(!subject || !title || !body || !DateTime){
      return res.status(400).json({message:"All the Fields are required!!"});
    }
    await ScheduledNotification.create({subject,title,body,DateTime,isNotified:false})
    
    return res.status(200).json({message:"Notification Scheduled!!"});
    
  }catch(err){
    console.log(err);
    return res.status(500).json({message:"Internal server Error Notification can't be saved!!"});
  }
}