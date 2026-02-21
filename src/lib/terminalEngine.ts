import { createDefaultFS, resolvePath, getNode, getParentAndName, formatLsLine, type FSNode } from './terminalFS';

export interface TerminalState {
  fs: FSNode;
  cwd: string;
  env: Record<string, string>;
  history: string[];
  processes: { pid: number; name: string; cpu: string; mem: string; status: string }[];
  user: string;
  hostname: string;
}

export function createTerminalState(): TerminalState {
  return {
    fs: createDefaultFS(),
    cwd: '/home/user',
    env: {
      HOME: '/home/user',
      USER: 'user',
      PATH: '/usr/local/bin:/usr/bin:/bin',
      SHELL: '/bin/bash',
      TERM: 'xterm-256color',
      LANG: 'en_US.UTF-8',
      PWD: '/home/user',
    },
    history: [],
    processes: [
      { pid: 1, name: 'systemd', cpu: '0.0', mem: '0.3', status: 'S' },
      { pid: 234, name: 'sshd', cpu: '0.0', mem: '0.1', status: 'S' },
      { pid: 567, name: 'nginx', cpu: '0.2', mem: '1.2', status: 'S' },
      { pid: 890, name: 'bash', cpu: '0.0', mem: '0.2', status: 'S' },
      { pid: 1337, name: 'crypto-miner', cpu: '98.5', mem: '45.2', status: 'R' },
      { pid: 1500, name: 'node', cpu: '1.2', mem: '3.4', status: 'S' },
    ],
    user: 'user',
    hostname: 'netquest-vm',
  };
}

export function executeCommand(state: TerminalState, input: string): { output: string[]; state: TerminalState } {
  const trimmed = input.trim();
  if (!trimmed) return { output: [], state };

  state.history.push(trimmed);
  state.env.PWD = state.cwd;

  // Handle pipes
  if (trimmed.includes('|')) {
    return handlePipe(state, trimmed);
  }

  // Handle output redirection
  if (trimmed.includes('>>') || trimmed.includes('>')) {
    return handleRedirect(state, trimmed);
  }

  // Parse command and args
  const parts = parseCommand(trimmed);
  const cmd = parts[0];
  const args = parts.slice(1);

  return runSingleCommand(state, cmd, args);
}

function parseCommand(input: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuote = '';
  for (const ch of input) {
    if ((ch === '"' || ch === "'") && !inQuote) { inQuote = ch; continue; }
    if (ch === inQuote) { inQuote = ''; continue; }
    if (ch === ' ' && !inQuote) {
      if (current) parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current) parts.push(current);
  // Expand env vars
  return parts.map(p => p.replace(/\$(\w+)/g, (_, name) => ''));
}

function handlePipe(state: TerminalState, input: string): { output: string[]; state: TerminalState } {
  const commands = input.split('|').map(s => s.trim());
  let currentOutput: string[] = [];

  for (const cmd of commands) {
    const parts = parseCommand(cmd);
    const name = parts[0];
    const args = parts.slice(1);

    if (name === 'grep' && currentOutput.length > 0) {
      const pattern = args[0] || '';
      const flags = args.includes('-i') ? 'i' : '';
      const regex = new RegExp(pattern, flags);
      currentOutput = currentOutput.filter(line => regex.test(line));
    } else if (name === 'head') {
      const n = parseInt(args[1] || '10') || 10;
      currentOutput = currentOutput.slice(0, n);
    } else if (name === 'tail') {
      const n = parseInt(args[1] || '10') || 10;
      currentOutput = currentOutput.slice(-n);
    } else if (name === 'wc') {
      if (args.includes('-l')) {
        currentOutput = [String(currentOutput.length)];
      } else {
        const lines = currentOutput.length;
        const words = currentOutput.join(' ').split(/\s+/).filter(Boolean).length;
        const chars = currentOutput.join('\n').length;
        currentOutput = [`  ${lines}  ${words}  ${chars}`];
      }
    } else if (name === 'sort') {
      currentOutput = [...currentOutput].sort();
    } else if (name === 'uniq') {
      currentOutput = currentOutput.filter((line, i) => i === 0 || line !== currentOutput[i - 1]);
    } else {
      const result = runSingleCommand(state, name, args);
      state = result.state;
      currentOutput = result.output;
    }
  }

  return { output: currentOutput, state };
}

function handleRedirect(state: TerminalState, input: string): { output: string[]; state: TerminalState } {
  const append = input.includes('>>');
  const [cmdPart, filePart] = input.split(append ? '>>' : '>').map(s => s.trim());
  
  const parts = parseCommand(cmdPart);
  const result = runSingleCommand(state, parts[0], parts.slice(1));
  state = result.state;

  const targetPath = resolvePath(state.fs, state.cwd, filePart);
  const { parent, name } = getParentAndName(state.fs, targetPath);
  if (parent && parent.type === 'dir' && parent.children) {
    const content = result.output.join('\n');
    const existing = parent.children[name];
    if (append && existing && existing.type === 'file') {
      existing.content = (existing.content || '') + '\n' + content;
      existing.size = existing.content.length;
    } else {
      parent.children[name] = { type: 'file', name, content, permissions: 'rw-r--r--', owner: 'user', group: 'user', size: content.length, modified: 'Feb 21 12:00' };
    }
    return { output: [], state };
  }
  return { output: [`bash: ${filePart}: No such file or directory`], state };
}

function runSingleCommand(state: TerminalState, cmd: string, args: string[]): { output: string[]; state: TerminalState } {
  const out = (...lines: string[]) => ({ output: lines, state });

  switch (cmd) {
    case 'pwd':
      return out(state.cwd);

    case 'whoami':
      return out(state.user);

    case 'hostname':
      return out(state.hostname);

    case 'echo': {
      const text = args.join(' ').replace(/\$(\w+)/g, (_, name) => state.env[name] || '');
      return out(text);
    }

    case 'clear':
      return { output: ['__CLEAR__'], state };

    case 'ls': {
      const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
      const target = args.find(a => !a.startsWith('-')) || state.cwd;
      const targetPath = resolvePath(state.fs, state.cwd, target);
      const node = getNode(state.fs, targetPath);
      if (!node) return out(`ls: cannot access '${target}': No such file or directory`);
      if (node.type === 'file') {
        return showLong ? out(formatLsLine(node)) : out(node.name);
      }
      const entries = Object.values(node.children || {});
      const filtered = showAll ? entries : entries.filter(e => !e.name.startsWith('.'));
      if (showLong) {
        const lines = [`total ${filtered.length}`];
        filtered.forEach(e => lines.push(formatLsLine(e)));
        return out(...lines);
      }
      return out(filtered.map(e => e.type === 'dir' ? `\x1b[1;34m${e.name}/\x1b[0m` : e.name).join('  '));
    }

    case 'cd': {
      const target = args[0] || '/home/user';
      const targetPath = resolvePath(state.fs, state.cwd, target);
      const node = getNode(state.fs, targetPath);
      if (!node) return out(`cd: ${target}: No such file or directory`);
      if (node.type !== 'dir') return out(`cd: ${target}: Not a directory`);
      state.cwd = targetPath;
      state.env.PWD = targetPath;
      return { output: [], state };
    }

    case 'mkdir': {
      const recursive = args.includes('-p');
      const dirs = args.filter(a => !a.startsWith('-'));
      for (const d of dirs) {
        const targetPath = resolvePath(state.fs, state.cwd, d);
        const { parent, name } = getParentAndName(state.fs, targetPath);
        if (!parent || parent.type !== 'dir') return out(`mkdir: cannot create directory '${d}': No such file or directory`);
        if (parent.children![name]) return out(`mkdir: cannot create directory '${d}': File exists`);
        parent.children![name] = { type: 'dir', name, children: {}, permissions: 'rwxr-xr-x', owner: state.user, group: state.user, modified: 'Feb 21 12:00' };
      }
      return { output: [], state };
    }

    case 'touch': {
      for (const f of args) {
        const targetPath = resolvePath(state.fs, state.cwd, f);
        const { parent, name } = getParentAndName(state.fs, targetPath);
        if (!parent || parent.type !== 'dir') return out(`touch: cannot touch '${f}': No such file or directory`);
        if (!parent.children![name]) {
          parent.children![name] = { type: 'file', name, content: '', permissions: 'rw-r--r--', owner: state.user, group: state.user, size: 0, modified: 'Feb 21 12:00' };
        }
      }
      return { output: [], state };
    }

    case 'rm': {
      const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
      const force = args.includes('-f') || args.includes('-rf') || args.includes('-fr');
      const targets = args.filter(a => !a.startsWith('-'));
      for (const t of targets) {
        const targetPath = resolvePath(state.fs, state.cwd, t);
        const { parent, name } = getParentAndName(state.fs, targetPath);
        if (!parent || !parent.children?.[name]) {
          if (!force) return out(`rm: cannot remove '${t}': No such file or directory`);
          continue;
        }
        const node = parent.children[name];
        if (node.type === 'dir' && !recursive) return out(`rm: cannot remove '${t}': Is a directory`);
        delete parent.children[name];
      }
      return { output: [], state };
    }

    case 'rmdir': {
      for (const d of args) {
        const targetPath = resolvePath(state.fs, state.cwd, d);
        const { parent, name } = getParentAndName(state.fs, targetPath);
        if (!parent || !parent.children?.[name]) return out(`rmdir: failed to remove '${d}': No such file or directory`);
        const node = parent.children[name];
        if (node.type !== 'dir') return out(`rmdir: failed to remove '${d}': Not a directory`);
        if (Object.keys(node.children || {}).length > 0) return out(`rmdir: failed to remove '${d}': Directory not empty`);
        delete parent.children[name];
      }
      return { output: [], state };
    }

    case 'cp': {
      const srcs = args.filter(a => !a.startsWith('-'));
      if (srcs.length < 2) return out('cp: missing destination file operand');
      const src = srcs[0];
      const dest = srcs[1];
      const srcPath = resolvePath(state.fs, state.cwd, src);
      const srcNode = getNode(state.fs, srcPath);
      if (!srcNode) return out(`cp: cannot stat '${src}': No such file or directory`);
      
      const destPath = resolvePath(state.fs, state.cwd, dest);
      const destNode = getNode(state.fs, destPath);
      
      if (destNode && destNode.type === 'dir') {
        // Copy into directory
        destNode.children![srcNode.name] = JSON.parse(JSON.stringify(srcNode));
      } else {
        const { parent, name } = getParentAndName(state.fs, destPath);
        if (!parent || parent.type !== 'dir') return out(`cp: cannot create '${dest}': No such file or directory`);
        const copy = JSON.parse(JSON.stringify(srcNode));
        copy.name = name;
        parent.children![name] = copy;
      }
      return { output: [], state };
    }

    case 'mv': {
      const srcs = args.filter(a => !a.startsWith('-'));
      if (srcs.length < 2) return out('mv: missing destination file operand');
      const src = srcs[0];
      const dest = srcs[1];
      const srcPath = resolvePath(state.fs, state.cwd, src);
      const { parent: srcParent, name: srcName } = getParentAndName(state.fs, srcPath);
      if (!srcParent || !srcParent.children?.[srcName]) return out(`mv: cannot stat '${src}': No such file or directory`);
      
      const srcNode = srcParent.children[srcName];
      const destPath = resolvePath(state.fs, state.cwd, dest);
      const destNode = getNode(state.fs, destPath);

      if (destNode && destNode.type === 'dir') {
        destNode.children![srcNode.name] = srcNode;
      } else {
        const { parent, name } = getParentAndName(state.fs, destPath);
        if (!parent || parent.type !== 'dir') return out(`mv: cannot move '${src}' to '${dest}': No such file or directory`);
        srcNode.name = name;
        parent.children![name] = srcNode;
      }
      delete srcParent.children[srcName];
      return { output: [], state };
    }

    case 'cat': {
      const files = args.filter(a => !a.startsWith('-'));
      const lines: string[] = [];
      for (const f of files) {
        const path = resolvePath(state.fs, state.cwd, f);
        const node = getNode(state.fs, path);
        if (!node) { lines.push(`cat: ${f}: No such file or directory`); continue; }
        if (node.type === 'dir') { lines.push(`cat: ${f}: Is a directory`); continue; }
        lines.push(...(node.content || '').split('\n'));
      }
      return out(...lines);
    }

    case 'head': {
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
      const file = args.find(a => !a.startsWith('-') && a !== String(n));
      if (!file) return out('head: missing file operand');
      const path = resolvePath(state.fs, state.cwd, file);
      const node = getNode(state.fs, path);
      if (!node) return out(`head: cannot open '${file}': No such file or directory`);
      if (node.type === 'dir') return out(`head: error reading '${file}': Is a directory`);
      return out(...(node.content || '').split('\n').slice(0, n));
    }

    case 'tail': {
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
      const file = args.find(a => !a.startsWith('-') && a !== String(n));
      if (!file) return out('tail: missing file operand');
      const path = resolvePath(state.fs, state.cwd, file);
      const node = getNode(state.fs, path);
      if (!node) return out(`tail: cannot open '${file}': No such file or directory`);
      if (node.type === 'dir') return out(`tail: error reading '${file}': Is a directory`);
      return out(...(node.content || '').split('\n').slice(-n));
    }

    case 'less': {
      const file = args[0];
      if (!file) return out('less: missing file operand');
      const path = resolvePath(state.fs, state.cwd, file);
      const node = getNode(state.fs, path);
      if (!node) return out(`less: ${file}: No such file or directory`);
      if (node.type === 'dir') return out(`less: ${file}: Is a directory`);
      return out(...(node.content || '').split('\n'), '', '(END) - press q to quit');
    }

    case 'wc': {
      const file = args.find(a => !a.startsWith('-'));
      if (!file) return out('wc: missing file operand');
      const path = resolvePath(state.fs, state.cwd, file);
      const node = getNode(state.fs, path);
      if (!node) return out(`wc: ${file}: No such file or directory`);
      if (node.type === 'dir') return out(`wc: ${file}: Is a directory`);
      const content = node.content || '';
      const lines = content.split('\n').length;
      const words = content.split(/\s+/).filter(Boolean).length;
      const chars = content.length;
      if (args.includes('-l')) return out(`  ${lines} ${file}`);
      if (args.includes('-w')) return out(`  ${words} ${file}`);
      return out(`  ${lines}  ${words}  ${chars} ${file}`);
    }

    case 'grep': {
      const flags = args.filter(a => a.startsWith('-')).join('');
      const nonFlags = args.filter(a => !a.startsWith('-'));
      const pattern = nonFlags[0];
      const files = nonFlags.slice(1);
      if (!pattern) return out('Usage: grep PATTERN [FILE]...');
      
      const caseInsensitive = flags.includes('i');
      const regex = new RegExp(pattern, caseInsensitive ? 'i' : '');
      const lines: string[] = [];

      for (const f of files) {
        const path = resolvePath(state.fs, state.cwd, f);
        const node = getNode(state.fs, path);
        if (!node) { lines.push(`grep: ${f}: No such file or directory`); continue; }
        if (node.type === 'dir') { lines.push(`grep: ${f}: Is a directory`); continue; }
        const matching = (node.content || '').split('\n').filter(line => regex.test(line));
        if (files.length > 1) {
          matching.forEach(m => lines.push(`${f}:${m}`));
        } else {
          lines.push(...matching);
        }
      }
      return out(...lines);
    }

    case 'find': {
      const startDir = args.find(a => !a.startsWith('-')) || '.';
      const namePattern = args.includes('-name') ? args[args.indexOf('-name') + 1] : null;
      const typeFilter = args.includes('-type') ? args[args.indexOf('-type') + 1] : null;
      
      const startPath = resolvePath(state.fs, state.cwd, startDir);
      const startNode = getNode(state.fs, startPath);
      if (!startNode) return out(`find: '${startDir}': No such file or directory`);

      const results: string[] = [];
      function walk(node: FSNode, path: string) {
        const typeMatch = !typeFilter || (typeFilter === 'f' && node.type === 'file') || (typeFilter === 'd' && node.type === 'dir');
        const nameMatch = !namePattern || new RegExp('^' + namePattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$').test(node.name);
        if (typeMatch && nameMatch) results.push(path);
        if (node.type === 'dir' && node.children) {
          for (const [name, child] of Object.entries(node.children)) {
            walk(child, path + '/' + name);
          }
        }
      }
      walk(startNode, startPath === '/' ? '' : startPath);
      return out(...results.slice(0, 30));
    }

    case 'which': {
      const name = args[0];
      if (!name) return out('which: missing argument');
      const known: Record<string, string> = {
        python3: '/usr/bin/python3', node: '/usr/bin/node', git: '/usr/bin/git',
        bash: '/bin/bash', ls: '/bin/ls', cat: '/bin/cat',
        grep: '/usr/bin/grep', find: '/usr/bin/find', ssh: '/usr/bin/ssh',
        npm: '/usr/bin/npm', vim: '/usr/bin/vim', nano: '/usr/bin/nano',
      };
      return out(known[name] || `${name} not found`);
    }

    case 'chmod': {
      const mode = args[0];
      const file = args[1];
      if (!mode || !file) return out('chmod: missing operand');
      const path = resolvePath(state.fs, state.cwd, file);
      const node = getNode(state.fs, path);
      if (!node) return out(`chmod: cannot access '${file}': No such file or directory`);
      
      // Handle numeric mode
      if (/^\d{3,4}$/.test(mode)) {
        const digits = mode.slice(-3);
        const perms = digits.split('').map(d => {
          const n = parseInt(d);
          return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
        }).join('');
        node.permissions = perms;
      } else if (mode === '+x') {
        const p = node.permissions || 'rw-r--r--';
        node.permissions = p.slice(0, 2) + 'x' + p.slice(3, 5) + 'x' + p.slice(6, 8) + 'x';
      }
      return { output: [], state };
    }

    case 'chown': {
      const owner = args[0];
      const file = args[1];
      if (!owner || !file) return out('chown: missing operand');
      const path = resolvePath(state.fs, state.cwd, file);
      const node = getNode(state.fs, path);
      if (!node) return out(`chown: cannot access '${file}': No such file or directory`);
      const [user, group] = owner.split(':');
      if (user) node.owner = user;
      if (group) node.group = group;
      return { output: [], state };
    }

    case 'ps': {
      const lines = ['  PID  CPU%  MEM%  STAT  COMMAND'];
      for (const p of state.processes) {
        lines.push(`${String(p.pid).padStart(5)}  ${p.cpu.padStart(4)}  ${p.mem.padStart(4)}  ${p.status.padStart(4)}  ${p.name}`);
      }
      return out(...lines);
    }

    case 'top': {
      const lines = [
        `top - 12:00:00 up 5 days, load average: 0.50, 0.30, 0.20`,
        `Tasks: ${state.processes.length} total, 1 running`,
        `%Cpu(s): 25.0 us, 2.0 sy, 0.0 ni`,
        `MiB Mem: 2048.0 total, 1024.0 free`,
        '',
        '  PID  CPU%  MEM%  STAT  COMMAND',
      ];
      for (const p of [...state.processes].sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu))) {
        lines.push(`${String(p.pid).padStart(5)}  ${p.cpu.padStart(4)}  ${p.mem.padStart(4)}  ${p.status.padStart(4)}  ${p.name}`);
      }
      lines.push('', '(press q to exit)');
      return out(...lines);
    }

    case 'kill': {
      const signal = args.find(a => a.startsWith('-'));
      const pid = parseInt(args.find(a => !a.startsWith('-')) || '0');
      if (!pid) return out('kill: missing pid');
      const idx = state.processes.findIndex(p => p.pid === pid);
      if (idx === -1) return out(`kill: (${pid}) - No such process`);
      const pname = state.processes[idx].name;
      state.processes.splice(idx, 1);
      return out(`[1]+ Terminated  ${pname}`);
    }

    case 'export': {
      if (args.length === 0) {
        return out(...Object.entries(state.env).map(([k, v]) => `declare -x ${k}="${v}"`));
      }
      for (const arg of args) {
        const [key, ...rest] = arg.split('=');
        const val = rest.join('=').replace(/^["']|["']$/g, '');
        state.env[key] = val;
      }
      return { output: [], state };
    }

    case 'env':
      return out(...Object.entries(state.env).map(([k, v]) => `${k}=${v}`));

    case 'history':
      return out(...state.history.map((h, i) => `  ${i + 1}  ${h}`));

    case 'date':
      return out(new Date().toString());

    case 'uname':
      if (args.includes('-a')) return out('Linux netquest-vm 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux');
      return out('Linux');

    case 'man':
      return out(`No manual entry for ${args[0] || 'unknown'}`, 'Try: help');

    case 'apt': {
      const subcmd = args[0];
      if (subcmd === 'update') {
        return out(
          'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease',
          'Hit:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease',
          'Hit:3 http://security.ubuntu.com/ubuntu jammy-security InRelease',
          'Reading package lists... Done',
          'All packages are up to date.'
        );
      }
      if (subcmd === 'install') {
        const pkg = args[1] || 'package';
        return out(
          `Reading package lists... Done`,
          `Building dependency tree... Done`,
          `The following NEW packages will be installed:`,
          `  ${pkg}`,
          `Setting up ${pkg} (latest) ...`,
          `✓ ${pkg} installed successfully`
        );
      }
      if (subcmd === 'remove') {
        const pkg = args[1] || 'package';
        return out(`Removing ${pkg} ...`, `✓ ${pkg} removed`);
      }
      return out('Usage: apt [update|install|remove] [package]');
    }

    case 'ssh': {
      const target = args[0] || 'root@server';
      const host = target.includes('@') ? target.split('@')[1] : target;
      const user = target.includes('@') ? target.split('@')[0] : 'root';
      return out(
        `Connecting to ${target}...`,
        `The authenticity of host '${host}' can't be established.`,
        `ED25519 key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8`,
        `Are you sure you want to continue connecting? (yes)`,
        `Warning: Permanently added '${host}' to the list of known hosts.`,
        `Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)`,
        ``,
        `Last login: Sat Feb 21 12:00:00 2026 from 10.0.0.1`,
        `${user}@${host}:~$ `
      );
    }

    case 'scp': {
      if (args.length < 2) return out('usage: scp source target');
      return out(
        `${args[0]}                100%  1024     1.0KB/s   00:01`,
        `✓ File transferred successfully`
      );
    }

    case 'help':
      return out(
        'Available commands:',
        '  Navigation: pwd, ls, cd, find, which',
        '  Files: cat, head, tail, less, wc, touch, mkdir, rm, rmdir, cp, mv',
        '  Search: grep, find',
        '  System: ps, top, kill, whoami, hostname, date, uname',
        '  Network: ping, ssh, scp, curl, netstat, ifconfig',
        '  Package: apt install/update/remove',
        '  Shell: echo, export, env, history, chmod, chown',
        '  Other: clear, help',
      );

    // Legacy network commands from original terminal
    case 'ping': {
      const host = args[0] || 'localhost';
      const ip = host === 'google.com' ? '142.250.80.46' : host === 'localhost' ? '127.0.0.1' : `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      return out(
        `PING ${host} (${ip}): 56 data bytes`,
        `64 bytes from ${ip}: icmp_seq=0 ttl=117 time=${Math.floor(Math.random() * 30 + 5)}ms`,
        `64 bytes from ${ip}: icmp_seq=1 ttl=117 time=${Math.floor(Math.random() * 30 + 5)}ms`,
        `64 bytes from ${ip}: icmp_seq=2 ttl=117 time=${Math.floor(Math.random() * 30 + 5)}ms`,
        `--- ${host} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss`
      );
    }

    case 'traceroute': {
      const host = args[0] || 'google.com';
      return out(
        `traceroute to ${host}, 30 hops max`,
        ` 1  192.168.1.1  1.2ms`,
        ` 2  10.0.0.1  8.4ms`,
        ` 3  72.14.215.85  12.1ms`,
        ` 4  142.250.80.46  18.3ms`,
      );
    }

    case 'nslookup': {
      const domain = args[0] || 'example.com';
      const ips: Record<string, string> = { 'google.com': '142.250.80.46', 'github.com': '140.82.121.4', 'example.com': '93.184.216.34' };
      const ip = ips[domain] || `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      return out(`Server:  8.8.8.8`, `Address: 8.8.8.8#53`, ``, `Non-authoritative answer:`, `Name:    ${domain}`, `Address: ${ip}`);
    }

    case 'curl': {
      const url = args[0] || 'http://example.com';
      return out(`<!DOCTYPE html>`, `<html><head><title>Example</title></head>`, `<body><h1>Hello World</h1></body></html>`, ``, `HTTP/1.1 200 OK`);
    }

    case 'netstat':
      return out(
        `Active Internet connections`,
        `Proto  Local Address      Foreign Address    State`,
        `tcp    0.0.0.0:22         0.0.0.0:*          LISTEN`,
        `tcp    0.0.0.0:80         0.0.0.0:*          LISTEN`,
        `tcp    0.0.0.0:443        0.0.0.0:*          LISTEN`,
        `tcp    192.168.1.10:52341 142.250.80.46:443  ESTABLISHED`,
      );

    case 'ifconfig':
      return out(
        `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>`,
        `        inet 192.168.1.10  netmask 255.255.255.0`,
        `        ether 02:42:ac:11:00:02`,
        ``,
        `lo: flags=73<UP,LOOPBACK,RUNNING>`,
        `        inet 127.0.0.1  netmask 255.0.0.0`,
      );

    case 'ip':
      if (args[0] === 'addr') return out(`1: lo: inet 127.0.0.1/8`, `2: eth0: inet 192.168.1.10/24`);
      return out('Usage: ip addr');

    case 'iptables':
      return out(
        `Chain INPUT (policy ACCEPT)`,
        `target  prot  source      destination`,
        `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:22`,
        `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:80`,
        `DROP    all   0.0.0.0/0   0.0.0.0/0`,
      );

    default:
      return out(`command not found: ${cmd}. Type "help" for available commands.`);
  }
}
