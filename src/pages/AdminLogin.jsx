import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api as base44 } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { toast.error('Please enter both admin ID and password'); return; }
    setLoading(true);
    try {
      const resp = await base44.auth.adminLogin({ username, password });
      if (resp && resp.role === 'admin') {
        localStorage.setItem('admin_session', 'true');
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      alert('invalid user and password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Admin ID</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Admin ID" className="rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="rounded-lg" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-lg mt-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Secure Login
          </Button>
        </form>
      </div>
    </div>
  );
}