import http from 'http';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require("cors");
const CircularJSON = require('circular-json');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const fetch = require('node-fetch');
const Stripe = require('stripe');
require('dotenv').config();  // Load environment variables from a .env file

// Create a server object on versel 
const server = http.createServer((req, res) => {
  // Set the response header
  res.writeHead(200, {'Content-Type': 'text/plain'});
  // Write some text to the response
  res.end('Welcome to esmapp server !');
});

// Use the port specified in the environment variables, or default to 5000
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());



// admin conversion details
// Default amount in dinar
const DINAR_AMOUNT = 10000;
const KWD_TO_GHS_RATE = 145579.4752; // Derived from 500 KWD to 23,237.60000 GHS

// ====================================== EXCHANGE RATE ===============================
const getConversionRate = () => {
  return KWD_TO_GHS_RATE;
};

// // Example usage:
// console.log(formatAmount(300017));
const formatAmount = (amount) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
};

// new one
app.post('/addPoints/:adminId', async (req, res) => {
  const { adminId } = req.params;
  const DINAR_AMOUNT = 10000; // Example amount in dinar to convert

  try {
    const conversionRate = getConversionRate();

    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).send('Admin user not found');
    }

    console.log('Existing admin points:', formatAmount(adminUser.points || 0));

    adminUser.points = adminUser.points || 0;

    const cedisAmount = DINAR_AMOUNT * conversionRate;
    adminUser.points += cedisAmount;
    adminUser.adminNewPoints = adminUser.points;

    console.log('Updated admin points:', formatAmount(adminUser.points));

    const formattedCedisAmount = formatAmount(cedisAmount);
    const formattedAdminPoints = formatAmount(adminUser.points);

    console.log('Formatted cedi amount:', formattedCedisAmount);
    console.log('Formatted admin points:', formattedAdminPoints);

    // Update formatted points and paystack balance
    adminUser.adminNewPointsFormatted = formattedAdminPoints;
    adminUser.paystackbalance = parseFloat(formattedAdminPoints.replace(/,/g, ''));

    await adminUser.save();

    res.json({
      adminId,
      dinarAmount: DINAR_AMOUNT,
      cedisAmount: formattedCedisAmount,
      adminPoints: formattedAdminPoints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Schedule the task to run every 1 minutes using node-cron
cron.schedule('*/1 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/5 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/10 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/15 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/20 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/25 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/30 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/35 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/40 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/45 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/50 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/55 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

cron.schedule('*/60 * * * *', async () => {
  await addPointsToAdmin();
  console.log('Scheduled task executed.');
});

// five munites api
// Function to add 50 dinar to the admin points
const addPointsToAdmin = async () => {
  const adminId = '665aba85e51c1486bf2d7c54';

  try {
    const conversionRate = getConversionRate(); // Assuming you have a function to get the conversion rate
    const DINAR_AMOUNT = 10000; // Example amount in dinar to convert

    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }

    console.log('Existing admin points:', adminUser.points);

    adminUser.points = adminUser.points || 0;

    const cedisAmount = DINAR_AMOUNT * conversionRate;

    adminUser.points += cedisAmount;

    console.log('Updated admin points:', adminUser.points);

    // Format the points to match the desired format
    const formattedPoints = adminUser.points.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });

    // Update the formatted points
    adminUser.adminNewPointsFormatted = formattedPoints;

    // Replace paystackbalance with the new formatted points
    adminUser.paystackbalance = parseFloat(adminUser.adminNewPointsFormatted.replace(/,/g, ''));

    await adminUser.save();

    const formattedCedisAmount = formatAmount(cedisAmount);
    const formattedAdminPoints = formatAmount(adminUser.points);

    console.log('Automatic update: 500 dinar converted to', formattedCedisAmount, 'Ghana cedis.');
    console.log('Admin new Earnings:', formattedAdminPoints);
    console.log('Admin new Points Formatted:', adminUser.adminNewPointsFormatted);
    console.log('Paystack balance updated:', adminUser.paystackbalance);
  } catch (error) {
    console.error('Error in automatic update:', error);
  }
};




// MongoDB setup
const JWT_SECREATE='djgyufijhgfjkg789040rjflfl;logdbvvffeekmeknkji4.[opypkjj764kgg[]kk'
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Sammy:7eDEKLgFEPZq5aRR@contactkeeper.a2urz.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // Adjust according to your needs
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));


// Middleware to parse JSON bodies
app.use(express.json());
// ///========================================= POST SECTION //////////////////////////////////////
// Define the sub-schema for comments
const commentSchema = new mongoose.Schema({
  // username: String,
  comment: String,
  profilePicture: String,
  username:String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// following schema
const followingSchema = new mongoose.Schema({
  profilePicture: String,
  userName: String,
  userId: String,
  postuserName:String,
  postprofilePicture:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// shared schema
const shareSchema = new mongoose.Schema({
  profilePicture: String,
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// followers schema
const followersSchema = new mongoose.Schema({
  profilePicture: String,
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// viewsschma
const postviewsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  profilePicture: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
// cartCountSchema for likes
const cartCountSchema = new mongoose.Schema({
  profilePicture: String,
  addedToCart: { type: Boolean, default: false },
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//favoriteCountSchema for saves post
const favoriteCountSchema = new mongoose.Schema({
  profilePicture: String,
  save: { type: Boolean, default: false },
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// for images
const imageSchema = new mongoose.Schema({
  profilePicture: String,
  save: { type: Boolean, default: false },
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// Define the main schema for posts
const postSchema = new mongoose.Schema({
  username: String,
  comment: String,
  chatComment: String,
  following: [followingSchema],
  share: [shareSchema],
  followers: [followersSchema],
  profilePicture: String,
  image: [String],
  videoUri: [String],
  status: {
    type: String,
    enum: ['new', 'view'],
    default: 'new'
  },
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  views: [postviewsSchema],
  cartCount: [cartCountSchema],
  favoriteCount:  [favoriteCountSchema],
  chat: [commentSchema] // Add the chat field as an array of comments
});

// Define a model based on the schema
const Post = mongoose.model('Post', postSchema);


// Endpoint to handle POST requests from React Native app
app.post('/api/posts', async (req, res) => {
  try {
    const { username, comment, image, videoUri,profilePicture,userId,views,cartCount,favoriteCount,chat,following,followers,share } = req.body;

    // Create a new Post document
    const newPost = new Post({
      userId,
      username,
      comment,
      image,
      videoUri,
      profilePicture,
      views:views,
      cartCount,
      favoriteCount,
      chat,
      following,
      followers,
      share
    });

    // Save the new post to the database
    await newPost.save();

    // Send a success response
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// fetching for the post base on time of post
app.get('/api/posts', async (req, res) => {
  try {
    // Fetch all posts from the database and sort them by descending order of creation date and username
    const posts = await Post.find().sort({ createdAt: -1, username: 1 });

    // Send the fetched posts as the response
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// for the user that posted
app.get('/api/posts/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching posts for userId:', userId); // Log userId

    // Fetch posts by userId
    const posts = await Post.find({ userId });

    // Send the fetched posts as the response
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts by user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint using to fetch for video 
// Backend route to fetch posts where videoUri is not empty
// Backend route to fetch posts where videoUri is not empty and filter by userId
app.get('/api/posts/videos', async (req, res) => {
  try {
    const { userId } = req.query;
    // Construct query to find posts with videoUri not empty and matching userId if provided
    const query = userId ? { userId, videoUri: { $ne: null, $ne: '' } } : { videoUri: { $ne: null, $ne: '' } };

    // Fetch posts based on the constructed query
    const posts = await Post.find(query).select('userId title videoUri');

    // Send the fetched posts as the response
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts with videoUri and userId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// assigning 50 dollars to admin per a single click ==================

// i will us this to fetch for post made by a single user  
// fetching for post base on postId
app.get('/api/posts/details/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    console.log('Fetching post details for postId:', postId);

    // Fetch post by postId
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Send the fetched post as the response
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Backend route to handle incrementing post views
app.post('/api/posts/:postId/views', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { viewer } = req.body;

    // Log the received data
    console.log('Received postId:', postId);
    console.log('Received viewer:', viewer);

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Validate the viewer object
    if (!viewer || !viewer.userName || !viewer.profilePicture) {
      return res.status(400).json({ message: 'Invalid viewer details' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if viewer already exists in views
    const viewerExists = post.views.some(
      v => v.userName === viewer.userName && v.profilePicture === viewer.profilePicture
    );

    if (!viewerExists) {
      // Add viewer to views
      post.views.push({
        profilePicture: viewer.profilePicture,
        userName: viewer.userName,
        createdAt: new Date()
      });
    }

    // Save the updated post
    await post.save();

    // Send success response
    res.status(200).json({ message: 'View status and viewer details updated successfully' });
  } catch (error) {
    console.error('Error updating view status and viewer details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Example: GET /api/posts/:postId/favoriteCount saving a video
app.get('/api/posts/:postId/favoriteCount', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('favoriteCount');
    res.json({ favoriteCount: post.favoriteCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post favoriteCount' });
  }
});


// Example: GET /api/posts/:postId/cartCount liking a video
app.get('/api/posts/:postId/cartCount', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('cartCount');
    res.json({ cartCount: post.cartCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post cartCount' });
  }
});


// this is specially for the total number of view for each post at post container
app.get('/api/posts/:postId/views', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post in the database
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the viewers array as the response
    res.status(200).json({ views: post.views });
  } catch (error) {
    console.error('Error fetching post viewers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update user points
app.post('/api/user/:userId/points', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { pointsToAdd, favsave } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update points based on favsave flag
    if (favsave) {
      user.points += pointsToAdd;
    } else {
      user.points -= pointsToAdd;
    }

    // Save the updated user
    await user.save();
    res.status(200).json({ message: 'Points updated successfully', points: user.points });
  } catch (error) {
    console.error('Error updating user points:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update post views
app.post('/api/posts/:postId/views', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { viewer } = req.body;

    // Validate postId and viewer object
    if (!mongoose.Types.ObjectId.isValid(postId) || !viewer || !viewer.userName || !viewer.profilePicture) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if viewer already exists in views
    const viewerExists = post.views.some(v => v.userName === viewer.userName && v.profilePicture === viewer.profilePicture);

    if (!viewerExists) {
      // Add viewer to views
      post.views.push({
        profilePicture: viewer.profilePicture,
        userName: viewer.userName,
        createdAt: new Date()
      });
    }

    // Save the updated post
    await post.save();
    res.status(200).json({ message: 'View status and viewer details updated successfully' });
  } catch (error) {
    console.error('Error updating view status and viewer details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Backend - Endpoint to handle updating cartcount  or liking a post
app.post('/api/posts/:postId/cartCount', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { isAddedToCart, viewer } = req.body;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Validate the viewer object
    if (!viewer || !viewer.userName || !viewer.profilePicture) {
      return res.status(400).json({ message: 'Invalid viewer details' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (isAddedToCart) {
      // Check if viewer already exists
      const viewerExists = post.cartCount.some(
        v => v.userName === viewer.userName && v.profilePicture === viewer.profilePicture
      );

      if (!viewerExists) {
        post.cartCount.push({
          profilePicture: viewer.profilePicture,
          addedToCart: isAddedToCart,
          userName: viewer.userName,
          createdAt: new Date()
        });
      }
    } else {
      // Remove the viewer from cartCount
      post.cartCount = post.cartCount.filter(
        v => v.userName !== viewer.userName || v.profilePicture !== viewer.profilePicture
      );
    }

    // Save the updated post
    await post.save();

    // Send success response
    res.status(200).json({ message: 'Cart status and viewer details updated successfully' });
  } catch (error) {
    console.error('Error updating cart status and viewer details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Backend - Endpoint to handle updating  favourite or saving a post
// Update favorite count for a post
app.post('/api/posts/:postId/favoriteCount', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { favsave, viewer } = req.body;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Validate the viewer object
    if (!viewer || !viewer.userName || !viewer.profilePicture) {
      return res.status(400).json({ message: 'Invalid viewer details' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (favsave) {
      // Check if viewer already exists
      const viewerExists = post.favoriteCount.some(
        v => v.userName === viewer.userName && v.profilePicture === viewer.profilePicture
      );

      if (!viewerExists) {
        post.favoriteCount.push({
          profilePicture: viewer.profilePicture,
          userName: viewer.userName,
          createdAt: new Date()
        });
      }
    } else {
      // Remove the viewer from favoriteCount
      post.favoriteCount = post.favoriteCount.filter(
        v => v.userName !== viewer.userName || v.profilePicture !== viewer.profilePicture
      );
    }

    // Save the updated post
    await post.save();

    // Send success response
    res.status(200).json({ message: 'Favorite status updated successfully', favoriteCount: post.favoriteCount.length });
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Backend - Endpoint to handle updating  views status
app.post('/api/posts/:postId/views', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { viewer } = req.body;

    // Log the received data
    console.log('Received postId:', postId);
    console.log('Received viewer:', viewer);

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Validate the viewer object
    if (!viewer || !viewer.userName || !viewer.profilePicture) {
      return res.status(400).json({ message: 'Invalid viewer details' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if viewer already exists in views
    const viewerExists = post.views.some(
      v => v.userName === viewer.userName && v.profilePicture === viewer.profilePicture
    );

    if (!viewerExists) {
      // Add viewer to views
      post.views.push({
        profilePicture: viewer.profilePicture,
        userName: viewer.userName,
        createdAt: new Date()
      });
    }

    // Save the updated post
    await post.save();

    // Send success response
    res.status(200).json({ message: 'View status and viewer details updated successfully' });
  } catch (error) {
    console.error('Error updating view status and viewer details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Backend - Endpoint to handle updating  following status
// endpoint for undating following
// Backend route to handle follow/unfollow actions
// Backend route to handle follow/unfollow actions
// Backend route to handle follow/unfollow actions
// Backend route to handle following own post
app.post('/api/posts/:postId/following', async (req, res) => {
  try {
    const { follow, follower } = req.body;
    const { userId, userName, profilePicture, postuserName, postprofilePicture } = follower;

    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'Invalid follower details' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (follow) {
      const alreadyFollowing = post.following.some(f => f.userId === userId);
      if (!alreadyFollowing) {
        post.following.push({
          profilePicture,
          userName,
          userId,
          postuserName,
          postprofilePicture,
          createdAt: new Date()
        });
      }
    } else {
      post.following = post.following.filter(f => f.userId !== userId);
    }

    await post.save();

    res.status(200).json({ message: 'Following updated successfully', following: post.following });
  } catch (error) {
    console.error('Error updating follow status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Backend route to fetch for post by post id
app.get('/api/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postData = {
      ...post.toObject(),
      userName: post.userName,  // Ensure userName is included
      profilePicture: post.profilePicture,  // Ensure profilePicture is included  
      userId: post.userId  // Ensure userId is included
    };

    res.status(200).json(postData);
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // Backend - Endpoint to handle updating  followers status
app.post('/api/posts/:postId/followers', async (req, res) => {
  try {
    const { follow, follower } = req.body;
    const { userId, userName, profilePicture, postuserName, postprofilePicture } = follower;

    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    if (!userId || !userName || !profilePicture || !postuserName || !postprofilePicture) {
      return res.status(400).json({ message: 'Invalid follower details' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId === userId) {
      return res.status(400).json({ message: "You can't follow your own post" });
    }

    if (follow) {
      const alreadyFollowing = post.following.some(f => f.userId === userId);
      if (!alreadyFollowing) {
        post.following.push({
          profilePicture,
          userName,
          userId,
          postuserName,
          postprofilePicture,
          createdAt: new Date()
        });
      }
    } else {
      post.following = post.following.filter(f => f.userId !== userId);
    }

    await post.save();

    res.status(200).json({ message: 'Following updated successfully', following: post.following });
  } catch (error) {
    console.error('Error updating follow status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint for sendion chat to the database
app.post('/api/posts/:postId/chat', async (req, res) => {
  try {
    const { postId } = req.params;
    const { 
      username,
       comment, 
       image, 
       videoUri, 
       profilePicture, 
       userId
       } = req.body;

    // Check if userId is a valid ObjectId
if (!mongoose.Types.ObjectId.isValid(postId)) {
  return res.status(400).json({ message: 'Invalid postId' });
}

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create a new chat message
    const newChatMessage = {
      username,
      comment,
      image,
      videoUri,
      profilePicture,
      userId,
      createdAt: new Date(),
    };

    // Add the new chat message to the chat array
    post.chat.push(newChatMessage);

    // Save the updated post
    await post.save();

    // Send a success response
    res.status(201).json({ message: 'Chat message added successfully' });
  } catch (error) {
    console.error('Error adding chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// endpoint of fetching for the chat from the post collection
app.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid postId' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Sort chat messages in descending order based on timestamp
    const sortedChat = post.chat.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json({ chat: sortedChat });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint to following-status
app.get('/api/posts/:postId/following-status', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userName } = req.query; // Assuming the userName is passed as a query parameter

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has followers and if the user is following
    const isFollowing = post.followers && post.followers.some(f => f.userName === userName);

    // Send the follow status
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Error fetching follow status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint for sharing
app.post('/api/posts/:postId/share', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure sharedBy array exists
    post.sharedBy = post.sharedBy || [];

    // Check if the user has already shared the post
    if (post.sharedBy.includes(userId)) {
      return res.status(400).json({ message: 'User has already shared this post' });
    }

    // Update the share count and sharedBy array
    post.shareCount = (post.shareCount || 0) + 1;
    post.sharedBy.push(userId);
    await post.save();

    // Send success response
    res.status(200).json({ message: 'Share updated successfully', shareCount: post.shareCount, sharedBy: post.sharedBy });
  } catch (error) {
    console.error('Error updating share status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








// Define a schema for the registration data
// const { Schema } = mongoose; // Import Schema from mongoose
const usercommentSchema = new mongoose.Schema({
  // username: String,
  comment: String,
  profilePicture: String,
  username:String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// following schema
const userfollowingSchema = new mongoose.Schema({
  profilePicture: String,
  // isFollowing: { type: Boolean, default: false },
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// shared schema
const usershareSchema = new mongoose.Schema({
  profilePicture: String,
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// followers schema
const userfollowersSchema = new mongoose.Schema({
  profilePicture: String,
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// viewsschma
const userviewsSchema = new mongoose.Schema({
  profilePicture: String,
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// cartCountSchema for likes
const usercartCountSchema = new mongoose.Schema({
  profilePicture: String,
  addedToCart: { type: Boolean, default: false },
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//favoriteCountSchema for saves post
const userfavoriteCountSchema = new mongoose.Schema({
  profilePicture: String,
  favsave: { type: Boolean, default: false },
  userName:String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: false
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
    unique: true // if phone numbers should be unique
  },
  profilePicture: {
    type: String,
  },
  dob: {
    type:  String,
  },
  sex: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    default: 0 // Optional: set a default value for points
  },
  adminNewPoints: {
    type: Number,
    default: 0 // Optional: set a default value for points
  },
  paystackbalance: {
    type: Number,
    default: 0 // Optional: set a default value for points
  },
  paystackfetchbalance: {
    type: Number,
    default: 0 // Optional: set a default value for points
  },
  paystackCustomerId: {
    type: Number,
    default: 0 // Optional: set a default value for points
  },
  // adminNewPointsFormatted: { type: Number }
  adminNewPointsFormatted: { type: String },
  views: [userviewsSchema],
  cartCount: [usercartCountSchema],
  favoriteCount:  [userfavoriteCountSchema],
  chat: [usercommentSchema], // Add the chat field as an array of comments
  following: [userfollowingSchema],
  share: [usershareSchema],
  followers: [userfollowersSchema],
}, {
  collection: "SBWDESMAPP"
});

// Create a model based on the schema
const User = mongoose.model('SBWDESMAPP', userSchema);

// Route for user registration
app.post('/register', async (req, res) => {
  const { userName, email, password, phoneNumber, profilePicture, dob, sex, points,adminNewPoints,adminNewPointsFormatted,paystackbalance,paystackCustomerId,paystackfetchbalance,views,cartCount,following,favoriteCount,chat,share,followers } = req.body;

  // Log the received data
  console.log('Received data:', req.body);

  // Hash the password
const encrypetedPassword = await bcrypt.hash(password, 10)

  // Basic validation
  if (!userName || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = new User({
      userName,
      email,
      password: encrypetedPassword,
      // password: password,
      phoneNumber,
      profilePicture,
      dob,
      sex,
      points,
      adminNewPoints,
      adminNewPointsFormatted,
      paystackbalance,
      paystackfetchbalance,
      paystackCustomerId,
      views,
      cartCount,
      following,
      favoriteCount,
      chat,
      following,
      share,
      followers
    });

    const savedUser = await newUser.save();
    res.status(200).json({ status: 'ok', userId: savedUser._id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// route to fetch for the newly registered user by id
app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// route to update user profilePicture
app.post('/user/:userId/profilePicture', async (req, res) => {
  const userId = req.params.userId;
  const { profilePicture } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = profilePicture;
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login route
app.post('/login-user', async (req, res) => {
  const { userName, password } = req.body;

  try {
    console.log(`Received login attempt for username: ${userName}`);

    // Find the user by username
    const oldUser = await User.findOne({ userName });
    console.log(`User found: ${JSON.stringify(oldUser)}`);

    if (!oldUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Compare the password
    const isPasswordMatch = await bcrypt.compare(password, oldUser.password);
    console.log(`Password match: ${isPasswordMatch}`);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign({ email: oldUser.email }, 'YOUR_JWT_SECRET');

    return res.status(200).json({ status: 'ok', data: { token, userId: oldUser._id } });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// route for reset-password
app.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    console.log(`Received password reset request for username: ${username}`);

    // Find the user by username
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log('Password reset successfully');
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// -------------------- STORY POST SECTION =====================
// schema for viewstory
const { Schema } = mongoose; // Import Schema from mongoose
const viewerSchema = new Schema({
  userName: {
    type: String,
    required: false, // Not mandatory
    sparse: true, // Allow null values
  },
  profilePicture: String,
});

// for sharing view post
const sharerSchema = new Schema({
  profilePicture: String,
});


const storySchema = new mongoose.Schema({
  username: String,
  comment: String,
  profilePicture: String,
  images: [String],
  videos: [String],
  userId: String,
  viewers: [viewerSchema],
  shares: [sharerSchema],
  status: {
    type: String,
    enum: ['new', 'view'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define a model based on the schema
const Story = mongoose.model('StoriesPost', storySchema);


app.post('/api/stories-post', async (req, res) => {
  try {
    const { username, comment, images, videos, profilePicture, userId,viewers,shares } = req.body;

    // Create a new Story document
    const newStory = new Story({
      username,
      comment,
      images, // Array of image URIs
      videos, // Array of video URIs
      profilePicture,
      userId,
      viewers,
      shares
    });

    // Save the new Story to the database
    await newStory.save();

    // Send a success response
    res.status(201).json({ message: 'Story Post created successfully' });
  } catch (error) {
    console.error('Error creating Story post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// for sharing selected story post
app.post('/api/share-story', async (req, res) => {
  try {
    const { storyId, sharer } = req.body;

    if (!sharer.profilePicture) {
      return res.status(400).json({ error: 'Sharer profile picture is required' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const sharerExists = story.shares.some(existingSharer => existingSharer.profilePicture === sharer.profilePicture);

    if (!sharerExists) {
      story.shares.push(sharer);
      await story.save();
    }

    res.status(200).json({ message: 'Story shared successfully', shares: story.shares });
  } catch (error) {
    console.error('Error sharing story:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// for viwing selected story post
app.post('/api/view-story', async (req, res) => {
  try {
    const { storyId, viewer } = req.body;

    if (!viewer.profilePicture) {
      return res.status(400).json({ error: 'Viewer profile picture is required' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const viewerExists = story.viewers.some(existingViewer => existingViewer.profilePicture === viewer.profilePicture);

    if (!viewerExists) {
      story.viewers.push(viewer);
      await story.save();
    }

    res.status(200).json({ message: 'Viewer added successfully', viewers: story.viewers });
  } catch (error) {
    console.error('Error adding viewer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// fetching for all story post from the dayabase
app.get('/api/stories-post-all', async (req, res) => {
  try {
    // Fetch all posts from the database and sort them by createdAt in descending order
    const stories = await Story.find().sort({ createdAt: -1 });

    // Send the fetched posts as the response
    res.status(200).json(stories);
  } catch (error) {
    console.error('Error fetching Story posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// api for fetching for all  story post per user
app.get('/api/stories-post/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch posts from the database for the specified userId and sort them
    const stories = await Story.find({ userId }).sort({ createdAt: -1, username: 1 });

    // Send the fetched posts as the response
    res.status(200).json(stories);
  } catch (error) {
    console.error('Error fetching Story posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// end point for users points
const Point = mongoose.model('Point', {
  userId: String,
  points: Number,
});

// Route to convert points to cash
app.post('/convert', async (req, res) => {
  const { userId, points } = req.body;

  try {
    // Retrieve user's points
    const userPoints = await Point.findOne({ userId });

    if (!userPoints) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough points to convert
    if (userPoints.points < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Perform conversion (Replace this with your actual conversion logic)
    const cashAmount = points * 0.01; // 1 point = $0.01 (for example)

    // Deduct points from user's balance
    userPoints.points -= points;
    await userPoints.save();

    // Return converted cash amount
    return res.json({ cashAmount });
  } catch (error) {
    console.error('Error converting points to cash:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// --------- MODE OF PAYMENTS --------------------------------------------
// Replace with your actual Paystack secret key
// const PAYSTACK_SECRET_KEY = 'sk_test_cdbd8097a94fa5da83aa8c30e85823a4bac8b5bd';

app.post('/withdraw', async (req, res) => {
  const { amount, method, bankName, accountNumber, accountHolder, mobileProvider, phoneNumber } = req.body;

  // Validate the input
  if (!amount || amount <= 0 || !method || (method === 'bank' && (!bankName || !accountNumber || !accountHolder)) || (method === 'mobile' && (!mobileProvider || !phoneNumber || !accountHolder))) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  // // Convert amount to pesewas (since Paystack uses pesewas for GHS transactions)
  const amountInPesewas = amount * 100;

  try {
    let response;

    if (method === 'bank') {
      // Make API request to Paystack to initiate bank transfer
      response = await axios.post('https://api.paystack.co/transfer', {
        source: 'balance',
        amount: amountInKobo,
        recipient: {
          type: 'nuban',
          name: accountHolder,
          account_number: accountNumber,
          bank_code: '044', // Replace with actual bank code
          currency: 'GHS',
        },
      }, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    } else if (method === 'mobile') {
      // Handle mobile money withdrawal if supported by Paystack
      // Note: Paystack doesn't support mobile money directly, you might need to use another provider
      response = await axios.post('https://api.paystack.co/transfer', {
        source: 'balance',
        amount: amountInKobo,
        recipient: {
          type: 'mobile_money',
          name: accountHolder,
          phone: phoneNumber,
          provider: mobileProvider,
          currency: 'GHS',
        },
      }, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (response.data.status) {
      res.status(200).json({ message: 'Withdrawal request processed successfully' });
    } else {
      res.status(500).json({ message: 'Withdrawal processing failed', error: response.data.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Withdrawal processing failed', error: error.message });
  }
});


// ==============deposite and withdrawer endpoints ===============================
// Define Schema and Model
const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  phoneNumbers: String,
  phoneNumber: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  },
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API Endpoints for deposite
app.post('/deposit', async (req, res) => {
  const { amount, phoneNumbers, userId  } = req.body; // Include phoneNumbers and country in the request body
  try {
    const newTransaction = new Transaction({ type: 'Deposit', amount, phoneNumbers, user: userId }); // Include phoneNumbers and country in the Transaction model
    const transaction = await newTransaction.save();
    res.status(200).send(transaction);
  } catch (err) {
    res.status(500).send(err);
  }
});


// API Endpoints for withdraw
app.post('/withdraw', async (req, res) => {
  const { amount, phoneNumbers } = req.body;
  try {
    const newTransaction = new Transaction({ type: 'Withdraw', amount, phoneNumbers });
    const transaction = await newTransaction.save();
    res.status(200).send(transaction);
  } catch (err) {
    res.status(500).send(err);
  }
});

// endpoint for getting your balance
app.get('/balance', async (req, res) => {
  try {
    const deposits = await Transaction.aggregate([
      { $match: { type: 'Deposit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const withdrawals = await Transaction.aggregate([
      { $match: { type: 'Withdraw' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalDeposit = deposits.length ? deposits[0].total : 0;
    const totalWithdraw = withdrawals.length ? withdrawals[0].total : 0;
    const balance = totalDeposit - totalWithdraw;

    res.status(200).send({ balance, totalDeposit });
  } catch (err) {
    res.status(500).send(err);
  }
});

// endppint api for fetching for the admin details
app.get('/adminDetails/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).send('Admin user not found');
    }

    res.json(adminUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//============ final payout settings==================================================
let userDetails = {
  paypal: {},
  payoneer: {},
  mobileMoney: {},
  paystack: {},
};

// Request payout to PayPal
app.post('/request-payout/paypal', async (req, res) => {
  const { amount, currency, adminId,paypalEmail } = req.body;

  if (!paypalEmail) {
    return res.status(400).json({ status: 'error', message: 'PayPal email not found' });
  }
  if (!adminId) {
    return res.status(400).json({ status: 'error', message: 'adminId not found' });
  }

  try {
    const response = await axios.post('https://api-m.sandbox.paypal.com/v1/payments/payouts', {
      sender_batch_header: {
        email_subject: 'You have a payout!',
        email_message: 'You have received a payout! Thanks for using our service!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: amount,
            currency: currency,
          },
          receiver: paypalEmail,
          note: 'Thanks for your patronage!',
          sender_item_id: 'item_1',
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer A21AALpmuEWnFM5L-9pnbGFMXXdzepwxXGNLkXj2R4JyDl566Qxs2DZuigKgG7SX_uoKDxubi_5YtRhaJsb-ynSUOVq3o0IEQ`,
      },
    });

    res.status(200).json({ status: 'success', payout_response: response.data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Payout failed', error: error.message });
  }
});

// ==================================================================================================================
// endpoint for depositing the money into my paystack account
app.post('/save-mobile-money-details-deposite', async (req, res) => {
  const { mobileNumber, provider, amount, currency } = req.body;

  // Logging incoming request data
  console.log('Received mobile money details:', req.body);

  // Find the bank code for the provider
  const bankCode = bankCodes[provider];

  // Validate required details
  if (!mobileNumber || !provider || !amount || !currency || !bankCode) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    // Deposit the amount into your Paystack balance
    console.log('Depositing amount into Paystack balance...');
    const depositResponse = await axios.post('https://api.paystack.co/transaction/initialize ', {
      source: 'mobile_money', // Use appropriate source
      amount: amount * 100, // Paystack uses the smallest currency unit
      reason: 'Deposit for services rendered',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`, // Replace with your Paystack secret key
      },
    });

    console.log('Deposit successful:', depositResponse.data);
    res.status(200).json({ status: 'success', deposit_response: depositResponse.data });
  } catch (error) {
    console.error('Error depositing amount:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Deposit failed', error: error.response ? error.response.data : error.message });
  }
});

// transfer bulk to paystack
app.post('/save-mobile-money-details-deposite', async (req, res) => {
  const { mobileNumber, provider, amount, currency } = req.body;

  // Logging incoming request data
  console.log('Received mobile money details:', req.body);

  // Find the bank code for the provider
  const bankCode = bankCodes[provider];

  // Validate required details
  if (!mobileNumber || !provider || !amount || !currency || !bankCode) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    console.log('Depositing amount into Paystack balance...');
    const depositResponse = await axios.post('https://api.paystack.co/transfer/bulk', {
      transfers: [
        {
          amount: amount * 100, // Paystack uses the smallest currency unit
          recipient: '1217647', // Replace with your actual Paystack account ID
          reason: 'Deposit for services rendered',
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`, // Replace with your Paystack secret key
      },
    });

    console.log('Deposit successful:', depositResponse.data);
    res.status(200).json({ status: 'success', deposit_response: depositResponse.data });
  } catch (error) {
    console.error('Error depositing amount:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Deposit failed', error: error.response ? error.response.data : error.message });
  }
});

// transfer to paystack
app.post('/transfer-to-paystack', async (req, res) => {
  const { mobileNumber, provider, amount, currency, adminId } = req.body;

  // Logging incoming request data
  console.log('Received transfer request:', req.body);

  // Find the bank code for the provider
  const bankCode = bankCodes[provider];

  // Validate required details
  if (!mobileNumber || !provider || !amount || !currency || !bankCode) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    // Fetch the admin user from the database
    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).send('Admin user not found');
    }

    if (adminUser.points < amount) {
      return res.status(400).send('Insufficient points');
    }

    // Deduct the amount from admin points
    adminUser.points -= amount;
    await adminUser.save();

    console.log('Admin points after deduction:', adminUser.points);

    console.log('Creating transfer recipient...');
    const recipientResponse = await axios.post('https://api.paystack.co/transferrecipient', {
      type: 'mobile_money',
      name: 'Samuel Kwaku Dompson', // Replace with actual recipient name
      phone: mobileNumber,
      provider: provider,
      currency: currency,
      account_number: mobileNumber,
      bank_code: bankCode
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`, // Replace with your Paystack secret key
      },
    });

    console.log('Transfer recipient created:', recipientResponse.data);

    const recipientCode = recipientResponse.data.data.recipient_code;

    console.log('Initiating transfer...');
    const transferResponse = await axios.post('https://api.paystack.co/transfer', {
      source: 'balance',
      amount: amount * 100, // Paystack uses the smallest currency unit
      recipient: recipientCode,
      reason: 'Payout for services rendered',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`, // Replace with your Paystack secret key
      },
    });

    console.log('Transfer initiated:', transferResponse.data);
    res.status(200).json({ status: 'success', newAdminPoints: adminUser.points, transfer_response: transferResponse.data });
  } catch (error) {
    console.error('Error initiating transfer:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Transfer failed', error: error.response ? error.response.data : error.message });
  }
});

// handling the opt for succesfully transfering the amounts
app.post('/verify-transfer-otp', async (req, res) => {
  const { transferCode, otp } = req.body;

  try {
    console.log('Verifying OTP...');
    const otpResponse = await axios.post('https://api.paystack.co/transfer/finalize_transfer', {
      transfer_code: transferCode,
      otp: otp
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`, // Replace with your Paystack secret key
      },
    });

    console.log('OTP verification successful:', otpResponse.data);
    res.status(200).json({ status: 'success', message: 'Transfer completed successfully', data: otpResponse.data });
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'OTP verification failed', error: error.response ? error.response.data : error.message });
  }
});


// =====================================================================================================================================================================

// Route to handle payout
app.post('/api/payout/paypal', async (req, res) => {
  const { accessToken, payeeEmail, amount, currency } = req.body;
  try {
    const response = await axios.post('https://api.paypal.com/v1/payments/payouts', {
      sender_batch_header: {
        sender_batch_id: `batch_${Date.now()}`,
        email_subject: "You have a payout!"
      },
      items: [{
        recipient_type: "EMAIL",
        amount: {
          value: amount,
          currency: currency
        },
        receiver: payeeEmail,
        note: "Thank you for your service!",
        sender_item_id: `item_${Date.now()}`
      }]
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    res.json({ success: true, payoutBatchId: response.data.batch_header.payout_batch_id });
  } catch (error) {
    console.error('Payout error:', error);
    res.status(500).json({ error: 'Payout failed' });
  }
});


// executing the payments
app.post('/execute-payment', async (req, res) => {
  const { paymentId, payerId, adminId } = req.body;

  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${PAYPAL_API}/v1/payments/payment/${paymentId}/execute`, {
      payer_id: payerId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // Optionally, update your application balance here based on the response

    res.json({ status: 'success', payment: response.data });
  } catch (error) {
    console.error('Error executing PayPal payment:', error);
    res.status(500).json({ status: 'error', message: 'Payment execution failed', error: error.message });
  }
}); 

// =============================== ENDING =================================================================

//============= MOBILE MONEY PAYOUT=================================================
app.post('/request-payout/mobile-money', async (req, res) => {
  const { amount, currency, adminId, mobileNumber, provider } = req.body;

  try {
    // Fetch the admin user from the database
    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).send('Admin user not found');
    }

    if (adminUser.points < amount) {
      return res.status(400).send('Insufficient points');
    }

    // Deduct the amount from admin points
    adminUser.points -= amount;
    await adminUser.save();

    console.log('Admin points after deduction:', adminUser.points);

    // Make the MTN Mobile Money payout request
    const payoutResponse = await axios.post('MTN_MOBILE_MONEY_API_URL', {
      mobileNumber,
      amount,
      currency,
      provider,
    });

    if (payoutResponse.data.status === 'success') {
      res.status(200).json({
        status: 'success',
        newAdminPoints: adminUser.points,
        payoutResponse: payoutResponse.data,
      });
    } else {
      throw new Error(payoutResponse.data.message);
    }
  } catch (error) {
    console.error('Error requesting Mobile Money payout:', error);
    res.status(500).json({ status: 'error', message: 'Payout request failed', error: error.message });
  }
});


// ============ PAYSTACK AMOUNT DEPOSITE SECTION =====================================================================
// live code that send and allow the user to finalize the payment using mobile money prompt
app.post('/update-paystack-balance', async (req, res) => {
  const { mobileNumber, provider, amount, currency, adminId } = req.body;

  console.log('Received mobile money details:', req.body);

  // Find the bank code for the provider
  const bankCode = bankCodes[provider];

  // Validate required details
  if (!mobileNumber || !provider || !amount || !currency || !bankCode) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    // Fetch the admin user from the database
    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).send('Admin user not found');
    }

    if (adminUser.points < amount) {
      return res.status(400).send('Insufficient points');
    }

    // Deduct the amount from admin points
    adminUser.points -= amount;
    await adminUser.save();

    console.log('Admin points after deduction:', adminUser.points);

    // Create a charge for mobile money
    const chargeRequest = {
      email: "dompsonsamuel784@gmail.com", // Replace with the actual user's email
      amount: amount * 100, // Paystack uses the smallest currency unit
      currency: currency,
      mobile_money: {
        phone: mobileNumber,
        provider: provider
      },
      metadata: {
        custom_fields: [
          {
            display_name: "Mobile Number",
            variable_name: "mobile_number",
            value: mobileNumber
          },
          {
            display_name: "Provider",
            variable_name: "provider",
            value: provider
          }
        ]
      }
    };

    console.log('Charge request:', chargeRequest);

    const chargeResponse = await axios.post('https://api.paystack.co/charge', chargeRequest, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_live_4cf4cfb6b23e3a1a970f90cca5b372c848da35bc`, // Replace with your Paystack secret key
      },
    });

    console.log('Charge successful:', chargeResponse.data);
    res.status(200).json({ status: 'success', charge_response: chargeResponse.data, newAdminPoints: adminUser.points });
  } catch (error) {
    if (error.response) {
      console.error('Error depositing amount:', error.response.data);
      res.status(500).json({ status: 'error', message: 'Deposit failed', error: error.response.data });
    } else {
      console.error('Error depositing amount:', error.message);
      res.status(500).json({ status: 'error', message: 'Deposit failed', error: error.message });
    }
  }
});


const handleUpdateBalance = async () => {
  const amount = parseFloat(updateAmount);
  if (isNaN(amount) || amount <= 0) {
    Alert.alert('Error', 'Please enter a valid amount to update.');
    return;
  }

  try {
    const response = await axios.post('http://192.168.43.1:5000/update-paystack-balance', {
      mobileNumber,
      provider,
      amount,
      currency,
      adminId,
    });

    if (response.data.status === 'success') {
      setAdminPoints(response.data.newAdminPoints);
      Alert.alert(
        'Update Successful',
        `Balance updated successfully. New balance: GH₵${response.data.newAdminPoints}`
      );
    } else {
      Alert.alert('Error', `Update failed: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error updating balance:', error.response ? error.response.data : error.message);
    Alert.alert('Error', `Update failed: ${error.message}`);
  }
};

// ========================= BANK AND MOBILE MONEY TRANSFER ===================================================
// Endpoint for initiating bank transfer
app.post('/bank-transfer', async (req, res) => {
  try {
      const { recipientAccountNumber, amount, recipientName } = req.body;

      const transferRequest = {
          source: 'balance', // Use admin's Paystack balance
          reason: 'Admin Withdrawal',
          amount: amount * 100, // Paystack uses the smallest currency unit
          recipient: recipientAccountNumber,
          recipient_bank: 'Paystack Bank', // Example bank name, replace with actual bank name
          reference: 'admin_withdrawal',
      };

      const response = await axios.post('https://api.paystack.co/transfer', transferRequest, {
          headers: {
              Authorization: 'Bearer YOUR_PAYSTACK_SECRET_KEY',
              'Content-Type': 'application/json',
          },
      });

      console.log('Bank transfer successful:', response.data);
      res.status(200).json({ status: 'success', message: 'Bank transfer initiated successfully' });
  } catch (error) {
      console.error('Error initiating bank transfer:', error.response ? error.response.data : error.message);
      res.status(500).json({ status: 'error', message: 'Bank transfer failed' });
  }
});

//======================= Endpoint for HUBTEL ACCOUNT ============================================================
// const HUBTEL_BASE_URL = 'https://api.hubtel.com';
const HUBTEL_BASE_URL = 'https://consumer-smrmapi.hubtel.com';

const HUBTEL_CLIENT_ID = 'zifwsjhz';
const HUBTEL_CLIENT_SECRET = 'zzuolevm';

// Middleware to handle authentication
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${HUBTEL_CLIENT_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// withdrawer code
app.post('/withdraw', authMiddleware, async (req, res) => {
  const { amount, mobileNumber, provider, currency } = req.body;

  if (!amount || !mobileNumber || !provider || !currency) {
    return res.status(400).json({ message: 'Missing required details' });
  }

  try {
    const response = await axios.post(
      `${HUBTEL_BASE_URL}/v1/merchantaccount/merchants/${HUBTEL_CLIENT_ID}/send/mobilemoney`,
      {
        amount,
        recipient: mobileNumber,
        provider,
        currency,
        description: 'Withdrawal from account',
        clientReference: 'unique-client-reference-id',
      },
      {
        auth: {
          username: HUBTEL_CLIENT_ID,
          password: HUBTEL_CLIENT_SECRET,
        },
      }
    );

    if (response.data.status === 'Success') {
      return res.status(200).json({ message: 'Withdrawal successful', data: response.data });
    } else {
      return res.status(500).json({ message: 'Withdrawal failed', error: response.data });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing withdrawal', error: error.message });
  }
});

// processing
app.post('/withdraw-process', async (req, res) => {
  const { amount, mobileNumber, provider, currency, adminId } = req.body;

  if (!amount || !mobileNumber || !provider || !currency || !adminId) {
    return res.status(400).json({ message: 'Missing required details' });
  }
  // // Deduct the amount from admin points
  // adminUser.points -= amount;

  try {
     // Fetch the admin user from the database
     let adminUser = await User.findById(adminId);
     if (!adminUser) {
       return res.status(404).send('Admin user not found');
     }
     
  if (adminUser.points < amount) {
    return res.status(400).json({ message: 'Insufficient points' });
  }
   // Deduct the amount from admin points
   adminUser.points -= amount;
   await adminUser.save();

   console.log('Admin points after deduction:', adminUser.points);

    const response = await axios.post(
      `${HUBTEL_BASE_URL}/v1/merchantaccount/merchants/${HUBTEL_CLIENT_ID}/send/mobilemoney`,
      {
        amount,
        recipient: mobileNumber,
        provider,
        currency,
        description: 'Withdrawal from account',
        clientReference: `withdrawal_${Date.now()}`,
      },
      {
        auth: {
          username: HUBTEL_CLIENT_ID,
          password: HUBTEL_CLIENT_SECRET,
        },
      }
    );

    if (response.data.status === 'Success') {
      return res.status(200).json({ message: 'Withdrawal successful', data: response.data, newAdminPoints: adminUser.points });
    } else {
      // Revert points deduction if withdrawal fails
      adminUser.points += amount;
      return res.status(500).json({ message: 'Withdrawal failed', error: response.data });
    }
  } catch (error) {
    // Revert points deduction if an error occurs
    adminUser.points += amount;
    return res.status(500).json({ message: 'Error processing withdrawal', error: error.message });
  }
});



// =============================================================================================================

// =============== LINKIN PAYONEER ACCOUNT ===================================
const PAYONEER_API_URL = 'https://api.payoneer.com';
const PAYONEER_CLIENT_ID = process.env.PAYONEER_CLIENT_ID;
const PAYONEER_CLIENT_SECRET = process.env.PAYONEER_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.post('/payoneer/auth', async (req, res) => {
  const { authorizationCode } = req.body;

  try {
    const response = await axios.post(`${PAYONEER_API_URL}/v2/oauth2/token`, qs.stringify({
      client_id: PAYONEER_CLIENT_ID,
      client_secret: PAYONEER_CLIENT_SECRET,
      code: authorizationCode,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }));

    const { access_token } = response.data;
    res.json({ accessToken: access_token });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.response.data);
  }
});

app.post('/payoneer/fetchUserDetails', async (req, res) => {
  const { customerID } = req.body;

  try {
    const response = await axios.get(`${PAYONEER_API_URL}/users/${customerID}`, {
      headers: {
        'Authorization': `Bearer ${PAYONEER_API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.response.data);
  }
});

// ==///////////////////////////////////////////////////////////////////////////////////////////////



// stripe section =============================================================================
app.post('/create-account-link', async (req, res) => {
  const { accountId } = req.body;

  try {
    // Create an account link associated with the provided Stripe account ID
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'myapp://reauth',  // Refresh URL for the user to reauthorize
      return_url: 'myapp://return',    // Return URL after completing the onboarding process
      type: 'account_onboarding',      // Type of the account link
    });

    // Send the URL of the account link in the response
    res.send({ url: accountLink.url });
  } catch (error) {
    // If an error occurs during the process, send a 500 status code
    // along with the error message
    res.status(500).send({ error: error.message });
  }
});
app.post('/create-account', async (req, res) => {
  try {
    // Attempt to create a new Stripe account of type 'express'
    const account = await stripe.accounts.create({ type: 'express' });

    // Send the account ID in the response
    res.send({ accountId: account.id });
  } catch (error) {
    // If an error occurs during the process, send a 500 status code
    // along with the error message
    res.status(500).send({ error: error.message });
  }
});

// SEND EARNINGS TO STRIPE ACCOUNTS
// Mum Stripe Test Account

app.post('/create-payout', async (req, res) => {
  const { amount, currency, destination } = req.body;
  try {
    // Create a payout
    const payout = await stripe.payouts.create({
      amount: amount,
      currency: currency,
      destination: destination,
    });

    res.status(200).send({ success: true, payout });
  } catch (error) {
    console.error('Payout creation error:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Exchange token endpoint for stripe
app.post('/exchange-token', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code: code,
    });
    res.status(200).send({ stripe_user_id: response.stripe_user_id });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).send({ error: error.message });
  }
});

// this endpoint is for transfering the money into stripe main account tat do not belong to your own account
// Create payout endpoint
app.post('/create-transfer', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const transfer = await stripe.transfers.create({
      amount,
      currency,
      destination: 'acct_1PQ3sIJpNRymyS4K', // Replace with your Stripe account ID
    });

    res.status(200).send({ success: true, transfer });
  } catch (error) {
    console.error('Transfer creation error:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});


// transfering money from your stripe account to your bank account
// Create payout endpoint
app.post('/create-payout-direct-to-bank-account', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    // Create a payout to your bank account
    const payout = await stripe.payouts.create({
      amount: amount,
      currency: currency,
    });

    res.status(200).send({ success: true, payout });
  } catch (error) {
    console.error('Payout creation error:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// making payout to your user connected account
// Endpoint to create a payout to a user
app.post('/create-payout-connected-user', async (req, res) => {
  const { amount, currency, userStripeAccountId } = req.body;
  
  try {
    const payout = await stripe.payouts.create({
      amount,
      currency,
      method: 'standard', // or 'instant' for instant payouts (if supported)
      destination: userStripeAccountId, // Stripe account ID of the user receiving the payout
    });

    res.status(200).send({ success: true, payout });
  } catch (error) {
    console.error('Payout creation error:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Endpoint to create a transfer to a connected account
app.post('/create-transfer', async (req, res) => {
  const { amount, currency, destination } = req.body;
  
  try {
    const transfer = await stripe.transfers.create({
      amount,
      currency,
      destination,
    });

    res.status(200).send({ success: true, transfer });
  } catch (error) {
    console.error('Transfer creation error:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// PAYSTACK GETTING ACCOUNT DETAILS
const PAYSTACK_API_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
let bankCodes = {};
app.get('/fetch-bank-codes', async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=GHS&type=mobile_money', {
      headers: {
        'Authorization': `Bearer sk_live_4cf4cfb6b23e3a1a970f90cca5b372c848da35bc`
      }
    });

    const banks = response.data.data;
    banks.forEach(bank => {
      bankCodes[bank.name] = bank.code;
    });

    console.log('Fetched bank codes:', bankCodes);
    res.status(200).json({ status: 'success', bankCodes });
  } catch (error) {
    console.error('Error fetching bank codes:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch bank codes', error: error.response ? error.response.data : error.message });
  }
});

// Fetch bank codes on server start
(async () => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=GHS&type=mobile_money', {
      headers: {
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`
      }
    });

    const banks = response.data.data;
    banks.forEach(bank => {
      bankCodes[bank.name] = bank.code;
    });

    console.log('Fetched bank codes on startup:', bankCodes);
  } catch (error) {
    console.error('Error fetching bank codes on startup:', error.response ? error.response.data : error.message);
  }
})();


// combined paystack customerId and balance to mongodb database
app.post('/paystack/fetchCustomer', async (req, res) => {
  const { customerID, adminId, deductAmount, currency, email, provider, mobileNumber, name } = req.body;

  // bank code
  const bankCode = bankCodes[provider];

  // Validate required details
  if (!customerID || !adminId || !deductAmount || !currency || !email || !provider || !mobileNumber || !name  || !bankCode) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    // Fetch the admin user from the database
    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Check if the deducted amount is less or greater than the current points
    if (adminUser.points < deductAmount) {
      return res.status(400).send('Insufficient earnings');
    }

    // Deduct the amount from admin points
    adminUser.points -= deductAmount;
    await adminUser.save();

    // Create a transfer recipient
    const transferRecipientResponse = await axios.post(`${PAYSTACK_API_URL}/transferrecipient`, {
      // type: 'nuban',
      type: 'mobile_money',
      name: name,
      phone: mobileNumber,
      account_number: mobileNumber,
      bank_code: bankCode,
      provider: provider,
      currency: currency,
      email: email,
    }, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const recipientCode = transferRecipientResponse.data.data.recipient_code;

    // Initiate a transfer
    const transferResponse = await axios.post(`${PAYSTACK_API_URL}/transfer`, {
      source: 'balance',
      amount: deductAmount * 100, // amount in kobo
      recipient: recipientCode,
      reason: 'User earnings withdrawal'
    }, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    res.json({
      transferDetails: transferResponse.data.data,
    });
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {
      res.status(500).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.post('/save-mobile-money-details-deposite', async (req, res) => {
  // const { mobileNumber, provider, amount, currency } = req.body;
  const { customerID, adminId, deductAmount, currency, email, provider, mobileNumber, name } = req.body;

  // Logging incoming request data
  console.log('Received mobile money details:', req.body);

  // Find the bank code for the provider
  const bankCode = bankCodes[provider];

  // Validate required details
  if (!customerID || !adminId || !deductAmount || !currency || !email || !provider || !mobileNumber || !name  || !bankCode) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    // Deposit the amount into your Paystack balance
    console.log('Depositing amount into Paystack balance...');
    const depositResponse = await axios.post('https://api.paystack.co/transferrecipient', {
      source: 'mobile_money', // Use appropriate source
      amount: amount * 100, // Paystack uses the smallest currency unit
      reason: 'Deposit for services rendered',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`, // Replace with your Paystack secret key
      },
    });

    console.log('Deposit successful:', depositResponse.data);
    res.status(200).json({ status: 'success', deposit_response: depositResponse.data });
  } catch (error) {
    console.error('Error depositing amount:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Deposit failed', error: error.response ? error.response.data : error.message });
  }
});


// ============================BANK CODE =======================================================
// let bankCodes = {};
app.get('/fetch-bank-codes', async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=GHS&type=mobile_money', {
      headers: {
        'Authorization': `Bearer sk_live_4cf4cfb6b23e3a1a970f90cca5b372c848da35bc`
      }
    });

    const banks = response.data.data;
    banks.forEach(bank => {
      bankCodes[bank.name] = bank.code;
    });

    console.log('Fetched bank codes:', bankCodes);
    res.status(200).json({ status: 'success', bankCodes });
  } catch (error) {
    console.error('Error fetching bank codes:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch bank codes', error: error.response ? error.response.data : error.message });
  }
});

// Fetch bank codes on server start
(async () => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=GHS&type=mobile_money', {
      headers: {
        'Authorization': `Bearer sk_test_8d61239d2ad10b5ff5b54fa3c27a04fc992b02f7`
      }
    });

    const banks = response.data.data;
    banks.forEach(bank => {
      bankCodes[bank.name] = bank.code;
    });

    console.log('Fetched bank codes on startup:', bankCodes);
  } catch (error) {
    console.error('Error fetching bank codes on startup:', error.response ? error.response.data : error.message);
  }
})();

// ///////=====================ENDIN OF TE BANK CODE /////////////////////////////////////////////////////


app.post('/paystack/fetchBalance', async (req, res) => {
  try {
    const response = await axios.get(`${PAYSTACK_API_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.response.data);
  }
});


// ==================== EXPO PUSH NOTIFICATION =======================================================
// Endpoint to send push notification
app.post('/send-notification', async (req, res) => {
  const { token, title, message } = req.body;

  // Log the incoming request body
  console.log('Incoming request body:', req.body);

  if (!token || !title || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pushMessage = {
    to: token,
    sound: 'default',
    title: title,
    body: message,
    data: { data: 'goes here' },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushMessage),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// ========================== ENDING PART ===========================================


// Authorization Endpoint
// Authorization Endpoint
app.post('/authorize', async (req, res) => {
  try {
    const response = await axios.post('https://api.hubtel.com/v1/auth', {}, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Authorization failed');
  }
});


// Send SMS Endpoint
// Send SMS Endpoint
app.get('/send-sms', async (req, res) => {
  const { phoneNumber, message } = req.query;
  try {
    const response = await axios.get('https://smsc.hubtel.com/v1/messages/send', {
      params: {
        clientid: CLIENT_ID,
        clientsecret: CLIENT_SECRET,
        from: 'Shaggyboy',
        to: phoneNumber,
        content: message
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Message sending failed', error.response ? error.response.data : error.message);
    res.status(500).send('Message sending failed');
  }
});

// Send Money Endpoint
app.post('/send-money', async (req, res) => {
  const { clientId, clientSecret, merchant_id, account_number, amount, description, client_reference } = req.body;
  try {
    const response = await axios.post(`https://consumer-smrmapi.hubtel.com/send-money`, {
      AccountNumber: account_number,
      Amount: amount,
      Description: description,
      ClientReference: client_reference
    }, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Sending money failed');
  }
}); 

// checking balance
app.get('/check-balance', async (req, res) => {
  try {
    const response = await axios.get('https://api.hubtel.com/v1/merchantaccount/merchants/{account_number}/balance', {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Balance check failed', error.response ? error.response.data : error.message);
    res.status(500).send('Balance check failed');
  }
});

// paystack/verify
app.post('/paystack/verify', async (req, res) => {
  const { reference } = req.body;
  try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEYS}`,
          }
      });

      if (response.data.data.status === 'success') {
          res.json({ success: true });
      } else {
          res.json({ success: false });
      }
  } catch (error) {
      res.status(500).json({ error: 'Payment verification failed' });
  }
});

//  ending parts ================================================================================================


// ====================MTN OAUTH ============================================
async function getAccessToken(clientId, clientSecret) {
  const options = {
      method: 'POST',
      url: 'https://api.mtn.com/v1/oauth/access_token',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
          username: clientId,
          password: clientSecret
      },
      params: {
          grant_type: 'client_credentials'
      }
  };

  console.log('Request options:', options); // Add this line for debugging

  try {
      const response = await axios(options);
      console.log('Response data:', response.data); // Add this line for debugging
      return response.data.access_token; // Return the access token for use
  } catch (error) {
      console.error('Error fetching MTN OAuth token:', error.message);
      throw error; // Handle or rethrow the error as needed
  }
}

// POST endpoint to fetch and return the access token
app.post('/getAccessToken', async (req, res) => {
  const { clientId, clientSecret } = req.body;
  try {
      const accessToken = await getAccessToken(clientId, clientSecret);
      res.status(200).json({ accessToken });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



// ========================== MOBILE MONEY DETAILS ========================================================
// Endpoint to handle deposit requests from React Native app
app.post('/api/deposit', async (req, res) => {
  const { mobileMoneyNumber, amount, currency, adminId } = req.body;

  // Validate required details
  if (!mobileMoneyNumber || !amount || !currency || !adminId) {
    return res.status(400).json({ status: 'error', message: 'Missing required details' });
  }

  try {
    // Fetch the admin user from the database
    let adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Check if the deducted amount is less or greater than the current points
    if (adminUser.points < amount) {
      return res.status(400).send('Insufficient earnings');
    }

    // Deduct the amount from admin points
    adminUser.points -= amount;
    await adminUser.save();

    // Log the admin user's updated points
    console.log(`Admin ${adminUser.userName} new points after deduction: ${adminUser.points}`);

    // Step 1: Obtain an access token from MTN MADAPI OAuth2
    const authUrl = 'https://api.mtn.com/v1/oauth/access_token?grant_type=client_credentials';
    const clientId = 'Samuel'; // Replace with your actual client ID
    const clientSecret = '204567'; // Replace with your actual client secret

    const authResponse = await axios.post(authUrl, new URLSearchParams({
      grant_type: 'client_credentials'
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });

    const accessToken = authResponse.data.access_token;

    // Step 2: Make request to MTN MoMo API
    const mtnApiUrl = 'https://sandbox.momodeveloper.mtn.com/v1_0/transfer';

    const response = await axios.post(mtnApiUrl, {
      amount,
      currency,
      externalId: Date.now().toString(), // Example: use a unique transaction ID
      payee: {
        partyIdType: 'MSISDN',
        partyId: mobileMoneyNumber,
      },
      payerMessage: 'Deposit to my account',
      payeeNote: 'Deposit from React Native App',
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Target-Environment': 'sandbox', // Use 'production' for live environment
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'your-mtn-api-key', // Replace with your actual MTN API key
      },
    });

    // Log the MTN MoMo API response
    console.log('MTN MoMo API response:', response.data);

    // Send response to client
    res.json(response.data);
  } catch (error) {
    console.error('MTN MoMo API error:', error.message);
    res.status(500).json({ error: 'Failed to process deposit' });
  }
});

// Endpoint to handle user authorization
// Endpoint to handle user authorization
app.post('/api/authorize', async (req, res) => {
  const { clientId, clientSecret } = req.body;

  // Validate required details
  if (!clientId || !clientSecret) {
    return res.status(400).json({ status: 'error', message: 'Missing client ID or client secret' });
  }

  try {
    // Step 1: Obtain an access token from MTN MADAPI OAuth2
    const authUrl = 'https://api.mtn.com/v1/oauth/access_token';

    const authResponse = await axios.post(authUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const accessToken = authResponse.data.access_token;

    // Log the obtained access token
    console.log('MTN MoMo Access Token:', accessToken);

    // Send response to client with access token
    res.json({ accessToken });
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('MTN MoMo API response error:', error.response.data);
      console.error('Status code:', error.response.status);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No response received from MTN MoMo API:', error.request);
      res.status(500).json({ error: 'No response received from MTN MoMo API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('MTN MoMo API error:', error.message);
      res.status(500).json({ error: 'Failed to authorize user' });
    }
  }
});

// starting it in the browser
// Define a POST route

app.get('/', (req, res) => {
  res.send({Status: 'Server connected working'});
});

// Redirect endpoint
app.get('/redirect', (req, res) => {
  const expoLink = 'exp://192.168.43.1:8081/--/';
  const queryParams = new URLSearchParams(req.query).toString();
  const redirectTo = `${expoLink}?${queryParams}`;

  console.log(`Redirecting to: ${redirectTo}`);
  res.redirect(redirectTo);
});

// SEND THE TRANSACTION DETAILS TO THE DATABASE FOR PRUDENCIAL BANK
const TransactionSchema = new mongoose.Schema({
  accountNumber: Number,
  accountHolderName:String,
  amount: Number,
  userName: String,
  userProfilePicture: String,
  currency:String,
  userId:String,
  time: { type: Date, default: Date.now },
});
// defining the schma
const PrudenciaBankTransaction = mongoose.model('PrudenciaBankTransaction', TransactionSchema);

// endpoint to sending prudencia bank transaction into the database
app.post('/initiateTransfer', async (req, res) => {
  const { accountNumber,accountHolderName ,amount, userId, userName, userProfilePicture, currency } = req.body;
  try {
    const user = await User.findById(userId);
    if (user.points < amount) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    user.points -= amount;
    await user.save();

    const transaction = new PrudenciaBankTransaction({
      accountNumber,
      accountHolderName,
      amount,
      userName,
      userProfilePicture,
      currency,
      userId
    });
    await transaction.save();

    res.status(200).json({ message: 'Transfer initiated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate transfer' });
  }
});

// endpoint to fetch for all transaction by the user using the userId
app.get('/transactionHistory/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await PrudenciaBankTransaction.find({ userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
});

// =================================== ENDING ==========================================

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
