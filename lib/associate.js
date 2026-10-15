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
import StudySessionModel from "../models/studysection.model.js"
import SquatHoldModel from "../models/squate.model.js"
import clothingItemModel from "../models/clothingItem.model.js";
import priorityModel from "../models/priority.model.js";
import PartyModel from "../models/party.model.js";
import PositionModel from "../models/position.model.js";
import CandidateModel from "../models/candidate.model.js";
import VoteModel from "../models/vote.model.js";
export default (sequelize)=>{

    const Student = StudentModel(sequelize);
    const Video = videoModel(sequelize);
    const PushSubscription = PushSubscriptionModel(sequelize);
    const WebsiteMonitor = websiteMonitorModel(sequelize);
    const StudySession = StudySessionModel(sequelize);
    const FcmToken = fcmModel(sequelize);
    const SquatHold = SquatHoldModel(sequelize);
    const Notification = notificationModel(sequelize);
    const Priority = priorityModel(sequelize);
    const ClothingItem = clothingItemModel(sequelize);
    const ScheduledNotification = scheduledNotificationModel(sequelize);
    const Quiz = QuizModel(sequelize);
    const TimeTable = TimeTableModel(sequelize);
    const TokenTransaction = TokenTransactionModel(sequelize);
    const QuizAttempt = QuizAttemptModel(sequelize);
    const StartDate = dateModel(sequelize);
    const Party = PartyModel(sequelize);
const Position = PositionModel(sequelize);
const Candidate = CandidateModel(sequelize);
const Vote = VoteModel(sequelize);


// Party <-> Candidate
Party.hasMany(Candidate);
Candidate.belongsTo(Party);

// Position <-> Candidate
Position.hasMany(Candidate);
Candidate.belongsTo(Position);

// Candidate <-> Vote
Candidate.hasMany(Vote);
Vote.belongsTo(Candidate);

// Position <-> Vote
Position.hasMany(Vote);
Vote.belongsTo(Position);

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
        TimeTable,
        StudySession,
        SquatHold,
        ClothingItem,
        Priority,
        Party,
        Position,
        Candidate,
        Vote
    };

};