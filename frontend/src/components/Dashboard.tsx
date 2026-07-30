import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddVehicleForm from './AddVehicleForm';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  quantity: number;
  category?: string;
  price?: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200">Logout</button>
      </nav>
      <div className="max-w-6xl mx-auto px-4">
        {error && <div role="alert" className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">{error}</div>}
        <AddVehicleForm onVehicleAdded={fetchVehicles} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Category:</span> {vehicle.category || 'N/A'}</p>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Price:</span> ${vehicle.price || 0}</p>
                <p className="text-gray-600"><span className="font-semibold">Qty:</span> {vehicle.quantity}</p>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-2">
                <button onClick={() => handleSell(vehicle.id)} className="flex-1 bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition duration-200">Sell</button>
                <button onClick={() => handleRestock(vehicle.id)} className="flex-1 bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600 transition duration-200">Restock</button>
                <button onClick={() => handleDelete(vehicle.id)} className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition duration-200">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
