'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

const lessons = [
  {
    title: "TCP — The Reliable One",
    content: "TCP (Transmission Control Protocol) guarantees delivery. Before sending data, it establishes a connection with a 3-way handshake:\n\n1️⃣ SYN → Client says \"I want to connect\"\n2️⃣ SYN-ACK → Server says \"OK, I'm ready\"\n3️⃣ ACK → Client says \"Great, let's go!\"\n\nThen data flows with acknowledgments. If a packet is lost, TCP resends it. Everything arrives in order. Think: certified mail with tracking.",
  },
  {
    title: "UDP — The Fast One",
    content: "UDP (User Datagram Protocol) just sends data — no handshake, no confirmation, no ordering.\n\nIf packets are lost? Too bad. Out of order? Deal with it.\n\nWhy use it? SPEED. When you're streaming video, gaming, or doing a voice call, a dropped frame doesn't matter — but waiting for a retransmission would cause lag.\n\nThink: shouting across a room. Fast, but no guarantee they heard you.",
  },
  {
    title: "When to Use Each",
    content: "TCP (reliable, ordered, slower):\n• Web browsing (HTTP/HTTPS)\n• Email (SMTP, IMAP)\n• File transfers (FTP)\n• SSH\n• Any time data MUST arrive correctly\n\nUDP (fast, no guarantees):\n• Video streaming\n• Online gaming\n• Voice/Video calls (VoIP)\n• DNS lookups\n• Live broadcasts\n\nRule of thumb: Need accuracy? TCP. Need speed? UDP.",
  },
];

interface MatchItem {
  protocol: string;
  answer: 'tcp' | 'udp';
}

const matchItems: MatchItem[] = [
  { protocol: 'Loading a web page (HTTPS)', answer: 'tcp' },
  { protocol: 'Watching a live Twitch stream', answer: 'udp' },
  { protocol: 'Sending an email', answer: 'tcp' },
  { protocol: 'Playing Fortnite online', answer: 'udp' },
  { protocol: 'Downloading a file via FTP', answer: 'tcp' },
  { protocol: 'Discord voice chat', answer: 'udp' },
  { protocol: 'SSH into a server', answer: 'tcp' },
  { protocol: 'DNS query to resolve google.com', answer: 'udp' },
];

const quizQuestions = [
  { q: "What are the 3 steps of the TCP handshake?", options: ['HELLO, OK, START', 'SYN, SYN-ACK, ACK', 'CONNECT, ACCEPT, BEGIN', 'REQ, RES, DONE'], correct: 1 },
  { q: "Why is UDP faster than TCP?", options: ['It uses more bandwidth', 'It skips the handshake and doesn\'t wait for acknowledgments', 'It compresses data more', 'It uses newer hardware'], correct: 1 },
  { q: "Which protocol would video streaming use?", options: ['TCP — needs to be reliable', 'UDP — speed matters more than perfection', 'Both equally', 'Neither — it uses HTTP'], correct: 1 },
  { q: "What happens when a TCP packet is lost?", options: ['Connection drops', 'It gets resent', 'Nothing', 'The server crashes'], correct: 1 },
];

export default function TCPvsUDP() {
  const [step, setStep] = useState(0);
  const [matchIdx, setMatchIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [quizStep, setQuizStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleMatch = (answer: 'tcp' | 'udp') => {
    const correct = answer === matchItems[matchIdx].answer;
    if (correct) {
      setScore(s => s + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ That's ${matchItems[matchIdx].answer.toUpperCase()}!`);
      loseLife();
    }
    setTimeout(() => {
      setFeedback('');
      if (matchIdx + 1 >= matchItems.length) {
        setStep(4);
      } else {
        setMatchIdx(matchIdx + 1);
      }
    }, 800);
  };

  const handleQuiz = (answer: number) => {
    if (answer === quizQuestions[quizStep].correct) {
      if (quizStep + 1 >= quizQuestions.length) {
        completeMission('net-2-3', 50);
        setTimeout(() => setComplete(true), 500);
      } else {
        setQuizStep(quizStep + 1);
      }
    } else {
      loseLife();
    }
  };

  if (complete) return <MissionComplete xp={50} message="TCP and UDP — understood!" backHref="/path/networking" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={2} title="TCP vs UDP" pathId="networking" />
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

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <p className="text-xs text-gray-400 mb-2">🤝 TCP 3-Way Handshake:</p>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="text-center">
                    <p className="text-2xl mb-1">💻</p>
                    <p className="text-gray-400">Client</p>
                  </div>
                  <div className="flex-1 mx-4 space-y-2">
                    <div className="flex items-center"><span className="flex-1 border-t border-dashed border-cyan-700"></span><span className="mx-2" style={{ color: '#39ff14' }}>SYN →</span></div>
                    <div className="flex items-center"><span className="mx-2" style={{ color: '#ff9500' }}>← SYN-ACK</span><span className="flex-1 border-t border-dashed border-orange-700"></span></div>
                    <div className="flex items-center"><span className="flex-1 border-t border-dashed border-cyan-700"></span><span className="mx-2" style={{ color: '#39ff14' }}>ACK →</span></div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl mb-1">🖥️</p>
                    <p className="text-gray-400">Server</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 2 ? 'Next →' : 'Start Challenge →'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="match" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">⚡ TCP or UDP? ({matchIdx + 1}/{matchItems.length})</h3>
              <p className="text-sm mb-4 text-center" style={{ color: '#00f0ff' }}>{matchItems[matchIdx].protocol}</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleMatch('tcp')} className="p-4 rounded-lg bg-gray-800/50 hover:bg-blue-900/30 transition-colors text-center">
                  <span className="text-2xl block mb-1">🔒</span>
                  <span className="text-sm font-semibold">TCP</span>
                  <span className="text-xs text-gray-500 block">Reliable</span>
                </button>
                <button onClick={() => handleMatch('udp')} className="p-4 rounded-lg bg-gray-800/50 hover:bg-purple-900/30 transition-colors text-center">
                  <span className="text-2xl block mb-1">⚡</span>
                  <span className="text-sm font-semibold">UDP</span>
                  <span className="text-xs text-gray-500 block">Fast</span>
                </button>
              </div>
              {feedback && <p className="text-sm mt-3 text-center">{feedback}</p>}
              <p className="text-xs text-gray-500 mt-2 text-center">Score: {score}/{matchIdx + (feedback ? 1 : 0)}</p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">📝 Quiz ({quizStep + 1}/{quizQuestions.length})</h3>
              <p className="text-sm mb-4">{quizQuestions[quizStep].q}</p>
              {quizQuestions[quizStep].options.map((opt, i) => (
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
