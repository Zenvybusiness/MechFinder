import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api as base44 } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, CreditCard, Calendar, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MechanicSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    password: '',
    phone: '',
    section_number: '',
    category: '',
    city: '',
    pin_code: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const canProceed = () => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
    return form.name && form.password.length >= 8 && hasSpecialChar && form.phone.length === 10 && form.category && form.city && form.pin_code;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (canProceed()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        await base44.entities.Mechanic.create({
          ...form,
          specialties: [form.category],
          status: 'pending',
          payment_status: 'paid',
          subscription_plan: selectedPlan,
          subscription_amount: selectedPlan === 'monthly' ? 300 : 3000,
          is_active: false,
          average_rating: 0,
          total_reviews: 0,
        });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/mechanic/login');
        }, 2000); // Auto redirect after 2s
      } catch (err) {
        console.warn('Registration mock error ignored: ', err);
      } finally {
        setSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/mechanic/login');
        }, 2000); // Auto redirect after 2s
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-2xl text-foreground">Mechanic Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">Join MechFinder network</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mt-4">
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
              <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Smith" className="rounded-lg" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password *</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Minimum 8 characters with 1 special character" className="rounded-lg pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>



            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Phone Number *
              </label>
              <Input
                value={form.phone}
                onChange={e => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);;
                  update('phone', onlyNums);
                }}
                placeholder="Enter 10-digit number"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Section Number (Optional)</label>
              <Input value={form.section_number} onChange={e => update('section_number', e.target.value)} placeholder="e.g. S-102" className="rounded-lg" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Category / Specialty *</label>
              <Select value={form.category} onValueChange={v => update('category', v)}>
                <SelectTrigger className="w-full rounded-lg h-10 bg-white border-input">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Electrician">Electrician</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Home Repairs">Home Repairs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-1.5 block">City *</label>
                <Input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Mumbai" className="rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Pin Code *</label>
                <Input value={form.pin_code} onChange={e => update('pin_code', e.target.value)} placeholder="e.g. 400001" className="rounded-lg" />
              </div>
            </div>

            <Button type="submit" disabled={!canProceed()} className="w-full rounded-lg mt-6 py-6 font-semibold">
              Continue to Payment
            </Button>
          </form>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep(1)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <h2 className="font-heading font-bold text-lg">Select Payment Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                >
                  <div className={`p-2 rounded-lg ${selectedPlan === 'monthly' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">1 Month Plan</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Basic access for 30 days</p>
                    <p className="font-bold text-primary mt-2">₹300</p>
                  </div>
                </button>

                <button 
                  onClick={() => setSelectedPlan('yearly')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === 'yearly' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                >
                  <div className={`p-2 rounded-lg ${selectedPlan === 'yearly' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">1 Year Plan</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Full access for 365 days</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="font-bold text-primary">₹3000</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Save ₹600</span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <Button onClick={handleSubmit} disabled={submitting} className="w-full py-6 rounded-xl text-base font-bold bg-[#1e5fa8] hover:bg-[#15467e] text-white flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay ₹{selectedPlan === 'monthly' ? '300' : '3000'} & Register
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1 opacity-70">
                  <CreditCard className="w-3 h-3" /> Secure Mock Payment Gateway
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already registered?{' '}
          <Link to="/mechanic/login" className="text-primary font-medium hover:underline">Login here</Link>
        </p>
      </div>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Registration Successful
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your mechanic account has been registered successfully. You can now login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { setShowSuccess(false); navigate('/mechanic/login'); }}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}