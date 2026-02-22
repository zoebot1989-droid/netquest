'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "What is the Cloud?",
    content: "\"The cloud\" = someone else's computers that you rent.\n\nInstead of buying and maintaining physical servers, you rent computing resources on-demand from cloud providers.\n\nBenefits:\n• 💰 Pay only for what you use\n• 📈 Scale up/down instantly\n• 🌍 Deploy globally in minutes\n• 🔧 No hardware maintenance\n• 🔒 Built-in security features",
  },
  {
    title: "The Big Three",
    content: "☁️ AWS (Amazon Web Services)\nMarket leader (~32%). Most services. Used by Netflix, Airbnb.\n\n🔵 Azure (Microsoft)\n#2 (~23%). Great for enterprises, integrates with Microsoft tools.\n\n🟢 GCP (Google Cloud Platform)\n#3 (~11%). Strong in data/AI. Used by Spotify, Snapchat.\n\nAll three offer similar core services — the concepts transfer between them.",
  },
  {
    title: "Key Services",
    content: "Every cloud provider has these core services:\n\n🖥️ Compute — Virtual machines / serverless\n  AWS: EC2, Lambda | Azure: VMs, Functions | GCP: Compute Engine, Cloud Functions\n\n💾 Storage — Files, objects, databases\n  AWS: S3, RDS | Azure: Blob, SQL | GCP: Cloud Storage, Cloud SQL\n\n🌐 Networking — Load balancers, CDN, DNS\n  AWS: ELB, CloudFront | Azure: LB, CDN | GCP: Cloud LB, Cloud CDN\n\n🐳 Containers — Run Docker/K8s\n  AWS: ECS, EKS | Azure: ACI, AKS | GCP: Cloud Run, GKE",
  },
];

export default function CloudProviders() {
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "Which cloud provider has the largest market share?", options: ['Google Cloud', 'Microsoft Azure', 'Amazon Web Services', 'IBM Cloud'], correct: 2 },
    { q: "What is AWS S3?", options: ['A compute service', 'An object storage service', 'A database service', 'A container service'], correct: 1 },
    { q: "What's the main benefit of cloud over on-premise?", options: ['Cloud is always free', 'Pay for what you use, scale on demand', 'Cloud is always faster', 'No internet needed'], correct: 1 },
  ];

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-4-1', 50);
        addAchievement('cloud-native');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={50} message="You know the cloud landscape!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Cloud Providers" pathId="devops" />
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

            {step === 1 && (
              <div className="card border-cyan-800/30">
                <div className="grid grid-cols-3 gap-3 text-xs text-center">
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#ff9500' }}>☁️ AWS</p>
                    <p className="text-gray-400">~32% share</p>
                    <p className="text-gray-500">200+ services</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#00f0ff' }}>🔵 Azure</p>
                    <p className="text-gray-400">~23% share</p>
                    <p className="text-gray-500">Enterprise focus</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#39ff14' }}>🟢 GCP</p>
                    <p className="text-gray-400">~11% share</p>
                    <p className="text-gray-500">Data/AI strong</p>
                  </div>
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
