import { useState } from 'react';

export default function AddVehicleForm() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch('/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        make,
        model,
        year: Number(year),
        price: Number(price),
        quantity: Number(quantity)
      })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
