'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "What's a VPS?",
    content: "A VPS (Virtual Private Server) is a computer in the cloud that's always on, always connected to the internet, with its own public IP address. It's like renting a room in a datacenter. You get root access — you're the admin. Companies like DigitalOcean, Linode, and AWS rent these for $5-20/month.",
  },
  {
    title: "VPS vs Localhost",
    content: "Your localhost: only you can access it, it turns off when your PC sleeps, dynamic IP that changes. A VPS: anyone can reach it 24/7, static public IP, always-on. When you 'deploy' a website, you're putting it on a VPS (or similar server) so the world can see it.",
  },
  {
    title: "Connecting via SSH",
    content: "SSH (Secure Shell) is how you control your VPS remotely. You type commands in a terminal on your computer, and they execute on the VPS. It's like a remote control for servers. The command: ssh root@your-server-ip",
  },
  {
    title: "The Deployment Flow",
    content: "1. Rent a VPS → get an IP address\n2. SSH into it → you're now 'inside' the server\n3. Install a web server (nginx) → it listens on port 80/443\n4. Upload your code → nginx serves it to visitors\n5. Point your domain's DNS to the VPS IP\n6. Anyone visiting yourdomain.com sees your site!",
  },
];

interface SimStep {
  command: string;
  output: string[];
  description: string;
}

const simSteps: SimStep[] = [
  {
    command: 'ssh root@167.172.5.42',
    output: ['Welcome to Ubuntu 22.04 LTS', 'Last login: Sat Feb 21 12:00:00 2026', 'root@netquest-vps:~#'],
    description: 'Connect to your VPS via SSH',
  },
  {
    command: 'apt update && apt install nginx -y',
    output: ['Reading package lists... Done', 'Setting up nginx (1.24.0)...', '✓ nginx installed successfully'],
    description: 'Install nginx web server',
  },
  {
    command: 'systemctl start nginx',
    output: ['✓ nginx.service started', 'Active: running on port 80'],
    description: 'Start the web server',
  },
  {
    command: 'echo "<h1>Hello from my VPS!</h1>" > /var/www/html/index.html',
    output: ['✓ File written'],
    description: 'Create a simple webpage',
  },
  {
    command: 'curl http://167.172.5.42',
    output: ['<h1>Hello from my VPS!</h1>', '', '🎉 Your site is live at http://167.172.5.42!'],
    description: 'Test it — visit your VPS IP in a browser!',
  },
];

export default function VPSMission() {
  const [step, setStep] = useState(0);
  const [simIndex, setSimIndex] = useState(0);
  const [executedCommands, setExecutedCommands] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const executeCommand = () => {
    setExecutedCommands([...executedCommands, simIndex]);
    if (simIndex + 1 >= simSteps.length) {
      setTimeout(() => setStep(5), 1000);
    } else {
      setTimeout(() => setSimIndex(simIndex + 1), 800);
    }
  };

  const handleQuiz = (answer: number) => {
    if (answer === 1) {
      setQuizDone(true);
      completeMission('4-3', 100);
      setTimeout(() => setComplete(true), 500);
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={100} message="You can set up a VPS!" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={4} title="VPS" />
      <AnimatePresence mode="wait">
        {step < 4 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/4</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">💰 Typical VPS Pricing</p>
                <div className="font-mono text-xs space-y-1">
                  <div className="flex justify-between"><span>1 CPU, 1GB RAM, 25GB SSD</span><span style={{ color: '#39ff14' }}>$5/mo</span></div>
                  <div className="flex justify-between"><span>2 CPU, 2GB RAM, 50GB SSD</span><span style={{ color: '#39ff14' }}>$12/mo</span></div>
                  <div className="flex justify-between"><span>4 CPU, 8GB RAM, 160GB SSD</span><span style={{ color: '#39ff14' }}>$48/mo</span></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="card border-cyan-800/30">
                <div className="grid grid-cols-2 gap-4 text-xs text-center">
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#ff9500' }}>💻 Localhost</p>
                    <div className="space-y-1 text-gray-400">
                      <p>Only you can see it</p>
                      <p>Turns off with your PC</p>
                      <p>Dynamic IP</p>
                      <p>Free</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2" style={{ color: '#39ff14' }}>☁️ VPS</p>
                    <div className="space-y-1 text-gray-400">
                      <p>Anyone can reach it</p>
                      <p>Always on (24/7)</p>
                      <p>Static public IP</p>
                      <p>~$5/month</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card border-green-800/30">
                <div className="text-center font-mono text-xs space-y-1">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div>👤<br/>You</div>
                    <span>→</span>
                    <div>🔑<br/>SSH</div>
                    <span>→</span>
                    <div>☁️<br/>VPS</div>
                    <span>→</span>
                    <div>🌐<br/>nginx:80</div>
                    <span>→</span>
                    <div>👥<br/>Visitors</div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 3 ? 'Next →' : 'Start VPS Setup →'}
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="sim" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🖥️ VPS Setup Simulation</h2>
              <p className="text-sm text-gray-400">Execute each command to set up your server:</p>
            </div>

            <div className="card bg-black/50">
              <div className="font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
                {executedCommands.map((idx) => (
                  <div key={idx}>
                    <div><span style={{ color: '#39ff14' }}>root@vps:~$</span> {simSteps[idx].command}</div>
                    {simSteps[idx].output.map((line, j) => (
                      <div key={j} className="text-gray-400">{line}</div>
                    ))}
                  </div>
                ))}
                {simIndex < simSteps.length && !executedCommands.includes(simIndex) && (
                  <div>
                    <span style={{ color: '#39ff14' }}>root@vps:~$</span>
                    <span className="cursor-blink ml-1">▊</span>
                  </div>
                )}
              </div>
            </div>

            {simIndex < simSteps.length && !executedCommands.includes(simIndex) && (
              <div className="card">
                <p className="text-xs text-gray-400 mb-2">Next: {simSteps[simIndex].description}</p>
                <button onClick={executeCommand} className="w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 font-mono text-sm text-left">
                  <span style={{ color: '#39ff14' }}>$</span> {simSteps[simIndex].command}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 5 && !quizDone && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-green-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#39ff14' }}>🎉 Server is Live!</h2>
              <p className="text-sm text-gray-400">Your VPS at 167.172.5.42 is serving your website. One final question:</p>
            </div>

            <div className="card">
              <p className="text-sm mb-4">What is the MAIN advantage of a VPS over localhost for hosting a website?</p>
              {[
                "VPS is faster than your computer",
                "VPS has a public IP and runs 24/7 — anyone can access it anytime",
                "VPS has better security",
                "VPS doesn't need an operating system",
              ].map((opt, i) => (
                <button key={i} onClick={() => handleQuiz(i)} className="w-full text-left p-3 rounded-lg mb-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
