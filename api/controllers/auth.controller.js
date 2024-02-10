import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

/**
 * Summary of signup():
 * 1. safety check for valid fields
 * 2. hashed the password using bcryptjs library to be stored into DB
 * 3. created a User() object to be sent
 * 4. sent request to DB server in trycatch
 */
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // safety check for valid fields
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    // return res.status(400).json({message: "All fields are required"})
    next(errorHandler(400, "All fields are required"));
  }

  // hashed the password to be stored into DB
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // created a User() object to be sent
  const newUser = User({
    username,
    email,
    password: hashedPassword,
  });

  // sent request to DB server in trycatch
  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

/**
 * Summary of signin():
 * 1. safety check for valid fields
 * 2. find the user with given email-id
 * 3. compare entered password with registered password
 * 4. if right credentials : create token
 * 5. return cookie, rest of obj
 */
export const signin = async (req, res, next) => {
    //destructuring obtained email and password
  const { email, password } = req.body;

  //safety check for valid fields
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  // find one/first user having same {email:email} ES6 syntax
  try {
    const validUser = await User.findOne({ email });
    // if email is incorrect (user is not returned)
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    // compares entered password with user registered password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    // as password is right, token is created using _id
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // no need to send password hence removing it from obtained validUser obj
    // and collecting all other properties using rest operator
    const { password: pass, ...rest } = validUser._doc;

    // creating cookie() to preserve user session until browser keeps running
    // returns rest instead of validUser
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
