import express from 'express'
import fileUpload from 'express-fileupload'
import {uploadFile} from './s3.js'
import path from 'path'
import {fileURLToPath} from 'url';
import {process} from './maps.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

app.get('/',(req,res)=>{
    res.json({message:'welcome to server with S3'})
});


app.get('/view', (req, res)=> {
    res.sendFile(__dirname + '/app.html');
});

app.listen(3000)
process(720, 60);


console.log('Server on port ${3000}')
