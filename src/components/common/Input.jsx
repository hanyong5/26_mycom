export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`h-11 px-3.5 rounded-lg border text-sm outline-none transition-colors
          ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}
          focus:ring-2 focus:ring-primary/15 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
