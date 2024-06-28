import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import sendToken from "../utils/jwtToken";

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      error: "Please enter all the fields",
    });
    return;
  }

  try {
    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      res.status(400).json({
        success: false,
        error: "Admin is already registered",
      });
      return;
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    sendToken(admin, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Some error occurred",
    });
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: "Please enter all the fields",
    });
    return;
  }

  try {
    const admin = await Admin.findOne({ email }).select("+password");

    if (admin && (await admin.comparePassword(password))) {
      sendToken(admin, 200, res);
    } else {
      res.status(401).json({
        success: false,
        error: "Invalid Email or Password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
