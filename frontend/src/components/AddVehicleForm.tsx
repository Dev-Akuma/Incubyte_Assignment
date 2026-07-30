import { useState } from 'react';
import { Plus } from 'lucide-react';

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
    <div className="bg-[#17171C] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#6366F1]" />
          Add New Vehicle
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {error && <div role="alert" className="col-span-full p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#EF4444] rounded-xl text-sm font-medium">{error}</div>}
        
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Make</label>
          <input 
            type="text" 
            placeholder="Make" 
            value={make} 
            onChange={(e) => setMake(e.target.value)} 
            className="w-full px-4 py-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Model</label>
          <input 
            type="text" 
            placeholder="Model" 
            value={model} 
            onChange={(e) => setModel(e.target.value)} 
            className="w-full px-4 py-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Year</label>
          <input 
            type="number" 
            placeholder="Year" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            className="w-full px-4 py-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Price</label>
          <input 
            type="number" 
            placeholder="Price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full px-4 py-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Quantity</label>
          <input 
            type="number" 
            placeholder="Quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            className="w-full px-4 py-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Category</label>
          <input 
            type="text" 
            placeholder="Category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-4 py-3 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
        </div>
        
        <div className="col-span-full mt-2">
          <button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium py-3 px-6 rounded-xl transition-all">
            Add Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
