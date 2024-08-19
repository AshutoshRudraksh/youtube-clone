// 1. GCS file interactions
// 2. Local file interactions

import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


// creating instance of Google cloud storage

const storage = new Storage();

/**
 * *create the local directories for raw and processed videos.
 */
const rawVideoBucketName = '{replace with your filename}';
const processedVideoBucketName = "{replace fileName}";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";



export function setupDirectories() {
	ensureDirectoryExistence(localRawVideoPath);
	ensureDirectoryExistence(localProcessedVideoPath);
};

// using simple api for processing and converting the video
/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@linklocalProcessedVideoPath}.
 * @returns A promise that resolves when the video has beeen converted.
 */

export function convertVideo(rawVideoName: string, processedVideoName: string){
	return new Promise<void> ((resolve, reject) => {
		ffmpeg('${localRawVideopath}/${rawVideoName}')
		.outputOptions("-vf", "scale=-1:360") // 360p
		.on("end", function(){
			console.log("Processing finished successully");
			resolve();
		})
		.on("error", function (err: any){
			console.log("An error occurred: " + err.message);
			reject(err);
		})
		.save(`${localProcessedVideoPath}/${processedVideoName}`);
	});
}



// moving ahead with file system operations with gcs
/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @return A promise that resolves when the file had been download
 */
// to download raw video from the raw buckets
export async function downloadRawVideo(fileName: string){
	await storage.bucket(rawVideoBucketName)// specify the bucket
	.file(fileName)// specify the file 
	.download({ // download 
		destination: '${localRawVideoPath}/${fileName}', // where to download
	});
	// log statement   
	console.log(
		'gs://${rawVideoBucketName}/${fileName} download to ${localRawVideoPath}/${fileName}.'
	);
}

/**
 * @param fileName - The Name of the file to upload form the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @return A promise that resolves when the file had been uploaded.
 */
// uploading publicly 
export async function uploadProcessedVideo(fileName: string) {
	const bucket = storage.bucket(processedVideoBucketName);
	// Upload video to the bucket
	await storage.bucket(processedVideoBucketName)
		.upload('${localProcessedVideoPath}/${filename}',{
			destination: fileName,
		});
		console.log(
			'${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.'
		);
	// set the video to be publicly readable so people can view 
	await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - The name of the file to delete from the 
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file had been deleted.
 */
//
export function deleteRawVideo(fileName: string){
	return deleteFile('${localRawVideoPath}/${fileName}');
}

/**
 * @param fileName - The name of the file to delete form the 
 * {@link localProcessedVideoPath} folder.
 * @return A promise that resolves when the file has been deleted.
 *
 */

export function deleteProcessedVideo(fileName: string){
	return deleteFile('${localProcessedVideoPath}/${fileName}');
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */

function deleteFile(filePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)){
			fs.unlink(filePath, (err) =>{
				if (err){
					console.error(`Failed to delete file at ${filePath}`, err);
					reject(err);
				} else{
					console.log(`File deleted at ${filePath}`);
					resolve();
				} 
			});
		}
		else {
			console.log(`File not found at ${filePath}, skipping delete.`)
			resolve();
		}
	});
}


/**
 * Ensure a directory exists, creating it if necessary.
 * @param {string} dirpath - The directory path to check.
 */

function ensureDirectoryExistence(dirPath: string){
	if (!fs.existsSync(dirPath)){
		fs.mkdirSync(dirPath, {recursive: true}); // recursive: true enable creating
		console.log(`Directory created at ${dirPath}`);
	}
}

