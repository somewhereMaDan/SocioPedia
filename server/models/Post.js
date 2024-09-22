import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    // default when and userId will get into the map the default value would be true, means user liked the post beacuse if the user is there in the map, 
    // it means he liked it or else he would not be in the map
    
    // It's defined as a Map where the keys are expected to be strings (possibly user IDs), and the values are Booleans.
    // if we would have used a Array of String, the time complexity would be O(n) but if we use "Map" we can just get the likes at once no need iterate till the end
    comments: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

const Post = mongoose.model("Post", postSchema);

export default Post;