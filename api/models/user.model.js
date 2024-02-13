import mongoose from "mongoose";
/**
 * 1. Create a Schema
 * 2. Create a model
 */
// Schema() takes multiple objects, first : schema, second : timestamps,
// model() takes name of model and name of schema.

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    // not accessible from UI, done manually
    isAdmin:{
      type: Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
