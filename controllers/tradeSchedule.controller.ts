import { Request, Response } from "express";
import { TradeSchedule, ITradeSchedule } from "../models/tradeSchedule.model";

export const getAllTradeSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentTime = new Date();
    let filter: any = {};

    if (req.query.type === "existing") {
      filter = {
        status: { $in: ["Pending", "Started"] },
      };
    }

    if (req.query.type === "history") {
      filter = {
        status: { $in: ["Completed", "Stopped"] },
      };
    }

    const tradeSchedules = await TradeSchedule.find(filter).sort({
      updatedAt: -1,
    });

    res.status(200).json({ tradeSchedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Some error occurred",
    });
  }
};

export const getTradeScheduleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tradeSchedule = await TradeSchedule.findById(req.params.id);

    if (!tradeSchedule) {
      res.status(404).json({
        success: false,
        error: "No Trade Schedule found for this id",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: tradeSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
      error,
    });
  }
};

export const createTradeSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    side,
    tradeQuantity,
    startTime,
    interval,
    numberOfTrades,
    exchanges,
  } = req.body;

  if (
    !side ||
    !tradeQuantity ||
    !interval ||
    !numberOfTrades ||
    !exchanges ||
    exchanges.length === 0
  ) {
    res.status(400).json({
      success: false,
      error: "Please enter all the fields",
    });
    return;
  }

  try {
    const tradeSchedule: ITradeSchedule = await TradeSchedule.create({
      side,
      tradeQuantity,
      startTime,
      interval,
      numberOfTrades,
      exchanges,
    });

    res.status(201).json({
      success: true,
      message: "Trade Schedule created successfully",
      data: tradeSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
      error,
    });
  }
};

export const updateTradeSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let tradeSchedule = await TradeSchedule.findById(req.params.id);

    if (!tradeSchedule) {
      res.status(404).json({
        success: false,
        error: "No Trade Schedule found for this id",
      });
      return;
    }

    tradeSchedule = await TradeSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Trade Schedule updated successfully",
      data: tradeSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
      error,
    });
  }
};

export const deleteTradeSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tradeSchedule = await TradeSchedule.findById(req.params.id);

    if (!tradeSchedule) {
      res.status(404).json({
        success: false,
        error: "No Trade Schedule found for this id",
      });
      return;
    }

    await TradeSchedule.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trade Schedule deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
      error,
    });
  }
};
