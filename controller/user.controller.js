import { models } from "../lib/db.js";

const {
    Student,
    TokenTransaction
} = models;

export const profile = async(req,res)=>{

    try{

        const user =
        await Student.findByPk(
            req.user.id,
            {
                attributes:[
                    "id",
                    "username",
                    "email",
                    "points",
                    "tokens",
                    "attemptedCount"
                ]
            }
        );

        res.json(user);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};

export const leaderboard = async(req,res)=>{

    try{

        const users =
        await Student.findAll({

            attributes:[
                "id",
                "username",
                "points",
                "tokens",
                "attemptedCount"
            ],

            order:[
                ["points","DESC"]
            ],

            limit:100

        });

        res.json(users);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};

export const transactions =
async(req,res)=>{

    try{

        const data =
        await TokenTransaction.findAll({

            where:{
                userId:req.user.id
            },

            order:[
                ["createdAt","DESC"]
            ]

        });

        res.json(data);

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};