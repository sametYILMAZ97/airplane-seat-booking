import { useEffect } from 'react';
import { useStore } from '@/store/store';

export const useSeats = (onReset?: () => void) => {
  const store = useStore();

  useEffect(() => {
    const fetchOccupiedUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        const occupiedSeats = store.seats.filter(s => s.isOccupied);
        const mappedUsers = occupiedSeats.map((_, index) => users[index]);
        store.setOccupiedUsers(mappedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchOccupiedUsers();
  }, [store.seats]);

  useEffect(() => {
    localStorage.setItem('selectedSeats', JSON.stringify(store.seats));
    localStorage.setItem('selectedSeatIds', JSON.stringify(store.selectedSeats));
  }, [store.seats, store.selectedSeats]);

  return {
    seats: store.seats,
    selectedSeats: store.selectedSeats,
    occupiedUsers: store.occupiedUsers,
    selectSeat: store.selectSeat,
  };
};

