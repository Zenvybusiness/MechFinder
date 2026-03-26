import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api as base44 } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Users, CheckCircle, Clock, CreditCard, LogOut, Search } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AdminMechanicRow from '../components/AdminMechanicRow';
import { toast } from 'sonner';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'paid', label: 'Paid' },
  { key: 'unpaid', label: 'Unpaid' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { 
    if (localStorage.getItem('admin_session') !== 'true') {
      navigate('/admin/login');
      return;
    }
    loadMechanics(); 
  }, [navigate]);

  const loadMechanics = async () => {
    setLoading(true);
    const data = await base44.entities.Mechanic.list('-created_date');
    setMechanics(data);
    setLoading(false);
  };

  const handleApprove = async (id) => { 
    await base44.entities.Mechanic.update(id, { status: 'approved', is_active: true }); 
    toast.success('Approved'); 
    setMechanics(prev => prev.map(m => m.id === id ? { ...m, status: 'approved', is_active: true } : m));
  };

  const handleReject = async (id) => { 
    await base44.entities.Mechanic.update(id, { status: 'rejected', is_active: false }); 
    toast.success('Rejected'); 
    setMechanics(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected', is_active: false } : m));
  };

  const handleDelete = async (id) => { 
    await base44.entities.Mechanic.delete(id); 
    toast.success('Deleted'); 
    setMechanics(prev => prev.filter(m => m.id !== id));
  };

  const handleTogglePayment = async (mech) => {
    const newStatus = mech.payment_status === 'paid' ? 'unpaid' : 'paid';
    const isActive = newStatus === 'paid' && mech.status === 'approved';
    await base44.entities.Mechanic.update(mech.id, {
      payment_status: newStatus,
      payment_date: newStatus === 'paid' ? new Date().toISOString() : null,
      payment_amount: newStatus === 'paid' ? 999 : 0,
      is_active: isActive,
    });
    toast.success(`Payment status: ${newStatus}`);
    setMechanics(prev => prev.map(m => m.id === mech.id ? { 
      ...m, 
      payment_status: newStatus, 
      is_active: isActive 
    } : m));
  };

  const filtered = mechanics.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.name?.toLowerCase().includes(q) || m.city?.toLowerCase().includes(q) || m.phone?.includes(q);
    const matchFilter = filter === 'all' || m.status === filter || m.payment_status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: mechanics.length,
    approved: mechanics.filter(m => m.status === 'approved').length,
    pending: mechanics.filter(m => m.status === 'pending').length,
    paid: mechanics.filter(m => m.payment_status === 'paid').length,
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform management console</p>
          </div>
          <Button variant="outline" onClick={() => { localStorage.removeItem('admin_session'); navigate('/admin/login'); }} className="rounded-lg text-sm">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Mechanics" value={stats.total} icon={Users} />
          <StatsCard label="Approved" value={stats.approved} icon={CheckCircle} accent />
          <StatsCard label="Pending Approval" value={stats.pending} icon={Clock} />
          <StatsCard label="Payments Received" value={stats.paid} icon={CreditCard} />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-heading font-semibold text-lg text-foreground">Mechanic Registry</h2>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mechanics..." className="pl-9 rounded-lg text-sm h-9" />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-border overflow-x-auto px-2">
            {FILTER_TABS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  filter === f.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}>{f.label}</button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14"><p className="text-muted-foreground font-medium">No mechanics found</p></div>
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden lg:grid grid-cols-12 gap-3 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-3">Mechanic</div>
                <div className="col-span-2">Shop</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Payment</div>
                <div className="col-span-3">Actions</div>
              </div>
              {filtered.map(m => (
                <AdminMechanicRow key={m.id} mechanic={m}
                  onApprove={() => handleApprove(m.id)}
                  onReject={() => handleReject(m.id)}
                  onDelete={() => handleDelete(m.id)}
                  onTogglePayment={() => handleTogglePayment(m)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}