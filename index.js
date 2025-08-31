// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const auth = require('./auth')
const app = express();
const multer = require("multer"); 
const PORT = process.env.PORT || 3000;
const parsePdf = require('./parsePdf');
const savetocsv = require("./saveToCsv");

// ---- Middlewares ---- //
const upload = multer({ dest: "uploads/" }); 
// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Logger (development friendly)
app.use(morgan("dev"));

// ---- Routes ---- //
app.get("/", auth, (req, res) => {
  res.json({ message: "Welcome to Express API 🚀" });
});
app.post("/parse-pdf",auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }
    console.log(req.file)
    const data = await parsePdf(req.file.path);
    res.status(200).json({data});
  } catch (err) {
    res.status(500).send({ error: "Failed to parse PDF", details: err.message });
  }
});
app.get("/view-report",auth,(req,res,next)=>{

})
app.post("/echo",auth, (req, res) => {
  res.json({
    receivedBody: req.body,
  });
});

// ---- Error Handling Middleware ---- //
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "something went wrong" });
});

// ---- Start Server ---- //
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
