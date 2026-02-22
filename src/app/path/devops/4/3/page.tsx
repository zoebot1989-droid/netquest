'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Why Monitor?",
    content: "You can't fix what you can't see. Monitoring answers:\n\n• Is the app running? (uptime)\n• Is it slow? (latency)\n• Is it breaking? (error rates)\n• Is it running out of resources? (CPU, memory, disk)\n\nThe three pillars of observability:\n📊 Metrics — numbers over time (CPU: 85%)\n📝 Logs — detailed event records\n🔗 Traces — request journey through services",
  },
  {
    title: "Key Tools",
    content: "📊 Prometheus — metrics collection & storage\nScrapes metrics from your apps. Time-series database. Free & open-source.\n\n📈 Grafana — visualization dashboards\nBeautiful charts and graphs. Connects to Prometheus, databases, etc.\n\n📝 ELK Stack — log management\nElasticsearch (search) + Logstash (ingest) + Kibana (visualize)\nAlternative: Loki + Grafana\n\n🔗 Jaeger / Zipkin — distributed tracing\nTrack requests across microservices.",
  },
  {
    title: "Alerting & SLOs",
    content: "Set up alerts for when things go wrong:\n• CPU > 90% for 5 minutes → alert\n• Error rate > 1% → alert\n• Response time > 2s → alert\n\nSLO (Service Level Objective) = your target\nExample: 99.9% uptime = ~8.7 hours downtime/year\n\nSLI (Indicator) = actual measurement\nSLA (Agreement) = promise to customers\n\nGood monitoring = sleep through the night. 😴",
  },
];

export default function MonitoringLogging() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What are the three pillars of observability?", options: ['CPU, memory, disk', 'Metrics, logs, traces', 'Prometheus, Grafana, ELK', 'Build, test, deploy'], correct: 1 },
    { q: "What does Grafana do?", options: ['Collects metrics', 'Stores logs', 'Visualizes data in dashboards', 'Deploys containers'], correct: 2 },
    { q: "What does 99.9% uptime mean in downtime per year?", options: ['About 52 minutes', 'About 8.7 hours', 'About 3.6 days', 'Zero downtime'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-4-3', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You understand monitoring and observability!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Monitoring & Logging" pathId="devops" />
      <AnimatePresence mode="wait">
        {step < lessons.length && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/{lessons.length}</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">📊 Example dashboard metrics:</p>
                <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-1">
                  <div><span style={{ color: '#39ff14' }}>CPU Usage:</span> <span className="text-gray-300">████████░░ 78%</span></div>
                  <div><span style={{ color: '#39ff14' }}>Memory:</span>   <span className="text-gray-300">██████░░░░ 62%</span></div>
                  <div><span style={{ color: '#39ff14' }}>Disk:</span>     <span className="text-gray-300">████░░░░░░ 41%</span></div>
                  <div><span style={{ color: '#39ff14' }}>Requests:</span> <span className="text-gray-300">1,247 req/s</span></div>
                  <div><span style={{ color: '#39ff14' }}>Errors:</span>   <span className="text-red-400">0.3%</span></div>
                  <div><span style={{ color: '#39ff14' }}>Latency:</span>  <span className="text-gray-300">p99: 245ms</span></div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Take the Quiz →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
