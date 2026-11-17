const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const express = require("express");
const app = express();
const { dbconnect } = require("./config/Databse");
const { cloudinaryconnect } = require("./config/Cloudinary");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const port = process.env.PORT || 4000;

const interviewRoute = require("./routes/InterviewRoutes");
const authRoute = require("./routes/UserRoutes");

dbconnect();
cloudinaryconnect();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ai-interview-seven-tau.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
}));

// Routes
app.use("/nain/v1/auth", authRoute);
app.use("/nain/v1/interview", interviewRoute);

app.get("/", (req, res) => {
  res.json({ success: true, message: "AI Interviewer Server is active" });
});

app.listen(port, () => {
    console.log(`server started successfully on port ${port}......`);
});
