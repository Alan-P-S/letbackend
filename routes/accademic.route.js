import express from "express";
import { getTimeTable, updatetimetable } from "../controller/accademic.controller.js";


const router = express.Router();


router.get('/time-table',getTimeTable);
router.post('/time-table',updatetimetable);

export default router;