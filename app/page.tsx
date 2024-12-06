"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useStore } from "@/store/store";
import { Seat } from "@/components/Seat";
import { PassengerForm } from "@/components/PassengerForm";
import { COLUMNS, ROWS, PRICE_PER_SEAT, formatPrice } from "@/utils/seats";
import { AirplaneSvg } from "@/components/AirplaneSvg";
import { toast } from "sonner";
import { Timer } from "@/components/Timer";

export default function Home() {
  const formRefs = useRef<{ [key: number]: { resetForm: () => void } }>({});
  const [openForm, setOpenForm] = useState<number | null>(1);
  const [passengers, setPassengers] = useState<{
    [key: number]: {
      name: string;
      surname: string;
      phone: string;
      email: string;
      gender: string;
      birthDate: string;
    };
  }>({});

  // Load passengers data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPassengers = window.localStorage.getItem('passengers');
      if (savedPassengers) {
        setPassengers(JSON.parse(savedPassengers));
      }
    }
  }, []);

  // Save passengers data when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('passengers', JSON.stringify(passengers));
    }
  }, [passengers]);

  const handleLocalReset = useCallback(() => {
    setPassengers({});
    setOpenForm(1);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('passengers');
    }
  }, []);

  const {
    seats,
    selectedSeats,
    occupiedUsers,
    selectSeat,
    handleReset,
    setOnTimeOut,
  } = useStore();

  // Register timeout callback
  useEffect(() => {
    setOnTimeOut(() => {
      // Reset all form data using refs when timer runs out
      Object.values(formRefs.current).forEach((form) => form.resetForm());
      handleLocalReset();
    });
  }, [handleLocalReset, setOnTimeOut]);

  const handleFormToggle = (index: number) => {
    setOpenForm(openForm === index ? null : index);
  };

  const handleComplete = () => {
    if (selectedSeats.length === 0) {
      toast.error("Lütfen en az bir koltuk seçin");
      return;
    }

    // Get both current and saved passengers
    const savedFormsStr = localStorage.getItem('passengerForms');
    const savedForms = savedFormsStr ? JSON.parse(savedFormsStr) : {};

    // Combine current passengers with saved ones
    const allPassengers = { ...savedForms, ...passengers };

    const filledPassengers = Object.values(allPassengers).filter(
      (p): p is typeof passengers[number] => {
        const passenger = p as typeof passengers[number];
        return !!(passenger.name && passenger.surname && passenger.phone && passenger.email && passenger.gender && passenger.birthDate);
      }
    );

    if (filledPassengers.length !== selectedSeats.length) {
      toast.error("Lütfen tüm yolcu bilgilerini doldurun");
      return;
    }

    toast.success("Rezervasyon başarıyla tamamlandı!");

    // Clear only current session data but keep saved passengers
    handleReset(() => {
      setPassengers({});
      setOpenForm(1);
      // Don't remove passengers from localStorage
      Object.values(formRefs.current).forEach(form => form.resetForm());
    });
  };

  // Add ref collection function
  const registerFormRef = (index: number, ref: { resetForm: () => void }) => {
    formRefs.current[index] = ref;
  };

  const handlePassengerSubmit = (
    index: number,
    data: {
      name: string;
      surname: string;
      phone: string;
      email: string;
      gender: string;
      birthDate: string;
    }
  ) => {
    setPassengers((prev) => ({ ...prev, [index]: data }));
  };

  // Add hydration effects
  useEffect(() => {
    const hydratePassengers = () => {
      if (typeof window !== 'undefined') {
        const savedPassengers = window.localStorage.getItem('passengers');
        if (savedPassengers) {
          setPassengers(JSON.parse(savedPassengers));
        }
      }
    };

    hydratePassengers();
    // Also re-hydrate store data
    useStore.getState().hydrateFromLocalStorage();
  }, []);

  // Add route change handler to preserve state
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('passengers', JSON.stringify(passengers));
      localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [passengers, selectedSeats]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="relative bg-white p-8 rounded-lg shadow">
          <div className="relative w-full max-w-[1200px] h-[800px] mx-auto">
            <div className="absolute inset-0 scale-y-100 origin-top translate-y-52">
              <AirplaneSvg />
            </div>
            <div className="absolute inset-0 flex items-start justify-center pl-24 pt-[80px]">
              <div className="w-[220px] flex gap-4 relative">
                {/* Adjust Entry/Exit text positions - move closer to seats */}
                <div className="absolute top-[100px] -left-32 w-[100px] text-center text-sm font-medium whitespace-nowrap">
                  Giriş / Entry
                </div>
                <div className="absolute top-[100px] -right-6 w-[100px] text-center text-sm font-medium whitespace-nowrap">
                  Çıkış / Exit
                </div>
                <div className="grid grid-cols-2 gap-x-0.5 gap-y-1">
                  {ROWS.map((row) =>
                    COLUMNS.slice(0, 2).map((col) => {
                      const seat = seats.find((s) => s.id === `${row}${col}`);
                      const occupiedUser = seat?.isOccupied
                        ? occupiedUsers[seat.id]
                        : undefined; // Fetch from map

                      return (
                        <Seat
                          key={`${row}${col}`}
                          seat={seat!}
                          isSelected={selectedSeats.includes(`${row}${col}`)}
                          occupiedUser={occupiedUser}
                          onSelect={selectSeat}
                          className={seat?.isExitRow ? "mt-6" : ""}
                        />
                      );
                    })
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-0.5 gap-y-1">
                  {" "}
                  {ROWS.map((row) =>
                    COLUMNS.slice(2).map((col) => {
                      const seat = seats.find((s) => s.id === `${row}${col}`);
                      const occupiedUser = seat?.isOccupied
                        ? occupiedUsers[seat.id]
                        : undefined; // Fetch from map

                      return (
                        <Seat
                          key={`${row}${col}`}
                          seat={seat!}
                          isSelected={selectedSeats.includes(`${row}${col}`)}
                          occupiedUser={occupiedUser}
                          onSelect={selectSeat}
                          className={seat?.isExitRow ? "mt-6" : ""}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400"></div>
              <span>Dolu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400"></div>
              <span>Seçili</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-400"></div>
              <span>Boş</span>
            </div>
          </div>
        </div>

        <div>
          {[1, 2, 3].map((index) => (
            <PassengerForm
              key={index}
              index={index}
              isOpen={openForm === index}
              onToggle={() => handleFormToggle(index)}
              onSubmit={(data) => handlePassengerSubmit(index, data)}
              disabled={index > selectedSeats.length}
              ref={(ref) =>
                registerFormRef(index, ref as { resetForm: () => void })
              }
              initialData={passengers[index]} // Pass saved passenger data
            />
          ))}

          <Timer />

          <div className="mt-4 p-4 bg-gray-100 rounded">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {selectedSeats.map((seatId) => (
                  <div key={seatId} className="px-2 py-1 bg-yellow-400 rounded">
                    {seatId}
                  </div>
                ))}
              </div>
              <div className="text-xl font-bold">
                {formatPrice(selectedSeats.length * PRICE_PER_SEAT)}
              </div>
            </div>
            <button onClick={handleComplete} className="complete-button">
              İşlemleri Tamamla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
