import { models } from "../lib/db.js";
import {app} from "../lib/firebase.js";
import { getMessaging } from "firebase-admin/messaging";
const {
    FcmToken
} = models;

export const sendNativeNotificationToAll = async (title,body)=>{
    try {
    const tokens = await FcmToken.findAll({
      attributes: ["token"],
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