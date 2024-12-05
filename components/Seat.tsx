import { useState } from "react";
import { Seat as SeatType, User } from "@/types";
import { toast } from "sonner";

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  occupiedUser?: User;
  onSelect: (seatId: string) => void;
  className?: string; // Add this line
}

export const Seat: React.FC<SeatProps> = ({
  seat,
  isSelected,
  occupiedUser,
  onSelect,
  className,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className={`w-6 h-5 text-[10px] border border-gray-400 ${
          seat.isOccupied
            ? "bg-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-yellow-400"
            : "bg-white"
        } hover:opacity-80 transition-colors rounded p-0.5 ${className}`} // Include `className`
        onClick={() => {
          if (seat.isOccupied) {
            const user = occupiedUser;
            toast.error(
              `Bu koltuk zaten dolu! (${user ? user.name : "Kullanıcı"})`,
              {
                style: {
                  backgroundColor: "#ef4444",
                  color: "white",
                },
              }
            );
            return;
          }
          onSelect(seat.id);
        }}
        onMouseEnter={() => {
          if (seat.isOccupied && occupiedUser) {
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {seat.row}
        {seat.column}
      </button>
      {showTooltip && seat.isOccupied && occupiedUser && (
        <div className="absolute z-10 px-2 py-1 text-xs text-white bg-black rounded -top-8 whitespace-nowrap">
          {occupiedUser.name}
        </div>
      )}
    </div>
  );
};
