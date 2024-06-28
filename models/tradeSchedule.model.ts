import mongoose, { Document } from "mongoose";

export interface ITradeSchedule extends Document {
  status: string;
  side: string;
  tradeQuantity: string;
  startTime: Date;
  interval: number;
  numberOfTrades: number;
  exchanges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const tradeSchedulerSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Started", "Stopped", "Completed"],
      default: "Pending",
    },
    side: {
      type: String,
      enum: ["Buy", "Sell"],
      required: [true, "Please specify the trade side (Buy or Sell)"],
    },
    tradeQuantity: {
      type: String,
      required: [true, "Please specify the trade quantity"],
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    interval: {
      type: Number,
      required: [true, "Please specify the interval between trades (in milliseconds)"],
    },
    numberOfTrades: {
      type: Number,
      required: [true, "Please specify the number of trades"],
    },
    exchanges: {
      type: [String],
      required: [true, "Please specify at least one exchange"],
    },
  },
  { timestamps: true }
);

export const TradeSchedule = mongoose.model<ITradeSchedule>("TradeSchedule", tradeSchedulerSchema);
