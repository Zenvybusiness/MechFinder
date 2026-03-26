import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api as base44 } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Camera, LogOut, Star, Eye, CreditCard, CheckCircle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { toast } from 'sonner';

const SPECIALTIES = ['Engine', 'Transmission', 'Brakes', 'Electrical', 'Bodywork', 'Suspension', 'AC/Heating', 'Diagnostics'];

export default function MechanicDashboard() {
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingShop, setUploadingShop] = useState(false);
  const [form, setForm] = useState({});
  const mechanicId = localStorage.getItem('mechanic_id');

  useEffect(() => {
    if (!mechanicId) { navigate('/mechanic/login'); return; }
    const load = async () => {
      setLoading(true);
      const data = await base44.entities.Mechanic.filter({ id: mechanicId });
      if (data.length > 0) { setMechanic(data[0]); setForm(data[0]); } else navigate('/mechanic/login');
      setLoading(false);
    };
    load();
  }, [mechanicId]);

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingProfile(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update('profile_photo', file_url); setUploadingProfile(false);
  };

  const handleShopUpload = async (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    setUploadingShop(true);
    const urls = [];
    for (const file of files) { const { file_url } = await base44.integrations.Core.UploadFile({ file }); urls.push(file_url); }
    update('shop_photos', [...(form.shop_photos || []), ...urls]); setUploadingShop(false);
  };

  const toggleSpecialty = (s) => {
    const cur = form.specialties || [];
    update('specialties', cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]);
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_date, updated_date, created_by, ...rest } = form;
    await base44.entities.Mechanic.update(mechanicId, rest);
    setMechanic(form);
    toast.success('profile saved successful');
    setShowSuccessModal(true);
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!mechanic) return null;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">My Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {mechanic.name}</p>
          </div>
          <Button variant="outline" onClick={() => { localStorage.removeItem('mechanic_id'); navigate('/mechanic/login'); }} className="rounded-lg text-sm">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Account Status" value={mechanic.status?.charAt(0).toUpperCase() + mechanic.status?.slice(1)} icon={Eye} accent={mechanic.status === 'approved'} />
          <StatsCard label="Payment Status" value={mechanic.payment_status?.charAt(0).toUpperCase() + mechanic.payment_status?.slice(1)} icon={CreditCard} />
          <StatsCard label="Avg. Rating" value={(Number(mechanic.average_rating) || 0).toFixed(1)} icon={Star} accent />
          <StatsCard label="Total Reviews" value={mechanic.total_reviews || 0} icon={Eye} />
        </div>

        {/* Status Banners */}
        {mechanic.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-700 font-medium">⏳ Your account is pending approval. Your profile won't be visible until approved by an admin.</p>
          </div>
        )}
        {mechanic.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 font-medium">❌ Your account has been rejected. Please contact support.</p>
          </div>
        )}
        {mechanic.payment_status === 'unpaid' && mechanic.status === 'approved' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700 font-medium">💳 Payment required to activate your profile.</p>
          </div>
        )}

        {/* Edit Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-heading font-semibold text-lg text-foreground">Edit Profile</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-border bg-secondary overflow-hidden shrink-0">
                {form.profile_photo ? <img src={form.profile_photo} alt="" className="w-full h-full object-cover" /> : <Camera className="w-7 h-7 text-muted-foreground" />}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-muted transition-colors">
                {uploadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingProfile ? 'Uploading...' : 'Change Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[['Name', 'name', 'Your name'], ['Phone', 'phone', '+91...'], ['Shop Name', 'shop_name', 'Shop name'], ['City', 'city', 'City'], ['Pin Code', 'pin_code', 'Pin code']].map(([label, field, placeholder]) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
                  <Input value={form[field] || ''} onChange={e => update(field, e.target.value)} placeholder={placeholder} className="rounded-lg" />
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
              <Textarea value={form.address || ''} onChange={e => update('address', e.target.value)} className="rounded-lg" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Specialties</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      (form.specialties || []).includes(s) ? 'bg-primary text-white border-primary' : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Shop Photos */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Shop Photos</label>
              {(form.shop_photos || []).length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {form.shop_photos.map((p, i) => (
                    <div key={i} className="relative aspect-video rounded-lg border border-border overflow-hidden group">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => update('shop_photos', form.shop_photos.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-muted transition-colors w-fit">
                {uploadingShop ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingShop ? 'Uploading...' : 'Add Photos'}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleShopUpload} />
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button onClick={handleSave} disabled={saving} className="rounded-lg">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg border border-border p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-heading font-semibold text-xl mb-2 text-foreground">Success!</h2>
            <p className="text-muted-foreground mb-6">profile saved successful</p>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full rounded-lg">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}