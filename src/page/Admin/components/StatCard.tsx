interface StatCardProps {
  icon: 'shield' | 'check' | 'x';
  label: string;
  value: number;
  color: 'blue' | 'green' | 'gray';
}

const COLORS = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', value: 'text-gray-900' },
  green: { bg: 'bg-green-100', text: 'text-green-600', value: 'text-green-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-500', value: 'text-gray-500' },
};

const ICONS = {
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  check: 'M5 13l4 4L19 7',
  x: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
};

export default function StatCard({ icon, label, value, color }: StatCardProps) {
  const c = COLORS[color];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${c.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <svg 
            className={`w-5 h-5 sm:w-6 sm:h-6 ${c.text}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={ICONS[icon]} 
            />
          </svg>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${c.value}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
