import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import connectDB from "./database/db.js";
import User from "./models/users.model.js";
import authenticateToken from "./utilities.js";
import Note from "./models/notes.model.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express(); //instantiate express application

//middlewares
const allowedOrigins = ["http://localhost:5173"]; //frontend url
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
); //let server specify who can access to server
app.use(express.json());

//Home route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Account created sucessfully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: `SignUp error ${error}` });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password and password are required!" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      message: "Login sucessfully!",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` });
  }
});

app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    return res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        _id: user._id,
        createdOn: user.createdOn,
      },
      message: "Sucessfully got user data!",
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to get user ${error}` });
  }
});

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.userId;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required!" });
  }
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId,
    });
    await note.save();

    return res.status(201).json({
      message: "Notes added Sucessfully!",
      note,
    });
  } catch (error) {
    return res.status(500).json({ message: `Add note error ${error}` });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user.userId;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(400).json({ message: "Note not found!" });
    }
    //updating note
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned === "boolean") note.isPinned = isPinned;

    await note.save();
    return res.status(200).json({
      message: "Note edit sucessfully!",
      note,
    });
  } catch (error) {
    return res.status(500).json({ message: `Edit note error ${error}` });
  }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      isPinned: -1,
    });

    return res.status(200).json({
      meassage: " All notes retrived sucessfully!",
      notes,
    });
  } catch (error) {
    return res.status(500).json({ message: `Get all notes error ${error}` });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.userId;
  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(400).json({ message: "Note not found!" });
    }
    await Note.deleteOne({ _id: noteId });
    return res.status(200).json({
      message: "Note deleted sucessfully!",
      note,
    });
  } catch (error) {
    return res.status(500).json({ message: `Delete error ${error}` });
  }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async(req, res)=>{
    const {isPinned} = req.body;
    const userId = req.user.userId;
    const noteId = req.params.noteId;

    try {
        const note = await Note.findOne({_id:noteId, userId});
        if(!note){
            return res.status(400).json({message:"Note not found!"})
        }
        note.isPinned= !! isPinned; // negation force any value into boolean
        await note.save();

        return res.status(200).json({
            message:"Pin status updated!",
            note
        })

    } catch (error) {
        return res.status(500).json({message:`Update pin status error ${error}`});
    }
})

//Start Server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
});
