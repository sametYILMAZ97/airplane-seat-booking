import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { toast } from "sonner";

interface PassengerFormProps {
  index: number;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onSubmit: (data: {
    name: string;
    surname: string;
    phone: string;
    email: string;
    gender: string;
    birthDate: string;
  }) => void;
  initialData?: {
    name: string;
    surname: string;
    phone: string;
    email: string;
    gender: string;
    birthDate: string;
  };
}

export const PassengerForm = forwardRef<
  { resetForm: () => void },
  PassengerFormProps
>(({ index, isOpen, disabled, onToggle, onSubmit, initialData }, ref) => {
PassengerForm.displayName = 'PassengerForm';
  const [formData, setFormData] = useState(() => {
    // Try to get saved form data from localStorage first
    if (typeof window !== 'undefined') {
      const savedForms = localStorage.getItem('passengerForms');
      if (savedForms) {
        const forms = JSON.parse(savedForms);
        if (forms[index]) {
          return forms[index];
        }
      }
    }
    // Fall back to initialData or empty object
    return initialData || {
      name: "",
      surname: "",
      phone: "",
      email: "",
      gender: "",
      birthDate: "",
    };
  });

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedForms = localStorage.getItem('passengerForms');
      const forms = savedForms ? JSON.parse(savedForms) : {};
      forms[index] = formData;
      localStorage.setItem('passengerForms', JSON.stringify(forms));
    }
  }, [formData, index]);

  // Expose resetForm method to parent
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormData({
        name: "",
        surname: "",
        phone: "",
        email: "",
        gender: "",
        birthDate: "",
      });
      // Clear the form data from all storages
      if (typeof window !== 'undefined') {
        const savedForms = localStorage.getItem('passengerForms');
        if (savedForms) {
          const forms = JSON.parse(savedForms);
          delete forms[index];
          localStorage.setItem('passengerForms', JSON.stringify(forms));
        }
        const savedPassengers = localStorage.getItem('passengers');
        if (savedPassengers) {
          const passengers = JSON.parse(savedPassengers);
          delete passengers[index];
          localStorage.setItem('passengers', JSON.stringify(passengers));
        }
      }
    }
  }));

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    onSubmit(formData);
    toast.success("Yolcu bilgileri kaydedildi", {
      style: {
        backgroundColor: "#22c55e",
        color: "white",
      },
    });
    onToggle(); // Close the form after successful submission
  };

  return (
    <div className={`mb-4 ${disabled ? "opacity-50" : ""}`}>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-full p-4 text-left rounded-lg transition-colors duration-200 flex items-center justify-between ${
          isOpen
            ? "bg-zinc-50 border-zinc-200 border"
            : "bg-gray-50 hover:bg-gray-100"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            {index}
          </span>
          <span className="font-medium">Yolcu {index}</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && !disabled && (
        <form
          onSubmit={handleSubmit}
          className="p-6 border rounded-lg mt-2 bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`name-${index}`} className="block mb-1">İsim</label>
              <input
                id={`name-${index}`}
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor={`surname-${index}`} className="block mb-1">Soyisim</label>
              <input
                id={`surname-${index}`}
                type="text"
                className="w-full p-2 border rounded"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor={`phone-${index}`} className="block mb-1">Telefon</label>
              <input
                id={`phone-${index}`}
                type="tel"
                className="w-full p-2 border rounded"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor={`email-${index}`} className="block mb-1">E-Posta</label>
              <input
                id={`email-${index}`}
                type="email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor={`gender-${index}`} className="block mb-1">Cinsiyet</label>
              <select
                id={`gender-${index}`}
                className="w-full p-2 border rounded"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                required
              >
                <option value="">Seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
            <div>
              <label htmlFor={`birthDate-${index}`} className="block mb-1">Doğum Tarihi</label>
              <input
                id={`birthDate-${index}`}
                type="date"
                className="w-full p-2 border rounded"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition-colors"
          >
            Kaydet
          </button>
        </form>
      )}
    </div>
  );
});
