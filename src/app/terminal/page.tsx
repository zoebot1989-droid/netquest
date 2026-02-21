'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addAchievement } from '@/lib/gameState';

interface Line {
  type: 'input' | 'output';
  text: string;
}

const commandHandlers: Record<string, (args: string[]) => string[]> = {
  help: () => [
    'Available commands:',
    '  ping <host>        - Test connectivity',
    '  traceroute <host>  - Trace packet route',
    '  nslookup <domain>  - DNS lookup',
    '  ssh <user@host>    - Secure shell connect',
    '  curl <url>         - HTTP request',
    '  netstat            - Show network connections',
    '  ifconfig           - Show network interfaces',
    '  ip addr            - Show IP addresses',
    '  iptables -L        - List firewall rules',
    '  whoami             - Current user',
    '  clear              - Clear terminal',
    '  help               - Show this help',
  ],
  ping: (args) => {
    const host = args[0] || 'localhost';
    const ip = host === 'google.com' ? '142.250.80.46' : host === 'localhost' ? '127.0.0.1' : `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    return [
      `PING ${host} (${ip}): 56 data bytes`,
      `64 bytes from ${ip}: icmp_seq=0 ttl=117 time=${Math.floor(Math.random() * 30 + 5)}ms`,
      `64 bytes from ${ip}: icmp_seq=1 ttl=117 time=${Math.floor(Math.random() * 30 + 5)}ms`,
      `64 bytes from ${ip}: icmp_seq=2 ttl=117 time=${Math.floor(Math.random() * 30 + 5)}ms`,
      `--- ${host} ping statistics ---`,
      `3 packets transmitted, 3 packets received, 0% packet loss`,
    ];
  },
  traceroute: (args) => {
    const host = args[0] || 'google.com';
    return [
      `traceroute to ${host}, 30 hops max`,
      ` 1  192.168.1.1 (192.168.1.1)  1.2ms`,
      ` 2  10.0.0.1 (10.0.0.1)  8.4ms`,
      ` 3  72.14.215.85 (72.14.215.85)  12.1ms`,
      ` 4  108.170.250.33 (108.170.250.33)  15.7ms`,
      ` 5  142.250.80.46 (142.250.80.46)  18.3ms`,
    ];
  },
  nslookup: (args) => {
    const domain = args[0] || 'example.com';
    const ips: Record<string, string> = { 'google.com': '142.250.80.46', 'github.com': '140.82.121.4', 'example.com': '93.184.216.34' };
    const ip = ips[domain] || `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    return [
      `Server:  8.8.8.8`,
      `Address: 8.8.8.8#53`,
      ``,
      `Non-authoritative answer:`,
      `Name:    ${domain}`,
      `Address: ${ip}`,
    ];
  },
  ssh: (args) => {
    addAchievement('first-ssh');
    const target = args[0] || 'root@server';
    return [
      `Connecting to ${target}...`,
      `The authenticity of host can't be established.`,
      `ED25519 key fingerprint is SHA256:abc123...`,
      `Warning: Permanently added '${target.split('@')[1] || 'server'}' to known hosts.`,
      `Welcome to Ubuntu 22.04.3 LTS`,
      `Last login: Sat Feb 21 12:00:00 2026`,
      `${target.split('@')[0] || 'root'}@server:~$ _`,
    ];
  },
  curl: (args) => {
    const url = args[0] || 'http://example.com';
    return [
      `  % Total    % Received`,
      `  100  1256  100  1256    0     0  12560      0 --:--:-- --:--:--`,
      `<!DOCTYPE html>`,
      `<html><head><title>Example</title></head>`,
      `<body><h1>Hello World</h1></body></html>`,
      ``,
      `HTTP/1.1 200 OK`,
      `Content-Type: text/html`,
    ];
  },
  netstat: () => [
    `Active Internet connections`,
    `Proto  Local Address      Foreign Address    State`,
    `tcp    0.0.0.0:22         0.0.0.0:*          LISTEN`,
    `tcp    0.0.0.0:80         0.0.0.0:*          LISTEN`,
    `tcp    0.0.0.0:443        0.0.0.0:*          LISTEN`,
    `tcp    192.168.1.10:52341 142.250.80.46:443  ESTABLISHED`,
    `tcp    192.168.1.10:52342 140.82.121.4:443   ESTABLISHED`,
    `udp    0.0.0.0:53         0.0.0.0:*          `,
  ],
  ifconfig: () => [
    `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>`,
    `        inet 192.168.1.10  netmask 255.255.255.0`,
    `        inet6 fe80::1  prefixlen 64`,
    `        ether 02:42:ac:11:00:02`,
    ``,
    `lo: flags=73<UP,LOOPBACK,RUNNING>`,
    `        inet 127.0.0.1  netmask 255.0.0.0`,
  ],
  ip: (args) => {
    if (args[0] === 'addr') return [
      `1: lo: <LOOPBACK,UP>`,
      `    inet 127.0.0.1/8 scope host lo`,
      `2: eth0: <BROADCAST,MULTICAST,UP>`,
      `    inet 192.168.1.10/24 scope global eth0`,
    ];
    return ['Usage: ip addr'];
  },
  iptables: () => [
    `Chain INPUT (policy ACCEPT)`,
    `target  prot  source      destination`,
    `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:22`,
    `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:80`,
    `ACCEPT  tcp   0.0.0.0/0   0.0.0.0/0   tcp dpt:443`,
    `DROP    all   0.0.0.0/0   0.0.0.0/0`,
    ``,
    `Chain OUTPUT (policy ACCEPT)`,
    `Chain FORWARD (policy DROP)`,
  ],
  whoami: () => ['root'],
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: '⚡ NetQuest Terminal v1.0' },
    { type: 'output', text: 'Type "help" for available commands' },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newLines: Line[] = [...lines, { type: 'input', text: `$ ${input}` }];
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    const handler = commandHandlers[cmd];
    if (handler) {
      const output = handler(args);
      output.forEach(line => newLines.push({ type: 'output', text: line }));
    } else {
      newLines.push({ type: 'output', text: `command not found: ${cmd}. Type "help" for available commands.` });
    }
    newLines.push({ type: 'output', text: '' });

    setLines(newLines);
    setHistory([input, ...history]);
    setHistoryIndex(-1);
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
      const cmds = Object.keys(commandHandlers);
      const match = cmds.find(c => c.startsWith(input));
      if (match) setInput(match + ' ');
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
          <span className="text-xs text-gray-500 ml-2 font-mono">netquest@terminal</span>
        </div>

        <div ref={scrollRef} className="p-4 font-mono text-sm overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          {lines.map((line, i) => (
            <div key={i} className={line.type === 'input' ? 'text-[#39ff14]' : 'text-gray-300'}>
              {line.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2 border-t border-gray-800">
          <span className="text-[#39ff14] font-mono text-sm">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent font-mono text-sm text-white outline-none"
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
