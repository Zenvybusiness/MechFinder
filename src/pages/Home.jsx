import { useState, useEffect, useMemo } from 'react';
import { api as base44 } from '@/api/apiClient';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import MechanicCard from '../components/MechanicCard';
import { Loader2, Wrench, ShieldCheck, Star } from 'lucide-react';

const STATS = [
  { label: 'Certified Mechanics', value: '500+', icon: Wrench },
  { label: 'Verified Profiles', value: '350+', icon: ShieldCheck },
  { label: 'Happy Customers', value: '10k+', icon: Star },
];

export default function Home() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ rating: 'all', specialty: 'all', sort: 'rating' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await base44.entities.Mechanic.filter({ status: 'approved', is_active: true });
      setMechanics(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let results = [...mechanics];
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q) ||
        m.pin_code?.includes(q) ||
        m.shop_name?.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q)
      );
    }
    if (filters.rating !== 'all') {
      results = results.filter(m => (m.average_rating || 0) >= parseInt(filters.rating));
    }
    if (filters.specialty !== 'all') {
      results = results.filter(m => m.specialties?.some(s => s.toLowerCase() === filters.specialty.toLowerCase()));
    }
    if (filters.sort === 'rating') results.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    else if (filters.sort === 'reviews') results.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
    else if (filters.sort === 'newest') results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return results;
  }, [mechanics, search, filters]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-[#1e5fa8] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl mb-4 leading-tight">
              Find Trusted Mechanics
              <br />
              <span className="text-cyan-300">Near You</span>
            </h1>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Search verified, admin-approved mechanics by city or pincode. Read reviews, compare ratings, and connect instantly.
            </p>
            <SearchBar value={search} onChange={setSearch} onSearch={() => {}} />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="w-6 h-6 text-primary mb-1" />
              <span className="font-heading font-bold text-2xl text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground">Available Mechanics</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} certified mechanics found</p>
          </div>
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-border">
            <Wrench className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No mechanics found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(m => <MechanicCard key={m.id} mechanic={m} />)}
          </div>
        )}
      </section>
    </div>
  );
}