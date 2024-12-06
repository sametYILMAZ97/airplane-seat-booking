import { Seat, User } from "@/types";

// Left side seats A-B, right side seats C-D
export const COLUMNS = ["A", "B", "C", "D"];
export const ROWS = Array.from({ length: 15 }, (_, i) => i + 1);
export const PRICE_PER_SEAT = 1000;

export const generateSeats = (occupiedUsers: { [key: string]: User } = {}): Seat[] => {
  return ROWS.flatMap((row) =>
    COLUMNS.map((col) => {
      const id = `${row}${col}`;
      const user = occupiedUsers[id];

      return {
        id,
        row,
        column: col,
        isOccupied: !!user,
        isExitRow: row === 5, // Change exit row to 5
        isEntryRow: row === 5, // Entry row same as exit
        occupiedBy: user ? {
          name: user.name,
          email: user.email
        } : undefined
      };
    })
  );
};

export const formatPrice = (price: number) => {
  return `${price.toLocaleString("tr-TR")} TL`;
};
