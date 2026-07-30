import { useState, useEffect } from 'react';
import AddVehicleForm from './AddVehicleForm';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  quantity: number;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSell = async (id: number) => {
    try {
      const response = await fetch(`/api/vehicles/${id}/sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantity: 1 })
      });
      if (response.ok) {
        fetchVehicles();
      }
    } catch (error) {
      console.error('Failed to sell vehicle:', error);
    }
  };

  const handleRestock = async (id: number) => {
    try {
      const response = await fetch(`/api/vehicles/${id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantity: 1 })
      });
      if (response.ok) {
        fetchVehicles();
      }
    } catch (error) {
      console.error('Failed to restock vehicle:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        fetchVehicles();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || 'Only admins can delete');
      }
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      setError('An unexpected error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <AddVehicleForm onVehicleAdded={fetchVehicles} />
      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            {vehicle.year} {vehicle.make} {vehicle.model} - Qty: {vehicle.quantity}
            <button onClick={() => handleSell(vehicle.id)}>Sell</button>
            <button onClick={() => handleRestock(vehicle.id)}>Restock</button>
            <button onClick={() => handleDelete(vehicle.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
