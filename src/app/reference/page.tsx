'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Ports', 'IPs', 'Subnets', 'Protocols', 'Net Cmds', 'Terminal', 'Linux'];

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
      </motion.div>
    </div>
  );
}
