import express from "express";

import authmiddleware from "../lib/authmiddleware.js";

import { login,signup } from "../controller/auth.controller.js";

import { profile,leaderboard,transactions } from "../controller/user.controller.js";



import {
createQuiz,
getAllQuizzes,
getQuizById,
getSubjectQuizzes
} from "../controller/quiz.controller.js";

import {
submitQuiz
} from "../controller/attemp.controller.js";

const router =
express.Router();

router.post("/signup",signup);
router.post("/login",login);

router.get(
"/profile",
authmiddleware,
profile
);

router.get(
"/leaderboard",
leaderboard
);

router.get(
"/transactions",
authmiddleware,
transactions
);

router.post(
"/quiz",
authmiddleware,
createQuiz
);

router.get(
"/quiz",
getAllQuizzes
);

router.get(
"/quiz/:id",
getQuizById
);

router.get(
"/quiz/subject/:subject",
getSubjectQuizzes
);

router.post(
"/quiz/submit",
authmiddleware,
submitQuiz
);

export default router;