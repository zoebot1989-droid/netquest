'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Ports', 'IPs', 'Subnets', 'Protocols', 'Net Cmds', 'Terminal', 'Linux', 'Python', 'Web Dev', 'DevOps', 'Hardware'];

const portsData = [
  { port: 20, service: 'FTP Data', protocol: 'TCP' },
  { port: 21, service: 'FTP Control', protocol: 'TCP' },
  { port: 22, service: 'SSH', protocol: 'TCP' },
  { port: 23, service: 'Telnet', protocol: 'TCP' },
  { port: 25, service: 'SMTP', protocol: 'TCP' },
  { port: 53, service: 'DNS', protocol: 'TCP/UDP' },
  { port: 67, service: 'DHCP Server', protocol: 'UDP' },
  { port: 68, service: 'DHCP Client', protocol: 'UDP' },
  { port: 80, service: 'HTTP', protocol: 'TCP' },
  { port: 110, service: 'POP3', protocol: 'TCP' },
  { port: 143, service: 'IMAP', protocol: 'TCP' },
  { port: 443, service: 'HTTPS', protocol: 'TCP' },
  { port: 993, service: 'IMAPS', protocol: 'TCP' },
  { port: 3306, service: 'MySQL', protocol: 'TCP' },
  { port: 3389, service: 'RDP', protocol: 'TCP' },
  { port: 5432, service: 'PostgreSQL', protocol: 'TCP' },
  { port: 6379, service: 'Redis', protocol: 'TCP' },
  { port: 8080, service: 'HTTP Alt', protocol: 'TCP' },
  { port: 27017, service: 'MongoDB', protocol: 'TCP' },
];

const terminalCategories = [
  {
    title: '📂 Navigation',
    commands: [
      { cmd: 'pwd', desc: 'Print current directory' },
      { cmd: 'ls / ls -la', desc: 'List files (-la for details + hidden)' },
      { cmd: 'cd <dir>', desc: 'Change directory' },
      { cmd: 'cd .. / cd ~', desc: 'Go up one level / go home' },
    ],
  },
  {
    title: '📝 Files',
    commands: [
      { cmd: 'touch <file>', desc: 'Create empty file' },
      { cmd: 'mkdir <dir>', desc: 'Create directory' },
      { cmd: 'cp <src> <dest>', desc: 'Copy file/directory' },
      { cmd: 'mv <src> <dest>', desc: 'Move or rename' },
      { cmd: 'rm <file>', desc: 'Delete file' },
      { cmd: 'rm -rf <dir>', desc: 'Delete directory (⚠️ careful!)' },
    ],
  },
  {
    title: '👀 Reading',
    commands: [
      { cmd: 'cat <file>', desc: 'Print file contents' },
      { cmd: 'head -n 5 <file>', desc: 'First 5 lines' },
      { cmd: 'tail -n 5 <file>', desc: 'Last 5 lines' },
      { cmd: 'less <file>', desc: 'Scrollable viewer' },
      { cmd: 'wc -l <file>', desc: 'Count lines' },
    ],
  },
  {
    title: '🔍 Search',
    commands: [
      { cmd: 'grep <pattern> <file>', desc: 'Search text in file' },
      { cmd: 'find . -name "*.txt"', desc: 'Find files by name' },
      { cmd: 'which <cmd>', desc: 'Find command location' },
    ],
  },
  {
    title: '🔗 Pipes & Redirect',
    commands: [
      { cmd: 'cmd1 | cmd2', desc: 'Pipe output to next command' },
      { cmd: 'cmd > file', desc: 'Write output to file (overwrite)' },
      { cmd: 'cmd >> file', desc: 'Append output to file' },
    ],
  },
  {
    title: '🔐 Permissions',
    commands: [
      { cmd: 'chmod +x <file>', desc: 'Make executable' },
      { cmd: 'chmod 755 <file>', desc: 'rwxr-xr-x' },
      { cmd: 'chmod 644 <file>', desc: 'rw-r--r--' },
      { cmd: 'chown user:group <file>', desc: 'Change owner' },
    ],
  },
  {
    title: '⚙️ System',
    commands: [
      { cmd: 'ps / top', desc: 'List/monitor processes' },
      { cmd: 'kill <PID>', desc: 'Stop a process' },
      { cmd: 'export VAR=val', desc: 'Set environment variable' },
      { cmd: 'env', desc: 'Show all env variables' },
      { cmd: 'apt install <pkg>', desc: 'Install package' },
      { cmd: 'ssh user@host', desc: 'Remote shell access' },
    ],
  },
];

const permissionsRef = [
  { num: '7', sym: 'rwx', desc: 'Read + Write + Execute' },
  { num: '6', sym: 'rw-', desc: 'Read + Write' },
  { num: '5', sym: 'r-x', desc: 'Read + Execute' },
  { num: '4', sym: 'r--', desc: 'Read only' },
  { num: '3', sym: '-wx', desc: 'Write + Execute' },
  { num: '2', sym: '-w-', desc: 'Write only' },
  { num: '1', sym: '--x', desc: 'Execute only' },
  { num: '0', sym: '---', desc: 'No permissions' },
];

const shortcuts = [
  { key: 'Ctrl+C', desc: 'Stop current command' },
  { key: 'Ctrl+Z', desc: 'Pause/suspend command' },
  { key: 'Ctrl+D', desc: 'Exit shell / EOF' },
  { key: 'Ctrl+R', desc: 'Search command history' },
  { key: 'Ctrl+L', desc: 'Clear screen (like clear)' },
  { key: 'Tab', desc: 'Auto-complete file/command name' },
  { key: '↑ / ↓', desc: 'Previous/next command in history' },
  { key: '!!', desc: 'Repeat last command' },
];

export default function Reference() {
  const [tab, setTab] = useState(0);

  return (
    <div className="pb-8">
      <h1 className="text-xl font-bold mb-4">📚 Quick Reference</h1>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${tab === i ? 'bg-cyan-900/30 text-[#00f0ff]' : 'bg-gray-800/50 text-gray-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 0 && (
          <div className="card overflow-hidden p-0">
            <div className="grid grid-cols-3 gap-0 text-xs font-mono">
              <div className="p-2 bg-gray-800/50 font-semibold" style={{ color: '#00f0ff' }}>Port</div>
              <div className="p-2 bg-gray-800/50 font-semibold" style={{ color: '#39ff14' }}>Service</div>
              <div className="p-2 bg-gray-800/50 font-semibold text-gray-400">Protocol</div>
              {portsData.map(p => (
                <div key={p.port} className="contents">
                  <div className="p-2 border-t border-gray-800/50" style={{ color: '#00f0ff' }}>{p.port}</div>
                  <div className="p-2 border-t border-gray-800/50">{p.service}</div>
                  <div className="p-2 border-t border-gray-800/50 text-gray-500">{p.protocol}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            <div className="card">
              <h3 className="font-semibold mb-2" style={{ color: '#39ff14' }}>Private IP Ranges</h3>
              <div className="font-mono text-xs space-y-2">
                <div><span style={{ color: '#00f0ff' }}>10.0.0.0/8</span> — 10.0.0.0 to 10.255.255.255<br/><span className="text-gray-500">Class A — Large networks (16M hosts)</span></div>
                <div><span style={{ color: '#00f0ff' }}>172.16.0.0/12</span> — 172.16.0.0 to 172.31.255.255<br/><span className="text-gray-500">Class B — Medium networks (1M hosts)</span></div>
                <div><span style={{ color: '#00f0ff' }}>192.168.0.0/16</span> — 192.168.0.0 to 192.168.255.255<br/><span className="text-gray-500">Class C — Home/small networks (65K hosts)</span></div>
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2" style={{ color: '#ff9500' }}>Special Addresses</h3>
              <div className="font-mono text-xs space-y-1">
                <div><span style={{ color: '#00f0ff' }}>127.0.0.1</span> — Loopback (localhost)</div>
                <div><span style={{ color: '#00f0ff' }}>0.0.0.0</span> — All interfaces</div>
                <div><span style={{ color: '#00f0ff' }}>255.255.255.255</span> — Broadcast</div>
                <div><span style={{ color: '#00f0ff' }}>8.8.8.8</span> — Google DNS</div>
                <div><span style={{ color: '#00f0ff' }}>1.1.1.1</span> — Cloudflare DNS</div>
              </div>
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className="card">
            <h3 className="font-semibold mb-3">Subnet Masks</h3>
            <div className="font-mono text-xs space-y-1">
              {[
                { cidr: '/8', mask: '255.0.0.0', hosts: '16,777,214' },
                { cidr: '/16', mask: '255.255.0.0', hosts: '65,534' },
                { cidr: '/24', mask: '255.255.255.0', hosts: '254' },
                { cidr: '/25', mask: '255.255.255.128', hosts: '126' },
                { cidr: '/26', mask: '255.255.255.192', hosts: '62' },
                { cidr: '/27', mask: '255.255.255.224', hosts: '30' },
                { cidr: '/28', mask: '255.255.255.240', hosts: '14' },
                { cidr: '/29', mask: '255.255.255.248', hosts: '6' },
                { cidr: '/30', mask: '255.255.255.252', hosts: '2' },
                { cidr: '/32', mask: '255.255.255.255', hosts: '1' },
              ].map(s => (
                <div key={s.cidr} className="flex justify-between py-1 border-b border-gray-800/30">
                  <span style={{ color: '#00f0ff' }}>{s.cidr}</span>
                  <span className="text-gray-400">{s.mask}</span>
                  <span style={{ color: '#39ff14' }}>{s.hosts} hosts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="space-y-3">
            <div className="card">
              <h3 className="font-semibold mb-2">TCP vs UDP vs ICMP</h3>
              <div className="text-xs space-y-3">
                <div>
                  <p className="font-semibold" style={{ color: '#00f0ff' }}>TCP (Transmission Control Protocol)</p>
                  <p className="text-gray-400">Reliable, ordered delivery. Connection-based (3-way handshake). Used for: HTTP, SSH, FTP, email.</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#39ff14' }}>UDP (User Datagram Protocol)</p>
                  <p className="text-gray-400">Fast, no guarantee of delivery. Connectionless. Used for: DNS, video streaming, gaming, VoIP.</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#ff9500' }}>ICMP (Internet Control Message Protocol)</p>
                  <p className="text-gray-400">Network diagnostics. Used by: ping, traceroute. Not for data transfer.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 4 && (
          <div className="space-y-2">
            {[
              { cmd: 'ping <host>', desc: 'Test if a host is reachable and measure latency' },
              { cmd: 'traceroute <host>', desc: 'Show the path packets take to reach a host' },
              { cmd: 'nslookup <domain>', desc: 'Look up DNS records for a domain' },
              { cmd: 'dig <domain>', desc: 'Advanced DNS lookup tool' },
              { cmd: 'ssh user@host', desc: 'Connect to a remote server securely' },
              { cmd: 'scp file user@host:path', desc: 'Copy files to/from remote server' },
              { cmd: 'curl <url>', desc: 'Make HTTP requests from command line' },
              { cmd: 'netstat -tulpn', desc: 'Show listening ports and connections' },
              { cmd: 'ss -tulpn', desc: 'Modern replacement for netstat' },
              { cmd: 'ifconfig / ip addr', desc: 'Show network interface configuration' },
              { cmd: 'iptables -L', desc: 'List firewall rules' },
              { cmd: 'ufw status', desc: 'Simple firewall status (Ubuntu)' },
              { cmd: 'systemctl status nginx', desc: 'Check if nginx is running' },
            ].map(c => (
              <div key={c.cmd} className="card py-2">
                <div className="font-mono text-sm" style={{ color: '#39ff14' }}>{c.cmd}</div>
                <div className="text-xs text-gray-500">{c.desc}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 5 && (
          <div className="space-y-4">
            {/* Commands by category */}
            {terminalCategories.map(cat => (
              <div key={cat.title} className="card">
                <h3 className="font-semibold mb-2 text-sm">{cat.title}</h3>
                <div className="space-y-1">
                  {cat.commands.map(c => (
                    <div key={c.cmd} className="flex gap-2 text-xs">
                      <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                      <span className="text-gray-500">— {c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Permissions */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔐 Permissions (chmod)</h3>
              <div className="font-mono text-xs space-y-1">
                {permissionsRef.map(p => (
                  <div key={p.num} className="flex gap-3">
                    <span style={{ color: '#00f0ff' }}>{p.num}</span>
                    <span style={{ color: '#39ff14' }}>{p.sym}</span>
                    <span className="text-gray-500">{p.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Example: 755 = rwxr-xr-x (owner: all, group: read+exec, others: read+exec)</p>
            </div>

            {/* Keyboard shortcuts */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⌨️ Keyboard Shortcuts</h3>
              <div className="space-y-1">
                {shortcuts.map(s => (
                  <div key={s.key} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0 bg-gray-800 px-1.5 py-0.5 rounded" style={{ color: '#ff9500' }}>{s.key}</span>
                    <span className="text-gray-400">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Directory structure */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📁 Linux Directory Structure</h3>
              <pre className="font-mono text-xs text-gray-300">{`/           Root of everything
├── home/   User home directories
├── etc/    System configuration
├── var/    Variable data (logs, www)
├── tmp/    Temporary files
├── usr/    User programs
│   └── bin/  Installed programs
├── bin/    Essential commands
├── root/   Root user's home
└── dev/    Device files`}</pre>
            </div>
          </div>
        )}
        {tab === 6 && (
          <div className="space-y-4">
            {/* Directory Structure */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📁 Linux Directory Structure</h3>
              <pre className="font-mono text-xs text-gray-300">{`/              Root of everything
├── home/      User home directories
├── etc/       System configuration files
│   ├── passwd    User accounts
│   ├── group     Group definitions
│   ├── sudoers   sudo permissions
│   ├── fstab     Filesystem mounts
│   ├── hosts     Local DNS overrides
│   └── resolv.conf  DNS servers
├── var/       Variable data
│   ├── log/      System logs
│   └── www/      Web server files
├── tmp/       Temporary files (cleared on reboot)
├── bin/       Essential command binaries
├── usr/bin/   Installed program binaries
├── dev/       Device files (sda, null, tty)
├── proc/      Virtual process/kernel info
├── root/      Root user's home
└── boot/      Bootloader files`}</pre>
            </div>

            {/* systemctl commands */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⚙️ systemctl Commands</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'systemctl status <svc>', desc: 'Check if a service is running' },
                  { cmd: 'systemctl start <svc>', desc: 'Start a service' },
                  { cmd: 'systemctl stop <svc>', desc: 'Stop a service' },
                  { cmd: 'systemctl restart <svc>', desc: 'Restart a service' },
                  { cmd: 'systemctl enable <svc>', desc: 'Start at boot' },
                  { cmd: 'systemctl disable <svc>', desc: 'Don\'t start at boot' },
                  { cmd: 'systemctl list-units', desc: 'List all services' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Manager Comparison */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📦 Package Managers</h3>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                <div className="text-gray-500 font-sans">Action</div>
                <div style={{ color: '#ff9500' }}>apt (Debian)</div>
                <div style={{ color: '#00f0ff' }}>dnf (Fedora)</div>
                <div style={{ color: '#39ff14' }}>pacman (Arch)</div>
                <div className="text-gray-400 font-sans">Install</div><div>apt install pkg</div><div>dnf install pkg</div><div>pacman -S pkg</div>
                <div className="text-gray-400 font-sans">Remove</div><div>apt remove pkg</div><div>dnf remove pkg</div><div>pacman -R pkg</div>
                <div className="text-gray-400 font-sans">Update</div><div>apt upgrade</div><div>dnf upgrade</div><div>pacman -Syu</div>
                <div className="text-gray-400 font-sans">Search</div><div>apt search pkg</div><div>dnf search pkg</div><div>pacman -Ss pkg</div>
              </div>
            </div>

            {/* Cron Syntax */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⏰ Cron Syntax</h3>
              <pre className="font-mono text-xs text-gray-300 mb-2">{`┌─ minute (0-59)
│ ┌─ hour (0-23)
│ │ ┌─ day of month (1-31)
│ │ │ ┌─ month (1-12)
│ │ │ │ ┌─ day of week (0-7)
* * * * * command`}</pre>
              <div className="space-y-1 text-xs font-mono">
                <div><span style={{ color: '#00f0ff' }}>0 2 * * *</span> <span className="text-gray-500">— Daily at 2 AM</span></div>
                <div><span style={{ color: '#00f0ff' }}>*/15 * * * *</span> <span className="text-gray-500">— Every 15 minutes</span></div>
                <div><span style={{ color: '#00f0ff' }}>0 0 * * 0</span> <span className="text-gray-500">— Every Sunday at midnight</span></div>
                <div><span style={{ color: '#00f0ff' }}>30 9 1 * *</span> <span className="text-gray-500">— 1st of month at 9:30 AM</span></div>
                <div><span style={{ color: '#00f0ff' }}>0 */6 * * *</span> <span className="text-gray-500">— Every 6 hours</span></div>
              </div>
            </div>

            {/* User & Group Commands */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">👥 Users & Groups</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'whoami', desc: 'Show current username' },
                  { cmd: 'id', desc: 'Show UID, GID, groups' },
                  { cmd: 'groups', desc: 'Show group memberships' },
                  { cmd: 'sudo <cmd>', desc: 'Run as root' },
                  { cmd: 'sudo !!', desc: 'Re-run last command as root' },
                  { cmd: 'su - <user>', desc: 'Switch user' },
                  { cmd: 'usermod -aG grp user', desc: 'Add user to group' },
                  { cmd: 'groupadd <name>', desc: 'Create new group' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disk & Log Commands */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">💾 Disk & Logs</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'df -h', desc: 'Disk free space per mount' },
                  { cmd: 'du -sh *', desc: 'Size of items in current dir' },
                  { cmd: 'lsblk', desc: 'List block devices' },
                  { cmd: 'free -h', desc: 'Memory/swap usage' },
                  { cmd: 'mount', desc: 'Show mounted filesystems' },
                  { cmd: 'journalctl', desc: 'View system journal' },
                  { cmd: 'journalctl -u svc', desc: 'Logs for specific service' },
                  { cmd: 'journalctl -p err', desc: 'Only error messages' },
                  { cmd: 'dmesg', desc: 'Kernel messages' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 7 && (
          <div className="space-y-4">
            {/* Basic Syntax */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🐍 Basic Syntax</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'x = 10', desc: 'Assign a variable' },
                  { cmd: 'print("text")', desc: 'Output to screen' },
                  { cmd: 'input("prompt")', desc: 'Get user input (returns str)' },
                  { cmd: 'type(x)', desc: 'Check type of a value' },
                  { cmd: 'len(obj)', desc: 'Length of string/list/dict' },
                  { cmd: 'int() / float() / str()', desc: 'Type conversion' },
                  { cmd: 'f"Hello {name}"', desc: 'f-string formatting' },
                  { cmd: '# comment', desc: 'Single line comment' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Types */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📊 Data Types</h3>
              <div className="font-mono text-xs space-y-1">
                {[
                  { type: 'str', ex: '"hello"', desc: 'Text' },
                  { type: 'int', ex: '42', desc: 'Whole number' },
                  { type: 'float', ex: '3.14', desc: 'Decimal number' },
                  { type: 'bool', ex: 'True / False', desc: 'Boolean' },
                  { type: 'list', ex: '[1, 2, 3]', desc: 'Ordered, mutable' },
                  { type: 'tuple', ex: '(1, 2, 3)', desc: 'Ordered, immutable' },
                  { type: 'dict', ex: '{"k": "v"}', desc: 'Key-value pairs' },
                  { type: 'set', ex: '{1, 2, 3}', desc: 'Unique items' },
                  { type: 'None', ex: 'None', desc: 'Nothing' },
                ].map(t => (
                  <div key={t.type} className="flex justify-between py-0.5 border-b border-gray-800/30">
                    <span style={{ color: '#00f0ff' }}>{t.type}</span>
                    <span className="text-gray-400">{t.ex}</span>
                    <span className="text-gray-500">{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List/Dict/Set Methods */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📋 Common Methods</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#00f0ff' }}>List</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>.append(x) .insert(i,x) .remove(x) .pop()</div>
                    <div>.sort() .reverse() .index(x) .count(x)</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#39ff14' }}>Dict</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>.keys() .values() .items() .get(k, default)</div>
                    <div>.pop(k) .update(other) .setdefault(k, v)</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#ff9500' }}>String</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>.upper() .lower() .strip() .split(sep)</div>
                    <div>.replace(old,new) .startswith() .endswith()</div>
                    <div>.join(list) .find(sub) .format()</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-purple-400">Set</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>.add(x) .remove(x) .discard(x)</div>
                    <div>| union  & intersect  - difference  ^ symmetric</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Flow */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔀 Control Flow</h3>
              <pre className="font-mono text-xs text-gray-300">{`# If/elif/else
if condition:
    ...
elif other:
    ...
else:
    ...

# For loop
for item in iterable:
    ...
for i in range(n):
    ...

# While loop
while condition:
    ...
    break     # exit loop
    continue  # skip to next`}</pre>
            </div>

            {/* Functions */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⚙️ Functions</h3>
              <pre className="font-mono text-xs text-gray-300">{`def func_name(param1, param2="default"):
    """Docstring"""
    return result

# Lambda (one-liner)
square = lambda x: x ** 2

# *args and **kwargs
def flex(*args, **kwargs):
    print(args)    # tuple
    print(kwargs)  # dict`}</pre>
            </div>

            {/* Modules */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📦 Common Modules</h3>
              <div className="space-y-1">
                {[
                  { mod: 'random', desc: 'randint, choice, shuffle, random' },
                  { mod: 'math', desc: 'sqrt, pi, sin, cos, floor, ceil' },
                  { mod: 'datetime', desc: 'date, time, datetime, timedelta' },
                  { mod: 'json', desc: 'loads, dumps — parse/create JSON' },
                  { mod: 'os', desc: 'path, listdir, mkdir, environ' },
                  { mod: 'sys', desc: 'argv, exit, path, stdin/stdout' },
                  { mod: 'csv', desc: 'reader, writer — CSV files' },
                  { mod: 're', desc: 'search, match, findall — regex' },
                  { mod: 'requests*', desc: 'get, post — HTTP (pip install)' },
                ].map(m => (
                  <div key={m.mod} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{m.mod}</span>
                    <span className="text-gray-500">— {m.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Types */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🐛 Common Errors</h3>
              <div className="space-y-1">
                {[
                  { err: 'SyntaxError', desc: 'Invalid Python syntax' },
                  { err: 'NameError', desc: 'Variable not defined' },
                  { err: 'TypeError', desc: 'Wrong type for operation' },
                  { err: 'ValueError', desc: 'Right type, wrong value' },
                  { err: 'IndexError', desc: 'List index out of range' },
                  { err: 'KeyError', desc: 'Dict key not found' },
                  { err: 'FileNotFoundError', desc: 'File doesn\'t exist' },
                  { err: 'ZeroDivisionError', desc: 'Division by zero' },
                  { err: 'ImportError', desc: 'Module not found' },
                  { err: 'AttributeError', desc: 'Object has no attribute' },
                ].map(e => (
                  <div key={e.err} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0 text-red-400">{e.err}</span>
                    <span className="text-gray-500">— {e.desc}</span>
                  </div>
                ))}
              </div>
              <pre className="font-mono text-xs text-gray-300 mt-2">{`try:
    risky_code()
except ValueError as e:
    print(f"Error: {e}")
finally:
    cleanup()`}</pre>
            </div>

            {/* Operators */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔢 Operators</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <p className="font-sans font-semibold text-gray-400 mb-1">Math</p>
                  <div className="text-gray-300 space-y-0.5">
                    <div><span style={{ color: '#00f0ff' }}>+</span> add  <span style={{ color: '#00f0ff' }}>-</span> sub  <span style={{ color: '#00f0ff' }}>*</span> mul</div>
                    <div><span style={{ color: '#00f0ff' }}>/</span> div  <span style={{ color: '#00f0ff' }}>//</span> floor  <span style={{ color: '#00f0ff' }}>%</span> mod</div>
                    <div><span style={{ color: '#00f0ff' }}>**</span> power</div>
                  </div>
                </div>
                <div>
                  <p className="font-sans font-semibold text-gray-400 mb-1">Comparison</p>
                  <div className="text-gray-300 space-y-0.5">
                    <div><span style={{ color: '#39ff14' }}>==</span> eq  <span style={{ color: '#39ff14' }}>!=</span> not eq</div>
                    <div><span style={{ color: '#39ff14' }}>&lt;</span> <span style={{ color: '#39ff14' }}>&gt;</span> <span style={{ color: '#39ff14' }}>&lt;=</span> <span style={{ color: '#39ff14' }}>&gt;=</span></div>
                    <div><span style={{ color: '#39ff14' }}>in</span> <span style={{ color: '#39ff14' }}>not in</span> <span style={{ color: '#39ff14' }}>is</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 8 && (
          <div className="space-y-4">
            {/* HTML Tags */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🏗️ Common HTML Tags</h3>
              <div className="space-y-1">
                {[
                  { tag: '<h1>-<h6>', desc: 'Headings (h1 biggest, h6 smallest)' },
                  { tag: '<p>', desc: 'Paragraph text' },
                  { tag: '<a href="url">', desc: 'Hyperlink' },
                  { tag: '<img src="" alt="">', desc: 'Image (self-closing)' },
                  { tag: '<div> / <span>', desc: 'Generic block/inline container' },
                  { tag: '<ul> / <ol> / <li>', desc: 'Lists (unordered/ordered/item)' },
                  { tag: '<header> <nav> <main>', desc: 'Semantic layout tags' },
                  { tag: '<section> <article>', desc: 'Content grouping' },
                  { tag: '<footer> <aside>', desc: 'Footer and sidebar' },
                  { tag: '<form> <input> <button>', desc: 'Form elements' },
                  { tag: '<table> <tr> <td> <th>', desc: 'Table elements' },
                  { tag: '<strong> / <em>', desc: 'Bold / italic emphasis' },
                ].map(t => (
                  <div key={t.tag} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{t.tag}</span>
                    <span className="text-gray-500">— {t.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Properties */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🎨 CSS Properties</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#00f0ff' }}>Layout</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>display: flex | grid | block | inline | none</div>
                    <div>position: static | relative | absolute | fixed | sticky</div>
                    <div>width, height, max-width, min-height</div>
                    <div>overflow: hidden | scroll | auto</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#39ff14' }}>Spacing</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>margin: 10px (outside spacing)</div>
                    <div>padding: 10px (inside spacing)</div>
                    <div>gap: 10px (flex/grid gap)</div>
                    <div>box-sizing: border-box (always use!)</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#ff9500' }}>Typography</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>font-size, font-weight, font-family</div>
                    <div>color, text-align, line-height</div>
                    <div>text-decoration, text-transform</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-purple-400">Visual</p>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>background, background-color, background-image</div>
                    <div>border, border-radius, box-shadow</div>
                    <div>opacity, transition, transform</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flexbox */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📦 Flexbox</h3>
              <div className="font-mono text-xs space-y-1">
                {[
                  { prop: 'display: flex', desc: 'Enable flexbox' },
                  { prop: 'flex-direction', desc: 'row | column | row-reverse | column-reverse' },
                  { prop: 'justify-content', desc: 'center | space-between | space-around | flex-start | flex-end' },
                  { prop: 'align-items', desc: 'center | flex-start | flex-end | stretch | baseline' },
                  { prop: 'flex-wrap', desc: 'wrap | nowrap' },
                  { prop: 'gap', desc: 'Space between items (e.g. 10px)' },
                  { prop: 'flex: 1', desc: 'Grow to fill space (on child)' },
                  { prop: 'align-self', desc: 'Override align-items for one child' },
                ].map(p => (
                  <div key={p.prop} className="flex gap-2">
                    <span className="shrink-0" style={{ color: '#00f0ff' }}>{p.prop}</span>
                    <span className="text-gray-500">— {p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📐 CSS Grid</h3>
              <div className="font-mono text-xs space-y-1">
                {[
                  { prop: 'display: grid', desc: 'Enable grid' },
                  { prop: 'grid-template-columns', desc: '1fr 1fr 1fr | repeat(3, 1fr) | 200px 1fr' },
                  { prop: 'grid-template-rows', desc: 'auto 1fr auto' },
                  { prop: 'gap', desc: 'Space between cells' },
                  { prop: 'grid-column: span 2', desc: 'Item spans 2 columns' },
                  { prop: 'place-items: center', desc: 'Center all items' },
                ].map(p => (
                  <div key={p.prop} className="flex gap-2">
                    <span className="shrink-0" style={{ color: '#39ff14' }}>{p.prop}</span>
                    <span className="text-gray-500">— {p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* JavaScript DOM */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⚡ JavaScript DOM</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'document.querySelector(".class")', desc: 'Select first match' },
                  { cmd: 'document.querySelectorAll("tag")', desc: 'Select all matches' },
                  { cmd: 'document.getElementById("id")', desc: 'Select by ID' },
                  { cmd: 'el.textContent = "text"', desc: 'Set text (safe)' },
                  { cmd: 'el.innerHTML = "<b>html</b>"', desc: 'Set HTML (careful!)' },
                  { cmd: 'el.style.color = "red"', desc: 'Change inline style' },
                  { cmd: 'el.classList.add("active")', desc: 'Add CSS class' },
                  { cmd: 'el.classList.toggle("dark")', desc: 'Toggle CSS class' },
                  { cmd: 'el.setAttribute("href", url)', desc: 'Set attribute' },
                  { cmd: 'document.createElement("div")', desc: 'Create new element' },
                  { cmd: 'parent.appendChild(child)', desc: 'Add element to DOM' },
                  { cmd: 'el.remove()', desc: 'Remove element' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🖱️ Events</h3>
              <div className="font-mono text-xs space-y-1">
                {[
                  { event: 'click', desc: 'Element clicked' },
                  { event: 'submit', desc: 'Form submitted' },
                  { event: 'input', desc: 'Input value changes' },
                  { event: 'keydown / keyup', desc: 'Key pressed/released' },
                  { event: 'mouseover / mouseout', desc: 'Mouse enter/leave' },
                  { event: 'scroll', desc: 'Page/element scrolled' },
                  { event: 'load', desc: 'Page finished loading' },
                  { event: 'DOMContentLoaded', desc: 'HTML parsed (use this!)' },
                ].map(e => (
                  <div key={e.event} className="flex gap-2">
                    <span style={{ color: '#ff9500' }}>{e.event}</span>
                    <span className="text-gray-500">— {e.desc}</span>
                  </div>
                ))}
              </div>
              <pre className="font-mono text-xs text-gray-300 mt-2">{`el.addEventListener("click", (event) => {
  event.preventDefault(); // stop default
  // your code here
});`}</pre>
            </div>

            {/* Fetch */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🌐 Fetch API</h3>
              <pre className="font-mono text-xs text-gray-300">{`// With .then()
fetch("https://api.example.com/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// With async/await
async function getData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}`}</pre>
            </div>

            {/* Breakpoints */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📱 Responsive Breakpoints</h3>
              <div className="font-mono text-xs space-y-1">
                {[
                  { bp: '640px', desc: 'Small (large phones)' },
                  { bp: '768px', desc: 'Medium (tablets)' },
                  { bp: '1024px', desc: 'Large (laptops)' },
                  { bp: '1280px', desc: 'XL (desktops)' },
                  { bp: '1536px', desc: '2XL (large screens)' },
                ].map(b => (
                  <div key={b.bp} className="flex gap-2">
                    <span style={{ color: '#00f0ff' }}>@media (min-width: {b.bp})</span>
                    <span className="text-gray-500">— {b.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 9 && (
          <div className="space-y-4">
            {/* Git Commands */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📝 Git Commands</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'git init', desc: 'Create new Git repository' },
                  { cmd: 'git add <file>', desc: 'Stage file for commit' },
                  { cmd: 'git add .', desc: 'Stage all changes' },
                  { cmd: 'git commit -m "msg"', desc: 'Save staged changes' },
                  { cmd: 'git status', desc: 'Show working tree status' },
                  { cmd: 'git log', desc: 'Show commit history' },
                  { cmd: 'git diff', desc: 'Show unstaged changes' },
                  { cmd: 'git branch <name>', desc: 'Create new branch' },
                  { cmd: 'git checkout -b <name>', desc: 'Create and switch branch' },
                  { cmd: 'git merge <branch>', desc: 'Merge branch into current' },
                  { cmd: 'git clone <url>', desc: 'Download remote repo' },
                  { cmd: 'git push', desc: 'Upload commits to remote' },
                  { cmd: 'git pull', desc: 'Download and merge remote changes' },
                  { cmd: 'git remote -v', desc: 'List remote connections' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Docker Commands */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🐳 Docker Commands</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'docker run <image>', desc: 'Run a container' },
                  { cmd: 'docker run -d -p 80:80 nginx', desc: 'Run detached with port mapping' },
                  { cmd: 'docker ps', desc: 'List running containers' },
                  { cmd: 'docker ps -a', desc: 'List all containers' },
                  { cmd: 'docker images', desc: 'List downloaded images' },
                  { cmd: 'docker pull <image>', desc: 'Download image from registry' },
                  { cmd: 'docker stop <id>', desc: 'Stop a container' },
                  { cmd: 'docker rm <id>', desc: 'Remove a container' },
                  { cmd: 'docker exec -it <id> bash', desc: 'Shell into a container' },
                  { cmd: 'docker build -t name .', desc: 'Build image from Dockerfile' },
                  { cmd: 'docker logs <id>', desc: 'View container logs' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dockerfile */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">📄 Dockerfile Reference</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'FROM image:tag', desc: 'Base image (required first)' },
                  { cmd: 'WORKDIR /app', desc: 'Set working directory' },
                  { cmd: 'COPY src dest', desc: 'Copy files into image' },
                  { cmd: 'RUN command', desc: 'Execute during build' },
                  { cmd: 'EXPOSE 3000', desc: 'Document port (metadata)' },
                  { cmd: 'ENV KEY=value', desc: 'Set environment variable' },
                  { cmd: 'CMD ["node","app.js"]', desc: 'Default run command' },
                  { cmd: 'ENTRYPOINT ["cmd"]', desc: 'Fixed run command' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#00f0ff' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* docker-compose */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🐙 docker-compose.yml</h3>
              <pre className="font-mono text-xs text-gray-300">{`version: "3.8"
services:
  web:
    build: .           # Build from Dockerfile
    ports: ["3000:3000"]
    depends_on: [db]
    environment:
      DB_HOST: db
  db:
    image: postgres:15
    volumes: [data:/var/lib/postgresql/data]
    environment:
      POSTGRES_PASSWORD: secret
volumes:
  data:`}</pre>
              <div className="space-y-1 mt-2">
                {[
                  { cmd: 'docker-compose up -d', desc: 'Start all services' },
                  { cmd: 'docker-compose down', desc: 'Stop and remove all' },
                  { cmd: 'docker-compose ps', desc: 'List services' },
                  { cmd: 'docker-compose logs', desc: 'View all logs' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Actions */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⚙️ GitHub Actions</h3>
              <pre className="font-mono text-xs text-gray-300">{`name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm test`}</pre>
            </div>

            {/* kubectl */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">☸️ kubectl Commands</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'kubectl get pods', desc: 'List running pods' },
                  { cmd: 'kubectl get deployments', desc: 'List deployments' },
                  { cmd: 'kubectl get services', desc: 'List services' },
                  { cmd: 'kubectl apply -f file.yaml', desc: 'Apply configuration' },
                  { cmd: 'kubectl describe pod <name>', desc: 'Detailed pod info' },
                  { cmd: 'kubectl logs <pod>', desc: 'View pod logs' },
                  { cmd: 'kubectl delete pod <name>', desc: 'Delete a pod' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CI/CD Stages */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔄 CI/CD Pipeline Stages</h3>
              <div className="space-y-1 text-xs">
                {[
                  { stage: '📥 Source', desc: 'Code pushed to Git repo' },
                  { stage: '🔨 Build', desc: 'Compile/bundle the application' },
                  { stage: '🧪 Test', desc: 'Run automated test suites' },
                  { stage: '📋 Lint', desc: 'Check code style and quality' },
                  { stage: '📦 Package', desc: 'Build Docker image, push to registry' },
                  { stage: '🚀 Deploy', desc: 'Deploy to staging/production' },
                  { stage: '📊 Monitor', desc: 'Watch metrics, logs, alerts' },
                ].map(s => (
                  <div key={s.stage} className="flex gap-2">
                    <span className="shrink-0" style={{ color: '#00f0ff' }}>{s.stage}</span>
                    <span className="text-gray-500">— {s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terraform */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🏗️ Terraform</h3>
              <div className="space-y-1">
                {[
                  { cmd: 'terraform init', desc: 'Initialize and download providers' },
                  { cmd: 'terraform plan', desc: 'Preview changes' },
                  { cmd: 'terraform apply', desc: 'Apply changes' },
                  { cmd: 'terraform destroy', desc: 'Tear down all resources' },
                ].map(c => (
                  <div key={c.cmd} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cmd}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 10 && (
          <div className="space-y-4">
            {/* CPU Specs */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🧠 CPU Specs Cheat Sheet</h3>
              <div className="space-y-1">
                {[
                  { spec: 'Cores', desc: 'Independent processors — more = better multitasking' },
                  { spec: 'Threads', desc: 'Virtual cores via hyperthreading (usually 2x cores)' },
                  { spec: 'Clock Speed (GHz)', desc: 'Cycles per second — higher = faster per core' },
                  { spec: 'L1/L2/L3 Cache', desc: 'Ultra-fast on-chip memory (L1 fastest, L3 largest)' },
                  { spec: 'TDP (Watts)', desc: 'Thermal design power — heat output, determines cooler needed' },
                  { spec: 'Socket', desc: 'Physical connection — must match motherboard (LGA 1700, AM5)' },
                ].map(s => (
                  <div key={s.spec} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#00f0ff' }}>{s.spec}</span>
                    <span className="text-gray-500">— {s.desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs space-y-1">
                <p className="font-semibold text-gray-400">CPU Tiers:</p>
                <div className="font-mono">
                  <div><span style={{ color: '#39ff14' }}>i3 / Ryzen 3</span> <span className="text-gray-500">— Budget (4 cores)</span></div>
                  <div><span style={{ color: '#00f0ff' }}>i5 / Ryzen 5</span> <span className="text-gray-500">— Mid-range, best value (6-10 cores)</span></div>
                  <div><span style={{ color: '#ff9500' }}>i7 / Ryzen 7</span> <span className="text-gray-500">— High-end (8-16 cores)</span></div>
                  <div><span className="text-red-400">i9 / Ryzen 9</span> <span className="text-gray-500">— Enthusiast (16-24 cores)</span></div>
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">⚡ RAM Comparison</h3>
              <div className="grid grid-cols-3 gap-1 text-xs font-mono mb-2">
                <div className="text-gray-500 font-sans">Spec</div>
                <div style={{ color: '#00f0ff' }}>DDR4</div>
                <div style={{ color: '#39ff14' }}>DDR5</div>
                <div className="text-gray-400 font-sans">Speed</div><div>2133-3600 MHz</div><div>4800-8000+ MHz</div>
                <div className="text-gray-400 font-sans">Capacity</div><div>Up to 32 GB/stick</div><div>Up to 64 GB/stick</div>
                <div className="text-gray-400 font-sans">Voltage</div><div>1.2V</div><div>1.1V</div>
                <div className="text-gray-400 font-sans">Price</div><div>Cheaper</div><div>Premium</div>
              </div>
              <p className="text-xs text-gray-500">💡 Always use dual channel (2 sticks). 16 GB = gaming sweet spot. 32 GB = content creation.</p>
            </div>

            {/* Storage */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">💾 Storage Comparison</h3>
              <div className="space-y-2 text-xs">
                {[
                  { type: '💿 HDD', speed: '80-160 MB/s', price: '$20/TB', best: 'Bulk storage, backups' },
                  { type: '⚡ SATA SSD', speed: '500-560 MB/s', price: '$50/TB', best: 'Budget boot drive' },
                  { type: '🚀 NVMe Gen 4', speed: '5,000-7,000 MB/s', price: '$60/TB', best: 'Best value boot/gaming' },
                  { type: '🏎️ NVMe Gen 5', speed: '10,000-14,000 MB/s', price: '$120/TB', best: 'Enthusiast, video editing' },
                ].map(s => (
                  <div key={s.type} className="bg-gray-800/50 rounded-lg p-2">
                    <div className="flex justify-between"><span className="font-semibold">{s.type}</span><span style={{ color: '#ff9500' }}>{s.price}</span></div>
                    <div className="flex justify-between text-gray-400"><span>{s.speed}</span><span>{s.best}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* GPU Tiers */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🎮 GPU Tiers</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#39ff14' }}>Budget ($200-350)</p>
                  <div className="text-gray-400">RTX 4060 / RX 7600 — 1080p gaming, 8 GB VRAM</div>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#00f0ff' }}>Mid-range ($400-600)</p>
                  <div className="text-gray-400">RTX 4070 / RX 7800 XT — 1440p gaming, 12 GB VRAM</div>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#ff9500' }}>High-end ($700-1000)</p>
                  <div className="text-gray-400">RTX 4080 Super / RX 7900 XTX — 4K gaming, 16 GB VRAM</div>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-red-400">Enthusiast ($1500+)</p>
                  <div className="text-gray-400">RTX 4090 — 4K max, AI/ML, 24 GB VRAM</div>
                </div>
              </div>
            </div>

            {/* Motherboard Form Factors */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔲 Motherboard Form Factors</h3>
              <div className="space-y-1 text-xs">
                {[
                  { form: 'ATX', size: '305×244mm', slots: '7 PCIe, 4 RAM', best: 'Standard desktop builds' },
                  { form: 'Micro-ATX', size: '244×244mm', slots: '4 PCIe, 2-4 RAM', best: 'Compact builds' },
                  { form: 'Mini-ITX', size: '170×170mm', slots: '1 PCIe, 2 RAM', best: 'Small form factor' },
                ].map(f => (
                  <div key={f.form} className="flex justify-between bg-gray-800/50 rounded-lg p-2">
                    <div><span className="font-semibold" style={{ color: '#00f0ff' }}>{f.form}</span> <span className="text-gray-500">({f.size})</span></div>
                    <span className="text-gray-400">{f.best}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PSU Wattage Guide */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔌 PSU Wattage Guide</h3>
              <div className="space-y-1 text-xs font-mono">
                {[
                  { comp: 'CPU (mid-range)', watts: '65-125W' },
                  { comp: 'GPU (mid-range)', watts: '150-250W' },
                  { comp: 'RAM (2 sticks)', watts: '5-10W' },
                  { comp: 'SSD/NVMe', watts: '5-10W' },
                  { comp: 'HDD', watts: '6-8W' },
                  { comp: 'Fans (each)', watts: '2-5W' },
                  { comp: 'Motherboard', watts: '40-80W' },
                ].map(c => (
                  <div key={c.comp} className="flex justify-between">
                    <span className="text-gray-300">{c.comp}</span>
                    <span style={{ color: '#ff9500' }}>{c.watts}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 Total draw × 1.5 = recommended PSU wattage. Always get 80+ Gold.</p>
            </div>

            {/* Cable Types */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">🔌 Cable Types</h3>
              <div className="space-y-1">
                {[
                  { cable: '24-pin ATX', desc: 'Main motherboard power' },
                  { cable: '8-pin EPS (CPU)', desc: 'CPU power (top of board)' },
                  { cable: '6+2 pin PCIe', desc: 'GPU power' },
                  { cable: 'SATA Power', desc: 'SSD/HDD power (L-shaped)' },
                  { cable: 'SATA Data', desc: 'Storage to motherboard' },
                  { cable: 'Cat5e/Cat6/Cat6a', desc: 'Ethernet (1/10 Gbps)' },
                  { cable: 'Fiber (SM/MM)', desc: 'High-speed, long distance' },
                  { cable: 'USB-A / USB-C', desc: 'Peripherals, data transfer' },
                  { cable: 'HDMI / DisplayPort', desc: 'Video output to monitor' },
                ].map(c => (
                  <div key={c.cable} className="flex gap-2 text-xs">
                    <span className="font-mono shrink-0" style={{ color: '#39ff14' }}>{c.cable}</span>
                    <span className="text-gray-500">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PC Build Checklist */}
            <div className="card">
              <h3 className="font-semibold mb-2 text-sm">✅ PC Build Checklist</h3>
              <div className="space-y-1 text-xs">
                {[
                  '☐ CPU socket matches motherboard',
                  '☐ RAM type matches (DDR4 or DDR5)',
                  '☐ GPU fits in case (check length)',
                  '☐ PSU has enough wattage (+50% headroom)',
                  '☐ CPU cooler clears RAM and case',
                  '☐ Case fits motherboard form factor',
                  '☐ M.2 slots available for NVMe drives',
                  '☐ Thermal paste applied (pea-sized dot)',
                  '☐ All power cables connected (24-pin, CPU, GPU)',
                  '☐ RAM in correct slots for dual channel',
                  '☐ Monitor plugged into GPU (not motherboard)',
                  '☐ XMP/DOCP enabled in BIOS',
                  '☐ Boot order set correctly',
                  '☐ OS installed and drivers updated',
                ].map(item => (
                  <div key={item} className="text-gray-300 font-mono">{item}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
