export default function StatCard({ value, label, icon, color = 'coral' }: {
  value: string | number
  label: string
  icon: string
  color?: 'coral' | 'menta' | 'gold'
}) {
  const colorMap = {
    coral: 'from-coral/10 to-transparent border-coral/20 text-coral',
    menta: 'from-menta/10 to-transparent border-menta/20 text-menta',
    gold: 'from-gold/10 to-transparent border-gold/20 text-gold',
  }

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colorMap[color]} border p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold ${colorMap[color].split(' ').pop()}`}>{value}</span>
      </div>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  )
}
