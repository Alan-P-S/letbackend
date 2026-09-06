import videoModel from "../models/video.model.js";
import StudentModel from "../models/student.model.js";
import QuizModel from "../models/quiz.model.js";
import TokenTransactionModel from "../models/transaction.model.js";
import QuizAttemptModel from "../models/quizattempt.model.js";
import PushSubscriptionModel from "../models/pushSubscription.model.js";
import websiteMonitorModel from "../models/websiteMonitor.model.js";
import fcmModel from "../models/fcm.model.js";
import notificationModel from "../models/notification.model.js";
import scheduledNotificationModel from "../models/scheduledNotification.model.js";
import dateModel from "../models/startDate.model.js";
import TimeTableModel from "../models/timeTable.js";
export default (sequelize)=>{

    const Student = StudentModel(sequelize);
    const Video = videoModel(sequelize);
    const PushSubscription = PushSubscriptionModel(sequelize);
    const WebsiteMonitor = websiteMonitorModel(sequelize);
    const FcmToken = fcmModel(sequelize);
    const Notification = notificationModel(sequelize);
    const ScheduledNotification = scheduledNotificationModel(sequelize);
    const Quiz = QuizModel(sequelize);
    const TimeTable = TimeTableModel(sequelize);
    const TokenTransaction = TokenTransactionModel(sequelize);
    const QuizAttempt = QuizAttemptModel(sequelize);
    const StartDate = dateModel(sequelize);
    Student.hasMany(QuizAttempt,{
    foreignKey:"userId"
});

QuizAttempt.belongsTo(Student,{
    foreignKey:"userId"
});

Quiz.hasMany(QuizAttempt,{
    foreignKey:"quizId"
});

QuizAttempt.belongsTo(Quiz,{
    foreignKey:"quizId"
});

Student.hasMany(TokenTransaction,{
    foreignKey:"userId"
});

TokenTransaction.belongsTo(Student,{
    foreignKey:"userId"
});

  return {
        Student,
        Quiz,
        TokenTransaction,
        QuizAttempt,
        Video,
        PushSubscription,
        WebsiteMonitor,
        FcmToken,
        Notification,
        StartDate,
        ScheduledNotification,
        TimeTable
    };

};