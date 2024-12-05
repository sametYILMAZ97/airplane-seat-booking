import { create } from "zustand";
import { Seat, User } from "@/types";
import { generateSeats } from "@/utils/seats";
import { toast } from "sonner";
import { useEffect } from "react";

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
  fetchOccupiedUsers: () => Promise<void>;
  onTimeOut?: () => void;
  setOnTimeOut: (callback: () => void) => void;
}

export const useStore = create<SeatStore>((set, get) => ({
  seats: generateSeats(),
  selectedSeats: [],
  occupiedUsers: {},
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
    const { setShowInactivityWarning, occupiedUsers } = get();
    setShowInactivityWarning(false);
    set({
      selectedSeats: [], // Only reset selected seats
      seats: generateSeats(occupiedUsers), // Pass existing occupiedUsers to maintain occupied state
    });
    if (onReset) onReset();
    // Remove localStorage.clear() to preserve occupied seats data
  },
  startInactivityTimer: () => {
    const { inactivityTimer, handleReset, setRemainingTime, onTimeOut } = get();

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
        // Call the timeout callback if set
        if (onTimeOut) onTimeOut();
      }
    }, 1000);

    set({ inactivityTimer: timer });
  },

  // Fetch users from API
  fetchOccupiedUsers: async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await response.json();
      const mappedUsers: { [key: string]: User } = {};

      // Map first 10 users to specific seats (1A through 3B)
      const seatIds = ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B'];

      users.slice(0, 10).forEach((user: any, index) => {
        const seatId = seatIds[index];
        mappedUsers[seatId] = {
          id: user.id,
          name: user.name || "",
          surname: user.name.split(' ')[1] || "",
          phone: user.phone || "",
          email: user.email || "",
          gender: "male", // Default value
          birthDate: "2000-01-01", // Default value
        };
      });

      set({
        occupiedUsers: mappedUsers,
        seats: generateSeats(mappedUsers)
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Kullanıcı verileri alınamadı.");
    }
  },
  onTimeOut: undefined,
  setOnTimeOut: (callback) => set({ onTimeOut: callback }),
}));

// Initialize fetching users
useStore.getState().fetchOccupiedUsers();
