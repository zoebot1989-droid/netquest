'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createTerminalState, executeCommand, type TerminalState } from '@/lib/terminalEngine';

interface Line { type: 'input' | 'output'; text: string; }

interface Props {
  onCommand?: (cmd: string, output: string[], state: TerminalState) => void;
  initialState?: TerminalState;
  height?: string;
  prompt?: string;
}

export default function InlineTerminal({ onCommand, initialState, height = '250px', prompt }: Props) {
  const [termState, setTermState] = useState<TerminalState>(() => initialState || createTerminalState());
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: '⚡ NetQuest Terminal' },
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

  const ps1 = prompt || `${termState.user}@${termState.hostname}:${termState.cwd === '/home/user' ? '~' : termState.cwd}$`;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newLines: Line[] = [...lines, { type: 'input', text: `${ps1} ${input}` }];

    const result = executeCommand(termState, input);
    const newState = result.state;

    if (result.output.includes('__CLEAR__')) {
      setLines([]);
      setInput('');
      setTermState(newState);
      return;
    }

    result.output.forEach(line => newLines.push({ type: 'output', text: line }));
    newLines.push({ type: 'output', text: '' });

    setLines(newLines);
    setHistory(prev => [input, ...prev]);
    setHistoryIndex(-1);
    setTermState(newState);
    
    onCommand?.(input, result.output, newState);
    setInput('');
  }, [input, lines, termState, ps1, onCommand]);

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
    <div
      className="bg-black/80 rounded-xl border border-gray-800 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border-b border-gray-800">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="text-[10px] text-gray-500 ml-1 font-mono">{termState.user}@{termState.hostname}</span>
      </div>

      <div ref={scrollRef} className="p-3 font-mono text-xs overflow-y-auto" style={{ height }}>
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'input' ? 'text-[#39ff14]' : 'text-gray-300'} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-gray-800">
        <span className="text-[#39ff14] font-mono text-xs whitespace-nowrap">{ps1}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-xs text-white outline-none min-w-0"
          placeholder="Type a command..."
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
