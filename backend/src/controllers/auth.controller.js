
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

import { generateWebToken } from "../utils/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async(req, res)=>{
    try{
        const {email, fullName, password}= req.body;
        //basic validation
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required."})
        }

        if(password.length < 6 ){
            res.status(400).send('password must be at least 6 characters long.')
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: 'email already exists.'});

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //creating new user if not exists
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            //generate jwt token 
            generateWebToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            })
        }else{
            res.status(400).json({message: 'Invalid user data.'});
        }

    }catch(err){
        res.status(500).json({message: 'server error during signup', error: err.message});
    }
};


export const login = async(req, res)=>{
    const{email,password} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid credentials."});
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"Invalid credentials."});
        }
        generateWebToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture
        })

    }catch(err){
        console.log("Error in login controller.");
        res.status(500).json({message: 'failed to login.', error: err.message});
    }
};


export const logout =  async(req, res)=>{
    try{
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged out."});

    }catch(err){
        console.log("Error in logout controller.")
        res.status(500).json({message:"Failed to log out", error: err.message});
    }
};


export const updateProfile = async(req, res)=>{
    try{
        const {profilePicture} = req.body;
        const userId = req.user._id;

        if(!profilePicture){
            return res.status(400).json({message:"Profile picture is required."});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findByIdAndUpdate(userId, 
            {profilePicture: uploadResponse.secure_url},
            {new: true}
        );
        return res.status(200).json(updatedUser);
    }catch(err){
        console.error("Error in updateProfile:", err);
        res.status(500).json({ message: 'Something went wrong uploading profile picture.' });
    }
};


export const checkAuth = async(req, res)=>{

    try{
        res.status(200).json(req.user)
    }catch(err){
        console.log('error in checkAuth controller', err.message);
        res.status(500).json({message: 'Internet Server Error.'});
    }

}

