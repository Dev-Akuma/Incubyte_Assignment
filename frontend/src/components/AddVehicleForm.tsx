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
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {error && <div role="alert" className="col-span-1 md:col-span-2 mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
        <input 
          type="text" 
          placeholder="Make" 
          value={make} 
          onChange={(e) => setMake(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text" 
          placeholder="Model" 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="number" 
          placeholder="Year" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="col-span-1 md:col-span-2 mt-2">
          <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200">
            Add Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
