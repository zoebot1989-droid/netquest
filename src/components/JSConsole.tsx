'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

interface Line { type: 'input' | 'output' | 'error' | 'log'; text: string; }

interface Props {
  onCommand?: (cmd: string, output: string) => void;
  height?: string;
  simulatedDOM?: Record<string, { textContent?: string; innerHTML?: string; style?: Record<string, string>; classList?: string[] }>;
}

export default function JSConsole({ onCommand, height = '250px', simulatedDOM }: Props) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: '🌐 JavaScript Console (NetQuest Simulator)' },
    { type: 'output', text: 'Type JavaScript code below!' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dom = useRef(simulatedDOM || {});

  useEffect(() => { dom.current = simulatedDOM || {}; }, [simulatedDOM]);
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines]);

  const formatVal = (v: unknown): string => {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'string') return `"${v}"`;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) return `[${v.map(formatVal).join(', ')}]`;
    if (typeof v === 'object') {
      try { return JSON.stringify(v, null, 2); } catch { return String(v); }
    }
    return String(v);
  };

  const evaluate = useCallback((cmd: string, vars: Record<string, unknown>): { output: Line[]; newVars: Record<string, unknown> } => {
    const output: Line[] = [];
    const newVars = { ...vars };
    const trimmed = cmd.trim();
    if (!trimmed) return { output, newVars };

    // console.log()
    const logMatch = trimmed.match(/^console\.log\s*\(([\s\S]*)\)$/);
    if (logMatch) {
      const argStr = logMatch[1].trim();
      if (!argStr) { output.push({ type: 'log', text: '' }); return { output, newVars }; }
      try {
        const val = evalExpr(argStr, newVars);
        output.push({ type: 'log', text: typeof val === 'string' ? val : formatVal(val) });
      } catch (e: unknown) {
        output.push({ type: 'error', text: `Error: ${e instanceof Error ? e.message : String(e)}` });
      }
      return { output, newVars };
    }

    // document.querySelector / getElementById
    const qsMatch = trimmed.match(/^document\.(querySelector|getElementById)\s*\(\s*["']([^"']+)["']\s*\)$/);
    if (qsMatch) {
      const sel = qsMatch[2];
      const el = dom.current[sel] || dom.current[`#${sel}`];
      if (el) {
        output.push({ type: 'output', text: `<Element: ${sel}>` });
        output.push({ type: 'output', text: `  textContent: "${el.textContent || ''}"` });
        if (el.innerHTML) output.push({ type: 'output', text: `  innerHTML: "${el.innerHTML}"` });
      } else {
        output.push({ type: 'output', text: 'null' });
      }
      return { output, newVars };
    }

    // .textContent / .innerHTML / .style / .classList modification
    const domModify = trimmed.match(/^document\.(querySelector|getElementById)\s*\(\s*["']([^"']+)["']\s*\)\.(textContent|innerHTML|style\.(\w+)|classList\.(add|remove|toggle))\s*=?\s*["']?([^"']*)["']?$/);
    if (domModify) {
      output.push({ type: 'output', text: `DOM updated: ${domModify[2]}` });
      return { output, newVars };
    }

    // addEventListener
    if (trimmed.includes('addEventListener')) {
      output.push({ type: 'output', text: 'Event listener registered ✓' });
      return { output, newVars };
    }

    // typeof
    const typeofMatch = trimmed.match(/^typeof\s+(.+)$/);
    if (typeofMatch) {
      const val = evalExpr(typeofMatch[1].trim(), newVars);
      output.push({ type: 'output', text: `"${typeof val}"` });
      return { output, newVars };
    }

    // let/const/var assignment
    const letMatch = trimmed.match(/^(let|const|var)\s+(\w+)\s*=\s*(.+)$/);
    if (letMatch) {
      try {
        const val = evalExpr(letMatch[3].trim(), newVars);
        newVars[letMatch[2]] = val;
        output.push({ type: 'output', text: 'undefined' });
      } catch (e: unknown) {
        output.push({ type: 'error', text: `Error: ${e instanceof Error ? e.message : String(e)}` });
      }
      return { output, newVars };
    }

    // reassignment
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch && !trimmed.includes('==') && !trimmed.includes('===')) {
      try {
        const val = evalExpr(assignMatch[2].trim(), newVars);
        newVars[assignMatch[1]] = val;
        output.push({ type: 'output', text: formatVal(val) });
      } catch (e: unknown) {
        output.push({ type: 'error', text: `Error: ${e instanceof Error ? e.message : String(e)}` });
      }
      return { output, newVars };
    }

    // Expression evaluation
    try {
      const val = evalExpr(trimmed, newVars);
      output.push({ type: 'output', text: formatVal(val) });
    } catch (e: unknown) {
      output.push({ type: 'error', text: `Error: ${e instanceof Error ? e.message : String(e)}` });
    }
    return { output, newVars };
  }, []);

  function evalExpr(expr: string, vars: Record<string, unknown>): unknown {
    expr = expr.trim();
    if (!expr) return undefined;

    // String literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    // Template literal
    if (expr.startsWith('`') && expr.endsWith('`')) {
      const inner = expr.slice(1, -1);
      return inner.replace(/\$\{([^}]+)\}/g, (_, e) => String(evalExpr(e.trim(), vars)));
    }
    // Numbers
    if (/^-?\d+(\.\d+)?$/.test(expr)) return parseFloat(expr);
    // Booleans
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (expr === 'undefined') return undefined;
    if (expr === 'NaN') return NaN;

    // Array literal
    if (expr.startsWith('[') && expr.endsWith(']')) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      return splitArgs(inner).map(a => evalExpr(a.trim(), vars));
    }

    // Object literal
    if (expr.startsWith('{') && expr.endsWith('}')) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return {};
      const obj: Record<string, unknown> = {};
      for (const pair of splitArgs(inner)) {
        const [k, ...vParts] = pair.split(':');
        obj[k.trim().replace(/["']/g, '')] = evalExpr(vParts.join(':').trim(), vars);
      }
      return obj;
    }

    // Parentheses
    if (expr.startsWith('(') && expr.endsWith(')')) {
      return evalExpr(expr.slice(1, -1), vars);
    }

    // Math operations (simple left-to-right)
    for (const op of ['+', '-', '*', '/', '%']) {
      const idx = findOp(expr, op);
      if (idx > 0) {
        const left = evalExpr(expr.slice(0, idx), vars);
        const right = evalExpr(expr.slice(idx + 1), vars);
        if (op === '+') {
          if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
          return (left as number) + (right as number);
        }
        if (op === '-') return (left as number) - (right as number);
        if (op === '*') return (left as number) * (right as number);
        if (op === '/') return (left as number) / (right as number);
        if (op === '%') return (left as number) % (right as number);
      }
    }

    // Comparison
    for (const op of ['===', '!==', '==', '!=', '<=', '>=', '<', '>']) {
      const idx = expr.indexOf(op);
      if (idx > 0) {
        const left = evalExpr(expr.slice(0, idx), vars);
        const right = evalExpr(expr.slice(idx + op.length), vars);
        if (op === '===' || op === '==') return left === right;
        if (op === '!==' || op === '!=') return left !== right;
        if (op === '<=') return (left as number) <= (right as number);
        if (op === '>=') return (left as number) >= (right as number);
        if (op === '<') return (left as number) < (right as number);
        if (op === '>') return (left as number) > (right as number);
      }
    }

    // Function calls: Math.*, parseInt, parseFloat, String, Number, Boolean, JSON.*
    const fnMatch = expr.match(/^([\w.]+)\s*\(([\s\S]*)\)$/);
    if (fnMatch) {
      const fn = fnMatch[1];
      const args = fnMatch[2].trim() ? splitArgs(fnMatch[2]).map(a => evalExpr(a.trim(), vars)) : [];
      if (fn === 'Math.floor') return Math.floor(args[0] as number);
      if (fn === 'Math.ceil') return Math.ceil(args[0] as number);
      if (fn === 'Math.round') return Math.round(args[0] as number);
      if (fn === 'Math.random') return Math.random();
      if (fn === 'Math.max') return Math.max(...(args as number[]));
      if (fn === 'Math.min') return Math.min(...(args as number[]));
      if (fn === 'Math.abs') return Math.abs(args[0] as number);
      if (fn === 'Math.sqrt') return Math.sqrt(args[0] as number);
      if (fn === 'Math.pow') return Math.pow(args[0] as number, args[1] as number);
      if (fn === 'parseInt') return parseInt(String(args[0]), args[1] as number || 10);
      if (fn === 'parseFloat') return parseFloat(String(args[0]));
      if (fn === 'String') return String(args[0]);
      if (fn === 'Number') return Number(args[0]);
      if (fn === 'Boolean') return Boolean(args[0]);
      if (fn === 'Array.isArray') return Array.isArray(args[0]);
      if (fn === 'JSON.stringify') return JSON.stringify(args[0]);
      if (fn === 'JSON.parse') return JSON.parse(String(args[0]));
      if (fn === 'alert') return `[alert: ${args[0]}]`;
      if (fn === 'prompt') return 'user_input';
      // .length is not a function but handle arr.push etc
      return undefined;
    }

    // Property access: x.length, x.toUpperCase(), etc.
    const propMatch = expr.match(/^(\w+)\.(\w+)(\(\))?$/);
    if (propMatch) {
      const obj = vars[propMatch[1]];
      const prop = propMatch[2];
      const isCall = !!propMatch[3];
      if (prop === 'length' && !isCall) {
        if (typeof obj === 'string') return obj.length;
        if (Array.isArray(obj)) return obj.length;
      }
      if (isCall && typeof obj === 'string') {
        if (prop === 'toUpperCase') return obj.toUpperCase();
        if (prop === 'toLowerCase') return obj.toLowerCase();
        if (prop === 'trim') return obj.trim();
      }
      if (prop === 'Math' || prop === 'PI') {
        if (expr === 'Math.PI') return Math.PI;
      }
    }

    // Special: Math.PI
    if (expr === 'Math.PI') return Math.PI;

    // Variable lookup
    if (/^[a-zA-Z_]\w*$/.test(expr)) {
      if (expr in vars) return vars[expr];
      throw new Error(`${expr} is not defined`);
    }

    return undefined;
  }

  function splitArgs(s: string): string[] {
    const args: string[] = [];
    let depth = 0, current = '', inStr: string | null = null;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        current += c;
        if (c === inStr && s[i - 1] !== '\\') inStr = null;
      } else if (c === '"' || c === "'" || c === '`') {
        inStr = c; current += c;
      } else if ('([{'.includes(c)) { depth++; current += c; }
      else if (')]}'.includes(c)) { depth--; current += c; }
      else if (c === ',' && depth === 0) { args.push(current); current = ''; }
      else { current += c; }
    }
    if (current.trim()) args.push(current);
    return args;
  }

  function findOp(expr: string, op: string): number {
    let depth = 0, inStr: string | null = null;
    for (let i = expr.length - 1; i >= 0; i--) {
      const c = expr[i];
      if (inStr) { if (c === inStr && expr[i - 1] !== '\\') inStr = null; }
      else if (c === '"' || c === "'" || c === '`') { inStr = c; }
      else if (')]}'.includes(c)) depth++;
      else if ('([{'.includes(c)) depth--;
      else if (depth === 0 && expr[i] === op && i > 0) {
        if (op === '-' && '+-*/%('.includes(expr[i - 1]?.trim() || '')) continue;
        return i;
      }
    }
    return -1;
  }

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    setInput('');
    if (!cmd.trim()) return;

    if (cmd.trim() === 'clear') { setLines([]); return; }

    const newLines: Line[] = [...lines, { type: 'input', text: `> ${cmd}` }];
    const result = evaluate(cmd, variables);
    setVariables(result.newVars);
    for (const o of result.output) newLines.push(o);
    setLines(newLines);
    setHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    onCommand?.(cmd, result.output.map(o => o.text).join('\n'));
  }, [input, lines, variables, evaluate, onCommand]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) { const i = historyIndex + 1; setHistoryIndex(i); setInput(history[i]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) { const i = historyIndex - 1; setHistoryIndex(i); setInput(history[i]); }
      else { setHistoryIndex(-1); setInput(''); }
    }
  };

  return (
    <div className="bg-black/80 rounded-xl border border-gray-800 overflow-hidden" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border-b border-gray-800">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="text-[10px] text-gray-500 ml-1 font-mono">JavaScript Console</span>
      </div>

      <div ref={scrollRef} className="p-3 font-mono text-xs overflow-y-auto" style={{ height }}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input' ? 'text-[#00f0ff]' :
              line.type === 'error' ? 'text-red-400' :
              line.type === 'log' ? 'text-yellow-300' :
              'text-gray-300'
            }
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-gray-800">
        <span className="text-[#00f0ff] font-mono text-xs">&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-xs text-white outline-none min-w-0"
          placeholder="Type JavaScript..."
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
