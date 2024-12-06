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
  fetchOccupiedUsers: () => Promise<void>;
  onTimeOut?: () => void;
  setOnTimeOut: (callback: () => void) => void;
  hydrateFromLocalStorage: () => void;
}

export const useStore = create<SeatStore>((set, get) => ({
  seats: generateSeats(),
  selectedSeats: [], // Will be hydrated from localStorage
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
      const newSelectedSeats = selectedSeats.filter((id) => id !== seatId);
      set({ selectedSeats: newSelectedSeats });
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedSeats', JSON.stringify(newSelectedSeats));
      }
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
      const newSelectedSeats = [...selectedSeats, seatId];
      set({ selectedSeats: newSelectedSeats });
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedSeats', JSON.stringify(newSelectedSeats));
      }
      startInactivityTimer();
    }
  },
  handleReset: (onReset) => {
    const { setShowInactivityWarning, occupiedUsers } = get();
    setShowInactivityWarning(false);
    set({
      selectedSeats: [],
      seats: generateSeats(occupiedUsers),
    });
    if (onReset) onReset();
  },
  startInactivityTimer: () => {
    const { inactivityTimer, handleReset, setRemainingTime, onTimeOut } = get();

    if (inactivityTimer) {
      return;
    }

    setRemainingTime(30);
    if (typeof window !== 'undefined') {
      localStorage.setItem('remainingTime', '30');
    }

    const timer = setInterval(() => {
      const currentTime = get().remainingTime;
      if (currentTime > 0) {
        const newTime = currentTime - 1;
        set({ remainingTime: newTime });
        if (typeof window !== 'undefined') {
          localStorage.setItem('remainingTime', newTime.toString());
        }
      } else {
        clearInterval(timer);
        set({ inactivityTimer: null });
        // Clear all storage and state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('remainingTime');
          localStorage.removeItem('selectedSeats');
          localStorage.removeItem('passengers');
          localStorage.removeItem('passengerForms');
        }
        handleReset();
        if (onTimeOut) onTimeOut();
      }
    }, 1000);

    set({ inactivityTimer: timer });
  },

  // Fetch users from API
  fetchOccupiedUsers: async () => {
    try {
      interface ApiUser {
        id: number;
        name: string;
        phone: string;
        email: string;
      }

      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = (await response.json()) as ApiUser[];
      const mappedUsers: { [key: string]: User } = {};

      // Map first 10 users to specific seats (1A through 3B)
      const seatIds = ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B'];

      users.slice(0, 10).forEach((user: ApiUser, index) => {
        const seatId = seatIds[index];
        mappedUsers[seatId] = {
          id: user.id,
          name: user.name || "",
          surname: user.name.split(' ')[1] || "",
          phone: user.phone || "",
          email: user.email || "",
          gender: "male",
          birthDate: "2000-01-01",
        };
      });

      // First update occupiedUsers, then generate seats with those users
      set({
        occupiedUsers: mappedUsers,
        seats: generateSeats(mappedUsers) // Pass occupiedUsers to generateSeats
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Kullanıcı verileri alınamadı.");
    }
  },
  onTimeOut: undefined,
  setOnTimeOut: (callback) => set({ onTimeOut: callback }),
  hydrateFromLocalStorage: () => {
    if (typeof window !== 'undefined') {
      const savedSeats = localStorage.getItem('selectedSeats');
      const savedTime = localStorage.getItem('remainingTime');

      // Restore selected seats
      if (savedSeats) {
        const parsedSeats = JSON.parse(savedSeats);
        set({
          selectedSeats: parsedSeats,
          // Regenerate seats to reflect occupied state
          seats: generateSeats(get().occupiedUsers)
        });
      }

      // Restore timer if needed
      if (savedTime) {
        const time = parseInt(savedTime, 10);
        if (time > 0) {
          set({ remainingTime: time });
          get().startInactivityTimer();
        }
      }
    }
  },
}));

// Initialize store
useStore.getState().fetchOccupiedUsers().then(() => {
  // Hydrate after fetching users
  useStore.getState().hydrateFromLocalStorage();
});
