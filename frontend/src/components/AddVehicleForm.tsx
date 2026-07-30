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
    <div className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black mb-8 flex flex-col">
      <div className="bg-[#000080] text-white font-bold px-2 py-1 mb-4 flex justify-between items-center">
        <span>Add_Vehicle.exe</span>
        <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black text-black px-1 text-xs cursor-default font-bold">X</div>
      </div>
      <div className="px-4 pb-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && <div role="alert" className="col-span-1 md:col-span-2 mb-4 p-2 bg-red-600 text-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white text-sm font-bold">{error}</div>}
          <input 
            type="text" 
            placeholder="Make" 
            value={make} 
            onChange={(e) => setMake(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
          <input 
            type="text" 
            placeholder="Model" 
            value={model} 
            onChange={(e) => setModel(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
          <input 
            type="number" 
            placeholder="Year" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
          <input 
            type="text" 
            placeholder="Category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
          <div className="col-span-1 md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-[#c0c0c0] text-black font-bold py-1 px-4 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-[#000080]">
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
