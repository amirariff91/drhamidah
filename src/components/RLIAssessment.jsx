import { useState, useCallback } from 'preact/hooks';

const DIMENSIONS = [
  {
    id: 'courage',
    name: 'Courage & Challenge',
    icon: '🛡️',
    color: '#f0b429',
    description: 'Your ability to face adversity, take calculated risks, and support others through challenges.',
  },
  {
    id: 'mindset',
    name: 'Positive Mindset',
    icon: '🌟',
    color: '#38a169',
    description: 'Your capacity for optimism, growth orientation, and viewing stress as an opportunity.',
  },
  {
    id: 'focus',
    name: 'Focus & Commitment',
    icon: '🎯',
    color: '#627d98',
    description: 'Your strength in managing distractions, persisting toward goals, and sustaining productive work.',
  },
  {
    id: 'community',
    name: 'Community & Support',
    icon: '🤝',
    color: '#102a43',
    description: 'Your effectiveness in building teams, engaging parents, and nurturing stakeholder relationships.',
  },
];

const QUESTIONS = [
  // Courage & Challenge (dimension 0)
  {
    text: 'When faced with a major crisis or disruption at school, I remain calm and take decisive action rather than avoid the situation.',
    dimension: 0,
  },
  {
    text: 'I am willing to try new approaches or programmes even when the outcome is uncertain, because innovation requires risk.',
    dimension: 0,
  },
  {
    text: 'I actively support and mentor colleagues who are struggling, helping them build their own resilience during difficult times.',
    dimension: 0,
  },
  // Positive Mindset (dimension 1)
  {
    text: 'I generally maintain an optimistic outlook about my school\'s future, even when current circumstances are challenging.',
    dimension: 1,
  },
  {
    text: 'I view setbacks and failures as valuable learning opportunities that help me grow as a leader.',
    dimension: 1,
  },
  {
    text: 'When under pressure, I can reframe stressful situations as opportunities to demonstrate effective leadership.',
    dimension: 1,
  },
  // Focus & Commitment (dimension 2)
  {
    text: 'I can effectively manage competing demands and distractions to stay focused on the most important priorities for my school.',
    dimension: 2,
  },
  {
    text: 'Once I commit to a goal or initiative, I persist even when progress is slow or obstacles arise.',
    dimension: 2,
  },
  {
    text: 'I maintain healthy boundaries between my professional duties and personal well-being to sustain long-term performance.',
    dimension: 2,
  },
  // Community & Support (dimension 3)
  {
    text: 'I actively build a strong, cohesive team culture where staff feel valued, heard, and empowered to contribute.',
    dimension: 3,
  },
  {
    text: 'I prioritise meaningful engagement with parents and the wider community, seeing them as essential partners in education.',
    dimension: 3,
  },
  {
    text: 'I cultivate relationships with key stakeholders (district officers, community leaders, NGOs) to create a support network for my school.',
    dimension: 3,
  },
];

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', short: 'SD' },
  { value: 2, label: 'Disagree', short: 'D' },
  { value: 3, label: 'Neutral', short: 'N' },
  { value: 4, label: 'Agree', short: 'A' },
  { value: 5, label: 'Strongly Agree', short: 'SA' },
];

function getInterpretation(score) {
  if (score <= 24) return { level: 'Developing', color: '#627d98', emoji: '🌱', text: 'Your resilience leadership is in the developing stage. This is a starting point — every exceptional leader began here. Focus on building foundational habits around self-awareness and seeking support.' };
  if (score <= 36) return { level: 'Moderate', color: '#f0b429', emoji: '🌿', text: 'You show moderate resilience in your leadership. You have a solid foundation but there are specific areas where targeted development could significantly strengthen your leadership capacity.' };
  if (score <= 48) return { level: 'Strong', color: '#38a169', emoji: '🌳', text: 'You demonstrate strong resilient leadership. You handle challenges well and support others effectively. Fine-tuning specific dimensions could help you move from strong to exceptional.' };
  return { level: 'Exceptional', color: '#102a43', emoji: '🏔️', text: 'Your resilient leadership is exceptional. You embody the qualities found in Malaysia\'s highest-performing headteachers. Consider mentoring others and sharing your resilience strategies.' };
}

function getDimensionRecommendation(dimIndex, avg) {
  const recs = [
    // Courage & Challenge
    [
      'Start small: volunteer to lead one new initiative this term. Build your courage muscle gradually.',
      'Practise scenario planning — thinking through "what if" situations builds confidence for real crises.',
      'You show good courage. To reach the next level, seek out stretch assignments that push beyond your comfort zone.',
      'Your courage is a strength. Share your approach with peers — teaching courage to others reinforces your own.',
    ],
    // Positive Mindset
    [
      'Begin a daily reflection practice: write down one positive outcome from each challenging day.',
      'When facing setbacks, ask "What can I learn?" before "What went wrong?" This reframes your perspective.',
      'Your mindset is strong. Try practising gratitude journaling to further strengthen your optimism.',
      'Exceptional mindset! Consider leading professional development sessions on growth mindset for your staff.',
    ],
    // Focus & Commitment
    [
      'Try time-blocking: dedicate specific hours to your top priorities and protect them from interruptions.',
      'Set quarterly goals with measurable milestones. Regular review keeps you on track when distractions arise.',
      'Good focus! Consider whether your work-life boundaries could be strengthened to sustain your energy long-term.',
      'Your commitment is remarkable. Ensure you model sustainable work habits — your team watches what you do.',
    ],
    // Community & Support
    [
      'Schedule one informal connection with a parent or community member each week. Relationships start with showing up.',
      'Create structured opportunities for staff input — regular forums show you value their perspectives.',
      'Strong community building! Deepen stakeholder relationships by involving them in school strategic planning.',
      'Exceptional community leadership! Your network is a model. Document your engagement strategies for others to learn from.',
    ],
  ];
  const idx = avg <= 2 ? 0 : avg <= 3 ? 1 : avg <= 4 ? 2 : 3;
  return recs[dimIndex][idx];
}

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div class="mb-8">
      <div class="flex justify-between text-sm text-navy-500 mb-2">
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div class="h-2 bg-navy-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuestionCard({ question, questionIndex, answer, onAnswer }) {
  const dim = DIMENSIONS[question.dimension];
  return (
    <div class="animate-fadeIn">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xl" aria-hidden="true">{dim.icon}</span>
        <span class="text-sm font-medium uppercase tracking-wider" style={{ color: dim.color }}>{dim.name}</span>
      </div>
      <h3 class="font-serif text-xl sm:text-2xl font-bold text-navy-900 mb-8 leading-relaxed">{question.text}</h3>
      <div class="grid grid-cols-5 gap-2 sm:gap-3">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(questionIndex, opt.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAnswer(questionIndex, opt.value); } }}
            aria-label={`${opt.value} — ${opt.label}`}
            aria-pressed={answer === opt.value}
            class={`group flex flex-col items-center p-3 sm:p-4 rounded-xl border-2 transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 touch-action-manipulation ${
              answer === opt.value
                ? 'border-gold-500 bg-gold-50 shadow-md shadow-gold-200/50'
                : 'border-navy-100 bg-white hover:border-navy-300 hover:bg-navy-50'
            }`}
          >
            <span class={`text-lg sm:text-2xl font-bold mb-1 tabular-nums ${answer === opt.value ? 'text-gold-600' : 'text-navy-400 group-hover:text-navy-600'}`}>
              {opt.value}
            </span>
            <span class="text-xs text-navy-500 text-center hidden sm:block">{opt.label}</span>
            <span class="text-xs text-navy-500 text-center sm:hidden">{opt.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GaugeMeter({ score, maxScore }) {
  const pct = (score / maxScore) * 100;
  const interp = getInterpretation(score);
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (pct / 100) * circumference * 0.75; // 270 deg arc
  
  return (
    <div class="flex flex-col items-center">
      <div class="relative w-52 h-52">
        <svg viewBox="0 0 200 200" class="w-full h-full transform -rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="#d9e2ec"
            stroke-width="16"
            stroke-dasharray={circumference}
            stroke-dashoffset={circumference * 0.25}
            stroke-linecap="round"
          />
          {/* Score arc */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke={interp.color}
            stroke-width="16"
            stroke-dasharray={circumference}
            stroke-dashoffset={offset}
            stroke-linecap="round"
            class="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-4xl font-bold font-serif text-navy-900">{score}</span>
          <span class="text-sm text-navy-500">of {maxScore}</span>
        </div>
      </div>
      <div class="text-center mt-2">
        <span class="text-3xl">{interp.emoji}</span>
        <p class="font-serif text-2xl font-bold mt-2" style={{ color: interp.color }}>{interp.level} Resilience</p>
      </div>
    </div>
  );
}

function DimensionBar({ dimension, scores, index }) {
  const dimScores = scores.filter((_, i) => QUESTIONS[i].dimension === index);
  const total = dimScores.reduce((a, b) => a + b, 0);
  const max = dimScores.length * 5;
  const pct = (total / max) * 100;
  const avg = total / dimScores.length;

  return (
    <div class="bg-white rounded-xl p-5 border border-navy-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg" aria-hidden="true">{dimension.icon}</span>
        <h4 class="font-semibold text-navy-900">{dimension.name}</h4>
        <span class="ml-auto font-bold text-navy-900 tabular-nums">{total}/{max}</span>
      </div>
      <div class="h-3 bg-navy-100 rounded-full overflow-hidden mb-3">
        <div
          class="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: dimension.color }}
        />
      </div>
      <p class="text-sm text-navy-600 mb-2">{dimension.description}</p>
      <div class="mt-3 p-3 bg-navy-50 rounded-lg">
        <p class="text-sm text-navy-700"><strong>💡 Recommendation:</strong> {getDimensionRecommendation(index, avg)}</p>
      </div>
    </div>
  );
}

function Results({ answers }) {
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const interp = getInterpretation(totalScore);

  return (
    <div class="animate-fadeIn">
      <div class="text-center mb-10">
        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-navy-900 mb-2">Your Resilient Leadership Index</h2>
        <p class="text-navy-500">Based on your responses across 4 dimensions of resilient leadership</p>
      </div>

      <div class="flex justify-center mb-10">
        <GaugeMeter score={totalScore} maxScore={60} />
      </div>

      <div class="max-w-2xl mx-auto mb-10">
        <div class="bg-gradient-to-br from-navy-50 to-gold-50 rounded-xl p-6 border border-navy-100">
          <p class="text-navy-700 leading-relaxed">{interp.text}</p>
        </div>
      </div>

      <h3 class="font-serif text-2xl font-bold text-navy-900 mb-6 text-center">Score Breakdown by Dimension</h3>
      <div class="grid sm:grid-cols-2 gap-4 mb-10">
        {DIMENSIONS.map((dim, i) => (
          <DimensionBar key={dim.id} dimension={dim} scores={answers} index={i} />
        ))}
      </div>

      {/* Citation */}
      <div class="bg-navy-50 rounded-xl p-5 border border-navy-100 mb-8">
        <p class="text-xs text-navy-500 text-center">
          Based on the Resilient Leadership Index framework by Dr. Hamidah Che Abdul Hamid (UniSZA, 2025).<br />
          Research: "Development of Mathematical Formulation of Resilient Leadership Index for Head Teachers' Leadership Model"
        </p>
      </div>

      {/* CTA */}
      <div class="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 text-center text-white">
        <h3 class="font-serif text-2xl font-bold mb-3">Want to Discuss Resilient Leadership for Your School?</h3>
        <p class="text-navy-200 mb-6">Dr. Hamidah brings 30 years of school leadership experience and published research on building resilience in educational leaders.</p>
        <a
          href="/contact"
          class="inline-flex items-center justify-center px-8 py-4 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-[background-color,box-shadow] duration-200 hover:shadow-lg hover:shadow-gold-500/25 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          Contact Dr. Hamidah →
        </a>
      </div>

      {/* Retake */}
      <div class="text-center mt-8">
        <button
          onClick={() => window.location.reload()}
          class="text-navy-500 hover:text-navy-700 text-sm font-medium transition-colors"
        >
          ↻ Take the Assessment Again
        </button>
      </div>
    </div>
  );
}

export default function RLIAssessment() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(0));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = useCallback((qIndex, value) => {
    setAnswers(prev => {
      const next = [...prev];
      next[qIndex] = value;
      return next;
    });
    // Auto-advance after brief delay
    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setCurrentQ(qIndex + 1);
      }
    }, 300);
  }, []);

  const handleBack = useCallback(() => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  }, [currentQ]);

  const handleFinish = useCallback(() => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const allAnswered = answers.every(a => a > 0);
  const isLast = currentQ === QUESTIONS.length - 1;

  if (showResults) {
    return (
      <div class="max-w-3xl mx-auto">
        <Results answers={answers} />
      </div>
    );
  }

  return (
    <div class="max-w-2xl mx-auto">
      <ProgressBar current={currentQ} total={QUESTIONS.length} />
      <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-navy-100 min-h-[320px]">
        <QuestionCard
          question={QUESTIONS[currentQ]}
          questionIndex={currentQ}
          answer={answers[currentQ]}
          onAnswer={handleAnswer}
        />
      </div>
      <div class="flex justify-between items-center mt-6">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          class={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
            currentQ === 0
              ? 'text-navy-300 cursor-not-allowed'
              : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
          }`}
        >
          ← Back
        </button>
        {isLast ? (
          <button
            onClick={handleFinish}
            disabled={!allAnswered}
            class={`px-6 py-3 rounded-lg font-semibold transition-[background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
              allAnswered
                ? 'bg-gold-500 hover:bg-gold-600 text-navy-900 shadow-md hover:shadow-lg'
                : 'bg-navy-100 text-navy-400 cursor-not-allowed'
            }`}
          >
            See My Results →
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            disabled={!answers[currentQ]}
            class={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
              answers[currentQ]
                ? 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                : 'text-navy-300 cursor-not-allowed'
            }`}
          >
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}
