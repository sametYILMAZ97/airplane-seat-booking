import { create } from "zustand";
import { Seat, User } from "@/types";
import { generateSeats } from "@/utils/seats";
import { toast } from "sonner";

interface SeatStore {
  seats: Seat[];
  selectedSeats: string[];
  occupiedUsers: { [key: string]: User };
  inactivityTimer: NodeJS.Timeout | null;
  showInactivityWarning: boolean;
  remainingTime: number;
  setSeats: (seats: Seat[]) => void;
  setSelectedSeats: (seats: string[]) => void;
  setOccupiedUsers: (users: { [key: string]: User }) => void;
  setInactivityTimer: (timer: NodeJS.Timeout | null) => void;
  setShowInactivityWarning: (show: boolean) => void;
  setRemainingTime: (time: number) => void;
  selectSeat: (seatId: string) => void;
  handleReset: (onReset?: () => void) => void;
  startInactivityTimer: () => void;
}

export const useStore = create<SeatStore>((set, get) => ({
  seats: generateSeats(),
  selectedSeats: [],
  occupiedUsers: {
    "1A": { name: "User 1", idNumber: "ID1" },
    "1B": { name: "User 2", idNumber: "ID2" },
    "1C": { name: "User 3", idNumber: "ID3" },
    "1D": { name: "User 4", idNumber: "ID4" },
    "2A": { name: "User 5", idNumber: "ID5" },
    "2B": { name: "User 6", idNumber: "ID6" },
    "2C": { name: "User 7", idNumber: "ID7" },
    "2D": { name: "User 8", idNumber: "ID8" },
    "3A": { name: "User 9", idNumber: "ID9" },
    "3B": { name: "User 10", idNumber: "ID10" },
  },
  inactivityTimer: null,
  showInactivityWarning: false,
  remainingTime: 30, // Initialize countdown (in seconds)
  setSeats: (seats) => set({ seats }),
  setSelectedSeats: (selectedSeats) => set({ selectedSeats }),
  setOccupiedUsers: (occupiedUsers) => set({ occupiedUsers }),
  setInactivityTimer: (timer) => set({ inactivityTimer: timer }),
  setShowInactivityWarning: (show) => set({ showInactivityWarning: show }),
  setRemainingTime: (time) => set({ remainingTime: time }),
  selectSeat: (seatId) => {
    const { seats, selectedSeats, startInactivityTimer } = get();
    const seat = seats.find((s) => s.id === seatId);

    if (!seat) return;

    if (seat.isOccupied) {
      toast.error("Bu koltuk zaten dolu!", {
        style: {
          backgroundColor: "#ef4444",
          color: "white",
        },
      });
      return;
    }

    if (selectedSeats.includes(seatId)) {
      set({ selectedSeats: selectedSeats.filter((id) => id !== seatId) });
    } else {
      if (selectedSeats.length >= 3) {
        toast.error("En fazla 3 koltuk seçebilirsiniz!", {
          style: {
            backgroundColor: "#ef4444",
            color: "white",
          },
        });
        return;
      }
      set({ selectedSeats: [...selectedSeats, seatId] });
      startInactivityTimer();
    }
  },
  handleReset: (onReset) => {
    const { setShowInactivityWarning } = get();
    setShowInactivityWarning(false);
    set({
      selectedSeats: [],
      seats: generateSeats(),
    });
    if (onReset) onReset();
    localStorage.clear();
  },
  startInactivityTimer: () => {
    const { inactivityTimer, handleReset, setRemainingTime } = get();

    if (inactivityTimer) {
      // Timer is already running, do not reset
      return;
    }

    setRemainingTime(30); // Initialize countdown

    const timer = setInterval(() => {
      const currentTime = get().remainingTime;
      if (currentTime > 0) {
        set({ remainingTime: currentTime - 1 });
      } else {
        clearInterval(timer);
        set({ inactivityTimer: null });
        handleReset();
      }
    }, 1000);

    set({ inactivityTimer: timer });
  },
}));
