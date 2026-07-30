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
          quantity: parseInt(quantity, 10)
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
        onVehicleAdded();
      }
    } catch (err) {
      setError('An error occurred while adding the vehicle');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div role="alert">{error}</div>}
      <input 
        type="text" 
        placeholder="Make" 
        value={make} 
        onChange={(e) => setMake(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Model" 
        value={model} 
        onChange={(e) => setModel(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Year" 
        value={year} 
        onChange={(e) => setYear(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Price" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Quantity" 
        value={quantity} 
        onChange={(e) => setQuantity(e.target.value)} 
      />
      <button type="submit">Add Vehicle</button>
    </form>
  );
}
