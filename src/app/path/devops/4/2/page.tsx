'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import InlineTerminal from '@/components/InlineTerminal';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "Infrastructure as Code (IaC)",
    content: "Instead of clicking through cloud dashboards to create servers, you WRITE CODE that describes your infrastructure.\n\nBenefits:\n• 📋 Version controlled — track changes in Git\n• 🔄 Reproducible — same config = same result\n• 📝 Documented — the code IS the documentation\n• ⚡ Fast — spin up entire environments in minutes\n• 🧪 Testable — validate before deploying",
  },
  {
    title: "Terraform Basics",
    content: "Terraform (by HashiCorp) is the most popular IaC tool.\n\nKey concepts:\n• Providers — plugins for cloud services (AWS, Azure, GCP)\n• Resources — things you create (VMs, databases, networks)\n• State — Terraform tracks what it's managing\n• Plan — preview changes before applying\n• Apply — execute the changes\n\nTerraform uses HCL (HashiCorp Configuration Language).",
  },
  {
    title: "Terraform Workflow",
    content: "The basic Terraform workflow:\n\n1. terraform init — initialize, download providers\n2. terraform plan — preview what will change\n3. terraform apply — create/update resources\n4. terraform destroy — tear everything down\n\nAlways run 'plan' before 'apply' to check for surprises!",
  },
];

export default function InfraAsCode() {
  const [step, setStep] = useState(0);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const quizQuestions = [
    { q: "What does IaC stand for?", options: ['Internet and Cloud', 'Infrastructure as Code', 'Internal Application Config', 'Instance as Container'], correct: 1 },
    { q: "What does 'terraform plan' do?", options: ['Creates resources', 'Destroys resources', 'Shows a preview of changes', 'Initializes Terraform'], correct: 2 },
    { q: "What is a key benefit of IaC over manual setup?", options: ['It costs more', 'Changes are version controlled and reproducible', 'It requires no coding knowledge', 'It only works with AWS'], correct: 1 },
  ];

  const handleCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== 'terraform') return;
    const newCompleted = new Set(completedCmds);
    if (parts[1] === 'init') newCompleted.add('init');
    if (parts[1] === 'plan') newCompleted.add('plan');
    if (parts[1] === 'apply') newCompleted.add('apply');
    setCompletedCmds(newCompleted);
    if (newCompleted.size >= 3) setTimeout(() => setStep(4), 500);
  }, [completedCmds]);

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('devops-4-2', 60);
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={60} message="You understand Infrastructure as Code!" backHref="/path/devops" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="Infrastructure as Code" pathId="devops" />
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
                <p className="text-xs text-gray-400 mb-2">📄 main.tf example:</p>
                <pre className="font-mono text-xs bg-black/50 rounded-lg p-3 text-gray-300">{`provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "web-server"
  }
}`}</pre>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < lessons.length - 1 ? 'Next →' : 'Try Terraform →'}
            </button>
          </motion.div>
        )}

        {step === lessons.length && (
          <motion.div key="challenge" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Terraform Workflow</h2>
              <p className="text-sm text-gray-400">Run the Terraform workflow: init → plan → apply</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['init', 'plan', 'apply'].map(c => (
                  <span key={c} className={`text-xs font-mono px-2 py-1 rounded ${completedCmds.has(c) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-500'}`}>
                    {completedCmds.has(c) ? '✅' : '⬜'} terraform {c}
                  </span>
                ))}
              </div>
            </div>
            <InlineTerminal onCommand={handleCommand} height="200px" />
          </motion.div>
        )}

        {step === 4 && (
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
