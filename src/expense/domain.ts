import { TrendsInterval } from "./types";

interface DateRange {
  startDate: string;
  endDate: string;
}

export function generateDates(interval: TrendsInterval): DateRange[] {
  const dates: DateRange[] = [];
  let days: number;
  let increment: number;

  if (interval === "daily") {
    days = 7;
    increment = 1;
  } else if (interval === "weekly") {
    days = 7 * 7; // 7 weeks
    increment = 7;
  } else if (interval === "monthly") {
    days = 30 * 7; // 7 months considering each month has 30 days for simplicity
    increment = 30;
  } else {
    console.error(
      "Invalid interval. Please specify 'daily', 'weekly', or 'monthly'."
    );
    return [];
  }

  for (let i = 0; i < days; i += increment) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - i);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    const endDate = new Date(startDate);
    if (interval === "daily" || interval === "weekly") {
      endDate.setDate(endDate.getDate() - (increment - 1));
    } else if (interval === "monthly") {
      endDate.setMonth(endDate.getMonth() - 1);
    }
    const formattedEndDate = endDate.toISOString().split("T")[0];

    dates.push({ startDate: formattedStartDate, endDate: formattedEndDate });
  }
  return dates;
}

interface Transaction {
  id: number;
  amount: string;
  textMessage: string;
  categoryName: string;
  createdAt: string;
}

export function calculateTotalAmount(transactions: Transaction[]): number {
  let totalAmount: number = 0;
  transactions.forEach((transaction) => {
    totalAmount += parseInt(transaction.amount);
  });
  return totalAmount;
}
