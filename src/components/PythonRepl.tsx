'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

interface Line { type: 'input' | 'output' | 'error'; text: string; }

interface Props {
  onCommand?: (cmd: string, output: string) => void;
  height?: string;
  initialCode?: string[];
}

type PyValue = string | number | boolean | null | PyValueArray | PyValueRecord;
interface PyValueArray extends Array<PyValue> {}
interface PyValueRecord extends Record<string, PyValue> {}

function formatValue(v: PyValue): string {
  if (v === null) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) return `[${v.map(formatValue).join(', ')}]`;
  if (typeof v === 'object') return `{${Object.entries(v).map(([k,val]) => `'${k}': ${formatValue(val)}`).join(', ')}}`;
  return String(v);
}

function inferType(v: PyValue): string {
  if (v === null) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (typeof v === 'object') return 'dict';
  return 'object';
}

function parseStringLiteral(s: string): { value: string; rest: string } | null {
  s = s.trim();
  const q = s[0];
  if (q !== '"' && q !== "'") return null;
  let i = 1;
  let result = '';
  while (i < s.length) {
    if (s[i] === '\\' && i + 1 < s.length) {
      const next = s[i + 1];
      if (next === 'n') result += '\n';
      else if (next === 't') result += '\t';
      else if (next === '\\') result += '\\';
      else if (next === q) result += q;
      else result += '\\' + next;
      i += 2;
    } else if (s[i] === q) {
      return { value: result, rest: s.slice(i + 1).trim() };
    } else {
      result += s[i];
      i++;
    }
  }
  return null;
}

function parseList(s: string): { value: PyValue[]; rest: string } | null {
  s = s.trim();
  if (s[0] !== '[') return null;
  s = s.slice(1).trim();
  const items: PyValue[] = [];
  if (s[0] === ']') return { value: items, rest: s.slice(1).trim() };
  while (s.length > 0) {
    const parsed = parseExpression(s);
    if (!parsed) return null;
    items.push(parsed.value);
    s = parsed.rest.trim();
    if (s[0] === ']') return { value: items, rest: s.slice(1).trim() };
    if (s[0] === ',') { s = s.slice(1).trim(); continue; }
    return null;
  }
  return null;
}

function parseDict(s: string): { value: Record<string, PyValue>; rest: string } | null {
  s = s.trim();
  if (s[0] !== '{') return null;
  s = s.slice(1).trim();
  const dict: Record<string, PyValue> = {};
  if (s[0] === '}') return { value: dict, rest: s.slice(1).trim() };
  while (s.length > 0) {
    const keyParsed = parseExpression(s);
    if (!keyParsed) return null;
    s = keyParsed.rest.trim();
    if (s[0] !== ':') return null;
    s = s.slice(1).trim();
    const valParsed = parseExpression(s);
    if (!valParsed) return null;
    dict[String(keyParsed.value)] = valParsed.value;
    s = valParsed.rest.trim();
    if (s[0] === '}') return { value: dict, rest: s.slice(1).trim() };
    if (s[0] === ',') { s = s.slice(1).trim(); continue; }
    return null;
  }
  return null;
}

function parseTuple(s: string): { value: PyValue[]; rest: string } | null {
  s = s.trim();
  if (s[0] !== '(') return null;
  s = s.slice(1).trim();
  const items: PyValue[] = [];
  if (s[0] === ')') return { value: items, rest: s.slice(1).trim() };
  while (s.length > 0) {
    const parsed = parseExpression(s);
    if (!parsed) return null;
    items.push(parsed.value);
    s = parsed.rest.trim();
    if (s[0] === ')') return { value: items, rest: s.slice(1).trim() };
    if (s[0] === ',') { s = s.slice(1).trim(); continue; }
    return null;
  }
  return null;
}

function parseAtom(s: string): { value: PyValue; rest: string } | null {
  s = s.trim();
  if (!s) return null;
  // String
  if (s[0] === '"' || s[0] === "'") return parseStringLiteral(s) as { value: PyValue; rest: string } | null;
  // List
  if (s[0] === '[') return parseList(s) as { value: PyValue; rest: string } | null;
  // Dict
  if (s[0] === '{') return parseDict(s) as { value: PyValue; rest: string } | null;
  // Tuple / paren group
  if (s[0] === '(') return parseTuple(s) as { value: PyValue; rest: string } | null;
  // Boolean / None
  if (s.startsWith('True')) return { value: true, rest: s.slice(4) };
  if (s.startsWith('False')) return { value: false, rest: s.slice(5) };
  if (s.startsWith('None')) return { value: null, rest: s.slice(4) };
  // Number
  const numMatch = s.match(/^-?\d+(\.\d+)?/);
  if (numMatch) {
    const n = numMatch[0].includes('.') ? parseFloat(numMatch[0]) : parseInt(numMatch[0]);
    return { value: n, rest: s.slice(numMatch[0].length) };
  }
  // Identifier — will be resolved by caller
  const idMatch = s.match(/^[a-zA-Z_]\w*/);
  if (idMatch) return { value: `__VAR__${idMatch[0]}`, rest: s.slice(idMatch[0].length) };
  return null;
}

function parseExpression(s: string): { value: PyValue; rest: string } | null {
  return parseAtom(s);
}

export default function PythonRepl({ onCommand, height = '250px', initialCode }: Props) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: '🐍 Python 3.12 (NetQuest Simulator)' },
    { type: 'output', text: 'Type Python code below!' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [variables, setVariables] = useState<Record<string, PyValue>>({});
  const [multilineBuffer, setMultilineBuffer] = useState<string[]>([]);
  const [inMultiline, setInMultiline] = useState(false);
  const [waitingInput, setWaitingInput] = useState<string | null>(null);
  const [inputCallback, setInputCallback] = useState<((val: string) => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  // Run initial code on mount
  useEffect(() => {
    if (initialCode && initialCode.length > 0) {
      let vars = { ...variables };
      const newLines: Line[] = [...lines];
      for (const cmd of initialCode) {
        const result = evaluate(cmd, vars);
        vars = result.newVars;
        newLines.push({ type: 'input', text: `>>> ${cmd}` });
        for (const o of result.output) {
          newLines.push({ type: o.type === 'error' ? 'error' : 'output', text: o.text });
        }
      }
      setVariables(vars);
      setLines(newLines);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveValue = useCallback((v: PyValue, vars: Record<string, PyValue>): PyValue => {
    if (typeof v === 'string' && v.startsWith('__VAR__')) {
      const name = v.slice(7);
      if (name in vars) return vars[name];
      return `__UNDEF__${name}`;
    }
    return v;
  }, []);

  const evaluate = useCallback((cmd: string, vars: Record<string, PyValue>): { output: { text: string; type: string }[]; newVars: Record<string, PyValue> } => {
    const output: { text: string; type: string }[] = [];
    let newVars = { ...vars };
    const trimmed = cmd.trim();

    if (!trimmed) return { output, newVars };

    // print()
    const printMatch = trimmed.match(new RegExp('^print\\s*\\((.*)\\)$', 's'));
    if (printMatch) {
      const argStr = printMatch[1].trim();
      if (!argStr) {
        output.push({ text: '', type: 'output' });
        return { output, newVars };
      }
      // Handle multiple args with comma
      const args = splitArgs(argStr);
      const parts = args.map(a => {
        const evaled = evalExpr(a.trim(), newVars);
        if (typeof evaled === 'string' && evaled.startsWith('__UNDEF__')) {
          return null; // error
        }
        // print displays strings without quotes
        if (typeof evaled === 'string') return evaled;
        if (evaled === true) return 'True';
        if (evaled === false) return 'False';
        if (evaled === null) return 'None';
        if (Array.isArray(evaled)) return formatValue(evaled);
        if (typeof evaled === 'object') return formatValue(evaled);
        return String(evaled);
      });
      if (parts.some(p => p === null)) {
        const badVar = args.find(a => {
          const v = evalExpr(a.trim(), newVars);
          return typeof v === 'string' && v.startsWith('__UNDEF__');
        });
        output.push({ text: `NameError: name '${badVar?.trim()}' is not defined`, type: 'error' });
      } else {
        output.push({ text: parts.join(' '), type: 'output' });
      }
      return { output, newVars };
    }

    // input() — simulated
    const inputMatch = trimmed.match(/^(\w+)\s*=\s*input\s*\((.*)\)$/);
    if (inputMatch) {
      const varName = inputMatch[1];
      const prompt = evalExpr(inputMatch[2].trim(), newVars);
      const simulated = typeof prompt === 'string' ? 'user_input' : 'user_input';
      newVars[varName] = simulated;
      output.push({ text: `${typeof prompt === 'string' ? prompt : ''}user_input`, type: 'output' });
      output.push({ text: `(Simulated — ${varName} = 'user_input')`, type: 'output' });
      return { output, newVars };
    }

    // type()
    const typeMatch = trimmed.match(/^type\s*\((.*)\)$/);
    if (typeMatch) {
      const val = evalExpr(typeMatch[1].trim(), newVars);
      if (typeof val === 'string' && val.startsWith('__UNDEF__')) {
        output.push({ text: `NameError: name '${typeMatch[1].trim()}' is not defined`, type: 'error' });
      } else {
        output.push({ text: `<class '${inferType(val)}'>`, type: 'output' });
      }
      return { output, newVars };
    }

    // len()
    const lenMatch = trimmed.match(/^len\s*\((.*)\)$/);
    if (lenMatch) {
      const val = evalExpr(lenMatch[1].trim(), newVars);
      if (typeof val === 'string') {
        output.push({ text: String(val.length), type: 'output' });
      } else if (Array.isArray(val)) {
        output.push({ text: String(val.length), type: 'output' });
      } else if (typeof val === 'object' && val !== null) {
        output.push({ text: String(Object.keys(val).length), type: 'output' });
      } else {
        output.push({ text: `TypeError: object has no len()`, type: 'error' });
      }
      return { output, newVars };
    }

    // range()
    const rangeMatch = trimmed.match(/^range\s*\((.+)\)$/);
    if (rangeMatch) {
      const args = splitArgs(rangeMatch[1]).map(a => Number(evalExpr(a.trim(), newVars)));
      if (args.length === 1) {
        output.push({ text: `range(0, ${args[0]})`, type: 'output' });
      } else if (args.length === 2) {
        output.push({ text: `range(${args[0]}, ${args[1]})`, type: 'output' });
      } else {
        output.push({ text: `range(${args[0]}, ${args[1]}, ${args[2]})`, type: 'output' });
      }
      return { output, newVars };
    }

    // for loop (single line): for i in range(n): print(i)
    const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+range\s*\((.+)\)\s*:\s*(.+)$/);
    if (forMatch) {
      const varName = forMatch[1];
      const rangeArgs = splitArgs(forMatch[2]).map(a => Number(evalExpr(a.trim(), newVars)));
      const body = forMatch[3].trim();
      let start = 0, end = 0, step = 1;
      if (rangeArgs.length === 1) { end = rangeArgs[0]; }
      else if (rangeArgs.length === 2) { start = rangeArgs[0]; end = rangeArgs[1]; }
      else { start = rangeArgs[0]; end = rangeArgs[1]; step = rangeArgs[2]; }
      
      let iterations = 0;
      for (let i = start; step > 0 ? i < end : i > end; i += step) {
        if (iterations++ > 100) { output.push({ text: '... (stopped after 100 iterations)', type: 'output' }); break; }
        newVars[varName] = i;
        const result = evaluate(body, newVars);
        newVars = result.newVars;
        for (const o of result.output) output.push(o);
      }
      return { output, newVars };
    }

    // for x in list: body
    const forListMatch = trimmed.match(/^for\s+(\w+)\s+in\s+(.+?)\s*:\s*(.+)$/);
    if (forListMatch) {
      const varName = forListMatch[1];
      const iterVal = evalExpr(forListMatch[2].trim(), newVars);
      const body = forListMatch[3].trim();
      const items = typeof iterVal === 'string' ? iterVal.split('') : Array.isArray(iterVal) ? iterVal : [];
      let iterations = 0;
      for (const item of items) {
        if (iterations++ > 100) { output.push({ text: '... (stopped after 100 iterations)', type: 'output' }); break; }
        newVars[varName] = item;
        const result = evaluate(body, newVars);
        newVars = result.newVars;
        for (const o of result.output) output.push(o);
      }
      return { output, newVars };
    }

    // while loop (single line)
    const whileMatch = trimmed.match(/^while\s+(.+?)\s*:\s*(.+)$/);
    if (whileMatch) {
      let iterations = 0;
      while (iterations++ < 100) {
        const cond = evalExpr(whileMatch[1].trim(), newVars);
        if (!cond) break;
        const result = evaluate(whileMatch[2].trim(), newVars);
        newVars = result.newVars;
        for (const o of result.output) output.push(o);
      }
      if (iterations >= 100) output.push({ text: '... (stopped — infinite loop protection)', type: 'error' });
      return { output, newVars };
    }

    // if/elif/else (single line)
    const ifMatch = trimmed.match(/^if\s+(.+?)\s*:\s*(.+)$/);
    if (ifMatch) {
      const cond = evalExpr(ifMatch[1].trim(), newVars);
      if (cond) {
        const result = evaluate(ifMatch[2].trim(), newVars);
        newVars = result.newVars;
        for (const o of result.output) output.push(o);
      }
      return { output, newVars };
    }

    // def function (simple)
    const defMatch = trimmed.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:\s*(.+)$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const params = defMatch[2].split(',').map(p => p.trim()).filter(Boolean);
      const body = defMatch[3].trim();
      newVars[`__fn__${fnName}`] = JSON.stringify({ params, body });
      return { output, newVars };
    }

    // Assignment with augmented operators
    const augAssign = trimmed.match(/^(\w+)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
    if (augAssign) {
      const [, name, op, expr] = augAssign;
      const current = newVars[name];
      const val = evalExpr(expr, newVars);
      if (current !== undefined && typeof current === 'number' && typeof val === 'number') {
        if (op === '+=') newVars[name] = current + val;
        else if (op === '-=') newVars[name] = current - val;
        else if (op === '*=') newVars[name] = current * val;
        else if (op === '/=') newVars[name] = current / val;
      } else if (op === '+=' && typeof current === 'string' && typeof val === 'string') {
        newVars[name] = current + val;
      } else if (op === '+=' && Array.isArray(current) && Array.isArray(val)) {
        newVars[name] = [...current, ...val];
      }
      return { output, newVars };
    }

    // Assignment
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch && !trimmed.match(/^(\w+)\s*==\s*/)) {
      const name = assignMatch[1];
      // Don't treat keywords as variable names
      if (['if', 'for', 'while', 'def', 'class', 'import', 'from', 'return', 'True', 'False', 'None'].includes(name)) {
        output.push({ text: `SyntaxError: invalid syntax`, type: 'error' });
        return { output, newVars };
      }
      const val = evalExpr(assignMatch[2].trim(), newVars);
      if (typeof val === 'string' && val.startsWith('__UNDEF__')) {
        output.push({ text: `NameError: name '${val.slice(9)}' is not defined`, type: 'error' });
      } else {
        newVars[name] = val;
      }
      return { output, newVars };
    }

    // .append(), .remove(), .pop(), .sort(), .keys(), .values(), .items()
    const methodMatch = trimmed.match(/^(\w+)\.(\w+)\s*\((.*)\)$/);
    if (methodMatch) {
      const [, objName, method, argStr] = methodMatch;
      const obj = newVars[objName];
      if (Array.isArray(obj)) {
        if (method === 'append') {
          const val = evalExpr(argStr.trim(), newVars);
          obj.push(val);
          return { output, newVars };
        }
        if (method === 'remove') {
          const val = evalExpr(argStr.trim(), newVars);
          const idx = obj.indexOf(val);
          if (idx >= 0) obj.splice(idx, 1);
          else output.push({ text: `ValueError: list.remove(x): x not in list`, type: 'error' });
          return { output, newVars };
        }
        if (method === 'pop') {
          if (!argStr.trim()) {
            const val = obj.pop();
            output.push({ text: formatValue(val ?? null), type: 'output' });
          } else {
            const idx = Number(evalExpr(argStr.trim(), newVars));
            const val = obj.splice(idx, 1)[0];
            output.push({ text: formatValue(val ?? null), type: 'output' });
          }
          return { output, newVars };
        }
        if (method === 'sort') {
          obj.sort((a, b) => (a as number) - (b as number));
          return { output, newVars };
        }
        if (method === 'reverse') {
          obj.reverse();
          return { output, newVars };
        }
        if (method === 'insert') {
          const args = splitArgs(argStr);
          const idx = Number(evalExpr(args[0].trim(), newVars));
          const val = evalExpr(args[1].trim(), newVars);
          obj.splice(idx, 0, val);
          return { output, newVars };
        }
      }
      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        if (method === 'keys') {
          output.push({ text: `dict_keys([${Object.keys(obj).map(k => `'${k}'`).join(', ')}])`, type: 'output' });
          return { output, newVars };
        }
        if (method === 'values') {
          output.push({ text: `dict_values([${Object.values(obj).map(formatValue).join(', ')}])`, type: 'output' });
          return { output, newVars };
        }
        if (method === 'items') {
          output.push({ text: `dict_items([${Object.entries(obj).map(([k, v]) => `('${k}', ${formatValue(v)})`).join(', ')}])`, type: 'output' });
          return { output, newVars };
        }
        if (method === 'get') {
          const args = splitArgs(argStr);
          const key = String(evalExpr(args[0].trim(), newVars));
          const def = args.length > 1 ? evalExpr(args[1].trim(), newVars) : null;
          const val = key in obj ? obj[key] : def;
          output.push({ text: formatValue(val), type: 'output' });
          return { output, newVars };
        }
      }
      if (typeof obj === 'string') {
        if (method === 'upper') { output.push({ text: `'${obj.toUpperCase()}'`, type: 'output' }); return { output, newVars }; }
        if (method === 'lower') { output.push({ text: `'${obj.toLowerCase()}'`, type: 'output' }); return { output, newVars }; }
        if (method === 'strip') { output.push({ text: `'${obj.trim()}'`, type: 'output' }); return { output, newVars }; }
        if (method === 'split') {
          const sep = argStr.trim() ? String(evalExpr(argStr.trim(), newVars)) : ' ';
          const parts = obj.split(sep);
          output.push({ text: formatValue(parts), type: 'output' });
          return { output, newVars };
        }
        if (method === 'replace') {
          const args = splitArgs(argStr);
          const old = String(evalExpr(args[0].trim(), newVars));
          const nw = String(evalExpr(args[1].trim(), newVars));
          output.push({ text: `'${obj.split(old).join(nw)}'`, type: 'output' });
          return { output, newVars };
        }
        if (method === 'startswith') {
          const prefix = String(evalExpr(argStr.trim(), newVars));
          output.push({ text: obj.startsWith(prefix) ? 'True' : 'False', type: 'output' });
          return { output, newVars };
        }
        if (method === 'endswith') {
          const suffix = String(evalExpr(argStr.trim(), newVars));
          output.push({ text: obj.endsWith(suffix) ? 'True' : 'False', type: 'output' });
          return { output, newVars };
        }
      }
      output.push({ text: `AttributeError: '${inferType(obj ?? null)}' object has no attribute '${method}'`, type: 'error' });
      return { output, newVars };
    }

    // dict assignment: d["key"] = val or d[key] = val
    const dictAssign = trimmed.match(/^(\w+)\[(.+?)\]\s*=\s*(.+)$/);
    if (dictAssign) {
      const [, objName, keyExpr, valExpr] = dictAssign;
      const obj = newVars[objName];
      const key = String(evalExpr(keyExpr.trim(), newVars));
      const val = evalExpr(valExpr.trim(), newVars);
      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        obj[key] = val;
      } else if (Array.isArray(obj)) {
        const idx = parseInt(key);
        if (!isNaN(idx) && idx >= 0 && idx < obj.length) obj[idx] = val;
      }
      return { output, newVars };
    }

    // import (just acknowledge)
    if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
      // Simulated — just acknowledge
      return { output, newVars };
    }

    // try/except placeholder
    if (trimmed === 'try:' || trimmed.startsWith('except') || trimmed === 'finally:') {
      return { output, newVars };
    }

    // Expression evaluation (fallback)
    const val = evalExpr(trimmed, newVars);
    if (typeof val === 'string' && val.startsWith('__UNDEF__')) {
      output.push({ text: `NameError: name '${val.slice(9)}' is not defined`, type: 'error' });
    } else if (val !== undefined && val !== '__NONE__') {
      output.push({ text: formatValue(val), type: 'output' });
    }
    return { output, newVars };
  }, [resolveValue]);

  function splitArgs(s: string): string[] {
    const args: string[] = [];
    let depth = 0, current = '', inStr: string | null = null;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        current += c;
        if (c === inStr && s[i - 1] !== '\\') inStr = null;
      } else if (c === '"' || c === "'") {
        inStr = c;
        current += c;
      } else if (c === '(' || c === '[' || c === '{') {
        depth++;
        current += c;
      } else if (c === ')' || c === ']' || c === '}') {
        depth--;
        current += c;
      } else if (c === ',' && depth === 0) {
        args.push(current);
        current = '';
      } else {
        current += c;
      }
    }
    if (current.trim()) args.push(current);
    return args;
  }

  function evalExpr(expr: string, vars: Record<string, PyValue>): PyValue {
    expr = expr.trim();
    if (!expr) return '__NONE__' as PyValue;

    // f-string
    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      const q = expr[1];
      const inner = expr.slice(2, expr.lastIndexOf(q));
      const result = inner.replace(/\{([^}]+)\}/g, (_, e) => {
        const val = evalExpr(e.trim(), vars);
        if (typeof val === 'string') return val;
        if (val === true) return 'True';
        if (val === false) return 'False';
        if (val === null) return 'None';
        return String(val);
      });
      return result;
    }

    // Handle 'not' prefix
    if (expr.startsWith('not ')) {
      const val = evalExpr(expr.slice(4), vars);
      return !val;
    }

    // Handle 'and' / 'or'
    const andParts = splitByKeyword(expr, ' and ');
    if (andParts.length > 1) {
      let result: PyValue = true;
      for (const p of andParts) {
        result = evalExpr(p, vars);
        if (!result) return result;
      }
      return result;
    }
    const orParts = splitByKeyword(expr, ' or ');
    if (orParts.length > 1) {
      for (const p of orParts) {
        const val = evalExpr(p, vars);
        if (val) return val;
      }
      return false;
    }

    // Comparison operators
    for (const op of ['==', '!=', '<=', '>=', '<', '>']) {
      const idx = findOperator(expr, op);
      if (idx >= 0) {
        const left = evalExpr(expr.slice(0, idx), vars);
        const right = evalExpr(expr.slice(idx + op.length), vars);
        if (op === '==') return left === right || String(left) === String(right);
        if (op === '!=') return left !== right;
        if (op === '<=') return (left as number) <= (right as number);
        if (op === '>=') return (left as number) >= (right as number);
        if (op === '<') return (left as number) < (right as number);
        if (op === '>') return (left as number) > (right as number);
      }
    }

    // 'in' operator
    const inMatch = expr.match(/^(.+?)\s+in\s+(.+)$/);
    if (inMatch) {
      const left = evalExpr(inMatch[1].trim(), vars);
      const right = evalExpr(inMatch[2].trim(), vars);
      if (typeof right === 'string') return (right as string).includes(String(left));
      if (Array.isArray(right)) return right.includes(left);
      if (typeof right === 'object' && right !== null) return String(left) in right;
      return false;
    }

    // Math: + - * / % **  // 
    // Order: +/- last, then *//, then **
    // Addition/subtraction (scan from right)
    for (let i = expr.length - 1; i >= 0; i--) {
      if (expr[i] === '+' || expr[i] === '-') {
        if (i === 0) continue;
        if ('+-*/(%'.includes(expr[i - 1]?.trim() || '')) continue;
        // Check we're not inside brackets
        let d = 0;
        for (let j = 0; j < i; j++) {
          if ('([{'.includes(expr[j])) d++;
          if (')]}'.includes(expr[j])) d--;
        }
        if (d !== 0) continue;
        const left = evalExpr(expr.slice(0, i), vars);
        const right = evalExpr(expr.slice(i + 1), vars);
        if (expr[i] === '+') {
          if (typeof left === 'string' && typeof right === 'string') return left + right;
          if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
          if (Array.isArray(left) && Array.isArray(right)) return [...left, ...right];
          return (left as number) + (right as number);
        }
        return (left as number) - (right as number);
      }
    }

    // Multiplication, division, floor division, modulo
    for (let i = expr.length - 1; i >= 0; i--) {
      if (expr[i] === '*' && expr[i + 1] !== '*' && expr[i - 1] !== '*') {
        let d = 0;
        for (let j = 0; j < i; j++) { if ('([{'.includes(expr[j])) d++; if (')]}'.includes(expr[j])) d--; }
        if (d !== 0) continue;
        const left = evalExpr(expr.slice(0, i), vars);
        const right = evalExpr(expr.slice(i + 1), vars);
        if (typeof left === 'string' && typeof right === 'number') return left.repeat(right);
        if (typeof right === 'string' && typeof left === 'number') return right.repeat(left);
        return (left as number) * (right as number);
      }
      if (expr[i] === '/' && expr[i + 1] !== '/') {
        let d = 0;
        for (let j = 0; j < i; j++) { if ('([{'.includes(expr[j])) d++; if (')]}'.includes(expr[j])) d--; }
        if (d !== 0) continue;
        const left = evalExpr(expr.slice(0, i), vars);
        const right = evalExpr(expr.slice(i + 1), vars);
        return (left as number) / (right as number);
      }
      if (expr[i] === '/' && expr[i + 1] === '/') {
        let d = 0;
        for (let j = 0; j < i; j++) { if ('([{'.includes(expr[j])) d++; if (')]}'.includes(expr[j])) d--; }
        if (d !== 0) continue;
        const left = evalExpr(expr.slice(0, i), vars);
        const right = evalExpr(expr.slice(i + 2), vars);
        return Math.floor((left as number) / (right as number));
      }
      if (expr[i] === '%') {
        let d = 0;
        for (let j = 0; j < i; j++) { if ('([{'.includes(expr[j])) d++; if (')]}'.includes(expr[j])) d--; }
        if (d !== 0) continue;
        return (evalExpr(expr.slice(0, i), vars) as number) % (evalExpr(expr.slice(i + 1), vars) as number);
      }
    }

    // Power **
    const powIdx = expr.indexOf('**');
    if (powIdx > 0) {
      const left = evalExpr(expr.slice(0, powIdx), vars);
      const right = evalExpr(expr.slice(powIdx + 2), vars);
      return Math.pow(left as number, right as number);
    }

    // Parentheses
    if (expr.startsWith('(') && expr.endsWith(')')) {
      return evalExpr(expr.slice(1, -1), vars);
    }

    // Function calls
    const fnCall = expr.match(/^(\w+)\s*\(([\s\S]*)\)$/);
    if (fnCall) {
      const fnName = fnCall[1];
      const argStr = fnCall[2].trim();
      const args = argStr ? splitArgs(argStr).map(a => evalExpr(a.trim(), vars)) : [];

      // Built-in functions
      if (fnName === 'len') {
        const v = args[0];
        if (typeof v === 'string') return v.length;
        if (Array.isArray(v)) return v.length;
        if (typeof v === 'object' && v !== null) return Object.keys(v).length;
        return 0;
      }
      if (fnName === 'type') {
        return `<class '${inferType(args[0])}'>` as PyValue;
      }
      if (fnName === 'int') {
        return parseInt(String(args[0]));
      }
      if (fnName === 'float') {
        return parseFloat(String(args[0]));
      }
      if (fnName === 'str') {
        if (args[0] === true) return 'True';
        if (args[0] === false) return 'False';
        if (args[0] === null) return 'None';
        return String(args[0]);
      }
      if (fnName === 'bool') {
        return !!args[0];
      }
      if (fnName === 'list') {
        if (typeof args[0] === 'string') return args[0].split('');
        if (Array.isArray(args[0])) return [...args[0]];
        return [];
      }
      if (fnName === 'range') {
        let start = 0, end = 0, step = 1;
        if (args.length === 1) end = args[0] as number;
        else if (args.length === 2) { start = args[0] as number; end = args[1] as number; }
        else { start = args[0] as number; end = args[1] as number; step = args[2] as number; }
        const result: number[] = [];
        for (let i = start; step > 0 ? i < end : i > end; i += step) {
          if (result.length > 100) break;
          result.push(i);
        }
        return result;
      }
      if (fnName === 'abs') return Math.abs(args[0] as number);
      if (fnName === 'max') {
        if (args.length === 1 && Array.isArray(args[0])) return Math.max(...(args[0] as number[]));
        return Math.max(...(args as number[]));
      }
      if (fnName === 'min') {
        if (args.length === 1 && Array.isArray(args[0])) return Math.min(...(args[0] as number[]));
        return Math.min(...(args as number[]));
      }
      if (fnName === 'sum') {
        if (Array.isArray(args[0])) return (args[0] as number[]).reduce((a, b) => a + b, 0);
        return 0;
      }
      if (fnName === 'sorted') {
        if (Array.isArray(args[0])) return [...(args[0] as number[])].sort((a, b) => a - b);
        return args[0];
      }
      if (fnName === 'reversed') {
        if (Array.isArray(args[0])) return [...args[0]].reverse();
        return args[0];
      }
      if (fnName === 'round') {
        const n = args[0] as number;
        const d = (args[1] as number) || 0;
        return Math.round(n * 10 ** d) / 10 ** d;
      }
      if (fnName === 'enumerate') {
        if (Array.isArray(args[0])) return args[0].map((v, i) => [i, v]);
        return [];
      }
      if (fnName === 'zip') {
        const arrs = args as PyValue[][];
        if (arrs.length >= 2 && Array.isArray(arrs[0]) && Array.isArray(arrs[1])) {
          const len = Math.min(arrs[0].length, arrs[1].length);
          return Array.from({ length: len }, (_, i) => arrs.map(a => (a as PyValue[])[i]));
        }
        return [];
      }
      if (fnName === 'isinstance') {
        const typeMap: Record<string, string> = { int: 'int', float: 'float', str: 'str', bool: 'bool', list: 'list', dict: 'dict' };
        const argType = inferType(args[0]);
        const checkType = typeof args[1] === 'string' && args[1].startsWith('__VAR__') ? args[1].slice(7) : String(args[1]);
        return argType === (typeMap[checkType] || checkType);
      }
      if (fnName === 'set') {
        if (Array.isArray(args[0])) return [...new Set(args[0] as PyValue[])];
        return [];
      }
      if (fnName === 'tuple') {
        if (Array.isArray(args[0])) return args[0];
        return [];
      }
      if (fnName === 'dict') {
        return {};
      }
      if (fnName === 'input') {
        return 'user_input';
      }

      // User-defined functions
      const fnDef = vars[`__fn__${fnName}`];
      if (typeof fnDef === 'string') {
        try {
          const { params, body } = JSON.parse(fnDef);
          const localVars = { ...vars };
          params.forEach((p: string, i: number) => {
            const paramName = p.includes('=') ? p.split('=')[0].trim() : p;
            localVars[paramName] = args[i] !== undefined ? args[i] : (p.includes('=') ? evalExpr(p.split('=')[1].trim(), vars) : null);
          });
          // Check for return
          if (body.startsWith('return ')) {
            return evalExpr(body.slice(7), localVars);
          }
          const result = evaluate(body, localVars);
          return '__NONE__' as PyValue;
        } catch {
          return '__NONE__' as PyValue;
        }
      }

      return `__UNDEF__${fnName}` as PyValue;
    }

    // Indexing: var[idx] or var["key"]
    const idxMatch = expr.match(/^(\w+)\[(.+)\]$/);
    if (idxMatch) {
      const obj = vars[idxMatch[1]];
      const key = evalExpr(idxMatch[2].trim(), vars);
      if (Array.isArray(obj)) {
        const idx = key as number;
        return idx < 0 ? obj[obj.length + idx] : obj[idx];
      }
      if (typeof obj === 'string') {
        const idx = key as number;
        return idx < 0 ? obj[obj.length + idx] : obj[idx];
      }
      if (typeof obj === 'object' && obj !== null) {
        return (obj as Record<string, PyValue>)[String(key)] ?? null;
      }
      return null;
    }

    // Slicing: var[start:end]
    const sliceMatch = expr.match(/^(\w+)\[(-?\d*):(-?\d*)\]$/);
    if (sliceMatch) {
      const obj = vars[sliceMatch[1]];
      const arr = Array.isArray(obj) ? obj : typeof obj === 'string' ? obj.split('') : [];
      const start = sliceMatch[2] ? parseInt(sliceMatch[2]) : 0;
      const end = sliceMatch[3] ? parseInt(sliceMatch[3]) : arr.length;
      const sliced = arr.slice(start < 0 ? arr.length + start : start, end < 0 ? arr.length + end : end);
      if (typeof obj === 'string') return sliced.join('');
      return sliced;
    }

    // Atoms
    const parsed = parseAtom(expr);
    if (parsed && parsed.rest.trim() === '') {
      const val = resolveValue(parsed.value, vars);
      return val;
    }

    return `__UNDEF__${expr}` as PyValue;
  }

  function splitByKeyword(s: string, keyword: string): string[] {
    const parts: string[] = [];
    let depth = 0, inStr: string | null = null, current = '';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        current += c;
        if (c === inStr && s[i - 1] !== '\\') inStr = null;
      } else if (c === '"' || c === "'") {
        inStr = c;
        current += c;
      } else if ('([{'.includes(c)) {
        depth++;
        current += c;
      } else if (')]}'.includes(c)) {
        depth--;
        current += c;
      } else if (depth === 0 && s.slice(i, i + keyword.length) === keyword) {
        parts.push(current);
        current = '';
        i += keyword.length - 1;
      } else {
        current += c;
      }
    }
    parts.push(current);
    return parts.length > 1 ? parts : [s];
  }

  function findOperator(expr: string, op: string): number {
    let depth = 0, inStr: string | null = null;
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (inStr) {
        if (c === inStr && expr[i - 1] !== '\\') inStr = null;
      } else if (c === '"' || c === "'") {
        inStr = c;
      } else if ('([{'.includes(c)) {
        depth++;
      } else if (')]}'.includes(c)) {
        depth--;
      } else if (depth === 0 && expr.slice(i, i + op.length) === op) {
        // Make sure we're not matching part of a longer operator
        if (op === '<' && expr[i + 1] === '=') continue;
        if (op === '>' && expr[i + 1] === '=') continue;
        if (op === '=' && expr[i + 1] === '=') continue;
        if (op === '!' && expr[i + 1] !== '=') continue;
        return i;
      }
    }
    return -1;
  }

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    setInput('');

    if (waitingInput !== null && inputCallback) {
      inputCallback(cmd);
      setWaitingInput(null);
      setInputCallback(null);
      return;
    }

    // Handle multiline
    if (inMultiline) {
      if (cmd.trim() === '') {
        // Execute multiline buffer
        const fullCmd = multilineBuffer.join('\n');
        const newLines: Line[] = [...lines, { type: 'input', text: `... ${cmd}` }];
        const result = evaluate(fullCmd, variables);
        setVariables(result.newVars);
        for (const o of result.output) {
          newLines.push({ type: o.type === 'error' ? 'error' : 'output', text: o.text });
        }
        setLines(newLines);
        setMultilineBuffer([]);
        setInMultiline(false);
        setHistory(prev => [fullCmd, ...prev]);
        setHistoryIndex(-1);
        onCommand?.(fullCmd, result.output.map(o => o.text).join('\n'));
        return;
      } else {
        setMultilineBuffer(prev => [...prev, cmd]);
        setLines(prev => [...prev, { type: 'input', text: `... ${cmd}` }]);
        return;
      }
    }

    // Check if starting multiline (ends with :)
    if (cmd.trim().endsWith(':') && !cmd.trim().match(/^(if|for|while|def)\s.+:.+$/)) {
      setInMultiline(true);
      setMultilineBuffer([cmd]);
      setLines(prev => [...prev, { type: 'input', text: `>>> ${cmd}` }]);
      return;
    }

    const newLines: Line[] = [...lines, { type: 'input', text: `>>> ${cmd}` }];

    if (cmd.trim() === 'clear' || cmd.trim() === 'clear()') {
      setLines([]);
      return;
    }
    if (cmd.trim() === 'help' || cmd.trim() === 'help()') {
      newLines.push({ type: 'output', text: 'Available: print(), type(), len(), range(), int(), float(), str()' });
      newLines.push({ type: 'output', text: 'Math: + - * / ** // %  |  Comparison: == != < > <= >=' });
      newLines.push({ type: 'output', text: 'Lists: .append() .remove() .pop() .sort()' });
      newLines.push({ type: 'output', text: 'Dicts: .keys() .values() .items() .get()' });
      newLines.push({ type: 'output', text: 'Strings: .upper() .lower() .split() .replace()' });
      newLines.push({ type: 'output', text: 'Type "clear" to clear the screen' });
      setLines(newLines);
      return;
    }

    const result = evaluate(cmd, variables);
    setVariables(result.newVars);
    for (const o of result.output) {
      newLines.push({ type: o.type === 'error' ? 'error' : 'output', text: o.text });
    }

    setLines(newLines);
    setHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    onCommand?.(cmd, result.output.map(o => o.text).join('\n'));
  }, [input, lines, variables, inMultiline, multilineBuffer, evaluate, onCommand, waitingInput, inputCallback]);

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
    }
  };

  const promptText = inMultiline ? '...' : (waitingInput !== null ? waitingInput : '>>>');

  return (
    <div
      className="bg-black/80 rounded-xl border border-gray-800 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border-b border-gray-800">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="text-[10px] text-gray-500 ml-1 font-mono">Python 3.12</span>
      </div>

      <div ref={scrollRef} className="p-3 font-mono text-xs overflow-y-auto" style={{ height }}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={line.type === 'input' ? 'text-[#39ff14]' : line.type === 'error' ? 'text-red-400' : 'text-gray-300'}
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-gray-800">
        <span className="text-[#39ff14] font-mono text-xs whitespace-nowrap">{promptText}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-xs text-white outline-none min-w-0"
          placeholder="Type Python code..."
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
