import express from "express";
import { getTimeTable, updatetimetable,addStudySession,
    getStudySessions
} from "../controller/accademic.controller.js";


const router = express.Router();

router.get('/study-section',getStudySessions);
router.post('/study-section',addStudySession);
router.get('/time-table',getTimeTable);
router.post('/time-table',updatetimetable);

export default router;