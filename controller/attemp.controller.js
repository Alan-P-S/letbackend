import { models } from "../lib/db.js";
const {
    Student,
    Quiz,
    QuizAttempt,
    TokenTransaction
} = models;

export const submitQuiz =
async(req,res)=>{

    try{

        const {
            quizId,
            answers
        } = req.body;

        const quiz =
        await Quiz.findByPk(
            quizId
        );

        if(!quiz){

            return res.status(404)
            .json({
                message:"Quiz not found"
            });

        }

        let score = 0;

        quiz.questions.forEach(q=>{

            if(
                answers[q.id] ===
                q.answer
            ){

                score++;

            }

        });

        const earnedTokens = quiz.rewardTokens;

        await QuizAttempt.create({

            userId:
            req.user.id,

            quizId,

            score,

            totalQuestions:
            quiz.questions.length,

            earnedTokens,

            submittedAnswers:
            answers

        });

        const user =
        await Student.findByPk(
            req.user.id
        );

        user.points += score;

        user.tokens +=
        earnedTokens;

        user.attemptedCount += 1;

        await user.save();

        await TokenTransaction.create({

            userId:user.id,

            amount:
            earnedTokens,

            type:
            "QUIZ_REWARD",

            description:
            quiz.title

        });

        res.json({

            score,

            total:
            quiz.questions.length,

            earnedTokens

        });

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};