import { Response } from "express";
import { IAdmin } from "../models/admin.model";

const sendToken = (user: IAdmin, statusCode: number, res: Response): void => {
  const token = user.getJWTToken();

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
