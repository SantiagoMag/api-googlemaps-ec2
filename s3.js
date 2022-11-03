import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import {AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME} from './config.js'
import fs from 'fs'

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId : AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

export async function uploadFile(file){
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }
    const command = new PutObjectCommand(uploadParams)
    await client.send(command)

    return fs.unlinkSync(file.tempFilePath)
}

