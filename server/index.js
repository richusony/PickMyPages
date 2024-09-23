import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import express from "express";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./dbConnection.js";

import userRoute from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;

connectMongoDB(MONGODB_URI);

const whitelist = [
  "http://localhost:5173",
  "https://richu-bloghub.vercel.app",
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // console.log("origin :::: ", origin);
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// This gives you the file path of the current module
const __filename = fileURLToPath(import.meta.url);

// This gives you the directory name of the current module
const __dirname = path.dirname(__filename);

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.use("/", userRoute);

app.listen(PORT, () => {
  console.log("listening on", PORT);
});
