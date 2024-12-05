import React from "react";
import { useStore } from "@/store/store";

export const Timer: React.FC = () => {
  const remainingTime = useStore((state) => state.remainingTime);

  if (remainingTime === 0 || remainingTime === 30) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-sm text-white px-4 py-2 rounded">
      Kalan Süre: {remainingTime} saniye
    </div>
  );
};
