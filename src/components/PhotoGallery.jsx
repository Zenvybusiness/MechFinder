import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoGallery({ photos = [] }) {
  const [selected, setSelected] = useState(null);

  if (!photos || photos.length === 0) return null;

  const handlePrev = () => {
    setSelected((p) => (p > 0 ? p - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setSelected((p) => (p < photos.length - 1 ? p + 1 : 0));
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className="relative aspect-video overflow-hidden border border-border group cursor-pointer"
          >
            <img
              src={photo}
              alt={`Shop photo ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 w-10 h-10 flex items-center justify-center bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <img
              src={photos[selected]}
              alt=""
              className="max-h-[80vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 w-10 h-10 flex items-center justify-center bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 font-mono text-xs text-muted-foreground">
              {selected + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}