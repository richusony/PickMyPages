import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function passwordHashing(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export const generateRefreshToken = (userId, email) => {
  const refreshToken = jwt.sign(
    { id: userId, email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  // console.log("Refresh Token :: ",refreshToken);
  return refreshToken;
};

export const generateAccessToken = (userId, email) => {
  const accessToken = jwt.sign(
    { id: userId, email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  // console.log("Access Token :: ",accessToken);
  return accessToken;
};

export const comparePassword = async (InputPassword, DataBasePassword) => {
  return await bcrypt.compare(InputPassword, DataBasePassword);
};

export const setCookieOptions = () => {
  let cookieOptions;
  if (process.env.NODE_ENV == "development") {
    cookieOptions = {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: process.env.COOKIE_EXPIRY,
    };
  }

  if (process.env.NODE_ENV == "production") {
    cookieOptions = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: process.env.COOKIE_EXPIRY,
    };
  }

  return cookieOptions;
};

export const deleteCookieAfterLogout = (res) => {
  if (process.env.NODE_ENV == "development") {
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0), // Set the expiration date to the past to clear the cookie
      sameSite: "Lax",
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0), // Set the expiration date to the past to clear the cookie
      sameSite: "Lax",
    });
  }

  if (process.env.NODE_ENV == "production") {
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0), // Set the expiration date to the past to clear the cookie
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0), // Set the expiration date to the past to clear the cookie
      sameSite: "None",
      secure: true,
    });
  }

  return res;
};

export const validatRrefreshToken = async (token, user) => {
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  if (user._id !== decoded.id) {
    console.log(user, decoded);
    throw new Error("user doesn't exists - RefreshToken");
  }

  if (token !== user?.refreshToken) {
    throw new Error("Invalid Refresh Token");
  }

  return true;
};

export function generateRandomPdfName() {
  const prefix = "pdf-";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase(); // Generate a random 4-character string
  return prefix + randomSuffix;
}

export const fillPageNumbers = (pageStarts, pageEnds) => {
  const pages = [];

  for (let i = pageStarts - 1; i < pageEnds; i++) {
    pages.push(i);
  }

  return pages;
};
