import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Package, Plus, DollarSign, Tag, TrendingUp, AlertTriangle } from 'lucide-react';
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0D] text-[#A1A1AA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const lowStockCount = vehicles.filter(v => v.quantity > 0 && v.quantity <= 2).length;
  const outOfStockCount = vehicles.filter(v => v.quantity === 0).length;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[rgba(255,255,255,0.08)] bg-[#0B0B0D] hidden md:flex flex-col h-screen flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#0B0B0D]" />
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">AutoSync</h2>
          </div>
          
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm font-medium">
              <Package className="w-4 h-4" />
              Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </a>
          </div>
        </div>
        <div className="mt-auto p-6">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0B0B0D]">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          
          {error && (
            <div role="alert" className="mb-6 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#EF4444] rounded-xl flex items-center justify-between text-sm font-medium">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-[#EF4444] hover:text-[#DC2626]">✕</button>
            </div>
          )}

          {/* Header & Search */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1 tracking-tight">Inventory</h1>
              <p className="text-[#A1A1AA] text-sm">Manage your vehicle catalog and stock</p>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#A1A1AA] group-focus-within:text-[#6366F1] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
              </div>
            </div>
          </header>

          <AddVehicleForm onVehicleAdded={fetchVehicles} />

          {/* Data Table */}
          <div className="bg-[#17171C] border border-[rgba(255,255,255,0.08)] rounded-[20px] overflow-hidden shadow-sm mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#111114] text-[#A1A1AA] font-medium border-b border-[rgba(255,255,255,0.08)]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Vehicle</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{vehicle.make} {vehicle.model}</span>
                          <span className="text-[#A1A1AA] text-xs mt-0.5">{vehicle.year}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#111114] text-[#A1A1AA] border border-[rgba(255,255,255,0.08)]">
                          {vehicle.category || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#A1A1AA]">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{vehicle.price?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {vehicle.quantity === 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[rgba(239,68,68,0.1)] text-[#EF4444]">
                            <AlertTriangle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : vehicle.quantity <= 2 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[rgba(245,158,11,0.1)] text-[#F59E0B]">
                            <AlertTriangle className="w-3 h-3" />
                            {vehicle.quantity} Left
                          </span>
                        ) : (
                          <span className="text-white font-medium">{vehicle.quantity}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleSell(vehicle.id)} 
                          disabled={vehicle.quantity === 0}
                          className="px-3 py-1.5 bg-white text-[#0B0B0D] rounded-lg hover:bg-[#F3F4F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium shadow-sm"
                        >
                          Sell
                        </button>
                        <button 
                          onClick={() => handleRestock(vehicle.id)} 
                          className="px-3 py-1.5 bg-[#111114] text-white border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-xs font-medium"
                        >
                          Restock
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle.id)} 
                          className="px-3 py-1.5 bg-transparent text-[#6B7280] hover:text-[#EF4444] rounded-lg transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#6B7280]">
                          <Search className="w-8 h-8 mb-3 opacity-20" />
                          <p>No vehicles found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Minimal Analytics Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111114] border border-[rgba(255,255,255,0.04)] rounded-[16px] p-5">
              <p className="text-[#6B7280] text-xs font-medium mb-1 tracking-wide uppercase">Total Vehicles</p>
              <h3 className="text-2xl font-semibold">{vehicles.length}</h3>
            </div>
            <div className="bg-[#111114] border border-[rgba(255,255,255,0.04)] rounded-[16px] p-5">
              <p className="text-[#6B7280] text-xs font-medium mb-1 tracking-wide uppercase">Total Stock</p>
              <h3 className="text-2xl font-semibold">{vehicles.reduce((acc, v) => acc + (v.quantity || 0), 0)}</h3>
            </div>
            <div className="bg-[#111114] border border-[rgba(255,255,255,0.04)] rounded-[16px] p-5">
              <p className="text-[#6B7280] text-xs font-medium mb-1 tracking-wide uppercase">Stock Alerts</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#F59E0B]">{lowStockCount}</span>
                <span className="text-[#6B7280] text-sm">low</span>
                <span className="text-[#6B7280] text-sm mx-1">•</span>
                <span className="text-2xl font-semibold text-[#EF4444]">{outOfStockCount}</span>
                <span className="text-[#6B7280] text-sm">empty</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
