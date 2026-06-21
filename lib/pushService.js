import webpush from "web-push";
import { models } from "../lib/db.js";
const {
    PushSubscription
} = models;

webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendNotificationToAll = async (
  title,
  message,
  url = "/"
) => {
  const subscriptions = await PushSubscription.findAll();

  const payload = JSON.stringify({
    title,
    message,
    url,
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
    } catch (err) {
      console.log(err.message);

      if (err.statusCode === 410) {
        await sub.destroy();
      }
    }
  }
};