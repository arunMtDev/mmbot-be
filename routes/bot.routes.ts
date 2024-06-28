import express, { Router } from "express";
import { getAllExchangesBalances } from "../controllers/bot.controller";
import { isAuthenticatedUser } from "../middleware/auth";

const router: Router = express.Router();

router.route("/bot/balances").get(isAuthenticatedUser, getAllExchangesBalances)



export default router;
