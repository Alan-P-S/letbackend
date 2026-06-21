import { saveFcmToken, sendCustomNotification, subscribe,sendNotification } from "../controller/subscription.controller.js";
import express from 'express'
const router = express.Router();


router.post("/", subscribe);
router.post("/custom-notification",sendCustomNotification);
router.get("/",(req,res)=>{
    res.send("notificationServiceRoute");
    console.log("notificationServiceRoute");
})
router.post("/register-device", saveFcmToken);
/**
 * @openapi
 * /api/subscribe/send-notification:
 *   post:
 *     summary: Send Notfication
 *     description: Sends Notification to all devices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: Breaking News!!
 *               body:
 *                 type: string
 *                 example: This is a test notification body!!
 *     responses:
 *       201:
 *         description: Messages sent to all
 *       400:
 *         description: Failes to send Messages.
 */
router.post("/send-notification",sendNotification);
export default router;