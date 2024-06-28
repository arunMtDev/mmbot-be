import express, { Application } from "express";
import connectDB from "./dbConnection";
import { startScheduler } from "./bot/bot";
import dotenv from "dotenv";

import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";

dotenv.config();

const PORT: number = parseInt(process.env.PORT_NUMBER || "5000");

// connecting the db
connectDB();

const app: Application = express();

app.use(
  cors({
    origin: "*",
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", async (socket) => {
  console.log("connected", socket.id);

  socket.on("disconnect", function () {
    console.log("user disconnected");
    socket.removeAllListeners();
  });
});

app.use(express.json());

// routes
import adminRoutes from "./routes/admin.routes";
import tradeScheduleRoutes from "./routes/tradeSchedule.routes";
import botRoutes from "./routes/bot.routes";

app.use("/api/v1/", adminRoutes);
app.use("/api/v1/", tradeScheduleRoutes);
app.use("/api/v1/", botRoutes);

// starting the scheduler (every second)
startScheduler(io);

// httpServer.listen(3000);
httpServer.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
