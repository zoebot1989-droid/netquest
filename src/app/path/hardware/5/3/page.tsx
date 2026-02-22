'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife, addAchievement } from '@/lib/gameState';

const lessons = [
  {
    title: "Why Build a Home Lab?",
    content: "A home lab is your personal playground for learning IT, networking, and server administration.\n\nWhy bother?\n• Learn by DOING — no better way to learn Linux, Docker, networking\n• Host your own services — Plex, Nextcloud, game servers, VPN\n• Build real skills for IT/DevOps careers\n• Self-host instead of paying for cloud services\n• It's genuinely fun to tinker with\n\n💡 You don't need expensive hardware!\n• Old office PCs (Dell OptiPlex, HP EliteDesk) — $50-100 on eBay\n• Old laptops with decent RAM\n• Raspberry Pi ($35-80) for lightweight tasks\n• Your current PC with a VM!",
  },
  {
    title: "Hypervisors & Virtualization",
    content: "A hypervisor lets you run multiple virtual machines (VMs) on one physical machine:\n\n🖥️ Proxmox VE (FREE, recommended!)\n• Linux-based, web UI for managing VMs\n• Supports VMs AND containers (LXC)\n• Active community, tons of tutorials\n• Perfect for home labs\n\n🖥️ VMware ESXi\n• Industry standard in enterprise\n• Free tier available (limited)\n• More polished UI\n\n🐳 Docker on bare metal\n• Skip VMs entirely — run containers directly\n• Lighter weight, less overhead\n• Great for services like Plex, Pi-hole, Home Assistant\n• Docker Compose manages multiple containers\n\n💡 Proxmox + Docker inside an LXC container = best of both worlds!",
  },
  {
    title: "Home Lab Services & NAS",
    content: "Popular home lab projects:\n\n📺 Media: Plex/Jellyfin (streaming), *arr stack (media management)\n🔒 Security: Pi-hole (ad blocking), WireGuard (VPN)\n☁️ Cloud: Nextcloud (file sync), Vaultwarden (passwords)\n🏠 Smart Home: Home Assistant (automation)\n📊 Monitoring: Grafana + Prometheus (dashboards)\n🎮 Gaming: Minecraft server, Valheim, etc.\n\n💾 NAS (Network Attached Storage)\n• Centralized file storage accessible over network\n• Software: TrueNAS (ZFS-based, enterprise grade) or OpenMediaVault\n• Minimum: 2 drives in RAID 1 (mirror) for safety\n• Use old PC with 4+ drive bays\n• ZFS is king — self-healing, snapshots, compression\n\n⚠️ RAID is NOT backup! Always have a separate backup (3-2-1 rule: 3 copies, 2 different media, 1 offsite).",
  },
];

interface LabItem { name: string; category: string; price: number; power: number; description: string }
const labItems: LabItem[] = [
  { name: 'Dell OptiPlex 7050 (i5, 16GB)', category: 'Server', price: 80, power: 65, description: 'Great starter server. Quiet, low power.' },
  { name: 'HP EliteDesk 800 G3 (i7, 32GB)', category: 'Server', price: 130, power: 90, description: 'More RAM for VMs. Solid choice.' },
  { name: 'Raspberry Pi 5 (8GB)', category: 'Server', price: 80, power: 5, description: 'Pi-hole, Home Assistant, lightweight services.' },
  { name: '2x 4TB HDD (RAID 1)', category: 'Storage', price: 120, power: 12, description: 'Mirrored storage for NAS. 4TB usable.' },
  { name: '1TB NVMe SSD', category: 'Storage', price: 70, power: 5, description: 'Fast boot drive for Proxmox/Docker.' },
  { name: 'TP-Link 8-port Managed Switch', category: 'Network', price: 50, power: 8, description: 'VLANs for network segmentation.' },
  { name: 'UPS Battery Backup (600VA)', category: 'Power', price: 60, power: 0, description: 'Protects against power outages.' },
  { name: 'Small Rack + Shelf', category: 'Infrastructure', price: 50, power: 0, description: 'Keep everything organized.' },
];

const labBudget = 400;

const quizQuestions = [
  { q: "What is Proxmox VE?", options: ['A Linux distro for gaming', 'A free hypervisor for running VMs and containers', 'A network monitoring tool', 'A type of RAID'], correct: 1 },
  { q: "What's the 3-2-1 backup rule?", options: ['3 drives, 2 backups, 1 original', '3 copies, 2 different media, 1 offsite', '3 servers, 2 networks, 1 firewall', '3 passwords, 2 keys, 1 admin'], correct: 1 },
  { q: "Why use ZFS for a NAS?", options: ['It\'s the fastest filesystem', 'Self-healing, snapshots, data integrity', 'It\'s the easiest to set up', 'It only works on Linux'], correct: 1 },
];

export default function BuildingAHomeLab() {
  const [step, setStep] = useState(0);
  const [labPicked, setLabPicked] = useState<LabItem[]>([]);
  const [labDone, setLabDone] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const labTotal = labPicked.reduce((s, i) => s + i.price, 0);
  const labPower = labPicked.reduce((s, i) => s + i.power, 0);

  const toggleLabItem = (item: LabItem) => {
    setLabPicked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('hw-5-3', 100);
        addAchievement('home-lab-hero');
        setTimeout(() => setComplete(true), 500);
      } else setQuizStep(quizStep + 1);
    } else loseLife();
  };

  if (complete) return <MissionComplete xp={100} message="Home lab ready! Welcome to self-hosting! 🏠" backHref="/path/hardware" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Building a Home Lab" pathId="hardware" />
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/3</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{lessons[step].content}</p>
            </div>
            {step === 2 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs font-semibold mb-2" style={{ color: '#00f0ff' }}>Popular Docker Compose Stack:</p>
                <pre className="font-mono text-[10px] text-gray-400 bg-gray-900 rounded p-2 overflow-x-auto">{`services:
  pihole:        # Ad blocking DNS
  wireguard:     # VPN access from anywhere
  nextcloud:     # Cloud file sync
  jellyfin:      # Media streaming
  vaultwarden:   # Password manager
  homeassistant: # Smart home
  grafana:       # Beautiful dashboards
  portainer:     # Docker management UI`}</pre>
              </div>
            )}
            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">{step < 2 ? 'Next →' : 'Plan Your Lab →'}</button>
          </motion.div>
        )}

        {step === 3 && !labDone && (
          <motion.div key="lab-build" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🏠 Plan Your Home Lab</h2>
              <p className="text-sm text-gray-400 mb-3">Build a home lab under ${labBudget}. Pick wisely!</p>
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-bold">
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div style={{ color: labTotal > labBudget ? '#ff4444' : '#39ff14' }}>${labTotal}</div>
                  <div className="text-gray-500">Budget</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div style={{ color: '#00f0ff' }}>{labPower}W</div>
                  <div className="text-gray-500">Power</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div style={{ color: '#ff9500' }}>{labPicked.length}</div>
                  <div className="text-gray-500">Items</div>
                </div>
              </div>
              <div className="space-y-2">
                {labItems.map(item => (
                  <button key={item.name} onClick={() => toggleLabItem(item)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${labPicked.includes(item) ? 'bg-cyan-900/30 border border-cyan-700/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold">{labPicked.includes(item) ? '✅ ' : ''}{item.name}</span>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div style={{ color: '#ff9500' }}>${item.price}</div>
                        <div className="text-xs text-gray-500">{item.power}W</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setLabDone(true)}
                className={`w-full mt-3 p-3 rounded-lg font-semibold text-sm ${labTotal <= labBudget && labPicked.length >= 2 ? 'bg-green-900/30 text-green-400 hover:bg-green-800/40' : 'bg-red-900/30 text-red-400'}`}>
                {labTotal <= labBudget ? '✅ Submit Lab Plan' : `❌ Over budget by $${labTotal - labBudget}`}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && labDone && (
          <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">🏠 Lab Plan Complete!</h3>
              <p className="text-sm text-gray-400 mb-2">Total: ${labTotal} | Power: {labPower}W | Monthly electric: ~${((labPower * 24 * 30 * 0.12) / 1000).toFixed(2)}</p>
              <div className="space-y-1">
                {labPicked.map(i => (
                  <div key={i.name} className="flex justify-between text-xs"><span>{i.name}</span><span style={{ color: '#00f0ff' }}>${i.price}</span></div>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(4)} className="btn-primary w-full">Take the Quiz →</button>
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
