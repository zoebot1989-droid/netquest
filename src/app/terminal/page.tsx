'use client';
import { useState, useRef, useEffect } from 'react';
import { createTerminalState, executeCommand, type TerminalState } from '@/lib/terminalEngine';
import { addAchievement } from '@/lib/gameState';

interface Line { type: 'input' | 'output'; text: string; }

export default function Terminal() {
  const [termState, setTermState] = useState<TerminalState>(() => createTerminalState());
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: '⚡ NetQuest Terminal v2.0' },
    { type: 'output', text: 'Full simulated Linux filesystem. Type "help" for commands.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const ps1 = `${termState.user}@${termState.hostname}:${termState.cwd === '/home/user' ? '~' : termState.cwd}$`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newLines: Line[] = [...lines, { type: 'input', text: `${ps1} ${input}` }];

    if (input.trim().startsWith('ssh')) addAchievement('first-ssh');

    const result = executeCommand(termState, input);

    if (result.output.includes('__CLEAR__')) {
      setLines([]);
      setInput('');
      setTermState(result.state);
      return;
    }

    result.output.forEach(line => newLines.push({ type: 'output', text: line }));
    newLines.push({ type: 'output', text: '' });

    setLines(newLines);
    setHistory([input, ...history]);
    setHistoryIndex(-1);
    setTermState(result.state);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className="pb-8">
      <h1 className="text-xl font-bold mb-4">💻 Terminal</h1>
      <div
        className="bg-black/80 rounded-xl border border-gray-800 overflow-hidden"
        style={{ height: 'calc(100dvh - 160px)' }}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs text-gray-500 ml-2 font-mono">{termState.user}@{termState.hostname}</span>
        </div>

        <div ref={scrollRef} className="p-4 font-mono text-sm overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          {lines.map((line, i) => (
            <div key={i} className={line.type === 'input' ? 'text-[#39ff14]' : 'text-gray-300'} style={{ whiteSpace: 'pre-wrap' }}>
              {line.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2 border-t border-gray-800">
          <span className="text-[#39ff14] font-mono text-sm whitespace-nowrap">{ps1}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent font-mono text-sm text-white outline-none min-w-0"
            placeholder="Type a command..."
            autoFocus
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
