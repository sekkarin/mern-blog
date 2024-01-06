const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Post = require("./models/Post");

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const cookieParser = require("cookie-parser");

//Environment Variables
require("dotenv").config();

//Express Setup
const app = express();

//Middleware Setup
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
//set statics (public) folder
app.use("/uploads", express.static(__dirname + "/uploads"));

//Database Connect
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL);

//Home Route
app.get("/", (req, res) => {
  res.send("<h1>This is a RESTful API FOR SE NPRU Blog</h1>");
});

//User Register
const salt = bcrypt.genSaltSync(10);
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//User login
const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
  if (isMatchedPassword) {
    //logged in
    jwt.sign({ username, id: userDoc }, secret, {}, (err, token) => {
      if (err) throw err;
      //Save data in cookie
      res.cookie("token", token).json({
        id: userDoc.id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

//logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

//Create Post
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.lenght - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  const { token } = req.cookies;

  jwt.verify(token, secret, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

// Delete Post
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (deletedPost) {
      res.json({ message: "Post deleted successfully", deletedPost });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json("Internal Server Error");
  }
});

//Edit
app.put("/posts/:id", uploadMiddleware.single("file"), async (req, res) => {
  const { id } = req.params;

  try {
    // ดึงข้อมูลโพสต์ (title, summary, content) จากรีเควสบอดี้
    const { title, summary, content } = req.body;
    let updateData = { title, summary, content };

    if (req.file) {
      // ดึงข้อมูลเกี่ยวกับไฟล์ที่อัปโหลด
      const { originalname, path } = req.file;

      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;

      await fs.promises.rename(path, newPath);
      updateData = { ...updateData, cover: newPath };
    }

    const existingPost = await Post.findById(id);
    // ดึง path ของ cover image ถ้ามี
    const existingCoverPath = existingPost ? existingPost.cover : "";

    const cover = req.file ? updateData.cover : existingCoverPath;
    // อัปเดตโพสต์ในฐานข้อมูลและรับโพสต์ที่อัปเดตแล้ว
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { ...updateData, cover },
      {
        new: true,
      }
    );

    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json("Internal Server Error");
  }
});

//
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

//
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
