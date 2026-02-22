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
        '  DevOps: git, docker, docker-compose, kubectl, terraform',
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

    case 'id': {
      const targetUser = args[0] || state.user;
      if (targetUser === 'root') return out('uid=0(root) gid=0(root) groups=0(root)');
      if (targetUser === 'user') return out('uid=1000(user) gid=1000(user) groups=1000(user),4(adm),27(sudo),100(users)');
      return out(`id: '${targetUser}': no such user`);
    }

    case 'groups': {
      const targetUser = args[0] || state.user;
      if (targetUser === 'root') return out('root');
      if (targetUser === 'user') return out('user adm sudo users');
      return out(`groups: '${targetUser}': no such user`);
    }

    case 'su': {
      const targetUser = args.includes('-') ? (args[args.indexOf('-') + 1] || 'root') : (args[0] || 'root');
      if (targetUser === 'root') {
        state.user = 'root';
        state.cwd = '/root';
        state.env.USER = 'root';
        state.env.HOME = '/root';
        return out(`root@${state.hostname}:/root#`);
      }
      state.user = targetUser;
      state.env.USER = targetUser;
      return { output: [], state };
    }

    case 'sudo': {
      if (args.length === 0) return out('usage: sudo <command>');
      if (args[0] === '!!') {
        const lastCmd = state.history.length > 1 ? state.history[state.history.length - 2] : '';
        if (!lastCmd) return out('sudo: no previous command');
        const parts2 = parseCommand(lastCmd);
        return runSingleCommand(state, parts2[0], parts2.slice(1));
      }
      const oldUser = state.user;
      state.user = 'root';
      const result = runSingleCommand(state, args[0], args.slice(1));
      result.state.user = oldUser;
      return result;
    }

    case 'usermod': {
      if (args.length < 2) return out('Usage: usermod [options] LOGIN');
      const targetUser = args[args.length - 1];
      return out(`usermod: user '${targetUser}' modified`);
    }

    case 'groupadd': {
      if (args.length === 0) return out('Usage: groupadd [options] GROUP');
      return out(`groupadd: group '${args[0]}' added`);
    }

    case 'ln': {
      const symbolic = args.includes('-s');
      const nonFlags = args.filter(a => !a.startsWith('-'));
      if (nonFlags.length < 2) return out('ln: missing file operand');
      const target = nonFlags[0];
      const linkName = nonFlags[1];
      const linkPath = resolvePath(state.fs, state.cwd, linkName);
      const { parent, name } = getParentAndName(state.fs, linkPath);
      if (!parent || parent.type !== 'dir') return out(`ln: failed to create ${symbolic ? 'symbolic ' : ''}link '${linkName}'`);
      parent.children![name] = {
        type: 'file', name,
        content: `-> ${target}`,
        permissions: symbolic ? 'lrwxrwxrwx'.slice(1) : 'rw-r--r--',
        owner: state.user, group: state.user, size: target.length,
        modified: 'Feb 21 12:00'
      };
      return { output: [], state };
    }

    case 'df': {
      const human = args.includes('-h');
      if (human) {
        return out(
          'Filesystem      Size  Used Avail Use% Mounted on',
          '/dev/sda1        50G   12G   35G  26% /',
          'tmpfs           1.0G  4.0M 1020M   1% /tmp',
          '/dev/sda3       100G   45G   50G  48% /home',
          'tmpfs           2.0G     0  2.0G   0% /dev/shm',
        );
      }
      return out(
        'Filesystem     1K-blocks     Used Available Use% Mounted on',
        '/dev/sda1       52428800 12582912  36700160  26% /',
        'tmpfs            1048576     4096   1044480   1% /tmp',
        '/dev/sda3      104857600 47185920  52428800  48% /home',
      );
    }

    case 'du': {
      const human = args.includes('-h');
      const summary = args.includes('-s');
      const target = args.find(a => !a.startsWith('-')) || '.';
      if (summary && human) return out(`1.2G\t${target}`);
      if (summary) return out(`1258291\t${target}`);
      if (human) {
        return out(
          `4.0K\t${target}/Desktop`,
          `12K\t${target}/Documents`,
          `2.1M\t${target}/Downloads`,
          `0\t${target}/Music`,
          `3.0M\t${target}/Pictures`,
          `5.1M\t${target}`,
        );
      }
      return out(
        `4\t${target}/Desktop`,
        `12\t${target}/Documents`,
        `2148\t${target}/Downloads`,
        `0\t${target}/Music`,
        `3072\t${target}/Pictures`,
        `5236\t${target}`,
      );
    }

    case 'mount': {
      if (args.length === 0) {
        return out(
          '/dev/sda1 on / type ext4 (rw,relatime,errors=remount-ro)',
          'tmpfs on /tmp type tmpfs (rw,nosuid,nodev)',
          '/dev/sda3 on /home type ext4 (rw,relatime)',
          'proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)',
          'sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)',
          'tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)',
        );
      }
      return out(`mount: ${args.join(' ')}: mounted`);
    }

    case 'umount':
      if (args.length === 0) return out('Usage: umount <directory>');
      return out(`umount: ${args[0]}: unmounted`);

    case 'systemctl': {
      const subcmd = args[0] || 'status';
      const service = args[1] || '';
      if (subcmd === 'status') {
        if (!service) {
          return out(
            '● nginx.service - A high performance web server',
            '     Loaded: loaded (/etc/systemd/system/nginx.service; enabled)',
            '     Active: active (running) since Sat 2026-02-21 10:00:00 UTC; 2h ago',
            '   Main PID: 567 (nginx)',
            '      Tasks: 2 (limit: 4915)',
            '     Memory: 12.5M',
            '     CGroup: /system.slice/nginx.service',
            '             └─567 nginx: master process /usr/sbin/nginx',
          );
        }
        const activeServices: Record<string, { desc: string; pid: number; active: boolean }> = {
          'nginx': { desc: 'A high performance web server', pid: 567, active: true },
          'nginx.service': { desc: 'A high performance web server', pid: 567, active: true },
          'sshd': { desc: 'OpenBSD Secure Shell server', pid: 234, active: true },
          'sshd.service': { desc: 'OpenBSD Secure Shell server', pid: 234, active: true },
          'mysql': { desc: 'MySQL Community Server', pid: 0, active: false },
          'mysql.service': { desc: 'MySQL Community Server', pid: 0, active: false },
          'cron': { desc: 'Regular background program processing daemon', pid: 456, active: true },
          'cron.service': { desc: 'Regular background program processing daemon', pid: 456, active: true },
        };
        const svc = activeServices[service.replace('.service', '')] || activeServices[service];
        if (!svc) return out(`Unit ${service}.service could not be found.`);
        const name = service.endsWith('.service') ? service : `${service}.service`;
        if (svc.active) {
          return out(
            `● ${name} - ${svc.desc}`,
            `     Loaded: loaded (/etc/systemd/system/${name}; enabled)`,
            `     Active: active (running) since Sat 2026-02-21 10:00:00 UTC; 2h ago`,
            `   Main PID: ${svc.pid} (${service.replace('.service', '')})`,
            `      Tasks: 2`,
            `     Memory: 12.5M`,
          );
        }
        return out(
          `● ${name} - ${svc.desc}`,
          `     Loaded: loaded (/etc/systemd/system/${name}; enabled)`,
          `     Active: inactive (dead) since Sat 2026-02-21 12:05:00 UTC; 1min ago`,
          `   Main PID: ${svc.pid} (code=exited, status=1/FAILURE)`,
        );
      }
      if (subcmd === 'start') return out(`Starting ${service}...`, `✓ ${service} started`);
      if (subcmd === 'stop') return out(`Stopping ${service}...`, `✓ ${service} stopped`);
      if (subcmd === 'restart') return out(`Restarting ${service}...`, `✓ ${service} restarted`);
      if (subcmd === 'enable') return out(`Created symlink /etc/systemd/system/multi-user.target.wants/${service}.service`);
      if (subcmd === 'disable') return out(`Removed symlink /etc/systemd/system/multi-user.target.wants/${service}.service`);
      if (subcmd === 'list-units') {
        return out(
          'UNIT                    LOAD   ACTIVE SUB     DESCRIPTION',
          'nginx.service           loaded active running A high performance web server',
          'sshd.service            loaded active running OpenBSD Secure Shell server',
          'cron.service            loaded active running Regular background program processing',
          'systemd-logind.service  loaded active running User Login Management',
          'mysql.service           loaded failed failed  MySQL Community Server',
          '',
          'LOAD   = Reflects whether the unit definition was properly loaded.',
          'ACTIVE = The high-level unit activation state, i.e. generalization of SUB.',
        );
      }
      return out(`Usage: systemctl [start|stop|restart|status|enable|disable|list-units] [service]`);
    }

    case 'journalctl': {
      if (args.includes('-u')) {
        const svc = args[args.indexOf('-u') + 1] || 'nginx';
        if (svc === 'mysql' || svc === 'mysql.service') {
          return out(
            'Feb 21 12:05:01 netquest systemd[1]: Starting MySQL Community Server...',
            'Feb 21 12:05:01 netquest mysqld[2345]: ERROR 2002 (HY000): Can\'t connect to local MySQL server through socket',
            'Feb 21 12:05:01 netquest systemd[1]: mysql.service: Main process exited, code=exited, status=1/FAILURE',
            'Feb 21 12:05:02 netquest systemd[1]: mysql.service: Failed with result \'exit-code\'.',
            'Feb 21 12:05:02 netquest systemd[1]: Failed to start MySQL Community Server.',
          );
        }
        return out(
          `Feb 21 10:00:00 netquest systemd[1]: Starting ${svc}...`,
          `Feb 21 10:00:01 netquest systemd[1]: Started ${svc}.`,
          `Feb 21 12:01:00 netquest ${svc}[567]: 192.168.1.1 - GET /index.html 200`,
        );
      }
      if (args.includes('-p') && args.includes('err')) {
        return out(
          'Feb 21 12:05:00 netquest kernel: Out of memory: Killed process 1337 (crypto-miner)',
          'Feb 21 12:05:01 netquest systemd[1]: mysql.service: Main process exited, code=exited, status=1/FAILURE',
          'Feb 21 12:05:02 netquest systemd[1]: mysql.service: Failed with result \'exit-code\'.',
        );
      }
      return out(
        '-- Journal begins at Sat 2026-02-21 10:00:00 UTC --',
        'Feb 21 10:00:00 netquest kernel: Linux version 5.15.0-91-generic',
        'Feb 21 10:00:01 netquest systemd[1]: Started nginx.service.',
        'Feb 21 10:00:02 netquest systemd[1]: Started sshd.service.',
        'Feb 21 12:00:01 netquest systemd[1]: Started Daily apt activities.',
        'Feb 21 12:05:01 netquest systemd[1]: mysql.service: Main process exited, code=exited, status=1/FAILURE',
        'Feb 21 12:05:02 netquest systemd[1]: mysql.service: Failed with result \'exit-code\'.',
      );
    }

    case 'dmesg': {
      return out(
        '[    0.000000] Linux version 5.15.0-91-generic (buildd@lcy02-amd64-051)',
        '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-5.15.0-91-generic root=UUID=a1b2c3d4',
        '[    0.100000] BIOS-provided physical RAM map:',
        '[    0.100000]  BIOS-e820: [mem 0x0000000000000000-0x000000007fffffff] usable',
        '[    0.500000] Memory: 2097152K/2097152K available (12288K kernel code)',
        '[    1.000000] CPU: Intel(R) Core(TM) i5-9600K CPU @ 3.70GHz',
        '[    1.200000] smpboot: CPU0: Intel(R) Core(TM) i5-9600K (family: 0x6, model: 0x9e)',
        '[    2.000000] NET: Registered PF_INET protocol family',
        '[    2.500000] EXT4-fs (sda1): mounted filesystem with ordered data mode',
        '[    3.000000] systemd[1]: Detected architecture x86-64.',
        '[42069.123000] Out of memory: Killed process 1337 (crypto-miner) total-vm:4096000kB',
      );
    }

    case 'ip':
      if (args[0] === 'addr' || args[0] === 'a') {
        return out(
          '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN',
          '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00',
          '    inet 127.0.0.1/8 scope host lo',
          '    inet6 ::1/128 scope host',
          '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP',
          '    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff',
          '    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic eth0',
          '    inet6 fe80::42:acff:fe11:2/64 scope link',
        );
      }
      if (args[0] === 'route' || args[0] === 'r') {
        return out(
          'default via 192.168.1.1 dev eth0 proto dhcp metric 100',
          '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100',
        );
      }
      return out('Usage: ip [addr|route]');

    case 'ss': {
      return out(
        'Netid  State   Recv-Q  Send-Q    Local Address:Port     Peer Address:Port',
        'tcp    LISTEN  0       128       0.0.0.0:22              0.0.0.0:*',
        'tcp    LISTEN  0       511       0.0.0.0:80              0.0.0.0:*',
        'tcp    LISTEN  0       511       0.0.0.0:443             0.0.0.0:*',
        'tcp    ESTAB   0       0         192.168.1.10:52341     142.250.80.46:443',
        'tcp    ESTAB   0       0         192.168.1.10:22         10.0.0.5:49832',
        'udp    UNCONN  0       0         127.0.0.53:53           0.0.0.0:*',
      );
    }

    case 'crontab': {
      if (args.includes('-l')) {
        return out(
          '# Edit this file to introduce tasks to be run by cron.',
          '# m h  dom mon dow   command',
          '0 2 * * * /usr/bin/backup.sh',
          '*/15 * * * * /usr/bin/check-health.sh',
          '0 0 * * 0 /usr/bin/weekly-report.sh',
        );
      }
      if (args.includes('-e')) {
        return out('crontab: editing crontab for user', '(simulated — use crontab -l to view)');
      }
      if (args.includes('-r')) {
        return out('crontab: removed crontab for user');
      }
      return out('usage: crontab [-l | -e | -r]');
    }

    case 'lsblk': {
      return out(
        'NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS',
        'sda      8:0    0    50G  0 disk',
        '├─sda1   8:1    0    49G  0 part /',
        '└─sda2   8:2    0     1G  0 part [SWAP]',
        'sdb      8:16   0   100G  0 disk',
        '└─sdb1   8:17   0   100G  0 part /home',
      );
    }

    case 'free': {
      if (args.includes('-h')) {
        return out(
          '               total        used        free      shared  buff/cache   available',
          'Mem:           2.0Gi       512Mi       512Mi        16Mi       1.0Gi       1.5Gi',
          'Swap:          1.0Gi        48Mi       976Mi',
        );
      }
      return out(
        '               total        used        free      shared  buff/cache   available',
        'Mem:         2097152      524288      524288       16384     1048576     1572864',
        'Swap:        1048576       49152      999424',
      );
    }

    case 'iptables':
      return out(
        `Chain INPUT (policy ACCEPT)`,
        `target  prot  source      destination`,
        `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:22`,
        `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:80`,
        `DROP    all   0.0.0.0/0   0.0.0.0/0`,
      );

    case 'git': {
      const sub = args[0];
      if (!sub) return out('usage: git <command> [<args>]', '', 'Common commands:', '   init       Create an empty Git repository', '   add        Add file contents to the index', '   commit     Record changes to the repository', '   status     Show the working tree status', '   log        Show commit logs', '   branch     List, create, or delete branches', '   checkout   Switch branches', '   merge      Join two branches', '   remote     Manage remotes', '   push       Update remote refs', '   pull       Fetch and merge from remote', '   clone      Clone a repository', '   diff       Show changes between commits');
      if (sub === 'init') return out('Initialized empty Git repository in ' + state.cwd + '/.git/');
      if (sub === 'add') {
        const target = args[1] || '.';
        return out(`Added ${target === '.' ? 'all files' : `'${target}'`} to staging area`);
      }
      if (sub === 'commit') {
        const msgIdx = args.indexOf('-m');
        const msg = msgIdx >= 0 ? args[msgIdx + 1] || 'update' : 'update';
        const hash = Math.random().toString(16).slice(2, 9);
        return out(`[main ${hash}] ${msg}`, ' 3 files changed, 42 insertions(+), 7 deletions(-)');
      }
      if (sub === 'status') return out('On branch main', '', 'Changes not staged for commit:', '  (use "git add <file>..." to update what will be committed)', '', '\tmodified:   index.html', '\tmodified:   style.css', '', 'Untracked files:', '\tnew-feature.js', '', 'no changes added to commit (use "git add")');
      if (sub === 'log') return out(
        'commit a1b2c3d (HEAD -> main)', 'Author: user <user@example.com>', 'Date:   Sat Feb 21 12:00:00 2026', '', '    Add navigation bar', '',
        'commit e4f5a6b', 'Author: user <user@example.com>', 'Date:   Fri Feb 20 15:30:00 2026', '', '    Initial commit'
      );
      if (sub === 'branch') {
        if (args.length === 1) return out('* main', '  feature/login', '  bugfix/header');
        return out(`Created branch '${args[1]}'`);
      }
      if (sub === 'checkout' || sub === 'switch') {
        const branch = args.includes('-b') ? args[args.indexOf('-b') + 1] : args[1];
        if (!branch) return out('error: please specify a branch');
        if (args.includes('-b')) return out(`Switched to a new branch '${branch}'`);
        return out(`Switched to branch '${branch}'`);
      }
      if (sub === 'merge') {
        const branch = args[1];
        if (!branch) return out('error: please specify a branch to merge');
        return out(`Merge made by the 'ort' strategy.`, ` src/login.js | 45 +++++++++++++++`, ` 1 file changed, 45 insertions(+)`, ` create mode 100644 src/login.js`);
      }
      if (sub === 'remote') {
        if (args[1] === 'add') return out(`Remote '${args[2] || 'origin'}' added → ${args[3] || 'https://github.com/user/repo.git'}`);
        if (args[1] === '-v') return out('origin\thttps://github.com/user/repo.git (fetch)', 'origin\thttps://github.com/user/repo.git (push)');
        return out('origin');
      }
      if (sub === 'push') return out('Enumerating objects: 5, done.', 'Counting objects: 100% (5/5), done.', 'Delta compression using up to 8 threads', 'Writing objects: 100% (3/3), 320 bytes | 320.00 KiB/s, done.', `To https://github.com/user/repo.git`, `   e4f5a6b..a1b2c3d  main -> main`);
      if (sub === 'pull') return out('remote: Enumerating objects: 3, done.', 'remote: Counting objects: 100% (3/3), done.', 'Unpacking objects: 100% (3/3), done.', 'From https://github.com/user/repo.git', '   a1b2c3d..f7e8d9c  main -> origin/main', 'Updating a1b2c3d..f7e8d9c', 'Fast-forward', ' README.md | 5 +++++', ' 1 file changed, 5 insertions(+)');
      if (sub === 'clone') {
        const repo = args[1] || 'https://github.com/user/repo.git';
        const name = repo.split('/').pop()?.replace('.git', '') || 'repo';
        return out(`Cloning into '${name}'...`, 'remote: Enumerating objects: 42, done.', 'remote: Total 42 (delta 0), reused 0 (delta 0)', `Receiving objects: 100% (42/42), 12.5 KiB | 6.25 MiB/s, done.`);
      }
      if (sub === 'diff') return out('\x1b[1mdiff --git a/index.html b/index.html\x1b[0m', '--- a/index.html', '+++ b/index.html', '@@ -1,4 +1,5 @@', ' <html>', '   <head>', '+    <title>My Site</title>', '   </head>', '   <body>');
      return out(`git: '${sub}' is not a git command.`);
    }

    case 'docker': {
      const sub = args[0];
      if (!sub) return out('Usage: docker <command>', '', 'Commands:', '  run       Create and run a container', '  ps        List containers', '  images    List images', '  stop      Stop a container', '  rm        Remove a container', '  pull      Download an image', '  exec      Run command in container', '  build     Build an image from Dockerfile', '  logs      View container logs');
      if (sub === 'run') {
        const image = args.find(a => !a.startsWith('-')) || 'nginx';
        const detach = args.includes('-d');
        const id = Math.random().toString(16).slice(2, 14);
        if (image === 'hello-world' || args.includes('hello-world')) {
          return out('Unable to find image \'hello-world:latest\' locally', 'latest: Pulling from library/hello-world', 'Digest: sha256:2498fce14358aa50ead0cc6c19990fc6ff866ce72aeb5546e1d59caac3d0d60f', 'Status: Downloaded newer image for hello-world:latest', '', 'Hello from Docker!', 'This message shows that your installation appears to be working correctly.', '', 'To generate this message, Docker took the following steps:', ' 1. The Docker client contacted the Docker daemon.', ' 2. The daemon pulled the "hello-world" image from Docker Hub.', ' 3. The daemon created a new container from that image.', ' 4. The daemon streamed output to the Docker client.');
        }
        if (detach) return out(id);
        return out(`Container ${id.slice(0, 12)} started from image '${image}'`, 'Listening on port 80...');
      }
      if (sub === 'ps') {
        const all = args.includes('-a');
        const lines = ['CONTAINER ID   IMAGE     COMMAND       STATUS          PORTS                  NAMES',
          'a1b2c3d4e5f6   nginx     "/docker-…"   Up 2 hours      0.0.0.0:80->80/tcp     web-server',
          'f6e5d4c3b2a1   redis     "redis-se…"   Up 2 hours      0.0.0.0:6379->6379     cache'];
        if (all) lines.push('deadbeef1234   node      "npm start"   Exited (0) 1h ago                            old-app');
        return out(...lines);
      }
      if (sub === 'images') return out('REPOSITORY   TAG       IMAGE ID       CREATED        SIZE', 'nginx        latest    a1b2c3d4e5f6   2 weeks ago    187MB', 'redis        7         b2c3d4e5f6a1   3 weeks ago    138MB', 'node         20        c3d4e5f6a1b2   1 month ago    1.1GB', 'python       3.11      d4e5f6a1b2c3   1 month ago    1.01GB');
      if (sub === 'stop') {
        const id = args[1] || 'container';
        return out(id);
      }
      if (sub === 'rm') {
        const id = args[1] || 'container';
        return out(id);
      }
      if (sub === 'pull') {
        const image = args[1] || 'nginx';
        return out(`Using default tag: latest`, `latest: Pulling from library/${image}`, 'a2abf6c4d29d: Pull complete', '878a5e1b7a23: Pull complete', 'Digest: sha256:abc123def456', `Status: Downloaded newer image for ${image}:latest`, `docker.io/library/${image}:latest`);
      }
      if (sub === 'exec') {
        const container = args.find(a => !a.startsWith('-') && a !== 'exec') || 'container';
        const cmd2 = args.slice(args.indexOf(container) + 1).join(' ') || 'bash';
        if (cmd2.includes('ls')) return out('app  bin  etc  home  lib  proc  root  tmp  usr  var');
        if (cmd2.includes('bash') || cmd2.includes('sh')) return out(`root@${container.slice(0, 12)}:/# `);
        return out(`Executing '${cmd2}' in container ${container}`);
      }
      if (sub === 'build') {
        const tag = args.includes('-t') ? args[args.indexOf('-t') + 1] || 'myapp' : 'myapp';
        return out(`[+] Building ${tag}`, ' => [1/5] FROM docker.io/library/node:20', ' => [2/5] WORKDIR /app', ' => [3/5] COPY package*.json ./', ' => [4/5] RUN npm install', ' => [5/5] COPY . .', `Successfully built ${tag}`, `Successfully tagged ${tag}:latest`);
      }
      if (sub === 'logs') {
        const container = args[1] || 'web-server';
        return out(`[${container}] 2026-02-21 12:00:01 - GET /index.html 200 OK`, `[${container}] 2026-02-21 12:00:05 - GET /api/data 200 OK`, `[${container}] 2026-02-21 12:01:12 - POST /api/login 401 Unauthorized`, `[${container}] 2026-02-21 12:01:30 - POST /api/login 200 OK`);
      }
      return out(`docker: '${sub}' is not a docker command.`);
    }

    case 'docker-compose': {
      const sub = args[0];
      if (!sub) return out('Usage: docker-compose <command>', '', 'Commands:', '  up      Create and start containers', '  down    Stop and remove containers', '  ps      List containers', '  logs    View container logs');
      if (sub === 'up') {
        const detach = args.includes('-d');
        return out('Creating network "myapp_default" with the default driver', 'Creating myapp_db_1   ... done', 'Creating myapp_redis_1 ... done', 'Creating myapp_web_1   ... done', ...(detach ? [] : ['Attaching to myapp_web_1, myapp_db_1, myapp_redis_1', 'web_1   | Server running on port 3000', 'db_1    | PostgreSQL ready on port 5432', 'redis_1 | Redis ready on port 6379']));
      }
      if (sub === 'down') return out('Stopping myapp_web_1   ... done', 'Stopping myapp_redis_1 ... done', 'Stopping myapp_db_1    ... done', 'Removing myapp_web_1   ... done', 'Removing myapp_redis_1 ... done', 'Removing myapp_db_1    ... done', 'Removing network myapp_default');
      if (sub === 'ps') return out('      Name              Command          State           Ports', '-----------------------------------------------------------------------', 'myapp_db_1      docker-entrypoint.sh   Up      0.0.0.0:5432->5432/tcp', 'myapp_redis_1   redis-server           Up      0.0.0.0:6379->6379/tcp', 'myapp_web_1     npm start              Up      0.0.0.0:3000->3000/tcp');
      if (sub === 'logs') return out('web_1   | [2026-02-21] Server started on port 3000', 'db_1    | [2026-02-21] PostgreSQL database ready', 'redis_1 | [2026-02-21] Redis ready to accept connections', 'web_1   | [2026-02-21] GET / 200 OK');
      return out(`docker-compose: '${sub}' is not a command.`);
    }

    case 'kubectl': {
      const sub = args[0];
      if (!sub) return out('Usage: kubectl <command> [resource]', '', 'Commands: get, apply, describe, logs, delete');
      if (sub === 'get') {
        const resource = args[1];
        if (resource === 'pods' || resource === 'pod') return out('NAME                        READY   STATUS    RESTARTS   AGE', 'web-app-5d8f9b7c4-x2k9j    1/1     Running   0          2h', 'web-app-5d8f9b7c4-m3n7p    1/1     Running   0          2h', 'redis-master-0              1/1     Running   0          5h', 'postgres-6b8c9d4e5f-q1w2   1/1     Running   0          5h');
        if (resource === 'deployments' || resource === 'deploy') return out('NAME         READY   UP-TO-DATE   AVAILABLE   AGE', 'web-app      2/2     2            2           2h', 'redis        1/1     1            1           5h', 'postgres     1/1     1            1           5h');
        if (resource === 'services' || resource === 'svc') return out('NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE', 'kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP        7d', 'web-app      LoadBalancer   10.96.45.123    203.0.113.5   80:30080/TCP   2h', 'redis        ClusterIP      10.96.78.234    <none>        6379/TCP       5h', 'postgres     ClusterIP      10.96.12.345    <none>        5432/TCP       5h');
        if (resource === 'nodes') return out('NAME           STATUS   ROLES           AGE   VERSION', 'node-1         Ready    control-plane   7d    v1.28.0', 'node-2         Ready    <none>          7d    v1.28.0', 'node-3         Ready    <none>          7d    v1.28.0');
        return out(`error: the server doesn't have a resource type "${resource || ''}"`);
      }
      if (sub === 'apply') {
        const file = args.includes('-f') ? args[args.indexOf('-f') + 1] || 'config.yaml' : 'config.yaml';
        return out(`deployment.apps/web-app configured`, `service/web-app configured`);
      }
      if (sub === 'describe') {
        const resource = args[1] || 'pod';
        const name = args[2] || 'web-app-5d8f9b7c4-x2k9j';
        return out(`Name:         ${name}`, `Namespace:    default`, `Node:         node-2`, `Status:       Running`, `IP:           10.244.1.5`, `Containers:`, `  web-app:`, `    Image:        myapp:latest`, `    Port:         3000/TCP`, `    State:        Running`, `    Ready:        True`, `    Restart Count: 0`);
      }
      if (sub === 'logs') {
        const pod = args[1] || 'web-app-5d8f9b7c4-x2k9j';
        return out(`[${pod}] 2026-02-21T12:00:00Z Server started on port 3000`, `[${pod}] 2026-02-21T12:00:05Z Connected to database`, `[${pod}] 2026-02-21T12:01:00Z GET / 200 OK 12ms`, `[${pod}] 2026-02-21T12:01:15Z GET /api/health 200 OK 2ms`);
      }
      if (sub === 'delete') {
        const resource = args[1] || 'pod';
        const name = args[2] || 'web-app';
        return out(`${resource} "${name}" deleted`);
      }
      return out(`kubectl: unknown command "${sub}"`);
    }

    case 'terraform': {
      const sub = args[0];
      if (!sub) return out('Usage: terraform <command>', '', 'Commands: init, plan, apply, destroy');
      if (sub === 'init') return out('Initializing the backend...', 'Initializing provider plugins...', '- Finding hashicorp/aws versions matching "~> 5.0"...', '- Installing hashicorp/aws v5.31.0...', '- Installed hashicorp/aws v5.31.0 (signed by HashiCorp)', '', 'Terraform has been successfully initialized!');
      if (sub === 'plan') return out('Terraform will perform the following actions:', '', '  # aws_instance.web will be created', '  + resource "aws_instance" "web" {', '      + ami           = "ami-0c55b159cbfafe1f0"', '      + instance_type = "t2.micro"', '      + tags = {', '          + "Name" = "web-server"', '        }', '    }', '', 'Plan: 1 to add, 0 to change, 0 to destroy.');
      if (sub === 'apply') return out('aws_instance.web: Creating...', 'aws_instance.web: Still creating... [10s elapsed]', 'aws_instance.web: Creation complete after 30s [id=i-0abc123def456]', '', 'Apply complete! Resources: 1 added, 0 changed, 0 destroyed.', '', 'Outputs:', '  public_ip = "54.123.45.67"');
      if (sub === 'destroy') return out('aws_instance.web: Destroying... [id=i-0abc123def456]', 'aws_instance.web: Destruction complete after 30s', '', 'Destroy complete! Resources: 1 destroyed.');
      return out(`terraform: unknown command "${sub}"`);
    }

    // ========== CYBERSECURITY TOOLS ==========

    case 'nmap': {
      const target = args.find(a => !a.startsWith('-')) || '192.168.1.1';
      const synScan = args.includes('-sS');
      const versionScan = args.includes('-sV');
      const osScan = args.includes('-O');
      const aggressive = args.includes('-A');
      const portRange = args.includes('-p') ? args[args.indexOf('-p') + 1] : null;

      const lines = [
        `Starting Nmap 7.94 ( https://nmap.org ) at 2026-02-21 12:00 UTC`,
        `Nmap scan report for ${target}`,
        `Host is up (0.0034s latency).`,
        '',
      ];

      if (portRange) {
        lines.push(`PORT      STATE    SERVICE       VERSION`);
        const ports = portRange.split(',').map(p => p.trim());
        for (const p of ports) {
          const portNum = parseInt(p);
          const svcMap: Record<number, [string, string]> = {
            21: ['ftp', 'vsftpd 3.0.5'], 22: ['ssh', 'OpenSSH 8.9p1'], 25: ['smtp', 'Postfix'],
            53: ['dns', 'BIND 9.18.1'], 80: ['http', 'Apache httpd 2.4.54'], 443: ['https', 'nginx 1.24.0'],
            3306: ['mysql', 'MySQL 8.0.35'], 5432: ['postgresql', 'PostgreSQL 15.4'], 8080: ['http-proxy', 'Apache Tomcat 9.0.82'],
          };
          const [svc, ver] = svcMap[portNum] || ['unknown', ''];
          lines.push(`${String(portNum).padEnd(5)}/${('tcp').padEnd(4)} open     ${svc.padEnd(13)} ${versionScan || aggressive ? ver : ''}`);
        }
      } else {
        lines.push(`Not shown: 993 closed tcp ports`);
        lines.push(`PORT      STATE    SERVICE       ${versionScan || aggressive ? 'VERSION' : ''}`);
        lines.push(`22/tcp    open     ssh           ${versionScan || aggressive ? 'OpenSSH 8.9p1 Ubuntu 3ubuntu0.4' : ''}`);
        lines.push(`80/tcp    open     http          ${versionScan || aggressive ? 'Apache httpd 2.4.54 ((Ubuntu))' : ''}`);
        lines.push(`443/tcp   open     https         ${versionScan || aggressive ? 'nginx 1.24.0' : ''}`);
        lines.push(`3306/tcp  open     mysql         ${versionScan || aggressive ? 'MySQL 8.0.35-0ubuntu0.22.04.1' : ''}`);
        lines.push(`8080/tcp  open     http-proxy    ${versionScan || aggressive ? 'Apache Tomcat 9.0.82' : ''}`);
        lines.push(`8443/tcp  filtered https-alt`);
        lines.push(`9090/tcp  open     zeus-admin    ${versionScan || aggressive ? 'Webmin httpd' : ''}`);
      }

      if (osScan || aggressive) {
        lines.push('', 'OS detection performed.');
        lines.push('Running: Linux 5.X');
        lines.push('OS details: Linux 5.15 - 5.19 (Ubuntu 22.04)');
        lines.push('Network Distance: 2 hops');
      }

      if (synScan) {
        lines.push('', 'SYN Stealth Scan completed — packets sent but connections not fully established.');
        lines.push('This scan type is harder to detect in logs.');
      }

      if (aggressive) {
        lines.push('', 'TRACEROUTE');
        lines.push('HOP   RTT      ADDRESS');
        lines.push('1     1.23 ms  192.168.1.1');
        lines.push(`2     3.45 ms  ${target}`);
      }

      lines.push('', `Nmap done: 1 IP address (1 host up) scanned in 4.52 seconds`);
      return out(...lines);
    }

    case 'whois': {
      const domain = args[0] || 'example.com';
      return out(
        `% WHOIS lookup for ${domain}`,
        '',
        `Domain Name: ${domain.toUpperCase()}`,
        `Registry Domain ID: 2336799_DOMAIN_COM-VRSN`,
        `Registrar WHOIS Server: whois.registrar.com`,
        `Registrar URL: http://www.registrar.com`,
        `Updated Date: 2025-08-14T07:01:44Z`,
        `Creation Date: 2005-03-15T12:00:00Z`,
        `Registry Expiry Date: 2027-03-15T12:00:00Z`,
        `Registrar: Example Registrar, Inc.`,
        `Registrar IANA ID: 1234`,
        '',
        `Domain Status: clientTransferProhibited`,
        '',
        `Name Server: NS1.DNSPROVIDER.COM`,
        `Name Server: NS2.DNSPROVIDER.COM`,
        '',
        `Registrant Organization: REDACTED FOR PRIVACY`,
        `Registrant State/Province: CA`,
        `Registrant Country: US`,
        `Admin Email: REDACTED`,
        `Tech Email: REDACTED`,
        '',
        `>>> Last update of WHOIS database: 2026-02-21T12:00:00Z <<<`,
      );
    }

    case 'dig': {
      const domain = args.find(a => !a.startsWith('-') && !a.startsWith('+')) || 'example.com';
      const recordType = args.find(a => ['A', 'MX', 'NS', 'TXT', 'AAAA', 'CNAME', 'SOA'].includes(a.toUpperCase()))?.toUpperCase() || 'A';
      const ips: Record<string, string> = { 'google.com': '142.250.80.46', 'github.com': '140.82.121.4', 'example.com': '93.184.216.34' };
      const ip = ips[domain] || '203.0.113.42';

      const lines = [
        `; <<>> DiG 9.18.1 <<>> ${domain} ${recordType}`,
        `;; global options: +cmd`,
        `;; Got answer:`,
        `;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345`,
        `;; flags: qr rd ra; QUERY: 1, ANSWER: ${recordType === 'MX' ? '2' : '1'}, AUTHORITY: 0`,
        '',
        ';; QUESTION SECTION:',
        `;${domain}.          IN    ${recordType}`,
        '',
        ';; ANSWER SECTION:',
      ];

      if (recordType === 'A') {
        lines.push(`${domain}.     300   IN    A     ${ip}`);
      } else if (recordType === 'MX') {
        lines.push(`${domain}.     300   IN    MX    10 mail1.${domain}.`);
        lines.push(`${domain}.     300   IN    MX    20 mail2.${domain}.`);
      } else if (recordType === 'NS') {
        lines.push(`${domain}.     86400 IN    NS    ns1.dnsprovider.com.`);
        lines.push(`${domain}.     86400 IN    NS    ns2.dnsprovider.com.`);
      } else if (recordType === 'TXT') {
        lines.push(`${domain}.     300   IN    TXT   "v=spf1 include:_spf.google.com ~all"`);
      }

      lines.push('', `;; Query time: 12 msec`, `;; SERVER: 8.8.8.8#53(8.8.8.8)`, `;; WHEN: Sat Feb 21 12:00:00 UTC 2026`, `;; MSG SIZE  rcvd: 68`);
      return out(...lines);
    }

    case 'nikto': {
      const target = args.find(a => !a.startsWith('-')) || args[args.indexOf('-h') + 1] || 'http://target.com';
      return out(
        `- Nikto v2.5.0`,
        `---------------------------------------------------------------------------`,
        `+ Target IP:          203.0.113.42`,
        `+ Target Hostname:    ${target}`,
        `+ Target Port:        80`,
        `+ Start Time:         2026-02-21 12:00:00 (GMT0)`,
        `---------------------------------------------------------------------------`,
        `+ Server: Apache/2.4.54 (Ubuntu)`,
        `+ /: The anti-clickjacking X-Frame-Options header is not present.`,
        `+ /: The X-Content-Type-Options header is not set.`,
        `+ /: Cookie PHPSESSID created without the httponly flag.`,
        `+ /config.php: PHP Config file may contain database IDs and passwords.`,
        `+ /admin/: Directory indexing found.`,
        `+ /admin/login.php: Admin login page/section found.`,
        `+ /backup/: Directory listing found — may contain sensitive files.`,
        `+ /phpinfo.php: Output from the phpinfo() function was found.`,
        `+ /wp-login.php: WordPress login found.`,
        `+ /robots.txt: contains 3 entries which should be manually viewed.`,
        `+ /.env: Environment file found — may contain secrets!`,
        `+ /server-status: Apache server-status accessible (should be disabled).`,
        `+ OSVDB-3233: /icons/README: Apache default file found.`,
        `---------------------------------------------------------------------------`,
        `+ 7 vulnerabilities found.`,
        `+ End Time:           2026-02-21 12:02:30 (GMT0) (150 seconds)`,
        `---------------------------------------------------------------------------`,
      );
    }

    case 'hashcat': {
      const hash = args.find(a => !a.startsWith('-')) || '5f4dcc3b5aa765d61d8327deb882cf99';
      const mode = args.includes('-m') ? args[args.indexOf('-m') + 1] : '0';
      const wordlist = args.find(a => a.includes('.txt') || a.includes('rockyou')) || 'rockyou.txt';
      return out(
        `hashcat (v6.2.6) starting...`,
        '',
        `Hash type: ${mode === '0' ? 'MD5' : mode === '100' ? 'SHA-1' : mode === '1400' ? 'SHA-256' : 'MD5'}`,
        `Hash target: ${hash}`,
        `Wordlist: ${wordlist}`,
        '',
        `[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%`,
        '',
        `${hash}:password123`,
        '',
        `Session..........: hashcat`,
        `Status...........: Cracked`,
        `Hash.Mode........: ${mode === '0' ? '0 (MD5)' : mode === '100' ? '100 (SHA1)' : '0 (MD5)'}`,
        `Hash.Target......: ${hash}`,
        `Time.Started.....: Sat Feb 21 12:00:00 2026`,
        `Time.Estimated...: Sat Feb 21 12:00:03 2026 (3 secs)`,
        `Candidates.#1....: 123456 -> zzzzzz`,
        `Speed.#1.........:  4521.3 kH/s`,
        '',
        `Started: Sat Feb 21 12:00:00 2026`,
        `Stopped: Sat Feb 21 12:00:03 2026`,
      );
    }

    case 'john': {
      const hashFile = args.find(a => !a.startsWith('-')) || 'hashes.txt';
      const wordlist = args.includes('--wordlist') ? args[args.indexOf('--wordlist') + 1] || args[args.indexOf('--wordlist=') + 1] : 'default';
      return out(
        `Using default input encoding: UTF-8`,
        `Loaded 3 password hashes with no different salts (Raw-MD5)`,
        `Press 'q' or Ctrl-C to abort, 'h' for help`,
        '',
        `[▓▓▓▓▓▓▓▓░░░░░░░░░░░░] 40%  (ETA: 00:00:05)`,
        `[▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░] 70%  (ETA: 00:00:02)`,
        `[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%`,
        '',
        `password123      (admin)`,
        `letmein          (user1)`,
        `dragon2024       (user2)`,
        '',
        `3g 0:00:00:03 DONE (2026-02-21 12:00) 1.0g/s 4521Kp/s`,
        `Use "--show" to display all cracked passwords reliably`,
        `Session completed.`,
      );
    }

    case 'aircrack-ng': {
      const file = args[0] || 'capture.cap';
      return out(
        `Aircrack-ng 1.7`,
        '',
        `                   [00:00:04] 4821/14344392 keys tested (1204.23 k/s)`,
        '',
        `                           KEY FOUND! [ hackm3plz ]`,
        '',
        `      Master Key     : A1 B2 C3 D4 E5 F6 A1 B2 C3 D4 E5 F6 A1 B2 C3 D4`,
        `                       E5 F6 A1 B2 C3 D4 E5 F6 A1 B2 C3 D4 E5 F6 A1 B2`,
        '',
        `      Transient Key  : 00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF`,
        `                       00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF`,
        '',
        `      EAPOL HMAC     : DE AD BE EF CA FE BA BE DE AD BE EF CA FE BA BE`,
      );
    }

    case 'sqlmap': {
      const url = args.find(a => a.startsWith('http') || a.startsWith('-u'))
        ? args.find(a => a.startsWith('http')) || args[args.indexOf('-u') + 1] || 'http://target.com/login'
        : 'http://target.com/login';
      return out(
        `        ___`,
        `       __H__`,
        ` ___ ___[']_____ ___ ___  {1.7.12#stable}`,
        `|_ -| . [)]     | .'| . |`,
        `|___|_  ["]_|_|_|__,|  _|`,
        `      |_|V...       |_|`,
        '',
        `[*] starting @ 12:00:00 /2026-02-21/`,
        ``,
        `[12:00:01] [INFO] testing connection to the target URL`,
        `[12:00:01] [INFO] testing if the target URL is stable`,
        `[12:00:02] [INFO] target URL is stable`,
        `[12:00:02] [INFO] testing if GET parameter 'id' is dynamic`,
        `[12:00:02] [INFO] GET parameter 'id' appears to be dynamic`,
        `[12:00:03] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable`,
        `[12:00:04] [INFO] testing for SQL injection on GET parameter 'id'`,
        `[12:00:05] [INFO] testing 'AND boolean-based blind'`,
        `[12:00:06] [INFO] GET parameter 'id' is 'AND boolean-based blind' injectable`,
        `[12:00:07] [INFO] testing 'MySQL >= 5.0 AND error-based'`,
        `[12:00:08] [INFO] GET parameter 'id' is 'MySQL >= 5.0 AND error-based' injectable`,
        '',
        `Parameter: id (GET)`,
        `    Type: boolean-based blind`,
        `    Payload: id=1 AND 5234=5234`,
        ``,
        `    Type: error-based`,
        `    Payload: id=1 AND (SELECT 1 FROM(SELECT COUNT(*),CONCAT(0x716b717671,(SELECT database()),0x717a767871,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)`,
        '',
        `[12:00:09] [INFO] the back-end DBMS is MySQL`,
        `back-end DBMS: MySQL >= 5.0`,
        `[12:00:10] [INFO] fetching database names`,
        `available databases [3]:`,
        `[*] information_schema`,
        `[*] webapp_db`,
        `[*] mysql`,
      );
    }

    case 'hydra': {
      const target = args.find(a => !a.startsWith('-')) || '192.168.1.100';
      const service = args.find(a => ['ssh', 'ftp', 'http', 'mysql', 'rdp'].includes(a)) || 'ssh';
      return out(
        `Hydra v9.5 (c) 2023 by van Hauser/THC`,
        '',
        `[DATA] max 16 tasks per 1 server, overall 16 tasks`,
        `[DATA] attacking ${service}://${target}:${service === 'ssh' ? '22' : service === 'ftp' ? '21' : '80'}`,
        `[STATUS] 128 of 14344392 [0.00%] [~112000 tries left]`,
        `[STATUS] 4521 of 14344392 [0.03%] [~31700 tries left]`,
        `[STATUS] 12453 of 14344392 [0.09%]`,
        `[${service === 'ssh' ? '22' : '80'}][${service}] host: ${target}   login: admin   password: P@ssw0rd2024`,
        '',
        `1 of 1 target successfully completed, 1 valid password found`,
        `Hydra finished at 2026-02-21 12:00:30`,
      );
    }

    case 'tcpdump': {
      const iface = args.includes('-i') ? args[args.indexOf('-i') + 1] : 'eth0';
      return out(
        `tcpdump: listening on ${iface}, link-type EN10MB (Ethernet), snapshot length 262144 bytes`,
        `12:00:01.234567 IP 192.168.1.10.52341 > 93.184.216.34.80: Flags [S], seq 1234567890`,
        `12:00:01.267890 IP 93.184.216.34.80 > 192.168.1.10.52341: Flags [S.], seq 987654321, ack 1234567891`,
        `12:00:01.268123 IP 192.168.1.10.52341 > 93.184.216.34.80: Flags [.], ack 987654322`,
        `12:00:01.270000 IP 192.168.1.10.52341 > 93.184.216.34.80: Flags [P.], HTTP GET /login`,
        `12:00:01.312000 IP 93.184.216.34.80 > 192.168.1.10.52341: Flags [P.], HTTP 200 OK`,
        `12:00:02.100000 IP 192.168.1.10.52341 > 93.184.216.34.80: Flags [P.], HTTP POST /login username=admin&password=letmein`,
        `12:00:02.150000 IP 93.184.216.34.80 > 192.168.1.10.52341: Flags [P.], HTTP 302 Found Set-Cookie: session=abc123`,
        `12:00:03.200000 ARP, Request who-has 192.168.1.1 tell 192.168.1.10`,
        `12:00:03.201000 ARP, Reply 192.168.1.1 is-at 02:42:ac:11:00:01`,
        '',
        `9 packets captured`,
        `9 packets received by filter`,
      );
    }

    case 'fail2ban-client': {
      const sub = args[0];
      if (sub === 'status') {
        const jail = args[1];
        if (jail === 'sshd') {
          return out(
            `Status for the jail: sshd`,
            `|- Filter`,
            `|  |- Currently failed: 3`,
            `|  |- Total failed:    47`,
            `|  \`- File list:       /var/log/auth.log`,
            `\`- Actions`,
            `   |- Currently banned: 2`,
            `   |- Total banned:     12`,
            `   \`- Banned IP list:   10.0.0.55 203.0.113.99`,
          );
        }
        return out(
          `Status`,
          `|- Number of jail:   3`,
          `\`- Jail list:        sshd, nginx-http-auth, apache-badbots`,
        );
      }
      return out('Usage: fail2ban-client status [jail]');
    }

    default:
      return out(`command not found: ${cmd}. Type "help" for available commands.`);
  }
}
