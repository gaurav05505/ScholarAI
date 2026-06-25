import dotenv from 'dotenv'; 
import app from './app.js';
import connectDb from './config/database.js';
import { recoverQueuedDocuments, startDocumentWorker } from './jobs/document.job.js';

dotenv.config(); 

const PORT = process.env.PORT || 5000; 

const startServer = async () =>{
    await connectDb(); 
    startDocumentWorker();
    await recoverQueuedDocuments();

    app.listen(PORT , ()=> {
        console.log(`server is running on port ${PORT}`);
        
    })

}

startServer(); 
