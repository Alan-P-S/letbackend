import fs from "fs";
import B2 from "backblaze-b2";

import { models } from "../lib/db.js";


const {
    Student,
    Video,
    TokenTransaction
} = models;


const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
});

export const uploadVideo = async (req, res) => {

    try {

        const videoFile = req.files?.video?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!videoFile) {

            return res.status(400).json({
                message: "Video file is required"
            });

        }

        await b2.authorize();

        const uploadUrlData =
        await b2.getUploadUrl({
            bucketId: process.env.B2_BUCKET_ID
        });

        /*
        =====================
        Upload Video
        =====================
        */

        const videoFileName =
        `videos/${Date.now()}-${videoFile.originalname}`;


        const videoBuffer =
videoFile.buffer;

        const videoResult =
        await b2.uploadFile({

            uploadUrl:
            uploadUrlData.data.uploadUrl,

            uploadAuthToken:
            uploadUrlData.data.authorizationToken,

            fileName:
            videoFileName,

            data:
            videoBuffer

        });

        /*
        =====================
        Upload Thumbnail
        =====================
        */

        let thumbnailFileName = null;
        let thumbnailFileId = null;

        if (thumbnailFile) {

            const thumbnailBuffer =
            thumbnailFile.buffer;

            thumbnailFileName =
            `thumbnails/${Date.now()}-${thumbnailFile.originalname}`;

            const thumbnailResult =
            await b2.uploadFile({

                uploadUrl:
                uploadUrlData.data.uploadUrl,

                uploadAuthToken:
                uploadUrlData.data.authorizationToken,

                fileName:
                thumbnailFileName,

                data:
                thumbnailBuffer

            });

            thumbnailFileId =
            thumbnailResult.data.fileId;

          
        }

        /*
        =====================
        Save Database
        =====================
        */

        const video =
        await Video.create({

            title:
            req.body.title,

            description:
            req.body.description,

            fileName:
            videoFileName,

            fileId:
            videoResult.data.fileId,

            mimeType:
            videoFile.mimetype,

            fileSize:
            videoFile.size,

            thumbnail:
            thumbnailFileName,

            thumbnailFileId,

            tokenCost:
            req.body.tokenCost || 5,

            status:
            "READY"

        });

       

        return res.status(201).json({

            message:
            "Video uploaded successfully",

            video

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
            "Upload failed",

            error:
            error.message

        });

    }

};

export const getAllVideos = async (
    req,
    res
) => {
    try {

        await b2.authorize();

        const videos = await Video.findAll({

            where: {
                status: "READY"
            },

            order: [
                ["createdAt", "DESC"]
            ]

        });

        /*
         Generate ONE token
         for all thumbnails
        */

        const auth =
        await b2.getDownloadAuthorization({

            bucketId:
            process.env.B2_BUCKET_ID,

            fileNamePrefix:
            "thumbnails/",

            validDurationInSeconds:
            3600

        });

        const token =
        auth.data.authorizationToken;

        const result =
        videos.map(video => {

            let thumbnailUrl = null;

            if (video.thumbnail) {

                thumbnailUrl =
                `${process.env.B2_DOWNLOAD_URL}/file/${process.env.B2_BUCKET_NAME}/${video.thumbnail}?Authorization=${token}`;

            }

            return {

                id: video.id,

                title: video.title,

                description:
                video.description,

                tokenCost:
                video.tokenCost,

                views:
                video.views,

                thumbnailUrl,

                createdAt:
                video.createdAt

            };

        });

        return res.json({
            videos: result
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
            "Failed to fetch videos",

            error:
            error.message

        });

    }

};



export const watchVideo = async (
    req,
    res
) => {

    try {

        const studentId =
        req.user.id;

        const videoId =
        req.params.id;

        const student =
        await Student.findByPk(
            studentId
        );

        const video =
        await Video.findByPk(
            videoId
        );

        if (!video) {

            return res.status(404)
            .json({
                message:
                "Video not found"
            });

        }

        if (
            student.tokens <
            video.tokenCost
        ) {

            return res.status(400)
            .json({
                message:
                "Not enough tokens"
            });

        }

        /*
         Deduct Tokens
        */

        student.tokens -=
        video.tokenCost;

        await student.save();

        /*
         Save Transaction
        */

        await TokenTransaction.create({

            amount:
            -video.tokenCost,

            type:
            "PURCHASE",

            description:
            `Watched video: ${video.title}`,

            studentId:
            student.id

        });

        /*
         Generate Temporary URL
        */

        await b2.authorize();

        const auth =
        await b2.getDownloadAuthorization({

            bucketId:
            process.env.B2_BUCKET_ID,

            fileNamePrefix:
            video.fileName,

            validDurationInSeconds:
            300

        });

        const videoUrl =
        `${process.env.B2_DOWNLOAD_URL}/file/${process.env.B2_BUCKET_NAME}/${video.fileName}?Authorization=${auth.data.authorizationToken}`;

        return res.json({

            message:
            "Access granted",

            remainingTokens:
            student.tokens,

            videoUrl

        });

    } catch (error) {

        console.error(error);

        return res.status(500)
        .json({

            message:
            "Failed to load video"

        });

    }

};