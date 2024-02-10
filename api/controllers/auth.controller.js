import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

/**
 * Summary of signup():
 * 1. safety check for valid fields
 * 2. hashed the password using bcryptjs library to be stored into DB
 * 3. created a User() object to be sent
 * 4. sent request to DB server in trycatch
 */
export const signup = async (req,res, next) => {
    const { username, email, password } = req.body;

    // safety check for valid fields
    if(!username || !email || !password || username === "" || password === "" || email === "" ){
        // return res.status(400).json({message: "All fields are required"})
        next(errorHandler(400, "All fields are required"))
    }

    // hashed the password to be stored into DB
    const hashedPassword = bcryptjs.hashSync(password, 10)
    
    // created a User() object to be sent
    const newUser = User({
        username,
        email,
        password : hashedPassword
    })

    // sent request to DB server in trycatch
    try {
        await newUser.save()
        res.json("Signup successful")
    } catch (error) {
        next(error)
    }
}