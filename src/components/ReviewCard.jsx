import { Star } from 'lucide-react';
import moment from 'moment';

export default function ReviewCard({ review }) {
  return (
    <article className="bg-white rounded-xl border border-border p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-heading font-semibold text-sm text-foreground">{review.reviewer_name}</h4>
          <span className="text-xs text-muted-foreground">{moment(review.created_date).fromNow()}</span>
        </div>
        <div className="flex">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
    </article>
  );
}