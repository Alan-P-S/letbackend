import { models } from "../lib/db.js";
import { sendNotificationToAll } from "../lib/pushService.js";
import { sendNativeNotificationToAll } from "../lib/NativeNotification.js";
const {
    PushSubscription,
    FcmToken
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