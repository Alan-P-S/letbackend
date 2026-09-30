import express from "express";

import {
    addClothing,
    deleteClothing,
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


router.delete("/clothing-item/:id", deleteClothing);

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