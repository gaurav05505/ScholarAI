import express from 'express'; 
import cors from 'cors'; 
import cookieparser from 'cookie-parser'
import authRoute from '../src/routes/auth.route.js'
import docRoute from '../src/routes/doc.route.js'
import chatRoutes from '../src/routes/chat.route.js'


const app = express(); 
app.use(cookieparser()); 

app.use(cors()); 
app.use(express.json()); 

app.use('/auth' ,  authRoute);
app.use('/docs', docRoute); 

app.use("/api/chat", chatRoutes);

app.get('/' , (req, res) => {
    res.send('server is running'); 
})

app.use((err, req, res, next) => {
    if (err) {
        const statusCode = err.name === 'MulterError' ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: err.message || 'Unexpected server error',
        });
    }

    next();
});

export default app; 
