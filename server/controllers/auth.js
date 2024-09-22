import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/* REGISTER USER */

// we're using async beacuse we're calling mongoose database
export const register = async (req, res) => {
  // req -> what we get from the frontend
  // res -> what we'll send to the frontend

  // encrypt the password and we're gonna save it and then after we 
  // save it, and whenever user tries to log in they're gonna provide 
  // the password we're gonna salt that again, and we're gonna make 
  // sure that's the correct one and we're gonna give them a JSONwebToken
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body;

    const salt = await bcrypt.genSalt();
    // it'll wait till it'll create a random salt provided by bcrypt
    // basically it's an encryption and we're gonna use this salt to encrypt our password

    const passwordHash = await bcrypt.hash(password, salt);
    // we're passing the salt and pass it in then it'll hash the password


    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    })
    /* here while creating the newUser we're not storing hashPassword not the real one, and we'll check through that only */
    const savedUser = await newUser.save()
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* LOGGING IN */

export const login = async (req, res) => {
  try {
    const {email, password} = req.body
    
    const user = await User.findOne({email : email})
    // -> here user will have all kind of information the db has
    if(!user) return res.status(400).json({msg : "User does not exist"})

    // The salt is incorporated into the hash (as plaintext). The /* COMAPARE */ function simply pulls the salt out of the hash and then uses it to hash the password and perform the comparison.
    const isMatch = await bcrypt.compare(password,user.password);
    // password -> what user is typing, user.password -> what is there in database 
    if(!isMatch) return res.status(401).json({msg : "Invalid Credentials"})

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
    delete user.password
    // -> and here we'll delete just the password field and then show it as json
    res.status(200).json({token, user})

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}