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
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
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

/**
 * Summary of google():
 * 1. extracting email, name and googlePhotoUrl from request body
 * 2. find the user with same email
 * 3. if it exists, create a token, generate and send a cookie with rest obj
 * 4. if it doesn't exist, means user needs to be signed up first:
 * - generating password : to include 0-9 + A-Z by concatenating two strings
 * - creating new user by generating username, keeping email same, 
 * - providing generated password and passing profile picture from google
 * 5. if success, return cookie, rest of obj
 */
export const google = async (req, res, next) => {
  // destructured email, name and googlePhotoUrl
  const { email, name, googlePhotoUrl } = req.body;

  // find a user in DB with same email
  // if it exists, create a token, generate and send a cookie with rest obj
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin},
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {

      // generating password to include 0-9 + A-Z by concatenating two strings
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
        // hashing this generated password 
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      // creating new user by generating username, keeping email same, 
      // providing generated password and passing profile picture from google
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // saving new user in DB
      await newUser.save();

      // create a token, generate and send a cookie with rest obj
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin},
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
