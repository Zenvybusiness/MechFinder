import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api as base44 } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function MechanicLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPhone || !newPassword) { toast.error('Please fill in all fields'); return; }
    setForgotLoading(true);
    try {
      const mechanics = await base44.entities.Mechanic.filter({ phone: forgotPhone });
      if (mechanics.length === 0) {
        toast.error('No mechanic found with this phone number');
        setForgotLoading(false);
        return;
      }
      const mech = mechanics[0];
      await base44.entities.Mechanic.update(mech.id, { password: newPassword });
      toast.success('Password reset explicitly successful! You can now log in.');
      setShowForgotModal(false);
      setForgotPhone('');
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const mechanics = await base44.entities.Mechanic.filter({ phone });
      if (!mechanics || mechanics.length === 0) {
        toast.error('No mechanic found with this phone number');
        setLoading(false);
        return;
      }
      const mech = mechanics[0];
      if (mech.password !== password) {
        toast.error('Invalid password');
        setLoading(false);
        return;
      }
      localStorage.setItem('mechanic_id', mech.id);
      localStorage.setItem('mechanic_name', mech.name);
      navigate('/mechanic/dashboard');
    } catch (error) {
       toast.error('Login failed due to a network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Mechanic Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          {/* <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="rounded-lg" />
          </div> */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Phone Number
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(onlyNums);
              }}
              placeholder="Enter 10-digit number"
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className="rounded-lg pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1.5 flex justify-end">
              <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm text-primary font-medium hover:underline">Forgot password?</button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-lg">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          New mechanic?{' '}
          <Link to="/mechanic/signup" className="text-primary font-medium hover:underline">Register here</Link>
        </p>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg border border-border p-6 w-full max-w-sm">
            <h2 className="font-heading font-bold text-xl mb-1">Reset Password</h2>
            <p className="text-sm text-muted-foreground mb-4">Enter your registered phone number and a new password.</p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                <Input value={forgotPhone} onChange={e => setForgotPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="9876543210" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">New Password</label>
                <div className="relative">
                  <Input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New secure password" className="rounded-lg pr-10" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button type="button" variant="outline" onClick={() => setShowForgotModal(false)} className="rounded-lg">Cancel</Button>
                <Button type="submit" disabled={forgotLoading} className="rounded-lg">
                  {forgotLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}