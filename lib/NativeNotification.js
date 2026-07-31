import { where } from "sequelize";
import { models } from "../lib/db.js";
import {app} from "../lib/firebase.js";
import { getMessaging } from "firebase-admin/messaging";
const {
    FcmToken,Notification
} = models;

export const sendNativeNotificationToAll = async (title,body)=>{
    try {
    await Notification.create({title,body});
    const tokens = await FcmToken.findAll({
      attributes: ["token"],where:{
        isActive:true,
      }
    });
    
    const tokenList = tokens.map((t) => t.token);

    if (!tokenList.length) return;
    

    const message = {
      notification: {
        title,
        body,
      },
      tokens: tokenList,
    };

    const response =
      await getMessaging(app).sendEachForMulticast(
      message
  );
  console.log("Notification send to all");

response.responses.forEach(async (result, index) => {
  if (!result.success) {

    const errorCode =
      result.error?.code;

    if (
      errorCode ===
        "messaging/registration-token-not-registered" ||
      errorCode ===
        "messaging/invalid-registration-token"
    ) {
      await FcmToken.destroy({
        where: {
          token: tokenList[index],
        },
      });
    }
  }
});
  } catch (error) {
    console.error(error);
  }
}