import { models } from "../lib/db.js";

const { TimeTable } = models;

import { sendNativeNotificationToAll } from "./NativeNotification.js";


export async function isPeriod(){
    let response = await fetch('https://timeapi.io/api/v1/time/current/zone?timezone=Asia%2FKolkata');
    const result = await TimeTable.findByPk(1);
    const timetable = result.data;
    let data = await response.json();
    let currentTime = new Date(data.date_time);
    let current_day_of_week = data.day_of_week;
    let periods = timetable[current_day_of_week];
    if(periods.length!=0){
        periodIteration(timetable[current_day_of_week],currentTime)
    }else{
        return;
    }
}
isPeriod();



function periodIteration(periods,currentTime){
    periods.forEach(p=>{
        const [FromHour , FromMinute , FromSecond] = p.time.split(':').map(Number);
        let firstTime = FromHour*60+FromMinute;
        let secondTime = currentTime.getHours()*60 + currentTime.getMinutes();
        let notificationDelay = 10;
        if(firstTime==secondTime){
            sendNativeNotificationToAll("Attention!!",`${p.subject} is going to start soon`);
        }
    })
}
