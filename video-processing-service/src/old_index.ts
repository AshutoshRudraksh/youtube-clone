import express from 'express';
import ffmpeg from "fluent-ffmpeg"; // ffmpeg is  nodejs wrapper and fluent-ffmpeg is CLI cmd
const app = express();
app.use(express.json()); // adding the middleware to handle json request
// const port = 3000; 

// creating route request and respond
// using get endpoint 
//using root rout for now

//app.get('/', (req, res) =>{
    // sending the responsse
    //res.send('Hello World!');

//});

// create new port for video file from the request body
// not using '/' root path now instead '/process-video'
app.post('/process-video', (req, res)=>{
    // Get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath; // input video path
    const outputFilePath = req.body.outputFilePath; // output path  both on local now later will do for cloud

    // to handle error to check undefined or we can't access file and send 400 error
    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file path. ") // A 400 Bad Request error is an HTTP status code client error
    }


    // converting the video file pixel scaling 
    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1: 360") // vf -> videofile 360px
        .on("end", ()=> {                      // on(event) run this code
            res.status(200).send(" Processing finished successfully. ") 

        }).on("error", (err) =>{                   // on error run this code
            console.log(`An error occured: ${err.message}`);
            // (HTTP) 500 Internal Server Error server error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request. 
            res.status(500).sendFile(`Internal Server Error: ${err.message}`); 
        })
        .save(outputFilePath);  //assuming successfull specify the path to save
    // we don't use return statement in any above so that the save part can execute
    // The HTTP 200 OK is the status response code from a server for successful HTTP requests from a client (browser).
    // return res.status(200).send("video processing started...") 
})
// google why we set the port here instead at the very beginning
const  port = process.env.PORT || 3001; // "process.env.PORT " : this is standard way to decalre the port at the run time
// 300 is not the exact port on which it might run it vary on rvn variable if undefined as we run local it will runn on 3000
// start our server
// listen at this port and execut the code 
app.listen(port, () =>{
    console.log(`Video processing service listening at ${port}`);
});

// when you want to run the code :
//      -- $npm run start
//      -- you need to have some video at the video processing service directory 
// note -- the path of the video matter should not be in the src dir because we run the npm commond from the the same dir as the video is in
