import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if(!token) return res.status(403).send("Access Denied");

    if(token.startsWith("Bearer ")){
      token = token.slice(7, token.length).trimLeft();
    }
    // The value of the token starts with string "Bearer" so you have to splice the string and take the value after the Beaere

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // process.env is common convention that we have to in order to access a variable from the "env file"
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}