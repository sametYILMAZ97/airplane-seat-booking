import React, { useEffect } from "react";
import { useStore } from "@/store/store";
import { toast } from "sonner";

export const Timer: React.FC = () => {
  const remainingTime = useStore((state) => state.remainingTime);
  const store = useStore();

  useEffect(() => {
    if (remainingTime === 5) {
      toast("Isleminize devam etmek istiyor musunuz?", {
        action: {
          label: "Evet",
          onClick: () => {
            // Clear existing timer and start a new one
            if (store.inactivityTimer) {
              clearInterval(store.inactivityTimer);
              store.setInactivityTimer(null);
            }
            store.startInactivityTimer();
          },
        },
      });
    }
  }, [remainingTime, store]);

  if (remainingTime === 0 || remainingTime === 30) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-sm text-white px-4 py-2 rounded">
      Kalan Süre: {remainingTime} saniye
    </div>
  );
};
