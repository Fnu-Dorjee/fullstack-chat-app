
import express from 'express';
import dotenv from  "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";

import { connectDB } from './src/lib/db.js';
import {app, server } from './src/lib/socket.js';
import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js';
dotenv.config();

const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // if you're using cookies or auth headers
  }));

app.use('/api/auth', authRoutes);

app.use('/api/messages', messageRoutes);

//deployment logic
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })

};

const startServer = async()=>{
    try{
        await connectDB();
        server.listen(PORT, ()=>{
            console.log(`Server is running on ${PORT}.`); 
        })
    }catch(error){
        console.log('failed to start server: ', error.message);
        process.exit(1);
    }
}
startServer();