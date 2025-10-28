'use client';

import { useEffect, useState } from 'react';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

const STATS: StatItem[] = [
  { label: 'Artworks', value: 10000, suffix: '+' },
  { label: 'Artists', value: 5000, suffix: '+' },
  { label: 'Collectors', value: 50000, suffix: '+' },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function AnimatedStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {STATS.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <div className="text-4xl md:text-5xl text-white mb-2">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-blue-200 text-lg">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
