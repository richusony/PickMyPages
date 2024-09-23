import express from "express";
import userAuth from "../middlewares/auth.js";
import { upload } from "../external-lib/multerConfig.js";
import {
  getUserDetails,
  signIn,
  signUp,
  uploadUserPdf,
  createNewPdf,
  getUserUploadedPdfs,
  userRefreshToken,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signUp", signUp);

router.post("/signin", signIn);

router.get("/get-user", userAuth, getUserDetails);

router.post("/upload-pdf", userAuth, upload.single("userPdf"), uploadUserPdf);

router.post("/create-pdf", userAuth, createNewPdf);

router.get("/pdfs", userAuth, getUserUploadedPdfs);

router.post("/refresh-token", userRefreshToken);

router.delete("/logout", userAuth, logoutUser);

export default router;
