import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api as base44 } from '@/api/apiClient';
import { MapPin, Phone, ArrowLeft, Star, Loader2, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import PowerBar from '../components/PowerBar';
import PhotoGallery from '../components/PhotoGallery';
import ReviewCard from '../components/ReviewCard';
import { toast } from 'sonner';

export default function MechanicProfilePage() {
  const { id } = useParams();
  const [mechanic, setMechanic] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await base44.entities.Mechanic.filter({ id });
      if (data.length > 0) setMechanic(data[0]);
      const revs = await base44.entities.Review.filter({ mechanic_id: id }, '-created_date');
      setReviews(revs);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewForm.reviewer_name || !reviewForm.comment) { toast.error('Please fill in all fields'); return; }
    setSubmitting(true);
    await base44.entities.Review.create({ ...reviewForm, mechanic_id: id });
    const allReviews = [...reviews, reviewForm];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await base44.entities.Mechanic.update(id, {
      average_rating: Math.round(avgRating * 10) / 10,
      total_reviews: allReviews.length,
    });
    const revs = await base44.entities.Review.filter({ mechanic_id: id }, '-created_date');
    setReviews(revs);
    setMechanic(p => ({ ...p, average_rating: Math.round(avgRating * 10) / 10, total_reviews: allReviews.length }));
    setReviewForm({ reviewer_name: '', rating: 5, comment: '' });
    setSubmitting(false);
    toast.success('Review submitted!');
  };

  const handlePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setHasPaid(true);
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      toast.success('Payment successful! Contact details unlocked for this session.');
    }, 1500);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!mechanic) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-muted-foreground">Mechanic not found</p>
      <Link to="/" className="text-primary hover:underline text-sm">← Back to Search</Link>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative h-64 bg-gradient-to-br from-primary to-[#1e5fa8] overflow-hidden">
        {(mechanic.shop_photos?.[0] || mechanic.profile_photo) && (
          <img src={mechanic.shop_photos?.[0] || mechanic.profile_photo} alt="" className="w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto flex items-end gap-5">
          <div className="hidden sm:block w-20 h-20 rounded-full border-4 border-white overflow-hidden shrink-0 shadow-lg">
            {mechanic.profile_photo
              ? <img src={mechanic.profile_photo} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-primary/20 flex items-center justify-center"><span className="font-heading font-bold text-2xl text-white">{mechanic.name?.charAt(0)}</span></div>
            }
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-300 text-xs font-medium">Verified Mechanic</span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">{mechanic.name}</h1>
            <p className="text-cyan-300 font-medium">{mechanic.shop_name}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Rating</p>
                <PowerBar rating={Number(mechanic.average_rating) || 0} size="md" />
                <p className="text-xs text-muted-foreground mt-1">{mechanic.total_reviews || 0} reviews</p>
              </div>
              <div className="bg-white rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Location</p>
                <p className="text-sm font-semibold text-foreground">{mechanic.city}</p>
                <p className="text-xs text-muted-foreground">{mechanic.pin_code}</p>
              </div>
              <div className="bg-white rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {(mechanic.specialties || []).map(s => (
                    <span key={s} className="px-2 py-0.5 text-xs font-medium bg-primary/8 text-primary rounded-full border border-primary/15">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Shop Photos */}
            {mechanic.shop_photos?.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-heading font-semibold text-base mb-4">Shop Gallery</h3>
                <PhotoGallery photos={mechanic.shop_photos} />
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 className="font-heading font-semibold text-base mb-3">Reviews ({reviews.length})</h3>
              {reviews.length === 0
                ? <div className="bg-white rounded-xl border border-dashed border-border p-8 text-center"><p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p></div>
                : <div className="space-y-3">{reviews.map(r => <ReviewCard key={r.id} review={r} />)}</div>
              }
            </div>
          </div>

          {/* Right - Sticky */}
          <div className="lg:col-span-2 space-y-4">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-4">
              <h3 className="font-heading font-semibold text-base">Contact</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {hasPaid ? `${mechanic.address}, ` : ''}{mechanic.city} — {mechanic.pin_code}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {hasPaid ? mechanic.phone : '+91 ••••• •••••'}
                  </span>
                </div>
              </div>
              
              {hasPaid ? (
                <a href={`tel:${mechanic.phone}`} className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              ) : (
                <div className="pt-2">
                  <Button onClick={() => setShowPaymentModal(true)} className="w-full py-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2 text-sm shadow-md transition-all">
                    <Lock className="w-4 h-4" />
                    Pay ₹5 to View Details
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-2">Secure payment to unlock complete profile</p>
                </div>
              )}

              {/* Write Review */}
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="font-heading font-semibold text-sm">Write a Review</h4>
                <Input placeholder="Your name" value={reviewForm.reviewer_name} onChange={e => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })} className="rounded-lg text-sm" />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Your rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(r => (
                      <button key={r} onClick={() => setReviewForm({ ...reviewForm, rating: r })}>
                        <Star className={`w-6 h-6 cursor-pointer transition-colors ${r <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200 hover:text-yellow-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} className="rounded-lg text-sm min-h-[90px]" />
                <Button onClick={handleSubmitReview} disabled={submitting} className="w-full rounded-xl">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="font-heading font-bold text-xl mb-2 text-center">Unlock Contact Details</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">Pay a nominal fee of ₹5 to view the complete address and phone number for {mechanic.name}.</p>
            
            <div className="bg-secondary/50 p-4 rounded-xl border border-border mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile View Fee</span>
                <span className="text-base font-bold">₹5.00</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground border-b border-border pb-3 mb-3">
                <span className="text-xs">GST (0%)</span>
                <span className="text-xs">₹0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Total Payable</span>
                <span className="text-lg font-bold text-primary">₹5.00</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handlePayment} 
                disabled={paymentProcessing}
                className="w-full py-6 rounded-xl text-base font-bold bg-[#1e5fa8] hover:bg-[#15467e] text-white flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ₹5 Securely
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setShowPaymentModal(false)} 
                variant="ghost" 
                disabled={paymentProcessing}
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-4 flex items-center justify-center gap-1 opacity-70">
              <Lock className="w-3 h-3" /> Secure Mock Payment Gateway
            </p>
          </div>
        </div>
      )}
    </div>
  );
}