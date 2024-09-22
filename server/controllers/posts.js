import Post from '../models/Post.js'
import User from '../models/User.js'

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath, // this is the user profile picture
      picturePath, // this is the post picturePath
      likes: {},
      comments: []
    })
    await newPost.save();

    const post = await Post.find();
    // this will grab all the post, like after creating a new Post it will get all the post like a "refresh"
    res.status(201).json(post);
    // 201 means something got created
  } catch (err) {
    res.status(409).json({ message: err.message });
    // 409 is a error for creating it
  }
}

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find(); // get all the Post
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// This API will get only the User posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

/* UPDATE */

export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // it'll get the id of the post, which we're gonna like
    const { userId } = req.body;
    const post = await Post.findById(id); // it'll get the json of the Post
    const isLiked = post.likes.get(userId); // if the userId exists in the likes(map) it means the post has been liked by the user

    if (isLiked) {
      post.likes.delete(userId);
      // if the post is already liked then it'll remove the userId from the likes(map)
    } else {
      post.likes.set(userId, true);
      // if it is not liked it'll add it like, key -> userId, value -> true
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    ) // now "updatedPost" will get the updated post (after user like or unlike the post)
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}