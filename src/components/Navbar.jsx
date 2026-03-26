import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Wrench, MessageCircle, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showSupport, setShowSupport] = useState(false);
  const [supportForm, setSupportForm] = useState({ name: '', contact: '', message: '' });
  const [supportLoading, setSupportLoading] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportForm.name || !supportForm.contact || !supportForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSupportLoading(true);
    setTimeout(() => {
      const subject = encodeURIComponent('Support Request from MechFinder');
      const body = encodeURIComponent(`Name: ${supportForm.name}\nContact: ${supportForm.contact}\n\nMessage:\n${supportForm.message}`);
      window.location.href = `mailto:kaifchoudri123@gmail.com?subject=${subject}&body=${body}`;
      
      setSupportLoading(false);
      setShowSupport(false);
      setSupportForm({ name: '', contact: '', message: '' });
      toast.success('Opening your email client to send the message...');
    }, 800);
  };

  const links = [
    { label: 'Find Mechanics', path: '/' },
    { label: 'For Mechanics', path: '/mechanic/signup' },
    { label: 'Mechanic Login', path: '/mechanic/login' },
    { label: 'Admin', path: '/admin/login' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              MechFinder
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button 
              onClick={() => setShowSupport(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5 ml-2"
            >
              <MessageCircle className="w-4 h-4" /> 24/7 Support
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-white'
                      : 'text-foreground/70 hover:bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); setShowSupport(true); }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-secondary transition-colors flex items-center gap-2 mt-2"
              >
                <MessageCircle className="w-4 h-4" /> 24/7 Support
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 24/7 Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" /> 24/7 Support
              </h3>
              <button type="button" onClick={() => setShowSupport(false)} className="p-1 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Facing registration or payment problems? Leave a message and we'll help you immediately.</p>
            
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name</label>
                <Input value={supportForm.name} onChange={e => setSupportForm({...supportForm, name: e.target.value})} placeholder="John Doe" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Number</label>
                <Input type="tel" value={supportForm.contact} onChange={e => setSupportForm({...supportForm, contact: e.target.value})} placeholder="+91 9876543210" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Problem Statement</label>
                <Textarea value={supportForm.message} onChange={e => setSupportForm({...supportForm, message: e.target.value})} placeholder="Describe your issue here..." className="rounded-lg min-h-[100px]" />
              </div>
              <Button type="submit" disabled={supportLoading} className="w-full rounded-xl py-6 bg-primary font-semibold text-white mt-2">
                {supportLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending Message...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send Message</>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}