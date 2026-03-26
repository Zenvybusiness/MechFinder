import { Star } from 'lucide-react';

export default function PowerBar({ rating = 0, size = 'md' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${sizes[size]} ${s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
      <span className="ml-1 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}