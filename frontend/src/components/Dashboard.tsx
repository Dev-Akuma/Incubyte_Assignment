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
    return <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[rgba(255,255,255,0.05)] bg-[#0a0b0e] hidden md:flex flex-col h-screen">
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-8 text-white">
            <span className="text-[#5a4aff]">✦</span> Auto-AI
          </h2>
          <div className="space-y-1">
            <div className="px-4 py-2 text-sm text-[#a0a0ab] font-medium tracking-wider mb-2">MENU</div>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#a0a0ab] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#a0a0ab] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Team
            </a>
          </div>
        </div>
        <div className="mt-auto p-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#a0a0ab] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0d0f14] relative">
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[rgba(112,0,255,0.05)] to-transparent pointer-events-none -z-10" />
        
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {error && (
            <div role="alert" className="mb-6 p-4 bg-[rgba(220,38,38,0.1)] border border-red-500 text-red-500 rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-400">✕</button>
            </div>
          )}

          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-[#a0a0ab]">Let's manage your inventory.</p>
            </div>
          </header>

          <AddVehicleForm onVehicleAdded={fetchVehicles} />

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#14161c] border border-[rgba(255,255,255,0.05)] p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5e00] opacity-10 blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity" />
              <p className="text-[#a0a0ab] text-sm mb-1">Total Vehicles</p>
              <h3 className="text-3xl font-bold">{vehicles.length}</h3>
            </div>
            <div className="bg-[#14161c] border border-[rgba(255,255,255,0.05)] p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7000ff] opacity-10 blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity" />
              <p className="text-[#a0a0ab] text-sm mb-1">Total Stock</p>
              <h3 className="text-3xl font-bold">{vehicles.reduce((acc, v) => acc + (v.quantity || 0), 0)}</h3>
            </div>
            <div className="bg-[#14161c] border border-[rgba(255,255,255,0.05)] p-5 rounded-2xl md:col-span-2 relative overflow-hidden group flex flex-col justify-center">
              <div className="relative z-10 w-full">
                <div className="flex items-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2 focus-within:bg-[rgba(255,255,255,0.06)] focus-within:border-[rgba(255,255,255,0.25)] transition-all">
                  <svg className="w-5 h-5 text-[#a0a0ab] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" 
                    placeholder="Search inventory by make, model, or category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-[#a0a0ab] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-[#14161c] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
              <h3 className="text-lg font-bold">Inventory Management</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[rgba(255,255,255,0.02)] text-[#a0a0ab] font-medium border-b border-[rgba(255,255,255,0.05)]">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(112,0,255,0.1)] text-[#9b72ff] border border-[rgba(112,0,255,0.2)]">
                          {vehicle.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#a0a0ab]">${vehicle.price || 0}</td>
                      <td className="px-6 py-4 text-white font-medium">{vehicle.quantity}</td>
                      <td className="px-6 py-4 flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleSell(vehicle.id)} 
                          disabled={vehicle.quantity === 0}
                          className="px-3 py-1.5 bg-[#5a4aff] text-white rounded hover:bg-[#4a3aef] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          Sell
                        </button>
                        <button 
                          onClick={() => handleRestock(vehicle.id)} 
                          className="px-3 py-1.5 bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.1)] rounded hover:bg-[rgba(255,255,255,0.1)] transition-colors text-xs font-medium"
                        >
                          Restock
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle.id)} 
                          className="px-3 py-1.5 bg-[rgba(220,38,38,0.1)] text-red-400 border border-[rgba(220,38,38,0.2)] rounded hover:bg-[rgba(220,38,38,0.2)] transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#a0a0ab]">
                        No vehicles found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
