import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from 'node-cron';
import axios from 'axios';


import router from "./routes/app.route.js";

dotenv.config();

const app = express();


// CORS

app.use(cors());

// Body Parser


cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Sending keep-alive ping to backend...');
    const response = await axios.get('https://letbackend.onrender.com/');
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