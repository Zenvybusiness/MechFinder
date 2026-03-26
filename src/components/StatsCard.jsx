import { motion } from 'framer-motion';

export default function StatsCard({ label, value, icon: Icon, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-5 flex items-center justify-between ${
        accent ? 'bg-primary text-white border-primary' : 'bg-white border-border'
      }`}
    >
      <div>
        <p className={`text-xs font-medium mb-1 ${accent ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
        <p className={`font-heading font-bold text-3xl ${accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accent ? 'bg-white/15' : 'bg-primary/8'}`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-primary'}`} />
        </div>
      )}
    </motion.div>
  );
}