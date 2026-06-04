import { models } from "../lib/db.js";

const { Quiz } = models;

export const createQuiz =
async(req,res)=>{
    console.log("hi")
    try{

        const {
            title,
            subject,
            questions
        } = req.body;

        const quiz =
        await Quiz.create({

            title,

            subject,

            questions,

            totalQuestions:
            questions.length,

            createdBy:
            req.user.id

        });

        res.json(quiz);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};

export const getAllQuizzes =
async(req,res)=>{

    try{

        const quizzes =
        await Quiz.findAll({

            attributes:[
                "id",
                "title",
                "subject",
                "totalQuestions",
                "rewardTokens"
            ]

        });

        res.json(quizzes);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};

export const getQuizById =
async(req,res)=>{

    try{

        const quiz =
        await Quiz.findByPk(
            req.params.id
        );

        if(!quiz){

            return res.status(404)
            .json({
                message:"Quiz not found"
            });

        }

        res.json(quiz);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};

export const getSubjectQuizzes =
async(req,res)=>{

    try{

        const quizzes =
        await Quiz.findAll({

            where:{
                subject:
                req.params.subject
            }

        });

        res.json(quizzes);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};