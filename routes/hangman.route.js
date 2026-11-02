
import { Router } from "express";
import { checkDeadline, completeTask, createTask, getAllTasks, getCurrentTask } from "../controller/hangman.controller.js";




const router = Router();

router.get("/current", getCurrentTask);
router.get("/tasks", getAllTasks);
router.post("/tasks", createTask);
router.post("/complete", completeTask);
router.post("/check-deadline", checkDeadline);

export default router;
