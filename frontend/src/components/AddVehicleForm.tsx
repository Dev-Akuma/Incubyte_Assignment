import { useState } from 'react';

interface AddVehicleFormProps {
  onVehicleAdded: () => void;
}

export default function AddVehicleForm({ onVehicleAdded }: AddVehicleFormProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          make,
          model,
          year: parseInt(year, 10),
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail[0].msg);
        } else {
          setError(data.detail || 'Failed to add vehicle');
        }
      } else {
        setMake('');
        setModel('');
        setYear('');
        setPrice('');
        setQuantity('');
        setCategory('');
        onVehicleAdded();
      }
    } catch (err) {
      setError('An error occurred while adding the vehicle');
    }
  };

  return (
    <div className="bg-[#14161c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 mb-8 shadow-lg">
      <div className="mb-6 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-[#5a4aff]">✦</span> Add New Vehicle
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {error && <div role="alert" className="col-span-1 md:col-span-3 mb-4 p-3 bg-[rgba(220,38,38,0.1)] border border-red-500 text-red-500 rounded-lg text-sm text-center">{error}</div>}
        
        <input 
          type="text" 
          placeholder="Make" 
          value={make} 
          onChange={(e) => setMake(e.target.value)} 
          className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[rgba(255,255,255,0.25)] focus:bg-[rgba(255,255,255,0.06)] transition-all"
        />
        <input 
          type="text" 
          placeholder="Model" 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[rgba(255,255,255,0.25)] focus:bg-[rgba(255,255,255,0.06)] transition-all"
        />
        <input 
          type="number" 
          placeholder="Year" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[rgba(255,255,255,0.25)] focus:bg-[rgba(255,255,255,0.06)] transition-all"
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[rgba(255,255,255,0.25)] focus:bg-[rgba(255,255,255,0.06)] transition-all"
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[rgba(255,255,255,0.25)] focus:bg-[rgba(255,255,255,0.06)] transition-all"
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[rgba(255,255,255,0.25)] focus:bg-[rgba(255,255,255,0.06)] transition-all"
        />
        <div className="col-span-1 md:col-span-3 mt-4">
          <button type="submit" className="w-full bg-[#5a4aff] hover:bg-[#4a3aef] text-white font-medium py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(90,74,255,0.2)]">
            Add Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
