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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.category && v.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    return <div className="min-h-screen flex items-center justify-center bg-[#008080] text-white font-bold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#008080] pb-12">
      <nav className="bg-[#c0c0c0] border-b-2 border-b-black p-2 flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black">Dashboard.exe</h2>
        <button onClick={handleLogout} className="bg-[#c0c0c0] text-black font-bold py-1 px-4 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">Logout</button>
      </nav>
      <div className="max-w-6xl mx-auto px-4">
        {error && <div role="alert" className="mb-6 p-2 bg-red-600 text-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white font-bold">{error}</div>}
        <AddVehicleForm onVehicleAdded={fetchVehicles} />

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search inventory by make, model, or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black flex flex-col">
              <div className="bg-[#000080] text-white font-bold px-2 py-1 mb-2 flex justify-between items-center text-sm">
                <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
              </div>
              <div className="px-2 pb-2 flex-grow text-black">
                <p className="mb-1"><span className="font-bold">Category:</span> {vehicle.category || 'N/A'}</p>
                <p className="mb-1"><span className="font-bold">Price:</span> ${vehicle.price || 0}</p>
                <p><span className="font-bold">Qty:</span> {vehicle.quantity}</p>
              </div>
              <div className="bg-[#c0c0c0] p-2 flex gap-2 border-t-2 border-gray-400 mt-2">
                <button 
                  onClick={() => handleSell(vehicle.id)} 
                  disabled={vehicle.quantity === 0}
                  className="flex-1 bg-[#c0c0c0] text-[#000080] font-bold py-1 px-2 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white disabled:opacity-50 disabled:active:border-t-white disabled:active:border-l-white disabled:active:border-b-black disabled:active:border-r-black"
                >
                  Sell
                </button>
                <button onClick={() => handleRestock(vehicle.id)} className="flex-1 bg-[#c0c0c0] text-[#006400] font-bold py-1 px-2 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">Restock</button>
                <button onClick={() => handleDelete(vehicle.id)} className="flex-1 bg-[#c0c0c0] text-[#8b0000] font-bold py-1 px-2 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
