import { Link } from 'react-router-dom';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                MechFinder
              </span>
            </div>
            <p className="text-sm text-foreground mb-4">
              Your trusted network of certified and verified auto mechanics. Quality service at your fingertips.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">Navigation</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Find Mechanics</Link>
              <Link to="/mechanic/signup" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Register as Mechanic</Link>
              <Link to="/mechanic/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Mechanic Login</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">Services</h4>
            <div className="space-y-2">
              {['Vehical', '', 'Plumbing', 'Electrical', 'Home Repairs'].map(s => (
                <span key={s} className="block text-sm text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                ARJ BCA COLLEGE OPPOSITE ILKAL
              </li>
              <li className="flex items-center gap-2.5 text-sm text-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +91 7899200478
              </li>
              <li className="flex items-center gap-2.5 text-sm text-foreground">
                <Mail className="w-4 h-4 text-primary" />
                kaifchoudri123@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 MechFinder. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}