import React from 'react';
import { useStore } from '@/store/store';

export const Timer: React.FC = () => {
  const remainingTime = useStore(state => state.remainingTime);

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-sm text-white px-4 py-2 rounded"> {/* Changed text-white to text-sm text-white */}
      Kalan Süre: {remainingTime} saniye
    </div>
  );
};