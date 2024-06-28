import express, { Router } from "express";
import { createAdmin, loginAdmin } from "../controllers/admin.controller";

const router: Router = express.Router();

router.route("/admin/register").post(createAdmin);
router.route("/admin/login").post(loginAdmin);

export default router;
