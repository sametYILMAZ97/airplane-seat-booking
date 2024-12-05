import { Seat } from "@/types";

// Left side seats A-B, right side seats C-D
export const COLUMNS = ["A", "B", "C", "D"];
export const ROWS = Array.from({ length: 15 }, (_, i) => i + 1);
export const PRICE_PER_SEAT = 1000;

export const generateSeats = (): Seat[] => {
  let occupiedCount = 0;

  return ROWS.flatMap((row) =>
    COLUMNS.map((column) => ({
      id: `${row}${column}`,
      row,
      column,
      isOccupied: ++occupiedCount <= 10, // the first 10 seats as occupied
      isExitRow: row === 4, // 4th row is emergency exit
    }))
  );
};

export const formatPrice = (price: number) => {
  return `${price.toLocaleString("tr-TR")} TL`;
};
