import express from "express";
import multer from "multer";

import {
    uploadVideo,
    getAllVideos,
    watchVideo
} from "../controller/video.controller.js";
import authmiddleware from "../lib/authmiddleware.js";

const router = express.Router();

const upload = multer({

    storage:
    multer.memoryStorage(),

    limits:{
        fileSize:
        100 * 1024 * 1024
    }

});

router.post("/upload", (req, res, next) => {

    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ])(req, res, (err) => {

        if (err) {

            console.error("MULTER ERROR:");
            console.error(err);

            return res.status(500).json({
                error: err.message
            });
        }

        next();
    });

}, uploadVideo);    

router.get(
    "/",
    getAllVideos
);

router.get(
    "/watch/:id",
    authmiddleware,
    watchVideo
);

export default router;