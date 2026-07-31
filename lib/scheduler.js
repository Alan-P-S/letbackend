import { models } from "../lib/db.js";
import { Op } from 'sequelize' 
import { sendNativeNotificationToAll } from "./NativeNotification.js";
const {
    ScheduledNotification
} = models;

export const scheduler  = async ()=>{
    try{
        const now = new Date();

        const ScheduledNotifications = await ScheduledNotification.findAll({
            where:{
                DateTime:{[Op.lte]:now},
                isNotified:false
            },
        })

        if (ScheduledNotifications == 0) return;

        for(const notification of ScheduledNotifications){
            await sendNativeNotificationToAll(notification.title,notification.body);
            notification.isNotified = true;
            await notification.save();
        }
    }catch(err){
        console.log(`Failed to run scheduler function ${err}`)
    }
}


