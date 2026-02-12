import { useState, useEffect, useRef } from 'preact/hooks';

const milestones = [
  {
    year: '1995',
    endYear: '2004',
    title: 'English Teacher',
    location: 'Primary Schools, Kelantan',
    narrative: 'Started in the classroom teaching English. Earned a BA in English Literature while working full-time.',
    accent: 'navy-300',
    dotColor: 'bg-navy-300',
    metric: null,
    phase: 'Foundation',
  },
  {
    year: '2004',
    endYear: '2014',
    title: 'Senior Assistant',
    location: 'Primary Schools, Kelantan',
    narrative: 'A decade running curriculum, teacher development, and school admin. Completed a Master in TESL at UiTM.',
    accent: 'navy-400',
    dotColor: 'bg-navy-400',
    metric: null,
    phase: 'Growth',
  },
  {
    year: '2014',
    endYear: '2016',
    title: 'SK Temalir',
    location: 'Kuala Krai',
    narrative: 'First headteacher posting — a small rural school. Won a national award within two years.',
    accent: 'navy-500',
    dotColor: 'bg-navy-500',
    metric: { value: '250', label: 'students', badge: 'National PIBG Award' },
    phase: 'Leadership',
  },
  {
    year: '2016',
    endYear: '2018',
    title: 'SK Islah',
    location: 'Kota Bharu',
    narrative: 'Took a school five times larger and tripled its top exam results in just two years.',
    accent: 'sage-500',
    dotColor: 'bg-sage-500',
    metric: { value: '300%', label: 'UPSR growth', badge: 'STEM Award' },
    phase: 'Impact',
  },
  {
    year: '2018',
    endYear: '2024',
    title: 'SK Datu\' Hashim',
    location: 'Kota Bharu',
    narrative: 'Six years driving digital transformation. Won the DUTA Award twice for technology in education.',
    accent: 'navy-600',
    dotColor: 'bg-navy-600',
    metric: { value: '1,400', label: 'students', badge: 'DUTA Award ×2' },
    phase: 'Innovation',
  },
  {
    year: '2024',
    endYear: 'Now',
    title: 'SK Kubang Kerian 3',
    location: 'Kota Bharu · SBT',
    narrative: 'Her largest school — one of Kelantan\'s premier High-Performance Schools.',
    accent: 'gold-500',
    dotColor: 'bg-gold-500',
    metric: { value: '1,700', label: 'students', badge: 'High-Performance' },
    phase: 'Mastery',
  },
];

function Milestone({ data, index, isVisible }) {
  const isEven = index % 2 === 0;
  const delay = index * 200;

  return (
    <div
      class="relative flex items-start gap-4 sm:gap-6 pb-2"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : `translateX(${isEven ? '-30px' : '30px'})`,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Timeline dot + connector */}
      <div class="relative flex-shrink-0 flex flex-col items-center" style={{ width: '40px' }}>
        <div class={`w-4 h-4 rounded-full ${data.dotColor} ring-4 ring-white shadow-md z-10`} />
        {index < milestones.length - 1 && (
          <div class="w-0.5 bg-gradient-to-b from-navy-200 to-navy-100 flex-1 mt-1" style={{ minHeight: '100%' }} />
        )}
      </div>

      {/* Card */}
      <div class="flex-1 pb-10">
        {/* Phase label + year */}
        <div class="flex items-center gap-3 mb-2 flex-wrap">
          <span class="text-xs font-bold text-navy-400 uppercase tracking-widest">{data.phase}</span>
          <span class="text-xs text-navy-400">·</span>
          <span class="text-xs font-medium text-navy-500">{data.year} – {data.endYear}</span>
        </div>

        <h3 class="font-serif text-xl font-bold text-navy-900 mb-1">{data.title}</h3>
        <p class="text-sm text-navy-500 mb-3">{data.location}</p>
        <p class="text-navy-600 leading-relaxed mb-3">{data.narrative}</p>

        {/* Metric + badge */}
        {data.metric && (
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-bold font-serif text-navy-900 tabular-nums">{data.metric.value}</span>
              <span class="text-sm text-navy-500">{data.metric.label}</span>
            </div>
            {data.metric.badge && (
              <span class="inline-flex items-center gap-1 bg-gold-100 text-gold-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                {data.metric.badge}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CareerJourney() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} class="relative max-w-2xl mx-auto">
      {/* Journey line background glow */}
      <div class="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-gold-400/50 via-navy-200 to-transparent" aria-hidden="true" />

      {milestones.map((m, i) => (
        <Milestone key={m.year} data={m} index={i} isVisible={isVisible} />
      ))}

      {/* End marker */}
      <div
        class="flex items-center gap-4 sm:gap-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.6s ease ${milestones.length * 200}ms`,
        }}
      >
        <div class="flex-shrink-0 flex justify-center" style={{ width: '40px' }}>
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
            <svg class="w-4 h-4 text-navy-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <p class="font-serif text-lg font-bold text-navy-900">Ready for the next chapter →</p>
      </div>
    </div>
  );
}
