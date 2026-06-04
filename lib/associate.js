import StudentModel from "../models/student.model.js";
import QuizModel from "../models/quiz.model.js";
import TokenTransactionModel from "../models/transaction.model.js";
import QuizAttemptModel from "../models/quizattempt.model.js";

export default (sequelize)=>{

    const Student = StudentModel(sequelize);
    const Quiz = QuizModel(sequelize);
    const TokenTransaction = TokenTransactionModel(sequelize);
    const QuizAttempt = QuizAttemptModel(sequelize);

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
        QuizAttempt
    };

};