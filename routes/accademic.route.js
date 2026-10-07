import express from "express";
import { getTimeTable, updatetimetable,addStudySession,
    getStudySessions,
    reorderPriorities,
    updatePriorityProgress,
    getPriorities,
    createPriority,
    deletePriority
} from "../controller/accademic.controller.js";


const router = express.Router();

router.get('/study-section',getStudySessions);
router.post('/study-section',addStudySession);
router.get('/time-table',getTimeTable);
router.post('/time-table',updatetimetable);


router.post(
    "/priorities",
    createPriority
);


router.get(
    "/priorities",
    getPriorities
);


router.put(
    "/priorities/:id/progress",
    updatePriorityProgress
);

router.delete(
    "/priorities/:id",
    deletePriority
);

router.put(
    "/priorities/reorder",
    reorderPriorities
);

export default router;