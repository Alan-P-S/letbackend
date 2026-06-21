import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from 'node-cron';
import axios from 'axios';
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./swagger.js";
import router from "./routes/app.route.js";
import videoRouter from "./routes/video.route.js"
import subscriptionRoute from "./routes/subscription.route.js"
import { checkWebsite } from "./controller/webmonitor.controller.js";


dotenv.config();

const app = express();
app.use(bodyParser.json());

// CORS

app.use(cors());

// Body Parser


cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('Sending keep-alive ping to backend...');
    const response = await axios.get('https://letbackend.onrender.com/');
    checkWebsite();
    console.log(`Ping successful! Status: ${response.status}`);
  } catch (error) {
    console.error('Ping failed:', error.message);
  }
});

app.use(
    express.json({
        limit:"10mb"
    })
);

app.use(
    express.urlencoded({
        extended:true
    })
);


// Health Check
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/",(req,res)=>{

    res.json({

        success:true,

        message:
        "Quiz API Running"

    });

});


// Routes

app.use(
    "/api",
    router
);

app.use(
    "/api/videos",
    videoRouter
);
app.use(
    "/api/subscribe",
    subscriptionRoute
);



// 404 Handler

app.use((req,res)=>{

    res.status(404)
    .json({

        success:false,

        message:
        "Route Not Found"

    });

});


// Error Handler

app.use((err,req,res,next)=>{

    console.error(err);

    res.status(500)
    .json({

        success:false,

        message:
        "Internal Server Error"

    });

});


const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});