import { timeStamp } from "console";
import mongoose from "mongoose";
/**
 * 1. Create a Schema
 * 2. Create a model
 */
// Schema() takes multiple objects, first : schema, second : timestamps, 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true,
    },
},
{timestamps: true}
)

const User = mongoose.model('User', userSchema)
export default User