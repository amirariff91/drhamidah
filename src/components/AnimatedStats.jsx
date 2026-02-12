import { useState, useEffect, useRef } from 'preact/hooks';

const icons = {
  "Years in Education": (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  "Schools Led": (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      <path d="M10 10h4" /><path d="M12 10v3" />
    </svg>
  ),
  "Students (Current School)": (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "UPSR Improvement (SK Islah)": (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
};

const accentColors = [
  { bg: 'bg-gold-500/10', ring: 'ring-gold-500/20', text: 'text-gold-600', bar: 'bg-gold-500' },
  { bg: 'bg-navy-500/10', ring: 'ring-navy-500/20', text: 'text-navy-600', bar: 'bg-navy-500' },
  { bg: 'bg-sage-500/10', ring: 'ring-sage-500/20', text: 'text-sage-600', bar: 'bg-sage-500' },
  { bg: 'bg-gold-500/10', ring: 'ring-gold-500/20', text: 'text-gold-600', bar: 'bg-gold-500' },
];

export default function AnimatedStats({ stats }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setIsVisible(true);

          if (prefersReducedMotion) {
            setCounts(stats.map(s => s.value));
            return;
          }

          const duration = 2000;
          const startTime = performance.now();

          function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
          }

          function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            setCounts(stats.map(s => Math.round(eased * s.value)));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stats]);

  function formatValue(count, stat) {
    const formatted = count.toLocaleString('en-US');
    return (stat.prefix || '') + formatted + (stat.suffix || '');
  }

  return (
    <div ref={containerRef} class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const color = accentColors[i % accentColors.length];
        const icon = icons[stat.label];
        return (
          <div
            key={stat.label}
            class={`relative rounded-2xl p-6 border border-navy-100 bg-white overflow-hidden transition-[opacity,transform] duration-700 ease-out hover:shadow-lg hover:-translate-y-1`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(24px)',
              transitionDelay: `${i * 150}ms`,
            }}
          >
            {/* Accent bar top */}
            <div class={`absolute top-0 left-0 right-0 h-1 ${color.bar}`} />
            {/* Icon */}
            {icon && (
              <div class={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color.bg} ring-1 ${color.ring} ${color.text} mb-4`}>
                {icon}
              </div>
            )}
            {/* Number */}
            <p class="text-4xl sm:text-5xl font-bold text-navy-900 font-serif tabular-nums leading-none mb-2">
              {formatValue(counts[i], stat)}
            </p>
            {/* Label */}
            <p class="text-sm font-medium text-navy-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
