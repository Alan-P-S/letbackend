import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";
import { sendNotificationToAll } from "../lib/pushService.js";
import { sendNativeNotificationToAll } from "../lib/NativeNotification.js";
import { models } from "../lib/db.js";
const {
    WebsiteMonitor
} = models;

const TARGET_URL = "https://lbsapplications.kerala.gov.in/btechlet2026";
const TARGET_SELECTOR = "body > div.container.body > div > div.right_col";

function createHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}


export const checkWebsite = async () => {
  try {
    console.log(`[${new Date().toLocaleTimeString()}] Checking...`);

    const response = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    const targetElement = $(TARGET_SELECTOR);

    if (!targetElement.length) {
      console.log("Selector not found");
      return;
    }

    const currentText = targetElement
      .text()
      .replace(/\s+/g, " ")
      .trim();

    
    const currentHash = createHash(currentText);

    let monitor = await WebsiteMonitor.findOne({
      where: { url: TARGET_URL },
    });

    // First run
    if (!monitor) {
      await WebsiteMonitor.create({
        url: TARGET_URL,
        lastHash: currentHash,
        lastContent: currentText,
      });

      console.log("Baseline saved.");
      return;
    }

    // Compare hashes
    if (monitor.lastHash !== currentHash) {
      await sendNotificationToAll(
          "Website Updated",
          "New announcement available.",
           TARGET_URL
      );

      await sendNativeNotificationToAll("Update On the Website","Something important has been changed in the website look out!!");

      monitor.lastHash = currentHash;
      monitor.lastContent = currentText;

      await monitor.save();
    } else {
      console.log("No changes found.");
    }
  } catch (error) {
    console.error(error.message);
  }
};