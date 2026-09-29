import express from "express";

import { addSquatHold,getSquatHolds } from "../controller/workout.controller.js";

const router = express.Router();


router.get("/squathold",getSquatHolds);
router.post("/squathold",addSquatHold);


export default router;