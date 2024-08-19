# youtube-clone

# --- what will you gain on compeletion?  ---> strong understanding of backend - cloud/restapi/ search engine/

# ---> Setup: VScode, Nodejs, Docker, 
# to install nodejs on mac using terminal : https://nodejs.org/en/download/package-manager/current (watch youtube if needed: https://www.youtube.com/watch?v=I8H4wolRFBk)

# to install docker : https://www.docker.com/get-started/ (youtube: https://www.youtube.com/watch?v=-EXlfSsP49A)

# install npm: https://treehouse.github.io/installation-guides/mac/node-mac.html
# Great Resource for Homebrew installation on Mac: https://treehouse.github.io/installation-guides/mac/homebrew 
# for learning more about Homebrew : http://brew.sh/


# -----> Part2 : Video Processing Serive
# create dir: 
# create npm node project using 'npm init' or 'npm init -y
# {
  "name": "video-processing-service",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
} 
# reopen the terminal and install dependencies:  $ npm install express
# after running the above command you will see the pacakage.json files with added dependencies
{

  "dependencies": {
    "express": "^4.19.2"
  },
}

# dev dependency : npm install --save-dev typescript ts-node 
# /--not vanillajs its typesript js --/
{
  "devDependencies": {
    "ts-node": "^10.9.2",
    "typescript": "^5.5.3"
  }
}

# installing few more dependencies: $ npm i(install) --save-dev @types/node @types/express 

# package.json - is the file you gonna commit to your version control system

# <--important --> node_module - you will not commit this to version control system --> so create new file (.gitignore) -- > add node_module to -> /.gitignore

# ---- time to write some source code
# 1. terminal ---> touch tsconfig.json (this file will let us define how use typescript and write code) use: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

# Create a new directory for your project, navigate into it, and initialize a new Node.js project:
    -Install Express, TypeScript, and the TypeScript Node development server as dependencies: 
    -Install the type definitions for Node.js and Express:
    -Create a new src directory with an index.ts file for your Express app:
    -Now you can start your Express.js server with npm run start.

# video processing locally
    - create new endpoint int index.ts
    - before that install dependencies: 
    - write the source code for processing video 
    - run $ npm run start 
    - I got error given the port 3000 was in use so I killed that process on 
        that port using: 
        - first get the process Id : $ netstat -anp tcp | grep 3000
        why use kill -9 <PID>? 
            $ kill -9 <PID>: Forcefully terminates the process without allowing it to clean up.
            kill <PID>: Gracefully requests the process to terminate, allowing it to clean up resources.
    -

// when you want to run the code :
//      -- $npm run start
//      -- you need to have some video at the video processing service
directory 
// note -- the path of the video matter should not be in the src dir because we run the npm commond from the the same dir as the video is in


To test this one out using thunder client API using extention 
    -Install Thunder Client in VSCode and send a request to test it out. The request URL:
    - In the new Request we going to select "POST" request -> 
        POST http://localhost:3000/process-video

        The request JSON body:

        {
        "inputFilePath": "./nc-intro.mp4",
        "outputFilePath": "./processed-nc-intro.mp4"
        }
    NOTE: don't forget to add the middleware :
        app.use(exprees.json)

# deploying the video processing service using docker container: 
It can be difficult to deploy apps and ensure they have all the dependencies they need.
    why docker? 
    -> Containers allow us to package our app and all its dependencies into a single image. We  can then  run this image on any machine that has Docker installed.
    For now, we will do so locally. But later on we will deploy our image to Google Cloud Run, which is specifically designed for running containerized apps.

# create a dockerfile
    - use parent(base) image-> node: 18 (built on linux system it's like running operating system ).
    - contianer has as file system so set up working dir.
    - docker image is used to instantiate containers : dock file (blueprint for)->dock image->(blueprint for) multiple container -> run or code in its isolated env/file-system

# convert videos hosted on google cloud storage
    - install cloud storage client library
        $npm install @google-cloud/storage
    -  to separate code create new file storage.ts
           1. GCS file interactions 
           2. local file interactions
    - import the necessary packages and libraries (storage, fs, ffmpeg)
    - create local directory for raw and processed videos
    - define constants/ instace for  GCS 
    - conversion code separately 
    - use simple api for converting(localbucket->processVideoName) used   within index.ts
    - create convert video funtion in storage.ts
    - create a popup message to know if the error ocurred or operation completed successfully
    - file system operations: download raw video from raw video bucket; upload video from local processed vido bucket.  (make sure to specify buckets/action/destination folder/ )
    - make it public 
    - Given the local file path -> delete the file
    - Ensure a drectory exists, creating it if necessary
    - get the bucket and filename from the cloud pub/sub 
    - Download the video from google cloud
    - processing -> convert the video tp 360px
    - upload the process video to cloud
    - 

