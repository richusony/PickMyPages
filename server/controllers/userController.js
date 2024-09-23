import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";
import UserModel from "../models/UserModel.js";
import {
  comparePassword,
  deleteCookieAfterLogout,
  fillPageNumbers,
  generateAccessToken,
  generateRandomPdfName,
  generateRefreshToken,
  passwordHashing,
  setCookieOptions,
} from "../utils/helper.js";
import PdfModel from "../models/PdfModel.js";

export const getUserDetails = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getUserUploadedPdfs = async (req, res) => {
  const userId = req.user._id;
  try {
    const userExist = await UserModel.findById(userId);
    if (!userExist) return res.status(404).json({ error: "User Not Found" });

    const userPdfs = await PdfModel.find({ userId });

    res.status(200).json(userPdfs);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const uploadUserPdf = async (req, res) => {
  const userId = req.user._id;
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ error: "No file uploaded or the file is not a PDF." });

    if (userId) {
      await PdfModel.create({
        userId,
        fileName: req.file.filename,
        pdfUrl: `/pdfs/${req.file.filename}`,
      });
    }

    res.status(200).json({
      message: "File uploaded successfully!",
      fileName: req.file.filename,
      filePath: `/pdfs/${req.file.filename}`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const createNewPdf = async (req, res) => {
  const userId = req.user._id;

  // This gives you the file path of the current module
  const __filename = fileURLToPath(import.meta.url);

  // This gives you the directory name of the current module
  const __dirname = path.dirname(__filename);

  const { pageStart, pageEnd, fileName } = req.body;
  const filePath = path.join(__dirname, "../pdfs", fileName);

  try {
    // Read the file as a Buffer using Node.js' file system
    const fileBuffer = fs.readFileSync(filePath);

    // Load the PDF document from the buffer
    const existingPdfDoc = await PDFDocument.load(fileBuffer);

    // Create a new PDF document for the extracted pages
    const newPdfDoc = await PDFDocument.create();

    const pages = fillPageNumbers(pageStart, pageEnd);
    // Extract specific pages
    const pagesToExtract = pages; // Convert to zero-indexed
    const copiedPages = await newPdfDoc.copyPages(
      existingPdfDoc,
      pagesToExtract
    );

    // Add the extracted pages to the new PDF
    copiedPages.forEach((page) => {
      newPdfDoc.addPage(page);
    });

    // Serialize the new PDF document to bytes
    const pdfBytes = await newPdfDoc.save();
    const pdfName = generateRandomPdfName();
    // Write the new PDF to the file system (optional)
    const outputFilePath = path.join(__dirname, "../pdfs", `${pdfName}.pdf`);
    fs.writeFileSync(outputFilePath, pdfBytes);

    // Send the new PDF back to the client as a downloadable file
    const newPdfName = `${pdfName}.pdf`;

    if (userId) {
      await PdfModel.create({
        userId,
        fileName: newPdfName,
        pdfUrl: `/pdfs/${newPdfName}`,
      });
    }
    res.status(200).json({ fileName: newPdfName });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // console.log("signup-body :", req.body);
  try {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields required");
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) throw new Error("User already exists with this email");

    const hashedPassword = await passwordHashing(password);
    const createUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!createUser)
      throw new Error("Error while creating user. Try after sometime");

    console.log("User Account Created For :", firstName);
    res.status(201).json(createUser);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  // console.log("login-body :", req.body);
  try {
    if (!email || !password) {
      throw new Error("All fields required");
    }

    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ error: "User Doesn't Exists" });
    }

    const passwordMatch = await comparePassword(password, userExist.password);
    if (!passwordMatch) {
      return res.status(403).json({ error: "Password is incorrect" });
    }

    const refreshToken = generateRefreshToken(userExist._id, userExist.email);
    const accessToken = generateAccessToken(userExist._id, userExist.email);
    // if (!token) {
    //   throw new Error("Something went wrong. Please try again after sometime");
    // }

    const cookieOptions = setCookieOptions();
    if (!cookieOptions) {
      throw new Error("Something went wrong. Please try again after sometime");
    }
    userExist.refreshToken = refreshToken;
    await userExist.save();

    console.log("User Logged In", email);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({ user: userExist, accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const userRefreshToken = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  // console.log("refreshToken from frontend :", incomingRefreshToken);
  const cookieOptions = setCookieOptions();
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await UserModel.findById(decoded?.id);

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(400).json({ error: "Invalid Refresh Token" });
    }

    const accessToken = generateAccessToken(user._id, user.email);

    console.log("acccess token refreshed");
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", incomingRefreshToken, cookieOptions);
    res.status(200).json({ accessToken, refreshToken: incomingRefreshToken });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  const token = req.cookies?.refreshToken;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await UserModel.findById(decoded?.id);

    if (!user) {
      throw new Error("user doesn't exists - RefreshToken");
    }

    if (token !== user?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    const response = deleteCookieAfterLogout(res);
    console.log("User logged out", decoded.email);
    response.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
