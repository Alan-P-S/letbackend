import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { models } from "../lib/db.js";

const { Student } = models;

export const signup = async(req,res)=>{

    try{

        const {
            username,
            email,
            password
        } = req.body;

        const exists =
        await Student.findOne({
            where:{ email }
        });

        if(exists){

            return res.status(400)
            .json({
                message:"Email already exists"
            });

        }

        const hashed =
        await bcrypt.hash(
            password,
            10
        );

        const user =
        await Student.create({

            username,
            email,
            password:hashed

        });

        const token =
        jwt.sign(
            { id:user.id },
            process.env.JWT_SECRET,
            { expiresIn:"30d" }
        );

        res.json({
            token
        });

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};

export const login = async(req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;

        const user =
        await Student.findOne({
            where:{ email }
        });

        if(!user){

            return res.status(404)
            .json({
                message:"Student not found"
            });

        }

        const match =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!match){

            return res.status(401)
            .json({
                message:"Invalid credentials"
            });

        }

        const token =
        jwt.sign(
            { id:user.id },
            process.env.JWT_SECRET,
            { expiresIn:"30d" }
        );

        res.json({
            token
        });

    }catch(err){

        res.status(500)
        .json({
            message:err.message
        });

    }

};