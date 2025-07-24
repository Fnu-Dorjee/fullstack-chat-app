

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        return res.status(200).json(filteredUsers);

    }catch(err){
        console.log('error in getUserForSidebar.');
        res.status(500).json({message: 'Something went wrong'});
    }
};

export const getMessage = async (req, res)=>{
    try{
        const{ id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });
        return res.status(200).json(messages);

    }catch(err){
        res.status(500).json({error: "Internal error."});
    }
}

export const sendMessage = async (req, res)=>{
    console.log("REQ.PARAMS:", req.params);  // id from URL
    console.log("REQ.BODY:", req.body);      // text + image
    console.log("REQ.USER:", req.user);      // authenticated user
    try{
        const { text, image } = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image); //Upload image to cloudinary
            imageUrl = uploadResponse.secure_url;
        }
        //creating a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //TO DO real time functionality goes here;
        const receiverSockeId = getReceiverSocketId(receiverId);
        if(receiverSockeId){
            io.to(receiverSockeId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
         
    }catch(err){
        console.log('error in sendMessage in controller');
        res.status(500).json({message:'something went wrong.'});
    }
}