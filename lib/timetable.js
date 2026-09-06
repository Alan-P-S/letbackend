import { models } from "../lib/db.js";
const { TimeTable } = models;
import { sendNativeNotificationToAll } from "./NativeNotification.js";

export async function isPeriod(){
    try {
        const result = await TimeTable.findByPk(1);
        const timetable = result.data;

        // 1. Get the current exact time in India (IST) directly from the machine clock
        const options = { timeZone: 'Asia/Kolkata', hour12: false, weekday: 'long', hour: '2-digit', minute: '2-digit' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        
        // Parts will safely contain: [{type: "weekday", value: "Monday"}, ..., {type: "hour", value: "11"}, ...]
        const parts = formatter.formatToParts(new Date());
        
        let current_day_of_week = parts.find(p => p.type === 'weekday').value; // e.g. "Monday"
        let localHour = Number(parts.find(p => p.type === 'hour').value);
        let localMinute = Number(parts.find(p => p.type === 'minute').value);

        let periods = timetable[current_day_of_week];

        if (periods && periods.length !== 0) {
            periodIteration(periods, localHour, localMinute);
        }
    } catch (error) {
        console.error("Error executing period check:", error);
    }
}

function periodIteration(periods, localHour, localMinute){
    periods.forEach(p => {
        const [FromHour, FromMinute] = p.time.split(':').map(Number);
        
        let firstTime = FromHour * 60 + FromMinute;
        let secondTime = localHour * 60 + localMinute; 

        if (firstTime === secondTime) {
            sendNativeNotificationToAll("Attention!!", `${p.subject} is going to start soon`);
        }
    });
}
