import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, placeholder = "Search by city or pincode..." }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center bg-white rounded-xl shadow-md border border-border overflow-hidden">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 py-4 pl-12 pr-4 text-base text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="m-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
}