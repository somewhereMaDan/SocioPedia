import User from "../models/User.js"

/* READ */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    // we're using Promise beacuse we have to make multiple API calls
    const friends = await Promise.all(
      user.friends.map((id) => {
        return User.findById(id);
        // It'll go through the array(friends) and it'll get all the id of the user inside the array and then 
        // it will return all the id's of the users and store it into "friends" (variable{array}), (who wants to see the friend list) 
      })
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastname, occupation, location, picturePath }) => {
        return { _id, firstName, lastname, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

/* UPDATE */

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // if friendId is in the array of the friends (friends - is a array inside user) 
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      // so whatever id inside the friends array which is not equal to friendID (only that friends we'll take otherwise ignore it), that's how friend 
      // array will get updated, and when you click the the friends who's in your list it'll get removed.

      friend.friends = friend.friends.filter((id) => id !== id);
      // like facebook, it'll go inside that friend list that I'm removing and it will check where I'm in the friends list and it'll also remove me from the list
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => {
        return User.findById(id);
        // It'll go through the array(friends) and it'll get all the id of the user inside the array and then 
        // it will return all the id's of the users and store it into "friends" (variable{array}), (who wants to see the friend list) 
      })
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastname, occupation, location, picturePath }) => {
        return { _id, firstName, lastname, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  }
  catch (err) {
    res.status(404).json({ message: err.message });
  }
}