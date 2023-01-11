const express = require("express");
const app = express();
const port = 3001;
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");

const corsOptions = {
  origin: [process.env.SERVER_HOSTNAME, "http://localhost:3000"],
  optionsSuccessStatus: 200,
};
const corsMiddleware = cors(corsOptions);
const register = require("./routes/register");
const login = require("./routes/login");
const completeProfile = require("./routes/complete_profile");
const uploadProfileImage = require("./routes/upload_profile_image");
const uploadFeedImages = require("./routes/upload_feed_images");
const confirmEmail = require("./routes/confirm_email");
const updateProfile = require("./routes/update_profile.js");
const resetPassword = require("./routes/reset_password.js");
const like = require("./routes/like");
const unlike = require("./routes/unlike");
const block = require("./routes/block");
const unblock = require("./routes/unblock");
const getBlockedUsers = require("./routes/get_blocked_users");
const deleteFeedImages = require("./routes/delete_feed_images");
const getUser = require("./routes/get_user");
const getLikers = require("./routes/get_likers");
const getVisitors = require("./routes/get_visitors");
const getFeedUsers = require("./routes/get_feed_users");
const getMe = require("./routes/get_me");

app.use(express.json());
app.options("*", corsMiddleware);
app.use(corsMiddleware);
app.use("/images", express.static("images"));
app.use("/register", register);
app.use("/login", login);
app.use("/complete_profile", completeProfile);
app.use("/upload_profile_image", uploadProfileImage);
app.use("/upload_feed_images", uploadFeedImages);
app.use("/confirm_email", confirmEmail);
app.use("/update_profile", updateProfile);
app.use("/reset_password", resetPassword);
app.use("/like", like);
app.use("/unlike", unlike);
app.use("/block", block);
app.use("/unblock", unblock);
app.use("/get_blocked_users", getBlockedUsers);
app.use("/delete_feed_images", deleteFeedImages);
app.use("/get_user", getUser);
app.use("/get_likers", getLikers);
app.use("/get_visitors", getVisitors);
app.use("/get_feed_users", getFeedUsers);
app.use("/get_me", getMe);

server.listen(port, () => console.log(`Matcha listening on port ${port}`));

// nodemon -x "printf '\x1Bc';node" index.js
