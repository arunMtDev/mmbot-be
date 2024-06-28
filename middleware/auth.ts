import { Request, Response, NextFunction } from "express";
import { Admin, IAdmin } from "../models/admin.model";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  admin: IAdmin | null;
}

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodedData: any = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

      (req as CustomRequest).admin = await Admin.findById(decodedData.id);
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Please login!" });
  }
};
