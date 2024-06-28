import express, { Router } from "express";
import {
  createTradeSchedule,
  getAllTradeSchedules,
  updateTradeSchedule,
  deleteTradeSchedule,
  getTradeScheduleById,
} from "../controllers/tradeSchedule.controller";

import { isAuthenticatedUser } from "../middleware/auth";

const router: Router = express.Router();

router
  .route("/tradeSchedulers/new")
  .post(isAuthenticatedUser, createTradeSchedule);
router.route("/tradeSchedulers").get(isAuthenticatedUser, getAllTradeSchedules);
router
  .route("/tradeScheduler/:id")
  .get(isAuthenticatedUser, getTradeScheduleById)
  .put(isAuthenticatedUser, updateTradeSchedule)
  .delete(isAuthenticatedUser, deleteTradeSchedule);

export default router;
