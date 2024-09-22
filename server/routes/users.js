import express  from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js"
import {verifyToken} from "../middleware/auth.js"

const router = express.Router()

/* READ */
router.get("/:id",verifyToken,getUser);
// when front-end sends a particular id we can grab the id and search the database with that "id" (and get the user)

router.get(":/id/friends",verifyToken,getUserFriends);
// to get the friends of the current user

/* UPDATE */
router.patch(":/id/:friendId",verifyToken,addRemoveFriend);
// so we need the both current user who is logged in and the friend ID who we want to add or delete

export default router;