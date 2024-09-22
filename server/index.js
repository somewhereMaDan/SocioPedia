import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/post.js'
import { register } from './controllers/auth.js'
import { verifyToken } from "./middleware/auth.js"
import { createPost } from './controllers/posts.js'
import Post from "./models/Post.js"
import User from "./models/User.js"
import {users, posts} from './data/index.js'

/* CONFIGRATIONS */

const __filename = fileURLToPath(import.meta.url); // so we can grab the file URL
const __dirname = path.dirname(__filename);
// this is only when you use type : module

dotenv.config();
const app = express();
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
// it's gonna stores the images locally insisde the public folder

/* shift + alt + A */

/* FILE STORAGE */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", verifyToken, upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)
// by hitting this route, from there we're use a middleware and upload the picture locally

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6000;
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}, db connected successfully`));

  /* ADD DATA ONE TIME */

  // User.insertMany(users);
  // Post.insertMany(posts);

}).catch((error) => {
  console.log(`${error} did not connect`)
})
