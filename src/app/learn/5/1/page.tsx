'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionHeader from '@/components/MissionHeader';
import MissionComplete from '@/components/MissionComplete';
import { completeMission, loseLife } from '@/lib/gameState';

interface Node {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

const nodes: Node[] = [
  { id: 'pc', label: 'Your PC', icon: '💻', x: 50, y: 250 },
  { id: 'router1', label: 'Home Router', icon: '📡', x: 150, y: 150 },
  { id: 'isp', label: 'ISP Router', icon: '🏢', x: 250, y: 80 },
  { id: 'router2', label: 'Core Router', icon: '📡', x: 350, y: 150 },
  { id: 'router3', label: 'Backbone', icon: '🌐', x: 250, y: 250 },
  { id: 'cdn', label: 'CDN Edge', icon: '⚡', x: 350, y: 250 },
  { id: 'server', label: 'Web Server', icon: '🖥️', x: 450, y: 180 },
];

const edges: Edge[] = [
  { from: 'pc', to: 'router1' },
  { from: 'router1', to: 'isp' },
  { from: 'router1', to: 'router3' },
  { from: 'isp', to: 'router2' },
  { from: 'isp', to: 'router3' },
  { from: 'router2', to: 'server' },
  { from: 'router2', to: 'cdn' },
  { from: 'router3', to: 'cdn' },
  { from: 'cdn', to: 'server' },
];

const correctPath = ['pc', 'router1', 'isp', 'router2', 'server'];

const lessons = [
  {
    title: "How Does a Packet Travel?",
    content: "When you visit google.com, your request is broken into PACKETS. Each packet must travel from your computer, through multiple routers, across the internet, to Google's server — then the response comes back the same way. Each router decides the next 'hop.'",
  },
  {
    title: "Routing Tables",
    content: "Every router has a ROUTING TABLE — a list of rules that say 'if the destination is X, send the packet to Y.' Routers don't know the entire path — they just know the NEXT hop. It's like asking for directions one turn at a time.",
  },
];

export default function RoutePacketMission() {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<string[]>(['pc']);
  const [complete, setComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [packetPos, setPacketPos] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  const scale = 0.65;
  const svgWidth = 520 * scale;
  const svgHeight = 320 * scale;

  const currentNode = path[path.length - 1];

  const getNeighbors = (nodeId: string) => {
    return edges
      .filter((e) => e.from === nodeId || e.to === nodeId)
      .map((e) => (e.from === nodeId ? e.to : e.from))
      .filter((n) => !path.includes(n));
  };

  const handleNodeClick = (nodeId: string) => {
    if (animating || puzzleComplete) return;
    const neighbors = getNeighbors(currentNode);
    if (!neighbors.includes(nodeId)) return;

    const newPath = [...path, nodeId];
    setPath(newPath);

    if (nodeId === 'server') {
      // Check if path is optimal
      if (newPath.length <= correctPath.length + 1) {
        setPuzzleComplete(true);
        setFeedback('');
        // Animate packet along path
        setAnimating(true);
        setPacketPos(0);
        const interval = setInterval(() => {
          setPacketPos((p) => {
            if (p >= newPath.length - 1) {
              clearInterval(interval);
              setAnimating(false);
              completeMission('net-5-1', 75);
              setTimeout(() => setComplete(true), 1000);
              return p;
            }
            return p + 1;
          });
        }, 600);
      } else {
        setPuzzleComplete(true);
        setFeedback('You reached the server, but took a longer route! Still counts though.');
        completeMission('net-5-1', 75);
        setTimeout(() => setComplete(true), 2000);
      }
    }
  };

  const resetPuzzle = () => {
    setPath(['pc']);
    setFeedback('');
    setPuzzleComplete(false);
    setPacketPos(0);
  };

  if (complete) return <MissionComplete xp={75} message="You can route packets like a pro!" />;

  return (
    <div className="pb-8">
      <MissionHeader chapter={5} title="Route the Packet" />
      <AnimatePresence mode="wait">
        {step < 2 && (
          <motion.div key={`l-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-900/30" style={{ color: '#00f0ff' }}>{step + 1}/2</span>
                <h2 className="font-semibold">{lessons[step].title}</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{lessons[step].content}</p>
            </div>

            {step === 0 && (
              <div className="card border-cyan-800/30">
                <div className="font-mono text-xs text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span>💻</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
                    <span>📡</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>→</motion.span>
                    <span>🏢</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>→</motion.span>
                    <span>📡</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}>→</motion.span>
                    <span>🖥️</span>
                  </div>
                  <p className="text-gray-500">Each arrow = one "hop" through a router</p>
                </div>
              </div>
            )}

            <button onClick={() => setStep(step + 1)} className="btn-primary w-full">
              {step < 1 ? 'Next →' : 'Start Puzzle →'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="puzzle" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card border-orange-800/30">
              <h2 className="font-semibold mb-1" style={{ color: '#ff9500' }}>🎯 Route the Packet</h2>
              <p className="text-sm text-gray-400">Tap routers to guide your packet from 💻 to 🖥️. Find the shortest path!</p>
            </div>

            <div className="card overflow-hidden p-2">
              <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${520} ${320}`} className="w-full">
                {/* Edges */}
                {edges.map((e, i) => {
                  const from = nodes.find((n) => n.id === e.from)!;
                  const to = nodes.find((n) => n.id === e.to)!;
                  const inPath = path.includes(e.from) && path.includes(e.to) &&
                    Math.abs(path.indexOf(e.from) - path.indexOf(e.to)) === 1;
                  return (
                    <line
                      key={i}
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={inPath ? '#00f0ff' : '#1e293b'}
                      strokeWidth={inPath ? 3 : 1.5}
                      strokeDasharray={inPath ? '' : '4 4'}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((n) => {
                  const inPath = path.includes(n.id);
                  const isCurrent = n.id === currentNode;
                  const isNeighbor = !puzzleComplete && getNeighbors(currentNode).includes(n.id);
                  return (
                    <g key={n.id} onClick={() => handleNodeClick(n.id)} className={isNeighbor ? 'cursor-pointer' : ''}>
                      <circle
                        cx={n.x} cy={n.y} r={28}
                        fill={inPath ? '#0f2a3d' : '#111827'}
                        stroke={isCurrent ? '#00f0ff' : isNeighbor ? '#39ff14' : inPath ? '#00f0ff44' : '#1e293b'}
                        strokeWidth={isCurrent || isNeighbor ? 2.5 : 1}
                      />
                      {isNeighbor && (
                        <circle cx={n.x} cy={n.y} r={28} fill="none" stroke="#39ff14" strokeWidth={1} opacity={0.5}>
                          <animate attributeName="r" from="28" to="36" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="20">{n.icon}</text>
                      <text x={n.x} y={n.y + 45} textAnchor="middle" fontSize="9" fill="#94a3b8">{n.label}</text>
                    </g>
                  );
                })}

                {/* Animated packet */}
                {animating && packetPos < path.length && (
                  <motion.circle
                    cx={nodes.find((n) => n.id === path[packetPos])!.x}
                    cy={nodes.find((n) => n.id === path[packetPos])!.y}
                    r={8}
                    fill="#00f0ff"
                    opacity={0.8}
                  >
                    <animate attributeName="r" from="6" to="12" dur="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0.4" dur="0.5s" repeatCount="indefinite" />
                  </motion.circle>
                )}
              </svg>
            </div>

            <div className="card">
              <p className="text-xs text-gray-400 mb-1">Current path ({path.length - 1} hops):</p>
              <div className="font-mono text-xs flex flex-wrap gap-1">
                {path.map((p, i) => (
                  <span key={i}>
                    <span style={{ color: '#00f0ff' }}>{nodes.find((n) => n.id === p)?.label}</span>
                    {i < path.length - 1 && <span className="text-gray-600"> → </span>}
                  </span>
                ))}
              </div>
            </div>

            {feedback && <p className="text-sm text-center" style={{ color: '#39ff14' }}>{feedback}</p>}

            {!puzzleComplete && path.length > 1 && (
              <button onClick={resetPuzzle} className="w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-sm text-center">
                🔄 Reset Path
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
