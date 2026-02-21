'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NetNode {
  id: string;
  type: string;
  icon: string;
  label: string;
  x: number;
  y: number;
  ip: string;
  ports: string[];
}

interface Connection {
  from: string;
  to: string;
}

const nodeTypes = [
  { type: 'pc', icon: '💻', label: 'PC', defaultIP: '192.168.1.' },
  { type: 'server', icon: '🖥️', label: 'Server', defaultIP: '10.0.0.' },
  { type: 'router', icon: '📡', label: 'Router', defaultIP: '192.168.1.1' },
  { type: 'switch', icon: '🔀', label: 'Switch', defaultIP: '' },
  { type: 'firewall', icon: '🛡️', label: 'Firewall', defaultIP: '' },
  { type: 'cloud', icon: '☁️', label: 'Internet', defaultIP: '' },
  { type: 'dns', icon: '📖', label: 'DNS Server', defaultIP: '8.8.8.8' },
  { type: 'vps', icon: '🌐', label: 'VPS', defaultIP: '167.172.' },
];

export default function Sandbox() {
  const [nodes, setNodes] = useState<NetNode[]>([
    { id: 'n1', type: 'router', icon: '📡', label: 'Home Router', x: 200, y: 150, ip: '192.168.1.1', ports: ['80', '443'] },
    { id: 'n2', type: 'pc', icon: '💻', label: 'My PC', x: 100, y: 280, ip: '192.168.1.10', ports: [] },
  ]);
  const [connections, setConnections] = useState<Connection[]>([{ from: 'n1', to: 'n2' }]);
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editNode, setEditNode] = useState<NetNode | null>(null);

  let counter = nodes.length + 1;

  const addNode = (type: typeof nodeTypes[0]) => {
    const id = `n${Date.now()}`;
    const newNode: NetNode = {
      id,
      type: type.type,
      icon: type.icon,
      label: type.label,
      x: 150 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      ip: type.defaultIP + (type.defaultIP.endsWith('.') ? Math.floor(Math.random() * 200 + 10) : ''),
      ports: [],
    };
    setNodes([...nodes, newNode]);
    setShowAdd(false);
  };

  const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
    if (connecting) {
      if (connecting !== nodeId && !connections.find(c => (c.from === connecting && c.to === nodeId) || (c.from === nodeId && c.to === connecting))) {
        setConnections([...connections, { from: connecting, to: nodeId }]);
      }
      setConnecting(null);
      return;
    }
    setDragging(nodeId);
    setSelected(nodeId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x, y } : n));
  }, [dragging]);

  const handlePointerUp = () => setDragging(null);

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    setSelected(null);
    setEditNode(null);
  };

  const selectedNode = nodes.find(n => n.id === selected);

  return (
    <div className="pb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">🔧 Network Sandbox</h1>
        <div className="flex gap-2">
          <button onClick={() => setConnecting(connecting ? null : selected)} className={`text-xs px-3 py-1.5 rounded-lg ${connecting ? 'bg-green-900/30 text-green-400' : 'bg-gray-800/50 text-gray-400'}`}>
            {connecting ? '🔗 Tap target' : '🔗 Connect'}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="text-xs px-3 py-1.5 rounded-lg bg-cyan-900/30 text-cyan-400">
            + Add
          </button>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="grid grid-cols-4 gap-2">
            {nodeTypes.map(t => (
              <button key={t.type} onClick={() => addNode(t)} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-xs">
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Canvas */}
      <div
        className="card p-0 overflow-hidden touch-none relative"
        style={{ height: '400px' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((c, i) => {
            const from = nodes.find(n => n.id === c.from);
            const to = nodes.find(n => n.id === c.to);
            if (!from || !to) return null;
            return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#1e4a5e" strokeWidth={2} />;
          })}
        </svg>

        {nodes.map(n => (
          <div
            key={n.id}
            className={`absolute flex flex-col items-center cursor-grab active:cursor-grabbing select-none ${selected === n.id ? 'z-10' : ''}`}
            style={{ left: n.x - 25, top: n.y - 25 }}
            onPointerDown={(e) => handlePointerDown(e, n.id)}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${selected === n.id ? 'bg-cyan-900/40 ring-2 ring-[#00f0ff]/50' : 'bg-gray-800/80'}`}>
              {n.icon}
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">{n.label}</span>
            {n.ip && <span className="text-[9px] font-mono" style={{ color: '#00f0ff' }}>{n.ip}</span>}
          </div>
        ))}
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{selectedNode.icon} {selectedNode.label}</h3>
            <div className="flex gap-2">
              <button onClick={() => setEditNode(selectedNode)} className="text-xs px-2 py-1 rounded bg-gray-800/50">✏️ Edit</button>
              <button onClick={() => deleteNode(selectedNode.id)} className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400">🗑️</button>
            </div>
          </div>
          <div className="font-mono text-xs space-y-1">
            <div>Type: <span className="text-gray-400">{selectedNode.type}</span></div>
            <div>IP: <span style={{ color: '#00f0ff' }}>{selectedNode.ip || 'None'}</span></div>
            {selectedNode.ports.length > 0 && <div>Ports: <span style={{ color: '#39ff14' }}>{selectedNode.ports.join(', ')}</span></div>}
          </div>
        </motion.div>
      )}

      {/* Edit modal */}
      {editNode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <div className="card max-w-sm w-full space-y-3">
            <h3 className="font-semibold">Edit {editNode.icon} {editNode.label}</h3>
            <div>
              <label className="text-xs text-gray-400">Label</label>
              <input value={editNode.label} onChange={e => setEditNode({ ...editNode, label: e.target.value })} className="w-full bg-gray-800/50 rounded-lg p-2 text-sm font-mono mt-1 border border-gray-700 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400">IP Address</label>
              <input value={editNode.ip} onChange={e => setEditNode({ ...editNode, ip: e.target.value })} className="w-full bg-gray-800/50 rounded-lg p-2 text-sm font-mono mt-1 border border-gray-700 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Open Ports (comma separated)</label>
              <input value={editNode.ports.join(', ')} onChange={e => setEditNode({ ...editNode, ports: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full bg-gray-800/50 rounded-lg p-2 text-sm font-mono mt-1 border border-gray-700 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setNodes(nodes.map(n => n.id === editNode.id ? editNode : n)); setEditNode(null); }} className="btn-primary flex-1 text-sm">Save</button>
              <button onClick={() => setEditNode(null)} className="flex-1 p-2 rounded-lg bg-gray-800/50 text-sm">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
