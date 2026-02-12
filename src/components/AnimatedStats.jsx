import { useState, useEffect, useRef } from 'preact/hooks';

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
    <div ref={containerRef} class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          class="transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
            transitionDelay: `${i * 150}ms`,
          }}
        >
          <p class="text-4xl font-bold text-navy-900 font-serif tabular-nums">
            {formatValue(counts[i], stat)}
          </p>
          <p class="text-sm text-navy-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
