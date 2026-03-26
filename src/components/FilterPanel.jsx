import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FilterPanel({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-muted-foreground">Filter:</span>

      <Select value={filters.rating || 'all'} onValueChange={(v) => onFilterChange({ ...filters, rating: v })}>
        <SelectTrigger className="w-36 h-9 bg-white border-border text-sm rounded-lg">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="4">4+ Stars</SelectItem>
          <SelectItem value="3">3+ Stars</SelectItem>
          <SelectItem value="2">2+ Stars</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.specialty || 'all'} onValueChange={(v) => onFilterChange({ ...filters, specialty: v })}>
        <SelectTrigger className="w-40 h-9 bg-white border-border text-sm rounded-lg">
          <SelectValue placeholder="Specialty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Vehicles">Vehicles</SelectItem>
          <SelectItem value="Electrician">Electrician</SelectItem>
          <SelectItem value="Plumbing">Plumbing</SelectItem>
          <SelectItem value="Home Repairs">Home Repairs</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sort || 'rating'} onValueChange={(v) => onFilterChange({ ...filters, sort: v })}>
        <SelectTrigger className="w-36 h-9 bg-white border-border text-sm rounded-lg">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="reviews">Most Reviews</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}