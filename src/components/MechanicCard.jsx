import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MechanicCard({ mechanic }) {
  const stars = Math.round(Number(mechanic.average_rating) || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-44 bg-secondary overflow-hidden">
        {mechanic.profile_photo ? (
          <img src={mechanic.profile_photo} alt={mechanic.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="font-heading font-bold text-5xl text-primary/30">{mechanic.name?.charAt(0)}</span>
          </div>
        )}
        {/* Verified Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs font-medium text-green-700">Verified</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-heading font-bold text-base text-foreground">{mechanic.name}</h3>
          <p className="text-sm font-medium text-primary">{mechanic.shop_name}</p>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{(Number(mechanic.average_rating) || 0).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({mechanic.total_reviews || 0} reviews)</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
          <span className="text-sm leading-relaxed">{mechanic.city} — {mechanic.pin_code}</span>
        </div>

        {/* Specialties */}
        {mechanic.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mechanic.specialties.slice(0, 3).map(s => (
              <span key={s} className="px-2.5 py-0.5 text-xs font-medium bg-primary/8 text-primary rounded-full border border-primary/15">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
          <Link
            to={`/mechanic/${mechanic.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors w-full justify-center"
          >
            View Profile
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}