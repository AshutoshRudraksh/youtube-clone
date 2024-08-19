import express from 'express';

import{
	uploadProcessedVideo,
	downloadRawVideo,
	deleteRawVideo,
	deleteProcessedVideo,
	convertVideo,
	setupDirectories
} from './storage';

// create the local directories for videos
setupDirectories();

const app = express();

app.use(express.json());

// process a video file from cloud storage into 360px
app.post('/process-video', async (req, res)=>{

	//get the bucket and filename from the cloud pub/sub message
	let data;
	try{
		const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
		data = JSON.parse(message);
		if (!data.name) {
			throw new Error('Invalid message payload received.');
		}
	} catch (error) {
		console.error(error);
		return res.status(400).send('Bad Request: missing filename.');
	}

	const inputFileName = data.name;
	const outputFileName = `processed-${inputFileName}`;

	// download the raw video from cloud storage
	await downloadRawVideo(inputFileName);


	// process the video into 360px
	try {
		await convertVideo(inputFileName, outputFileName)
	} catch(err) {
		await Promise.all([
			deleteRawVideo(inputFileName),
			deleteProcessedVideo(outputFileName)
		]);
		return res.status(500).send('Processing failed')
		
	}

	// upload the processed video to cloud storage
	await uploadProcessedVideo(outputFileName);

	await Promise.all([
		deleteRawVideo(inputFileName),
		deleteProcessedVideo(outputFileName)
	]);
	return res.status(200).send('Processing finished successfully');
});

const port = process.env.PORT || 8080;
app.listen(port, () =>{
	console.log(`Server is running on port ${port}`);
})
