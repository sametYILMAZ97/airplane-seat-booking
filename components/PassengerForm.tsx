import { useState } from 'react';

interface PassengerFormProps {
  index: number;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onSubmit: (data: { name: string; idNumber: string }) => void;
}

export const PassengerForm = ({
  index,
  isOpen,
  disabled,
  onToggle,
  onSubmit,
}: PassengerFormProps) => {
  const [formData, setFormData] = useState({ name: '', idNumber: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-full p-4 text-left rounded-lg transition-colors duration-200 flex items-center justify-between ${
          isOpen ? 'bg-zinc-50 border-zinc-200 border' : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            {index}
          </span>
          <span className="font-medium">Yolcu {index}</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && !disabled && (
        <form onSubmit={handleSubmit} className="p-6 border rounded-lg mt-2 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">İsim</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">Soyisim</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Telefon</label>
              <input type="tel" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">E-Posta</label>
              <input type="email" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Cinsiyet</label>
              <select className="w-full p-2 border rounded">
                <option value="">Seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Doğum Tarihi</label>
              <input
                type="text"
                placeholder="gg/aa/yyyy"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

