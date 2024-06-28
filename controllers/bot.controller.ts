import { azbitClient, coinsBitClient, dexTradeClient } from "../bot/bot";
import { Request, Response } from "express";

// Function to convert balance from scientific notation to fixed decimal format
const convertScientificToDecimal = (balance: number): string => {
  return balance.toFixed(8); // Set the desired number of decimal places
};

export const getAllExchangesBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const azbitBalance = await azbitClient.getBalance();
    const dexTradeBalance = await dexTradeClient.getBalance();
    const coinsbitSAFTPBalance = await coinsBitClient.getBalance("SAFTP");
    const coinsbitUSDTBalance = await coinsBitClient.getBalance("USDT");

    const azbitSAFTPBalance = azbitBalance.balances.find(
      (data: any) => data.currencyCode === "SAFTP"
    );

    const azbitUSDTBalance = azbitBalance.balances.find(
      (data: any) => data.currencyCode === "USDT"
    );

    const dexTradeSAFTPBalance = dexTradeBalance.data.list.find(
      (item: any) => item.currency.iso3 === "SAFTP"
    );

    const dexTradeUSDTBalance = dexTradeBalance.data.list.find(
      (item: any) => item.currency.iso3 === "USDT"
    );

    const balances = {
      azbit: {
        saftp: convertScientificToDecimal(Number(azbitSAFTPBalance.amount)),
        usdt: convertScientificToDecimal(Number(azbitUSDTBalance.amount)),
      },
      coinsbit: {
        saftp: convertScientificToDecimal(
          Number(coinsbitSAFTPBalance.result.available)
        ),
        usdt: convertScientificToDecimal(
          Number(coinsbitUSDTBalance.result.available)
        ),
      },
      dexTrade: {
        saftp: convertScientificToDecimal(
          Number(dexTradeSAFTPBalance.balances.available)
        ),
        usdt: convertScientificToDecimal(
          Number(dexTradeUSDTBalance.balances.available)
        ),
      },
    };

    res.status(200).json({ balances });
  } catch (error) {
    console.error(`error while getting balances : ${error}`);
    res.status(500).json({
      success: false,
      error: "some error occured",
    });
  }
};
