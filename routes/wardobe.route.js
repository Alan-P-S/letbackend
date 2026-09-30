import express from "express";

import {
    addClothing,
    getClothing,
    resetWornCount,
    wearClothing
} from "../controller/wardobe.controller.js" ;

const router = express.Router();


// Add clothing
router.post(
    "/clothing-item",
    addClothing
);


// Get all clothing
router.get(
    "/clothing-items",
    getClothing
);


router.post(
    "/:id/wear",
    wearClothing
);

router.patch("/:id/reset-worn-count", resetWornCount);

export default router;